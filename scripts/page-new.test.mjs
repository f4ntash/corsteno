import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertPagePlanAvailable,
  buildPageFiles,
  collectAppRoutes,
  componentNameFromPageName,
  findPageRouteConflict,
  normalizePagePath,
  routePatternMatches,
  serializePageRegistry,
  writePageTransaction,
} from "./page-generator-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("page paths normalize a trailing slash and preserve nested segments", () => {
  assert.equal(normalizePagePath("/revestimientos/demo/", "es"), "/revestimientos/demo");
  assert.equal(normalizePagePath("/en/experiences/3d/configurator", "en"), "/en/experiences/3d/configurator");
});

test("page paths reject unsafe and malformed routes", () => {
  assert.throws(() => normalizePagePath("", "es"), /no puede estar vacía/);
  assert.throws(() => normalizePagePath("/demo//muebles", "es"), /barras duplicadas/);
  assert.throws(() => normalizePagePath("/demo/../muebles", "es"), /no puede contener/);
  assert.throws(() => normalizePagePath("/en/surfaces", "es"), /prefijo reservado/);
  assert.throws(() => normalizePagePath("/surfaces/demo", "en"), /debe empezar por \/en\//);
});

test("component names are safe and readable", () => {
  assert.equal(componentNameFromPageName("Demo Revestimientos"), "DemoRevestimientosPage");
  assert.equal(componentNameFromPageName("3D / Configurador"), "Page3dConfiguradorPage");
});

test("dynamic and catch-all app routes match requested paths", () => {
  assert.equal(routePatternMatches("/proyectos/[slug]", "/proyectos/nuevo"), true);
  assert.equal(routePatternMatches("/docs/[...slug]", "/docs/a/b"), true);
  assert.equal(routePatternMatches("/docs/[[...slug]]", "/docs"), true);
  assert.equal(routePatternMatches("/proyectos/[slug]", "/proyectos/nuevo/demo"), false);
});

test("existing static and dynamic app routes are detected", async (context) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "corsteno-page-routes-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const appRoot = path.join(directory, "app");
  await mkdir(path.join(appRoot, "catalogo"), { recursive: true });
  await mkdir(path.join(appRoot, "proyectos", "[slug]"), { recursive: true });
  await writeFile(path.join(appRoot, "catalogo", "page.tsx"), "export default function Page() {}\n");
  await writeFile(path.join(appRoot, "proyectos", "[slug]", "page.tsx"), "export default function Page() {}\n");
  const routes = await collectAppRoutes(appRoot);
  assert.equal(findPageRouteConflict(routes, "/catalogo")?.pattern, "/catalogo");
  assert.equal(findPageRouteConflict(routes, "/proyectos/terrambu")?.pattern, "/proyectos/[slug]");
});

test("generated files include independent component, wrapper, content and optional CSS", () => {
  const files = buildPageFiles({
    root,
    createCssModule: true,
    page: {
      id: "demo-revestimientos",
      name: "Demo Revestimientos",
      componentName: "DemoRevestimientosPage",
      paths: { es: "/revestimientos/demo", en: "/en/surfaces/demo" },
      seo: {
        es: { title: "Demo | Corsteno", description: "Demo ES" },
        en: { title: "Demo | Corsteno", description: "Demo EN" },
      },
    },
  });
  const sources = new Map(files.map((file) => [file.relativePath.replaceAll("\\", "/"), file.content]));
  assert.match(sources.get("components/pages/demo-revestimientos/DemoRevestimientosPage.tsx"), /content\[locale\]/);
  assert.match(sources.get("components/pages/demo-revestimientos/DemoRevestimientosPage.tsx"), /Desarrollar página aquí/);
  assert.match(sources.get("app/revestimientos/demo/page.tsx"), /locale="es"/);
  assert.match(sources.get("app/en/surfaces/demo/page.tsx"), /locale="en"/);
  assert.match(sources.get("components/pages/demo-revestimientos/DemoRevestimientosPage.module.css"), /min-height: 100vh/);
  assert.match(sources.get("components/pages/demo-revestimientos/content.ts"), /en:/);
});

test("page transaction writes all files and never overwrites an existing target", async (context) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "corsteno-page-write-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const registryPath = path.join(directory, "data", "page-registry.json");
  const files = [{ relativePath: path.join("app", "demo", "page.tsx"), content: "export default function Page() {}\n" }];
  const initial = serializePageRegistry({ pages: [] });
  const updated = serializePageRegistry({ pages: [{ id: "demo" }] });
  await mkdir(path.dirname(registryPath), { recursive: true });
  await writeFile(registryPath, initial);
  await writePageTransaction({ root: directory, registryPath, expectedRegistry: initial, nextRegistry: updated, files });
  assert.equal(await readFile(path.join(directory, "app", "demo", "page.tsx"), "utf8"), files[0].content);
  assert.equal(await readFile(registryPath, "utf8"), updated);

  await assert.rejects(
    assertPagePlanAvailable({ root: directory, files, componentDirectory: path.join(directory, "components", "pages", "demo"), assetsDirectory: null }),
    /no se sobrescribirán/,
  );
  assert.equal(await readFile(path.join(directory, "app", "demo", "page.tsx"), "utf8"), files[0].content);
});

test("page:new dry-run does not write the registry or generated files", async () => {
  const registryPath = path.join(root, "data", "page-registry.json");
  const before = await readFile(registryPath, "utf8");
  const input = [
    "Dry Run Page",
    "dry-run-page",
    "/experiencias/dry-run-page",
    "n",
    "n",
    "s",
    "",
    "",
    "n",
  ].join("\n") + "\n";
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "page-new.mjs"), "--dry-run"], {
    cwd: root,
    input,
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /app\/experiencias\/dry-run-page\/page\.tsx/);
  assert.match(result.stdout, /No se modificó ningún archivo/);
  assert.equal(await readFile(registryPath, "utf8"), before);
});
