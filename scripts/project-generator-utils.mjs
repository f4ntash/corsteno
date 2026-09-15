import { constants as fsConstants } from "node:fs";
import { copyFile, link, mkdir, readFile, rename, rmdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function collectProjectSlugs(seoSource, routesSource, registry) {
  const es = new Set([
    ...[...seoSource.matchAll(/path:\s*"\/proyectos\/([^"/]+)\/?"/g)].map((match) => match[1]),
    ...[...routesSource.matchAll(/es:\s*"\/proyectos\/([^"/]+)\/?"/g)].map((match) => match[1]),
  ]);
  const en = new Set([...routesSource.matchAll(/en:\s*"\/en\/projects\/([^"/]+)\/?"/g)].map((match) => match[1]));

  for (const project of registry.projects) {
    es.add(project.slug);
    en.add(project.enSlug);
  }

  return { es, en };
}

export function findSimilarProjectNames(names, candidates) {
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const normalizedNames = names.map(normalize).filter((name) => name.length >= 4);
  return candidates.filter((candidate) => {
    const normalizedCandidate = normalize(candidate);
    return normalizedCandidate.length >= 4 && normalizedNames.some((name) => name === normalizedCandidate || name.includes(normalizedCandidate) || normalizedCandidate.includes(name));
  });
}

export function extractSpanishProjectNames(seoSource) {
  const names = [];
  const projectPaths = seoSource.matchAll(/path:\s*"\/proyectos\/[^"/]+\/?"/g);
  for (const match of projectPaths) {
    const start = seoSource.lastIndexOf("\n  {", match.index);
    const end = seoSource.indexOf("\n  },", match.index);
    if (start < 0 || end < 0) continue;
    const record = seoSource.slice(start, end);
    if (!/category:\s*"proyecto"/.test(record)) continue;
    const title = record.match(/title:\s*"([^"]+)"/)?.[1];
    if (title) names.push(title.split(/\s(?:—|\|)\s/)[0]);
  }
  return names;
}

export function extractEnglishProjectNames(projectsSource) {
  return [...projectsSource.matchAll(/h1:\s*"([^"]+)"/g)].map((match) => match[1]);
}

export function insertHomeProject(homeOrder, slug, position) {
  if (!Number.isInteger(position) || position < 1 || position > homeOrder.length + 1) {
    throw new Error(`La posición debe estar entre 1 y ${homeOrder.length + 1}.`);
  }
  const updated = [...homeOrder];
  updated.splice(position - 1, 0, slug);
  return updated;
}

export function validateLocalizedProject(project, { showOnHome }) {
  const errors = [];
  for (const locale of ["es", "en"]) {
    const copy = project.copy?.[locale];
    const label = locale.toUpperCase();
    for (const field of ["name", "description", "challengeTitle", "challengeBody", "solutionTitle", "solutionBody"]) {
      if (!copy?.[field]?.trim()) errors.push(`${label}: falta ${field}.`);
    }
    if (showOnHome && !copy?.cardDescription?.trim()) errors.push(`${label}: falta cardDescription.`);
    if (!project.seo?.[locale]?.title?.trim()) errors.push(`${label}: falta el título SEO.`);
  }
  if (!project.slug || !project.enSlug) errors.push("Falta el slug en uno de los idiomas.");
  if (!project.image?.trim()) errors.push("Falta la imagen de portada.");
  return errors;
}

export function serializeRegistry(registry) {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return false;
    throw error;
  }
}

export async function writeProjectTransaction({ registryPath, expectedRegistry, nextRegistry, assetSource, assetTarget }) {
  const currentRegistry = await readFile(registryPath, "utf8");
  if (currentRegistry !== expectedRegistry) throw new Error("El registro de proyectos cambió durante la preparación. No se escribió ningún archivo; volvé a ejecutar el generador.");
  if (assetTarget && await pathExists(assetTarget)) throw new Error(`El asset ya existe y no se sobrescribirá: ${assetTarget}`);

  const token = randomUUID();
  const registryTemp = `${registryPath}.${token}.tmp`;
  const assetDirectory = assetTarget ? path.dirname(assetTarget) : null;
  const assetTemp = assetTarget ? `${assetTarget}.${token}.tmp` : null;
  let madeAssetDirectory = false;
  let linkedAsset = false;

  try {
    await writeFile(registryTemp, nextRegistry, { flag: "wx", encoding: "utf8" });
    if (assetTarget && assetSource && assetDirectory && assetTemp) {
      if (!await pathExists(assetDirectory)) {
        await mkdir(assetDirectory, { recursive: true });
        madeAssetDirectory = true;
      }
      await copyFile(assetSource, assetTemp, fsConstants.COPYFILE_EXCL);
      await link(assetTemp, assetTarget);
      linkedAsset = true;
      await unlink(assetTemp);
    }

    const latestRegistry = await readFile(registryPath, "utf8");
    if (latestRegistry !== expectedRegistry) throw new Error("El registro de proyectos cambió durante la preparación. No se escribió ningún archivo; volvé a ejecutar el generador.");
    await rename(registryTemp, registryPath);
  } catch (error) {
    if (linkedAsset && assetTarget) await unlink(assetTarget).catch(() => undefined);
    if (assetTemp) await unlink(assetTemp).catch(() => undefined);
    await unlink(registryTemp).catch(() => undefined);
    if (madeAssetDirectory && assetDirectory) await rmdir(assetDirectory).catch(() => undefined);
    throw error;
  }
}

export async function resolveCoverAsset(root, input, slug) {
  const cleaned = input.trim().replace(/^(["'])(.*)\1$/, "$2");
  const publicRoot = path.resolve(root, "public");
  const isPublicReference = cleaned.startsWith("/") || cleaned.replaceAll("\\", "/").startsWith("public/");

  if (isPublicReference) {
    const relativePath = cleaned.replaceAll("\\", "/").replace(/^\/+/, "").replace(/^public\//, "");
    const resolved = path.resolve(publicRoot, ...relativePath.split("/"));
    const relativeToPublic = path.relative(publicRoot, resolved);
    if (relativeToPublic.startsWith("..") || path.isAbsolute(relativeToPublic)) throw new Error("La ruta debe permanecer dentro de public/.");
    if (!relativePath || relativePath.split("/").includes("..")) throw new Error("Ingresá una ruta válida dentro de public/.");
    const details = await stat(resolved).catch(() => null);
    if (!details?.isFile()) throw new Error(`No existe un archivo en public/: ${cleaned}`);
    return { image: `/${relativePath}`, sourcePath: null, targetPath: null, publicRelativePath: relativePath };
  }

  const sourcePath = path.isAbsolute(cleaned) ? path.resolve(cleaned) : path.resolve(root, cleaned);
  const details = await stat(sourcePath).catch(() => null);
  if (!details?.isFile()) throw new Error(`No existe el archivo de imagen: ${cleaned}`);
  const extension = path.extname(sourcePath).toLowerCase();
  if (![".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"].includes(extension)) {
    throw new Error("Usá una imagen PNG, JPG, GIF, AVIF o WebP. El generador no convierte formatos.");
  }

  const publicRelativePath = `projects/${slug}/cover${extension}`;
  const targetPath = path.resolve(publicRoot, ...publicRelativePath.split("/"));
  if (await pathExists(targetPath)) throw new Error(`El asset de destino ya existe y no se sobrescribirá: /${publicRelativePath}`);
  return { image: `/${publicRelativePath}`, sourcePath, targetPath, publicRelativePath };
}
