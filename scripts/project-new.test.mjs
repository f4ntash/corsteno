import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectProjectSlugs,
  extractEnglishProjectNames,
  extractSpanishProjectNames,
  findSimilarProjectNames,
  insertHomeProject,
  serializeRegistry,
  slugify,
  validateLocalizedProject,
  writeProjectTransaction,
} from "./project-generator-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("slug generation removes accents and normalizes separators", () => {
  assert.equal(slugify("Revestimientos Corsteno & Más"), "revestimientos-corsteno-mas");
});

test("static and generated slugs are checked per locale", () => {
  const slugs = collectProjectSlugs(
    'path: "/proyectos/terrambu"',
    'en: "/en/projects/terrambu/"',
    { projects: [{ slug: "mapa-punilla", enSlug: "punilla-map" }] },
  );
  assert.equal(slugs.es.has("terrambu"), true);
  assert.equal(slugs.es.has("mapa-punilla"), true);
  assert.equal(slugs.en.has("punilla-map"), true);
  assert.equal(slugs.en.has("terrambu"), true);
});

test("similar project names are detected without accents", () => {
  assert.deepEqual(findSimilarProjectNames(["Terrambú"], ["Terrambu"]), ["Terrambu"]);
});

test("static case study names are available for duplicate warnings", async () => {
  const seoSource = await readFile(path.join(root, "lib", "seo.ts"), "utf8");
  const englishSource = await readFile(path.join(root, "lib", "i18n", "en", "projects.ts"), "utf8");
  const spanishNames = extractSpanishProjectNames(seoSource);
  const englishNames = extractEnglishProjectNames(englishSource);
  assert.deepEqual(findSimilarProjectNames(spanishNames, ["Terrambu"]), ["Terrambu"]);
  assert.deepEqual(findSimilarProjectNames(spanishNames, ["Mapa Punilla"]), ["Mapa Punilla"]);
  assert.ok(englishNames.includes("Terrambu"));
});

test("home ordering inserts a project at the requested visible position", () => {
  assert.deepEqual(insertHomeProject(["terrambu", "mapa-punilla"], "nuevo", 2), ["terrambu", "nuevo", "mapa-punilla"]);
  assert.throws(() => insertHomeProject(["terrambu"], "nuevo", 3), /entre 1 y 2/);
});

test("required copy must be complete in both languages", () => {
  const copy = {
    name: "Proyecto",
    cardDescription: "Descripción",
    description: "Descripción completa",
    challengeTitle: "Desafío",
    challengeBody: "Contenido",
    solutionTitle: "Solución",
    solutionBody: "Contenido",
  };
  const project = {
    slug: "proyecto",
    enSlug: "project",
    image: "/projects/proyecto/cover.webp",
    seo: { es: { title: "Proyecto | Corsteno" }, en: { title: "Project | Corsteno" } },
    copy: { es: copy, en: { ...copy, cardDescription: "" } },
  };
  assert.deepEqual(validateLocalizedProject(project, { showOnHome: true }), ["EN: falta cardDescription."]);
  assert.deepEqual(validateLocalizedProject(project, { showOnHome: false }), []);
});

test("registry serialization is stable and complete", () => {
  const registry = { homeOrder: ["terrambu"], projects: [{ slug: "nuevo" }] };
  assert.equal(serializeRegistry(registry), `${JSON.stringify(registry, null, 2)}\n`);
});

test("transaction stages the registry and cover; existing assets are never overwritten", async (context) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "corsteno-project-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const registryPath = path.join(directory, "project-registry.json");
  const sourcePath = path.join(directory, "source.webp");
  const assetTarget = path.join(directory, "public", "projects", "nuevo", "cover.webp");
  const initial = '{"homeOrder":[],"projects":[]}\n';
  const updated = '{"homeOrder":["nuevo"],"projects":[{"slug":"nuevo"}]}\n';
  await writeFile(registryPath, initial);
  await writeFile(sourcePath, "image-bytes");

  await writeProjectTransaction({ registryPath, expectedRegistry: initial, nextRegistry: updated, assetSource: sourcePath, assetTarget });
  assert.equal(await readFile(registryPath, "utf8"), updated);
  assert.equal(await readFile(assetTarget, "utf8"), "image-bytes");

  await assert.rejects(
    writeProjectTransaction({ registryPath, expectedRegistry: updated, nextRegistry: initial, assetSource: sourcePath, assetTarget }),
    /ya existe/,
  );
  assert.equal(await readFile(registryPath, "utf8"), updated);
  assert.equal(await readFile(assetTarget, "utf8"), "image-bytes");
});

test("dry-run validates a bilingual project without writing the registry or assets", async () => {
  const registryPath = path.join(root, "data", "project-registry.json");
  const before = await readFile(registryPath, "utf8");
  const input = [
    "Dry run fixture",
    "Obra Aurora",
    "Aurora Project",
    "obra-aurora",
    "",
    "1",
    "n",
    "Descripción principal ES",
    "Main description EN",
    "El reto",
    "Contexto del reto",
    "The challenge",
    "Challenge context",
    "La solución",
    "Detalle de solución",
    "The solution",
    "Solution details",
    "",
    "",
    "/projects/terrambu-hotel-web.webp",
    "",
  ].join("\n") + "\n";
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "project-new.mjs"), "--dry-run"], {
    cwd: root,
    input,
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /No se modificó ningún archivo/);
  assert.match(result.stdout, /obra-aurora/);
  assert.equal(await readFile(registryPath, "utf8"), before);
});

test("normal mode shows the summary and does not write before confirmation", async () => {
  const registryPath = path.join(root, "data", "project-registry.json");
  const before = await readFile(registryPath, "utf8");
  const input = [
    "Cancelled fixture",
    "Obra Cancelada",
    "Cancelled Work",
    "obra-cancelada",
    "",
    "1",
    "n",
    "Descripción principal ES",
    "Main description EN",
    "El reto",
    "Contexto del reto",
    "The challenge",
    "Challenge context",
    "La solución",
    "Detalle de solución",
    "The solution",
    "Solution details",
    "",
    "",
    "/projects/terrambu-hotel-web.webp",
    "",
    "n",
  ].join("\n") + "\n";
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "project-new.mjs")], {
    cwd: root,
    input,
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(result.stdout.indexOf("Se creará:") < result.stdout.indexOf("¿Crear proyecto? [S/n]"));
  assert.match(result.stdout, /Cancelado\. No se modificó ningún archivo/);
  assert.equal(await readFile(registryPath, "utf8"), before);
});

test("duplicate Spanish slugs stop the interactive generator before writing", async () => {
  const registryPath = path.join(root, "data", "project-registry.json");
  const before = await readFile(registryPath, "utf8");
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "project-new.mjs"), "--dry-run"], {
    cwd: root,
    input: ["Duplicate fixture", "Terrambu", "Terrambu", "terrambu", ""].join("\n") + "\n",
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ya existe un proyecto con slug "terrambu"/);
  assert.equal(await readFile(registryPath, "utf8"), before);
});
