# SEO, GEO/AEO y analytics

## Canonical y despliegue

El sitio usa `NEXT_PUBLIC_SITE_URL` como URL canónica. El dominio oficial de producción es `https://corsteno.com`.

## Google Search Console

1. Configurar la propiedad con la URL canónica final.
2. Agregar el token de verificación en `NEXT_PUBLIC_GSC_VERIFICATION`.
3. Enviar `https://corsteno.com/sitemap.xml`.

## Google Analytics 4

Definir `NEXT_PUBLIC_GA_ID` con el measurement ID de GA4. Si la variable está vacía, no se carga ningún script de Google Analytics.

Eventos preparados:

- `cta_click`
- `contact_click`
- `whatsapp_click`
- `external_project_visit`
- `configurator_interaction`
- `project_interaction`
- `project_view`
- `share_click`

## Crawlers IA

`robots.txt` permite crawlers de búsqueda y asistentes: GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, ClaudeBot, Claude-SearchBot, Claude-User y PerplexityBot.
