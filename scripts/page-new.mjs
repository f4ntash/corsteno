#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertPagePlanAvailable,
  buildPageFiles,
  collectAppRoutes,
  componentNameFromPageName,
  findPageRouteConflict,
  isValidPageId,
  pathExists,
  serializePageRegistry,
  slugify,
  validatePagePath,
  writePageTransaction,
} from "./page-generator-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(root, "data", "page-registry.json");
const appRoot = path.join(root, "app");
const dryRun = process.argv.includes("--dry-run");
const help = process.argv.includes("--help") || process.argv.includes("-h");

if (help) {
  console.log("Uso: npm run page:new [-- --dry-run]");
  console.log("El modo --dry-run valida los datos y muestra el plan sin escribir archivos.");
  process.exit(0);
}

const rl = createInterface({ input: stdin, crlfDelay: Infinity });
const queuedAnswers = [];
let pendingAnswer;
let inputClosed = false;

rl.on("line", (line) => {
  if (pendingAnswer) {
    const resolve = pendingAnswer;
    pendingAnswer = undefined;
    resolve(line);
  } else {
    queuedAnswers.push(line);
  }
});
rl.on("close", () => {
  inputClosed = true;
  if (pendingAnswer) {
    const reject = pendingAnswer.reject;
    pendingAnswer = undefined;
    reject(new Error("La entrada terminó antes de completar las preguntas."));
  }
});

function nextAnswer() {
  if (queuedAnswers.length) return Promise.resolve(queuedAnswers.shift());
  if (inputClosed) return Promise.reject(new Error("La entrada terminó antes de completar las preguntas."));
  return new Promise((resolve, reject) => {
    pendingAnswer = (line) => resolve(line);
    pendingAnswer.reject = reject;
  });
}

async function ask(label, { defaultValue, required = false } = {}) {
  while (true) {
    const suffix = defaultValue === undefined ? "" : ` [${defaultValue}]`;
    stdout.write(`${label}${suffix}: `);
    const answer = (await nextAnswer()).trim();
    const value = answer || defaultValue || "";
    if (!required || value) return value;
    console.log("Este campo es necesario.");
  }
}

async function askYesNo(label, defaultYes) {
  while (true) {
    const rawAnswer = await ask(label);
    const answer = (rawAnswer || (defaultYes ? "s" : "n")).toLocaleLowerCase("es-AR");
    if (["s", "si", "sí", "y", "yes"].includes(answer)) return true;
    if (["n", "no"].includes(answer)) return false;
    console.log("Respondé S o n.");
  }
}

async function askPageId(suggestion, registry) {
  while (true) {
    const value = await ask("Identificador", { defaultValue: suggestion, required: true });
    if (!isValidPageId(value)) {
      console.log("Usá letras minúsculas sin acentos, números y guiones (sin espacios).");
      continue;
    }
    if (registry.pages.some((page) => page.id === value)) {
      throw new Error(`Ya existe una página registrada con el identificador "${value}". No se modificó ningún archivo.`);
    }
    return value;
  }
}

function displayPath(relativePath) {
  return relativePath.replaceAll("\\", "/");
}

async function preparePage({ registry, registrySource, name, id, esPath, enPath, createAssets, createCssModule, seoTitleEs, seoDescriptionEs, seoTitleEn, seoDescriptionEn }) {
  const reservedSegments = ["admin", "api", "_next"];
  const normalizedEsPath = validatePagePath(esPath, { locale: "es", reservedSegments });
  const normalizedEnPath = enPath ? validatePagePath(enPath, { locale: "en", reservedSegments }) : undefined;
  const registeredConflict = registry.pages.find((page) => [page.paths.es, page.paths.en].includes(normalizedEsPath) || (normalizedEnPath && [page.paths.es, page.paths.en].includes(normalizedEnPath)));
  if (registeredConflict) {
    throw new Error(`La ruta ya está registrada para la página "${registeredConflict.id}". No se modificó ningún archivo.`);
  }
  const routes = await collectAppRoutes(appRoot);
  for (const routePath of [normalizedEsPath, normalizedEnPath].filter(Boolean)) {
    const conflict = findPageRouteConflict(routes, routePath);
    if (conflict) {
      throw new Error(`La ruta ${routePath} entra en conflicto con ${conflict.pattern} (${conflict.kind}: ${displayPath(path.relative(root, conflict.filePath))}). No se modificó ningún archivo.`);
    }
  }

  const componentName = componentNameFromPageName(name);
  const page = {
    id,
    name,
    componentName,
    paths: { es: normalizedEsPath, ...(normalizedEnPath ? { en: normalizedEnPath } : {}) },
    seo: {
      es: { title: seoTitleEs, description: seoDescriptionEs },
      ...(normalizedEnPath ? { en: { title: seoTitleEn, description: seoDescriptionEn } } : {}),
    },
  };
  const files = buildPageFiles({ root, page, createCssModule });
  const componentDirectory = path.join(root, "components", "pages", id);
  const assetsDirectory = createAssets ? path.join(root, "public", "pages", id) : null;
  await assertPagePlanAvailable({ root, files, componentDirectory, assetsDirectory });

  const nextRegistry = {
    ...registry,
    pages: [...registry.pages, page],
  };
  return {
    page,
    files,
    registrySource,
    nextRegistrySource: serializePageRegistry(nextRegistry),
    componentDirectory,
    assetsDirectory,
    assetDirectoryIsNew: Boolean(assetsDirectory && !await pathExists(assetsDirectory)),
  };
}

function printSummary(plan, isDryRun) {
  const { page, files, assetsDirectory, assetDirectoryIsNew } = plan;
  console.log("\n----------------------------------");
  console.log(isDryRun ? "VISTA PREVIA · NUEVA PÁGINA CORSTENO" : "NUEVA PÁGINA CORSTENO");
  console.log("----------------------------------");
  console.log(`\nNombre: ${page.name}`);
  console.log(`ID: ${page.id}`);
  console.log(`\nES:\n${page.paths.es}`);
  if (page.paths.en) console.log(`\nEN:\n${page.paths.en}`);
  else console.log("\nEN:\nNo se crea versión en inglés");
  console.log(`\nComponente:\n${page.componentName}.tsx`);
  console.log(`CSS Module:\n${files.some((file) => file.relativePath.endsWith(".module.css")) ? "Sí" : "No"}`);
  console.log(`Assets:\n${assetsDirectory ? displayPath(path.relative(root, assetsDirectory)) : "No"}`);
  console.log(`\nSEO:\nES ✓\nEN ${page.paths.en ? "✓" : "omitido"}`);
  console.log("Home: no se modifica (la Home actual solo registra proyectos)");
  console.log("\nSe crearían:");
  for (const file of files) console.log(`- ${displayPath(file.relativePath)}`);
  if (assetDirectoryIsNew) console.log(`- ${displayPath(path.relative(root, assetsDirectory))}/.gitkeep`);
  console.log("\nSe modificaría:");
  console.log("- data/page-registry.json");
  if (isDryRun) console.log("\nNo se modificó ningún archivo.");
}

async function main() {
  const registrySource = await readFile(registryPath, "utf8");
  const parsedRegistry = JSON.parse(registrySource);
  const registry = { pages: [], ...parsedRegistry };
  if (!Array.isArray(registry.pages)) throw new Error("data/page-registry.json debe contener un array pages.");

  console.log("Generador general de páginas Corsteno");
  const name = await ask("Nombre de la página", { required: true });
  const suggestedId = slugify(name) || "nueva-pagina";
  console.log(`Identificador sugerido: ${suggestedId}`);
  const id = await askPageId(suggestedId, registry);
  const esPath = await ask("Ruta ES", { required: true });
  const createEnglish = await askYesNo("¿Crear versión en inglés? [S/n]", true);
  const enPath = createEnglish ? await ask("Ruta EN", { required: true }) : undefined;
  const createAssets = await askYesNo("¿Crear carpeta de assets? [S/n]", true);
  const createCssModule = await askYesNo("¿Crear CSS Module? [S/n]", true);
  const seoTitleEs = await ask("SEO title ES", { defaultValue: `${name} | Corsteno`, required: true });
  const seoDescriptionEs = await ask("Meta description ES", { defaultValue: `Experiencia digital ${name} desarrollada por Corsteno.`, required: true });
  const seoTitleEn = createEnglish ? await ask("SEO title EN", { defaultValue: `${name} | Corsteno`, required: true }) : undefined;
  const seoDescriptionEn = createEnglish ? await ask("Meta description EN", { defaultValue: `Digital experience ${name} developed by Corsteno.`, required: true }) : undefined;
  const addToHome = await askYesNo("¿Agregar esta página a la Home? [s/N]", false);
  if (addToHome) {
    throw new Error("La Home actual usa un registro y componentes específicos de proyectos; no existe una inserción genérica segura para páginas arbitrarias. No se modificó ningún archivo.");
  }

  const plan = await preparePage({
    registry,
    registrySource,
    name,
    id,
    esPath,
    enPath,
    createAssets,
    createCssModule,
    seoTitleEs,
    seoDescriptionEs,
    seoTitleEn,
    seoDescriptionEn,
  });
  printSummary(plan, dryRun);
  if (dryRun) return;

  if (!await askYesNo("¿Crear página? [S/n]", true)) {
    console.log("\nCancelado. No se modificó ningún archivo.");
    return;
  }

  const transactionFiles = [...plan.files];
  if (plan.assetDirectoryIsNew && plan.assetsDirectory) {
    transactionFiles.push({ relativePath: path.relative(root, path.join(plan.assetsDirectory, ".gitkeep")), content: "" });
  }
  await writePageTransaction({
    root,
    registryPath,
    expectedRegistry: plan.registrySource,
    nextRegistry: plan.nextRegistrySource,
    files: transactionFiles,
    assetsDirectory: plan.assetsDirectory,
  });

  console.log("\n✓ Página creada correctamente");
  console.log(`\nES:\nhttp://localhost:3000${plan.page.paths.es}`);
  if (plan.page.paths.en) console.log(`\nEN:\nhttp://localhost:3000${plan.page.paths.en}`);
  console.log(`\nCOMENZÁ A PROGRAMAR ACÁ:\ncomponents/pages/${plan.page.id}/${plan.page.componentName}.tsx`);
  if (plan.files.some((file) => file.relativePath.endsWith(".module.css"))) console.log(`\nEstilos:\ncomponents/pages/${plan.page.id}/${plan.page.componentName}.module.css`);
  console.log(`\nContenido ES${plan.page.paths.en ? "/EN" : ""}:\ncomponents/pages/${plan.page.id}/content.ts`);
  if (plan.assetsDirectory) console.log(`\nAssets:\npublic/pages/${plan.page.id}/`);
  console.log("\nSiguiente paso:\n\nnpm run dev");
}

try {
  await main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nERROR: ${message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
