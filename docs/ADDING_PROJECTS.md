# Agregar proyectos

Ejecutá el generador desde la raíz del repositorio:

```bash
npm run project:new
```

Te pide los nombres y slugs ES/EN, el tipo de proyecto, si aparece en la Home, las descripciones y textos del caso en ambos idiomas, los títulos SEO y una imagen de portada. La descripción principal de cada idioma también se usa como meta description. El sitio existente genera las rutas, canonical, hreflang, Open Graph, sitemap y datos estructurados desde ese contenido.

Antes de escribir, el generador muestra las rutas y archivos previstos y pide confirmación. Para validar las respuestas y ver el plan sin cambiar archivos:

```bash
npm run project:new -- --dry-run
```

Para la imagen, podés indicar una ruta absoluta a un archivo PNG, JPG, GIF, AVIF o WebP; se copia sin conversión a `public/projects/{slug}/cover.ext`. También podés reutilizar una imagen existente con una ruta como `/projects/terrambu-hotel-web.webp`. No se sobrescriben assets existentes.

Los proyectos nuevos se guardan en `data/project-registry.json`. Las páginas dinámicas existentes los incorporan a las rutas ES/EN, la Home (si se seleccionó), metadata y sitemap; no se crea una página individual por proyecto.

Verificá el generador y la compilación con:

```bash
npm run test:project
npm run build
```
