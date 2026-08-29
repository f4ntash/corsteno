# SEO Audit

## Estado general

✅ LISTO

## Críticos

No se encontraron problemas que bloqueen la indexación o el build.

## Importantes

Resueltos / aceptados:

1. La ausencia de `/proyectos/` es intencional: “Proyectos” es una sección de la home (`/#proyectos`) y todos los enlaces relacionados apuntan correctamente allí. No existe una ruta rota ni es necesario duplicar la sección en otra URL.
2. `previa_house_interior.glb` es el nombre técnico del modelo, no el nombre público del proyecto. La URL definitiva y coherente con el contenido visible es `/proyectos/revestimientos-interactivos/`; crear `/proyectos/previa-house-interior/` generaría una ruta duplicada sin beneficio SEO.

## Verificaciones

- Sitemap: correcto, 17 URLs bajo `https://corsteno.com`; incluye Exterior House y Revestimientos Interactivos. No incluye ATLAS, páginas experimentales, `/industrial` ni confirmación de formulario.
- Robots: correcto; permite indexación pública y referencia `https://corsteno.com/sitemap.xml`.
- Canonical: correcto en home, privacidad, servicios, sectores y proyectos generados. Las páginas deliberadamente no indexables no declaran canonical.
- Metadata: title, description, metadataBase, Open Graph, Twitter e icono configurados. Cada página pública principal genera un H1 y las imágenes relevantes tienen `alt`.
- Exterior House: ruta, metadata, JSON-LD, preview, enlaces internos y sitemap correctos en `/proyectos/exterior-house/`.
- Previa House Interior: modelo, preview, metadata, JSON-LD y sitemap correctos bajo el nombre público “Revestimientos Interactivos” en `/proyectos/revestimientos-interactivos/`; no existe la URL `/proyectos/previa-house-interior/`.
- ATLAS eliminado: sin referencias activas en rutas, sitemap, metadata, JSON-LD, `llms.txt`, cards, previews ni código fuente.
- Rutas públicas: no se detectaron enlaces internos rotos ni URLs antiguas. Home y páginas de proyecto tienen un único H1.
- Performance SEO: los GLB no aparecen referenciados por los scripts iniciales de la home; se cargan en sus experiencias correspondientes. Previews de proyecto: 121 KB y 150 KB.
- TypeScript: `npx tsc --noEmit` OK.
- Build: `npm run build` OK; export estático de 24 páginas.
