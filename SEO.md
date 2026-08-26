# SEO, GEO/AEO y analytics

## Canonical y despliegue

El sitio usa `NEXT_PUBLIC_SITE_URL` como URL canónica. El dominio oficial de producción es `https://corsteno.com`.

## Google Search Console

1. Configurar la propiedad con la URL canónica final.
2. Agregar el token de verificación en `NEXT_PUBLIC_GSC_VERIFICATION`.
3. Enviar `https://corsteno.com/sitemap.xml`.

## Google Analytics 4

Definir `NEXT_PUBLIC_GA_MEASUREMENT_ID` con el measurement ID de GA4. Si la variable está vacía, no se carga ningún script de Google Analytics.

Eventos preparados:

- `demo_started`
- `demo_configuration_changed`
- `demo_email_opened`
- `demo_email_submitted`
- `demo_marketing_consent`
- `project_opened`
- `project_external_opened`
- `contact_started`
- `contact_submitted`
- `cta_click`
- `contact_click`
- `whatsapp_click`
- `configurator_interaction`
- `project_interaction`
- `project_view`
- `share_click`

Los eventos nuevos se emiten mediante `trackEvent()` y no dependen directamente de GA4. Si `NEXT_PUBLIC_GA_MEASUREMENT_ID` está vacío, no se envían a ninguna plataforma.

## Demo

`NEXT_PUBLIC_DEMO_FORM_ENDPOINT` configura el formulario Formspree de la demo. El consentimiento de marketing se guarda en la misma submission y no dispara una suscripción ni un segundo request.

La política pública está disponible en `https://corsteno.com/privacidad/`.

## Crawlers IA

`robots.txt` permite crawlers de búsqueda y asistentes: GPTBot, OAI-SearchBot, ChatGPT-User, Google-Extended, ClaudeBot, Claude-SearchBot, Claude-User y PerplexityBot.
