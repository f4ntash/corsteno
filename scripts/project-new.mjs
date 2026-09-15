#!/usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectProjectSlugs,
  extractEnglishProjectNames,
  extractSpanishProjectNames,
  findSimilarProjectNames,
  insertHomeProject,
  isValidSlug,
  resolveCoverAsset,
  serializeRegistry,
  slugify,
  validateLocalizedProject,
  writeProjectTransaction,
} from "./project-generator-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(root, "data", "project-registry.json");
const dryRun = process.argv.includes("--dry-run");
const help = process.argv.includes("--help") || process.argv.includes("-h");

if (help) {
  console.log("Uso: npm run project:new [-- --dry-run]");
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
    console.log("Este campo es necesario para crear una página válida en español e inglés.");
  }
}

async function askSlug(label, suggestion, occupied, localeLabel) {
  while (true) {
    const value = await ask(label, { defaultValue: suggestion, required: true });
    if (!isValidSlug(value)) {
      console.log("Usá letras minúsculas sin acentos, números y guiones (sin espacios).");
      continue;
    }
    if (occupied.has(value)) throw new Error(`ERROR: ya existe un proyecto con slug "${value}" en las rutas ${localeLabel}. No se modificó ningún archivo.`);
    return value;
  }
}

async function askYesNo(label, defaultYes = true) {
  while (true) {
    const rawAnswer = await ask(label);
    const answer = (rawAnswer || (defaultYes ? "s" : "n")).toLocaleLowerCase("es-AR");
    if (["s", "si", "sí", "y", "yes"].includes(answer)) return true;
    if (["n", "no"].includes(answer)) return false;
    console.log("Respondé S o n.");
  }
}

async function askPosition(maximum) {
  while (true) {
    const value = Number(await ask(`¿En qué posición debería aparecer? (1-${maximum})`, { required: true }));
    if (Number.isInteger(value) && value >= 1 && value <= maximum) return value;
    console.log(`Ingresá una posición entre 1 y ${maximum}.`);
  }
}

async function askProjectKind() {
  while (true) {
    const value = await ask("Tipo de proyecto: 1) Proyecto cliente  2) Corsteno Lab", { defaultValue: "1" });
    if (value === "1") return "client-work";
    if (value === "2") return "corsteno-lab";
    console.log("Elegí 1 o 2.");
  }
}

function displayPath(filePath) {
  return path.relative(root, filePath).replaceAll("\\", "/");
}

function printSummary({ project, showOnHome, homePosition, asset, dryRun: isDryRun }) {
  const esRoute = `/proyectos/${project.slug}/`;
  const enRoute = `/en/projects/${project.enSlug}/`;
  const assetLabel = asset.targetPath ? displayPath(asset.targetPath) : `public/${asset.publicRelativePath}`;
  console.log("\n-------------------------------------");
  console.log(isDryRun ? "VISTA PREVIA · NUEVO PROYECTO" : "NUEVO PROYECTO");
  console.log("-------------------------------------");
  console.log(`Nombre ES: ${project.copy.es.name}`);
  console.log(`Nombre EN: ${project.copy.en.name}`);
  console.log(`Slug ES: ${project.slug}`);
  console.log(`Slug EN: ${project.enSlug}`);
  console.log(`Home: ${showOnHome ? `Sí · posición ${homePosition}` : "No"}`);
  console.log("ES: OK · EN: OK");
  console.log(`SEO ES/EN: OK · metadata descriptions reutilizan la descripción principal de cada idioma`);
  console.log(`Asset cover: ${asset.targetPath ? `se copiará a ${assetLabel}` : `existente: public/${asset.publicRelativePath}`}`);
  console.log(`Rutas: ES ${esRoute} · EN ${enRoute}`);
  console.log(`Se actualizará 1 archivo${asset.targetPath ? " y se creará 1 asset" : "; no se crea un asset nuevo"}.`);
  console.log("\nSe creará:");
  console.log(`+ proyecto: ${project.slug}`);
  console.log("+ contenido ES y EN");
  console.log(showOnHome ? `+ registro en Home · posición ${homePosition}` : "+ páginas del proyecto sin mostrar en Home");
  console.log("+ SEO ES y EN · canonical, hreflang, Open Graph, sitemap y datos estructurados");
  console.log(asset.targetPath ? `+ asset cover: ${assetLabel}` : `+ referencia a asset existente: public/${asset.publicRelativePath}`);
  console.log(`+ rutas: ${esRoute} · ${enRoute}`);
  console.log("\nArchivos que se modificarían:");
  console.log("- data/project-registry.json");
  if (asset.targetPath) console.log(`- ${assetLabel} (nuevo)`);

  if (isDryRun) {
    console.log("\nNo se modificó ningún archivo.");
  }
}

async function main() {
  const [registrySource, seoSource, routesSource, englishProjectsSource] = await Promise.all([
    readFile(registryPath, "utf8"),
    readFile(path.join(root, "lib", "seo.ts"), "utf8"),
    readFile(path.join(root, "lib", "i18n", "routes.ts"), "utf8"),
    readFile(path.join(root, "lib", "i18n", "en", "projects.ts"), "utf8"),
  ]);
  const registry = JSON.parse(registrySource);
  const staticSlugs = collectProjectSlugs(seoSource, routesSource, registry);

  console.log("Generador de proyectos Corsteno");
  const internalName = await ask("Nombre interno del proyecto", { required: true });
  const nameEs = await ask("Nombre público ES", { required: true });
  const nameEn = await ask("Nombre público EN", { required: true });
  const suggestedSlug = slugify(nameEs) || "nuevo-proyecto";
  console.log(`Slug sugerido: ${suggestedSlug}`);
  const slug = await askSlug("Slug ES", suggestedSlug, staticSlugs.es, "español");
  const enSlug = await askSlug("Slug EN (Enter conserva el slug ES)", slug, staticSlugs.en, "inglés");
  const kind = await askProjectKind();
  const showOnHome = await askYesNo("¿Mostrar este proyecto en la Home? [S/n]", true);
  const homePosition = showOnHome ? await askPosition(registry.homeOrder.length + 1) : null;

  const cardDescriptionEs = showOnHome ? await ask("Descripción corta para la Home ES", { required: true }) : "";
  const cardDescriptionEn = showOnHome ? await ask("Descripción corta para la Home EN", { required: true }) : "";
  const descriptionEs = await ask("Descripción principal ES (también se usa como meta description)", { required: true });
  const descriptionEn = await ask("Descripción principal EN (también se usa como meta description)", { required: true });

  const challengeTitleEs = await ask("El desafío · título ES", { required: true });
  const challengeBodyEs = await ask("El desafío · desarrollo ES", { required: true });
  const challengeTitleEn = await ask("The challenge · title EN", { required: true });
  const challengeBodyEn = await ask("The challenge · body EN", { required: true });
  const solutionTitleEs = await ask("La solución · título ES", { required: true });
  const solutionBodyEs = await ask("La solución · desarrollo ES", { required: true });
  const solutionTitleEn = await ask("The solution · title EN", { required: true });
  const solutionBodyEn = await ask("The solution · body EN", { required: true });

  const seoTitleEs = await ask("SEO title ES", { defaultValue: `${nameEs} | Corsteno`, required: true });
  const seoTitleEn = await ask("SEO title EN", { defaultValue: `${nameEn} | Corsteno`, required: true });
  const assetInput = await ask("Imagen/card principal (ruta absoluta o /ruta/dentro/de/public)", { required: true });
  const liveUrlInput = await ask("URL del sitio para mostrar en vivo (opcional; Enter para omitir)");

  const similarEs = findSimilarProjectNames(
    [...extractSpanishProjectNames(seoSource), ...registry.projects.map((project) => project.copy.es.name)],
    [nameEs],
  );
  const similarEn = findSimilarProjectNames(
    [...extractEnglishProjectNames(englishProjectsSource), ...registry.projects.map((project) => project.copy.en.name)],
    [nameEn],
  );
  if (similarEs.length || similarEn.length) {
    console.log("\nAVISO: el nombre parece similar a un proyecto existente. Revisalo antes de confirmar.");
    if (similarEs.length) console.log(`Nombre ES a revisar: ${nameEs}`);
    if (similarEn.length) console.log(`Nombre EN a revisar: ${nameEn}`);
  }

  let liveUrl = null;
  if (liveUrlInput) {
    let parsedUrl;
    try {
      parsedUrl = new URL(liveUrlInput);
    } catch {
      throw new Error("La URL del sitio debe ser absoluta e incluir https:// o http://. No se modificó ningún archivo.");
    }
    if (!new Set(["http:", "https:"]).has(parsedUrl.protocol)) throw new Error("La URL del sitio debe usar http o https. No se modificó ningún archivo.");
    liveUrl = parsedUrl.toString();
  }

  const asset = await resolveCoverAsset(root, assetInput, slug);
  const project = {
    internalName,
    slug,
    enSlug,
    kind,
    image: asset.image,
    imageAlt: {
      es: `Vista previa de ${nameEs}`,
      en: `Preview of ${nameEn}`,
    },
    liveUrl,
    seo: {
      es: { title: seoTitleEs, keywords: [] },
      en: { title: seoTitleEn, keywords: [] },
    },
    copy: {
      es: {
        name: nameEs,
        cardDescription: cardDescriptionEs,
        description: descriptionEs,
        challengeTitle: challengeTitleEs,
        challengeBody: challengeBodyEs,
        solutionTitle: solutionTitleEs,
        solutionBody: solutionBodyEs,
      },
      en: {
        name: nameEn,
        cardDescription: cardDescriptionEn,
        description: descriptionEn,
        challengeTitle: challengeTitleEn,
        challengeBody: challengeBodyEn,
        solutionTitle: solutionTitleEn,
        solutionBody: solutionBodyEn,
      },
    },
  };
  const validationErrors = validateLocalizedProject(project, { showOnHome });
  if (validationErrors.length) throw new Error(`La información está incompleta:\n${validationErrors.join("\n")}`);

  const nextRegistry = {
    ...registry,
    homeOrder: showOnHome ? insertHomeProject(registry.homeOrder, slug, homePosition) : registry.homeOrder,
    projects: [...registry.projects, project],
  };
  const nextRegistrySource = serializeRegistry(nextRegistry);

  printSummary({ project, showOnHome, homePosition, asset, dryRun });
  if (dryRun) return;

  if (!await askYesNo("¿Crear proyecto? [S/n]", true)) {
    console.log("\nCancelado. No se modificó ningún archivo.");
    return;
  }

  await writeProjectTransaction({
    registryPath,
    expectedRegistry: registrySource,
    nextRegistry: nextRegistrySource,
    assetSource: asset.sourcePath,
    assetTarget: asset.targetPath,
  });

  console.log("\n✓ Proyecto creado correctamente");
  console.log(`Proyecto: ${nameEs} / ${nameEn}`);
  console.log(`Rutas: ES ${`/proyectos/${slug}/`} · EN ${`/en/projects/${enSlug}/`}`);
  console.log(`Home: ${showOnHome ? `✓ agregado en la posición ${homePosition}` : "omitido"}`);
  console.log("SEO: ✓ ES · ✓ EN (canonical, hreflang, Open Graph, sitemap y JSON-LD desde los registros existentes)");
  console.log(`Assets: ✓ ${asset.publicRelativePath}${asset.sourcePath ? " (copiado sin conversión)" : " (reutilizado)"}`);
  console.log("Archivos modificados:");
  console.log("- data/project-registry.json");
  if (asset.targetPath) console.log(`- ${displayPath(asset.targetPath)} (nuevo)`);
  console.log("\nSiguiente paso: npm run dev");
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
