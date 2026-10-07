import { mkdir, readdir, readFile, rename, rm, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ROUTE_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROUTE_FILE_PATTERN = /^(page|route)\.(?:js|jsx|ts|tsx|mjs|mts)$/;

export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidPageId(value) {
  return ROUTE_SEGMENT_PATTERN.test(value);
}

export function componentNameFromPageName(value) {
  const words = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const baseName = words.map((word) => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`).join("") || "NuevaPagina";
  return `${/^[a-zA-Z_]/.test(baseName) ? baseName : `Page${baseName}`}Page`;
}

function removeWrappingQuotes(value) {
  return value.trim().replace(/^("|')(.*)\1$/, "$2");
}

export function normalizePagePath(input, locale) {
  const value = removeWrappingQuotes(input);
  if (!value) throw new Error(`La ruta ${locale.toUpperCase()} no puede estar vacía.`);
  if (!value.startsWith("/")) throw new Error(`La ruta ${locale.toUpperCase()} debe empezar con /.`);
  if (value.includes("\\")) throw new Error(`La ruta ${locale.toUpperCase()} no puede contener barras invertidas.`);
  if (value.includes("?") || value.includes("#")) throw new Error(`La ruta ${locale.toUpperCase()} no debe incluir query params ni hashes.`);
  if (value.includes("//")) throw new Error(`La ruta ${locale.toUpperCase()} no puede contener barras duplicadas.`);

  const withoutTrailingSlash = value.length > 1 ? value.replace(/\/$/, "") : value;
  const segments = withoutTrailingSlash.split("/").slice(1);
  if (!segments.length || segments.some((segment) => !segment)) throw new Error(`La ruta ${locale.toUpperCase()} no contiene segmentos válidos.`);
  if (segments.some((segment) => segment === "." || segment === "..")) throw new Error(`La ruta ${locale.toUpperCase()} no puede contener . ni ...`);
  if (segments.some((segment) => !ROUTE_SEGMENT_PATTERN.test(segment))) {
    throw new Error(`La ruta ${locale.toUpperCase()} solo puede usar segmentos en minúscula, números y guiones.`);
  }

  if (locale === "en" && (segments[0] !== "en" || segments.length < 2)) {
    throw new Error("La ruta EN debe empezar por /en/ y tener al menos un segmento adicional.");
  }
  if (locale === "es" && segments[0] === "en") {
    throw new Error("La ruta ES no debe usar el prefijo reservado /en/.");
  }

  return `/${segments.join("/")}`;
}

export function validatePagePath(pathValue, { locale, reservedSegments = [] }) {
  const normalized = normalizePagePath(pathValue, locale);
  const firstSegment = normalized.split("/")[1];
  if (reservedSegments.includes(firstSegment)) {
    throw new Error(`La ruta ${normalized} usa la zona reservada /${firstSegment}/.`);
  }
  return normalized;
}

export function pagePathToAppDirectory(root, pagePath) {
  const segments = pagePath.split("/").filter(Boolean);
  return path.resolve(root, "app", ...segments);
}

function routeSegmentsFromDirectory(appRoot, directory) {
  const relative = path.relative(appRoot, directory);
  if (!relative) return [];
  return relative
    .split(path.sep)
    .filter((segment) => segment && !segment.startsWith("(") && !segment.startsWith("_") && !segment.startsWith("@"));
}

export async function collectAppRoutes(appRoot) {
  const routes = [];
  const visit = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
        return;
      }
      if (!ROUTE_FILE_PATTERN.test(entry.name)) return;
      const routeSegments = routeSegmentsFromDirectory(appRoot, path.dirname(entryPath));
      routes.push({
        kind: entry.name.startsWith("route.") ? "route handler" : "page",
        filePath: entryPath,
        pattern: routeSegments.length ? `/${routeSegments.join("/")}` : "/",
      });
    }));
  };

  await visit(appRoot);
  return routes.sort((a, b) => a.pattern.localeCompare(b.pattern));
}

function patternMatches(patternSegments, requestedSegments, patternIndex = 0, requestedIndex = 0) {
  if (patternIndex === patternSegments.length) return requestedIndex === requestedSegments.length;
  const segment = patternSegments[patternIndex];
  if (segment.startsWith("[[...") && segment.endsWith("]]")) {
    return patternMatches(patternSegments, requestedSegments, patternIndex + 1, requestedIndex)
      || (requestedIndex < requestedSegments.length && patternMatches(patternSegments, requestedSegments, patternIndex, requestedIndex + 1));
  }
  if (segment.startsWith("[...") && segment.endsWith("]")) {
    return requestedIndex < requestedSegments.length
      && (patternMatches(patternSegments, requestedSegments, patternIndex + 1, requestedIndex + 1)
        || patternMatches(patternSegments, requestedSegments, patternIndex, requestedIndex + 1));
  }
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return requestedIndex < requestedSegments.length && patternMatches(patternSegments, requestedSegments, patternIndex + 1, requestedIndex + 1);
  }
  return segment === requestedSegments[requestedIndex]
    && patternMatches(patternSegments, requestedSegments, patternIndex + 1, requestedIndex + 1);
}

export function routePatternMatches(pattern, requestedPath) {
  const patternSegments = pattern.split("/").filter(Boolean);
  const requestedSegments = requestedPath.split("/").filter(Boolean);
  return patternMatches(patternSegments, requestedSegments);
}

export function findPageRouteConflict(routes, requestedPath) {
  return routes.find((route) => routePatternMatches(route.pattern, requestedPath)) ?? null;
}

export function serializePageRegistry(registry) {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

export function buildPageFiles({ root, page, createCssModule }) {
  const componentFile = `${page.componentName}.tsx`;
  const cssFile = `${page.componentName}.module.css`;
  const localeType = page.paths.en ? '"es" | "en"' : '"es"';
  const contentEntries = [
    `  es: {\n    title: ${JSON.stringify(page.name)},\n    description: "",\n  }`,
  ];
  if (page.paths.en) {
    contentEntries.push(`  en: {\n    title: ${JSON.stringify(page.name)},\n    description: "",\n  }`);
  }

  const imports = ["import { content } from \"./content\";"];
  if (createCssModule) imports.push(`import styles from \"./${cssFile}\";`);
  const mainClass = createCssModule ? " className={styles.page}" : "";
  const componentSource = `${imports.join("\n")}\n\ntype ${page.componentName}Props = {\n  locale: ${localeType};\n};\n\nexport default function ${page.componentName}({ locale }: ${page.componentName}Props) {\n  const copy = content[locale];\n\n  return (\n    <main${mainClass} id=\"main-content\">\n      <h1>{copy.title}</h1>\n      {/* Desarrollar página aquí */}\n    </main>\n  );\n}\n`;
  const contentSource = `export const content = {\n${contentEntries.join(",\n")}\n} as const;\n`;
  const files = [
    { relativePath: path.join("components", "pages", page.id, componentFile), content: componentSource },
    { relativePath: path.join("components", "pages", page.id, "content.ts"), content: contentSource },
  ];
  if (createCssModule) {
    files.push({
      relativePath: path.join("components", "pages", page.id, cssFile),
      content: ".page {\n  min-height: 100vh;\n}\n",
    });
  }

  const routes = [{ locale: "es", routePath: page.paths.es }];
  if (page.paths.en) routes.push({ locale: "en", routePath: page.paths.en });
  for (const route of routes) {
    const routeDirectory = pagePathToAppDirectory(root, route.routePath);
    files.push({
      relativePath: path.relative(root, path.join(routeDirectory, "page.tsx")),
      content: `import type { Metadata } from "next";\nimport ${page.componentName} from "@/components/pages/${page.id}/${componentFile.replace(/\.tsx$/, "")}";\nimport { getPageMetadata } from "@/lib/pages";\n\nexport const metadata: Metadata = getPageMetadata("${page.id}", "${route.locale}");\n\nexport default function Page() {\n  return <${page.componentName} locale="${route.locale}" />;\n}\n`,
    });
  }
  return files;
}

export async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

export async function assertPagePlanAvailable({ root, files, componentDirectory, assetsDirectory }) {
  const conflicts = [];
  for (const file of files) {
    const target = path.resolve(root, file.relativePath);
    if (await pathExists(target)) conflicts.push(path.relative(root, target));
  }
  if (await pathExists(componentDirectory)) conflicts.push(path.relative(root, componentDirectory));
  if (assetsDirectory && await pathExists(assetsDirectory) && !(await stat(assetsDirectory)).isDirectory()) {
    conflicts.push(path.relative(root, assetsDirectory));
  }
  if (conflicts.length) {
    throw new Error(`Ya existen archivos o carpetas que no se sobrescribirán:\n${conflicts.map((item) => `- ${item.replaceAll("\\", "/")}`).join("\n")}`);
  }
}

async function ensureParentDirectory(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function ensureDirectoryTracked(directory, createdDirectories) {
  const missingDirectories = [];
  let current = directory;
  while (!(await pathExists(current))) {
    missingDirectories.push(current);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  await mkdir(directory, { recursive: true });
  createdDirectories.push(...missingDirectories.reverse());
}

export async function writePageTransaction({ root, registryPath, expectedRegistry, nextRegistry, files, assetsDirectory }) {
  const currentRegistry = await readFile(registryPath, "utf8");
  if (currentRegistry !== expectedRegistry) {
    throw new Error("El registro de páginas cambió durante la preparación. No se escribió ningún archivo; volvé a ejecutar el generador.");
  }

  const token = randomUUID();
  const stagingRoot = path.join(root, `.page-new-${token}`);
  const committedFiles = [];
  const createdDirectories = [];
  try {
    await mkdir(stagingRoot, { recursive: true });
    for (const file of files) {
      const stagedFile = path.join(stagingRoot, file.relativePath);
      await ensureParentDirectory(stagedFile);
      await writeFile(stagedFile, file.content, { encoding: "utf8", flag: "wx" });
    }
    const stagedRegistry = path.join(stagingRoot, "page-registry.json");
    await writeFile(stagedRegistry, nextRegistry, { encoding: "utf8", flag: "wx" });

    const latestRegistry = await readFile(registryPath, "utf8");
    if (latestRegistry !== expectedRegistry) {
      throw new Error("El registro de páginas cambió durante la preparación. No se escribió ningún archivo; volvé a ejecutar el generador.");
    }

    const ensuredDirectories = new Set();
    for (const file of files) {
      const target = path.resolve(root, file.relativePath);
      const parent = path.dirname(target);
      if (!ensuredDirectories.has(parent)) {
        if (!await pathExists(parent)) {
          await ensureDirectoryTracked(parent, createdDirectories);
        }
        ensuredDirectories.add(parent);
      }
      if (await pathExists(target)) throw new Error(`El archivo ya existe y no se sobrescribirá: ${path.relative(root, target)}`);
      const stagedFile = path.join(stagingRoot, file.relativePath);
      await rename(stagedFile, target);
      committedFiles.push(target);
    }

    await rename(stagedRegistry, registryPath);
  } catch (error) {
    await Promise.all(committedFiles.map((filePath) => unlink(filePath).catch(() => undefined)));
    await Promise.all(createdDirectories.reverse().map((directory) => rm(directory, { recursive: true, force: true }).catch(() => undefined)));
    throw error;
  } finally {
    await rm(stagingRoot, { recursive: true, force: true }).catch(() => undefined);
  }
}
