# CORSTENO — 360° AUDIT

## Executive Summary

Auditoría ejecutada sobre el export de producción local, combinando código fuente, HTML exportado, DOM real, navegación, interacción y seis viewports. Los scores son evaluaciones heurísticas informadas por evidencia concreta; no son resultados Lighthouse. Lighthouse no está instalado en el proyecto y no se agregó ninguna dependencia.

| Área | Score |
|---|---:|
| UX | 76/100 |
| UI | 84/100 |
| Marketing | 64/100 |
| Positioning | 61/100 |
| Sales Psychology | 58/100 |
| CRO | 62/100 |
| Copy | 70/100 |
| SEO Technical | 86/100 |
| SEO Content | 74/100 |
| LLM/GEO | 81/100 |
| Performance | 48/100 |
| Accessibility | 72/100 |
| Mobile | 70/100 |
| Trust | 57/100 |
| Project Presentation | 66/100 |
| Technical Quality | 75/100 |

Corsteno se percibe como un estudio tecnológico especializado y visualmente competente. La home explica bien el problema de mostrar productos complejos y ofrece una demo real, pero la propuesta se ensancha hacia web, 3D, software conectado, datos, AR y VR antes de establecer suficiente prueba comercial. Para un decisor B2B, el principal freno no es el diseño: es la falta de evidencia verificable sobre resultados, alcance y capacidad operativa para sostener proyectos de varios miles de dólares.

El producto renderizado es robusto en responsive: no se detectó overflow horizontal en 1920×1080, 1440×900, 1280×800, 768×1024, 390×844 ni 360×800. Las rutas auditadas responden, los iframes y Canvas se adaptan, el menú mobile funciona y el export estático es consistente. La deuda más seria es de performance: un chunk de Three.js de 882.2 KB sin comprimir forma parte del HTML inicial de todas las rutas auditadas, aunque Canvas y GLB se difieran visualmente.

## Alcance y evidencia

- Rutas: `/`, `/proyectos/terrambu/`, `/proyectos/mapa-punilla/`, `/proyectos/h2o/`, `/proyectos/exterior-house/` y `/industrial/`.
- Viewports de home: los seis solicitados. Proyectos: desktop 1920×1080 y mobile 390×844, con comprobaciones estructurales adicionales sobre el HTML exportado.
- Build: Next.js 16.3.0, export estático de 23 páginas.
- Estado HTTP local: 200 en todas las rutas auditadas, `robots.txt`, `sitemap.xml` y `llms.txt`.
- Home: 1 H1, 20 links, 19 buttons, 8 imágenes, 1 formulario; ningún control o link sin nombre accesible; 0 Canvas y 0 iframes antes de hacer scroll.
- Altura de home: 8,091 px a 1920×1080; 13,030 px a 390×844; 13,196 px a 360×800.
- JS referenciado por ruta, suma sin comprimir: home ≈1,513.7 KB; proyectos ≈1,567.1 KB; `/industrial/` ≈1,549.4 KB.
- Chunk Three/R3F principal: 882.2 KB sin comprimir y presente en el HTML inicial de todas las rutas auditadas.
- GLB: `exterior_house.glb` 20,316,540 bytes; `preview_house.glb` 10,395,324 bytes.
- Logo y favicon fuente: PNG de marca ≈345.6 KB, 2000×2000; favicon ≈180.1 KB, 2000×2000.
- Lighthouse/CWV: no disponible. No se inventan LCP, CLS ni INP; las observaciones son inferencias técnicas.

## 10 problemas con mayor impacto

### 1. Three.js se entrega en todas las rutas iniciales

**Evidencia:** `out/_next/static/chunks/0r-o916yjbu0b.js` contiene Three/WebGLRenderer, pesa 882.2 KB sin comprimir y está referenciado por home, los cuatro proyectos y `/industrial/`, incluso Terrambú y Mapa Punilla. **Importa:** eleva descarga, parseo y ejecución antes de demostrar valor, especialmente en mobile. **Severidad:** P1. **Esfuerzo:** L. **Recomendación:** separar los límites de importación para que cada ruta cargue solo su experiencia y que la home difiera el runtime 3D hasta proximidad real de la demo.

### 2. La categoría mental de Corsteno se abre demasiado pronto

**Evidencia:** la home y `lib/seo.ts` combinan configuradores, desarrollo web, visualización, software conectado, datos, AR y VR. **Importa:** un decisor puede no saber si contrata una empresa de configuradores, una agencia web o un estudio generalista. **Severidad:** P1. **Esfuerzo:** M. **Recomendación:** jerarquizar una oferta principal y presentar el resto como extensiones del mismo sistema comercial.

### 3. Falta prueba verificable del impacto comercial

**Evidencia:** no hay métricas, resultados, citas ni testimonios visibles; `Testimonials.tsx` retorna `null` porque no existen datos. **Importa:** los beneficios quedan como promesas razonables, pero no reducen el riesgo de una compra B2B. **Severidad:** P1. **Esfuerzo:** M. **Recomendación:** incorporar únicamente evidencia real: resultados, entregables, contexto de cliente o testimonios autorizados.

### 4. La acción culminante de la demo no funciona

**Evidencia:** `IndustrialConfiguratorSummary.tsx` muestra “Solicitar esta configuración” como `<button>`, sin handler, y aclara que todavía no envía información. **Importa:** corta el recorrido en el momento de mayor intención. **Severidad:** P1. **Esfuerzo:** S. **Recomendación:** definir una transferencia explícita de la configuración al contacto o convertir la acción en un CTA honesto y funcional.

### 5. Los case studies explican capacidad, no demuestran resolución

**Evidencia:** las cuatro rutas usan la misma estructura y copy general de `ProjectCaseStudy.tsx`; faltan problema específico, restricciones, decisiones, alcance, rol y resultados. **Importa:** se ven bien, pero no permiten evaluar cómo Corsteno trabaja. **Severidad:** P1. **Esfuerzo:** L. **Recomendación:** estructurar cada caso con información factual propia, sin inventar métricas.

### 6. Demos propias y trabajos de cliente no se distinguen con suficiente fuerza

**Evidencia:** ATLAS/H2O y Exterior House conviven en “Trabajo seleccionado” junto a Terrambú y Mapa Punilla; el detalle aclara “Demo Corsteno”, pero la jerarquía de cards es equivalente. **Importa:** puede generar dudas sobre qué fue contratado, qué está en producción y qué es concepto. **Severidad:** P1. **Esfuerzo:** S. **Recomendación:** etiquetar de forma consistente tipo, estado y naturaleza de cada proyecto.

### 7. No hay capa pública de privacidad pese a analytics y formulario externo

**Evidencia:** no existe ruta o enlace de privacidad/cookies; `Analytics.tsx` puede cargar GA4 y el formulario envía datos a Formspree. **Importa:** crea riesgo legal y de confianza, sobre todo para tráfico internacional. **Severidad:** P1. **Esfuerzo:** M. **Recomendación:** documentar tratamiento de datos, proveedores y base de consentimiento aplicable con asesoramiento correspondiente.

### 8. El funnel no es medible de punta a punta

**Evidencia:** Analytics registra algunos CTA y links externos, pero no `form_start`, éxito/error, demo start, cambios del configurador principal ni apertura de cards actuales. **Importa:** impide saber dónde se pierde intención y optimizar con evidencia. **Severidad:** P1. **Esfuerzo:** M. **Recomendación:** definir taxonomía de eventos y parámetros antes de activar campañas.

### 9. Los modelos 3D son demasiado pesados para una experiencia comercial móvil

**Evidencia:** 19.38 MiB y 9.91 MiB; se difieren correctamente, pero el costo aparece al entrar en los proyectos 3D. **Importa:** en redes móviles puede demorar el momento de valor o provocar abandono. **Severidad:** P1. **Esfuerzo:** L. **Recomendación:** establecer presupuestos por modelo y optimizar geometría, texturas, compresión y progresive loading sin degradar la prueba visual.

### 10. La home mobile exige entre 15 y 16.5 pantallas de scroll

**Evidencia:** 13,030 px a 390×844 y 13,196 px a 360×800; contacto cerca del final. **Importa:** aumenta fatiga antes de confianza y conversión, aunque el CTA sticky mitiga parcialmente. **Severidad:** P1. **Esfuerzo:** M. **Recomendación:** medir lectura y abandonos; luego reducir repetición o reordenar prueba y confianza, sin eliminar la demo diferencial.

## Quick wins — alto impacto / bajo esfuerzo

1. Hacer funcional u honestamente no accionable el botón final de la demo.
2. Diferenciar visual y verbalmente “demo propia” de “proyecto para cliente”.
3. Instrumentar `form_start`, `form_success`, `form_error`, `demo_start` y `project_open`.
4. Unificar etiquetas ES/EN de las cards.
5. Alinear el nombre público ATLAS con su slug/identidad H2O o documentar la relación.
6. Agregar `width`/`height` o `aspect-ratio` estable a imágenes HTML relevantes.
7. Gestionar foco y anuncio de errores de validación.
8. Añadir acceso “Saltar al contenido”.
9. Revisar la promesa exacta de “24–48 h” contra la operación real.
10. Dar a cada case study al menos un problema, decisión y entregable factual.

## Findings completos

### UX y navegación

| ID | Finding concreto | Impacto | Sev. | Esf. | Recomendación |
|---|---|---|---:|---:|---|
| F01 | La home mide 13,030–13,196 px en mobile, 15–16.5 viewports. | Fatiga y abandono antes del contacto. | P1 | M | Medir profundidad y reordenar/reducir repetición con evidencia. |
| F02 | “Solicitar esta configuración” es un botón sin acción en la demo. | Rompe el compromiso progresivo en su punto más alto. | P1 | S | Conectar configuración y contacto o retirar affordance de acción. |
| F03 | Los iframes web miden ~333×521 px en mobile y alojan otra navegación. | Scroll/gestos anidados y contexto reducido. | P2 | M | Evaluar modo preview + apertura controlada, manteniendo acceso live. |
| F04 | En case studies largos, el retorno explícito a proyectos aparece solo arriba; al final domina contacto. | Comparar trabajos requiere nav global o back del navegador. | P2 | XS | Repetir una salida contextual al listado al cierre. |
| F05 | El estado activo de navbar representa solo cinco anchors, no las etapas intermedias. | En recorridos largos puede dar una orientación aproximada. | P3 | S | Definir qué secciones deben gobernar cada estado activo. |
| F06 | No existe skip link en el HTML renderizado. | Usuarios de teclado atraviesan el header en cada ruta. | P2 | XS | Agregar “Saltar al contenido” visible al foco. |
| F07 | En mobile el formulario aparece después de más de 11,000 px; el CTA sticky compensa, pero no aporta confianza contextual. | El salto al contacto puede sentirse abrupto. | P2 | S | Medir uso del sticky y acompañarlo con contexto mínimo en destino. |
| F08 | Las cards hero y “Trabajo seleccionado” presentan los mismos cuatro proyectos en dos momentos. | Refuerza evidencia, pero también agrega repetición y longitud. | P2 | M | Validar con scroll analytics si ambas exposiciones cumplen roles distintos. |

### UI, responsive y marca

| ID | Finding concreto | Impacto | Sev. | Esf. | Recomendación |
|---|---|---|---:|---:|---|
| F09 | Varias labels/meta usan 8–10 px, especialmente en industrial y mobile. | Lectura difícil aun con contraste suficiente. | P2 | S | Revisar mínimos tipográficos sin alterar jerarquía editorial. |
| F10 | Los cuatro case studies comparten casi toda la composición y bloques. | Se perciben como plantilla más que relato específico. | P1 | L | Permitir módulos de evidencia propios por proyecto. |
| F11 | Cards mezclan “Web development”, “Interactive web”, “3D experience” y “3D configurator” con cuerpo en español. | Pequeña inconsistencia de marca y tono. | P3 | XS | Elegir una convención bilingüe explícita o unificar idioma. |
| F12 | `/industrial/` utiliza un sistema visual y header propios frente a la home. | Si se descubre, puede parecer otra marca o versión competidora. | P2 | M | Mantenerlo aislado mientras sea experimento; definir destino antes de publicarlo. |
| F13 | El logo fuente 2000×2000 pesa ~345.6 KB para mostrarse a 30–40 px. | Transferencia y decodificación innecesarias. | P2 | S | Generar derivado optimizado conservando el original de marca. |
| F14 | El favicon fuente 2000×2000 pesa ~180.1 KB. | Costo evitable y asset sobredimensionado. | P2 | XS | Exportar tamaños de favicon adecuados. |
| F15 | El nuevo ritmo dark/light/dark funciona; dentro de cards, imágenes claras ocupan gran superficie sobre fondo oscuro. | La sección puede percibirse menos oscura según la imagen dominante. | P3 | XS | No tocar salvo evidencia de contraste contextual insuficiente. |
| F16 | Industrial mantiene muchas labels de 9 px y mayor densidad técnica. | Menor legibilidad y coherencia con la home comercial. | P2 | M | Si se reutiliza, armonizar escala y densidad con el sistema principal. |

### Marketing, posicionamiento, venta y copy

| ID | Finding concreto | Impacto | Sev. | Esf. | Recomendación |
|---|---|---|---:|---:|---|
| F17 | La oferta combina agencia web, estudio 3D, software conectado y tecnologías inmersivas. | La categoría mental no queda única. | P1 | M | Declarar oferta núcleo y extensiones. |
| F18 | “El 3D es solo la interfaz” promete CRM, ERP, pricing, producción y analytics sin caso que lo demuestre. | Aumenta percepción de claim aspiracional. | P1 | L | Sustentar con arquitectura/caso real o acotar alcance. |
| F19 | No hay resultados, métricas ni entregables verificables en proyectos. | No prueba impacto comercial ni ejecución. | P1 | L | Publicar evidencia real disponible. |
| F20 | Demos Corsteno y proyectos de clientes reciben peso visual equivalente. | Puede confundir portafolio real y laboratorio. | P1 | S | Etiquetar naturaleza y estado en cards y páginas. |
| F21 | El diferencial frente a agencia tradicional o SaaS no se formula explícitamente. | El decisor debe inferir por qué Corsteno. | P1 | M | Explicar ventaja en integración, personalización y experiencia de producto. |
| F22 | El “por qué ahora” queda implícito en claridad/preventa, no cuantificado ni contextualizado. | Menor urgencia para iniciar conversación. | P2 | M | Vincular con costos o riesgos reales, solo con evidencia. |
| F23 | RA/RV “Próximamente” ocupa nav SEO, capacidades y llms.txt sin producto demostrable actual. | Diluye foco de servicios disponibles. | P2 | S | Mantener expectativa secundaria y distinguir disponibilidad. |
| F24 | “Interactive Technologies” es amplio respecto del problema concreto del hero. | Marca premium, pero poco específica por sí sola. | P2 | S | Acompañar con descriptor estable orientado a resultado. |
| F25 | “No te lo contamos. Probalo.” es memorable, pero el producto configurado es una ventana genérica. | El aha demuestra interacción, no necesariamente el caso del prospecto. | P2 | L | Conectar controles con un beneficio/decisión comercial observable. |
| F26 | El precio “USD 1.840” es ilustrativo dentro de demo, sin explicar qué representa. | Puede anclar expectativas de presupuesto equivocadas. | P2 | XS | Aclarar que es precio de producto demo, no del servicio. |
| F27 | “Respuesta habitual: 24–48 h” es una promesa operativa exacta. | Si no se cumple, erosiona confianza. | P2 | XS | Confirmar capacidad real o usar expectativa sostenible. |
| F28 | No hay testimonios visibles; el componente existe pero retorna `null`. | Falta validación externa. | P1 | M | Agregar solo testimonios reales y autorizados. |
| F29 | El equipo aporta nombres, roles y LinkedIn, pero no muestra responsabilidades por proyecto ni señal empresarial adicional. | Puede percibirse como dos freelancers capaces, no como proveedor escalable. | P2 | M | Explicar modelo operativo con hechos, sin inflar credenciales. |
| F30 | Terrambú y Mapa Punilla son relevantes para web, pero no conectan directamente con el target de fabricantes físicos. | La prueba dispersa la especialización de producto. | P2 | S | Contextualizar por qué cada caso valida una capacidad del sistema. |
| F31 | La home vende resultado en hero y vuelve a lenguaje técnico en sistema/datos. | El beneficio comercial pierde protagonismo. | P2 | M | Mantener resultado como hilo conductor de cada capacidad. |
| F32 | Algunos CTA son “Quiero algo así”, “Contanos…” y “Enviar consulta”. | La intención varía y dificulta comparar rendimiento. | P3 | XS | Definir una jerarquía de CTA y eventos consistente. |

### CRO y lead generation

| ID | Finding concreto | Impacto | Sev. | Esf. | Recomendación |
|---|---|---|---:|---:|---|
| F33 | El formulario pide solo nombre, email, empresa y mensaje. | Baja fricción, pero califica poco alcance, urgencia o tipo de proyecto. | P2 | S | Decidir explícitamente si se prioriza volumen o calificación. |
| F34 | No existe tracking de inicio, validación, error o éxito del formulario. | El funnel de conversión no se puede diagnosticar. | P1 | S | Instrumentar estados sin enviar contenido sensible. |
| F35 | La demo principal no registra inicio, cambios, reset ni CTA final. | No se conoce si la interacción aumenta intención. | P1 | M | Definir eventos y parámetros de configuración no sensibles. |
| F36 | Analytics identifica clases del showroom anterior, no los controles del configurador industrial actual. | Cobertura aparente, pero evento principal ausente. | P2 | S | Migrar selectores/eventos al componente vigente. |
| F37 | Las aperturas de cards actuales no tienen `data-analytics` específico. | No se compara interés por proyecto. | P2 | XS | Emitir `project_open` con slug/origen/tamaño de card. |
| F38 | Si faltan variables de canales alternativos, el formulario solo informa que existen “canales alternativos”. | En una caída de Formspree puede no haber salida real. | P3 | XS | Mostrar solo canales efectivamente configurados. |
| F39 | El submit exitoso resetea y redirige correctamente; ante error conserva datos. No existe test automatizado del flujo. | Una regresión podría romper la conversión sin señal previa. | P2 | M | Agregar test E2E con endpoint simulado. |
| F40 | El CTA sticky mobile aparece tras soluciones y permanece durante un recorrido largo. | Ayuda a convertir, pero puede ocultar contenido o fatigarse en pantallas pequeñas. | P2 | S | Medir clicks/dismissal y verificar safe areas en dispositivos reales. |

### SEO técnico, on-page y GEO

| ID | Finding concreto | Impacto | Sev. | Esf. | Recomendación |
|---|---|---|---:|---:|---|
| F41 | ATLAS se publica bajo `/proyectos/h2o/`. | Inconsistencia de entidad, URL compartida y anchor text. | P2 | M | Unificar identidad o establecer transición/redirect documentado. |
| F42 | La metadata de los proyectos es correcta, pero el cuerpo comparte frases y secciones genéricas. | Reduce diferenciación semántica entre casos. | P2 | M | Agregar contenido específico factual por ruta. |
| F43 | Imágenes HTML de hero, cards y SEO no declaran dimensiones intrínsecas. | Riesgo de CLS y menor previsibilidad del render. | P1 | S | Reservar espacio con dimensiones/aspect-ratio. |
| F44 | `/industrial/` está correctamente `noindex,nofollow`, sin canonical y fuera del sitemap, pero sigue accesible por URL. | Bien para experimento; riesgo solo si se enlaza o difunde. | P3 | XS | Mantener aislamiento y revisar antes de cualquier publicación. |
| F45 | Sitemap contiene 16 URLs válidas y excluye confirmación/industrial; no hay señales de rutas de proyecto rotas. | Estado saludable, pero requiere disciplina al escalar. | P3 | S | Generarlo desde una única fuente de rutas. |
| F46 | `llms.txt` describe servicios y proyectos, pero replica la amplitud de AR/VR próximos. | Un LLM puede sobreestimar oferta disponible. | P2 | XS | Separar claramente disponible, demo y roadmap. |
| F47 | JSON-LD usa ProfessionalService y CreativeWork, pero los proyectos no incluyen resultados/autores/cliente verificables. | Entidad válida pero poco rica para citación. | P2 | M | Completar solo propiedades respaldadas. |
| F48 | El contenido define Corsteno, servicios y proyectos en texto HTML; el diferencial competitivo sigue implícito. | LLMs responden qué hace, no por qué elegirlo. | P2 | M | Formular diferenciación factual y consistente. |
| F49 | El alcance geográfico mezcla Argentina, Córdoba, remoto e internacional. | Relevancia local/internacional no está priorizada por intención. | P2 | M | Definir páginas/claims según mercado real. |
| F50 | No existe contenido público de privacidad enlazado pese a GA/Formspree. | Riesgo legal, SEO de confianza y procurement. | P1 | M | Crear política factual y gobernanza de consentimiento. |

### Performance y Core Web Vitals

| ID | Finding concreto | Impacto | Sev. | Esf. | Recomendación |
|---|---|---|---:|---:|---|
| F51 | Chunk Three/R3F de 882.2 KB sin comprimir en todas las rutas. | Parseo/ejecución inicial altos, especialmente mobile. | P1 | L | Separar bundles por ruta y lazy boundary real. |
| F52 | Proyectos web y 3D refieren aproximadamente el mismo total JS (~1.57 MB). | Terrambú/Mapa pagan costo de capacidades que no usan. | P1 | L | Resolver experiencia por módulo/ruta antes del cliente. |
| F53 | GLB exterior 19.38 MiB y preview 9.91 MiB. | Demora y consumo de datos al abrir proyectos 3D. | P1 | L | Optimizar con presupuesto y pruebas visuales. |
| F54 | `useGLTF.preload()` corre a nivel de módulo cuando se carga cada módulo 3D. | Puede anticipar transferencia antes de intención dentro de la ruta. | P2 | S | Preload condicionado por proximidad/intención. |
| F55 | La home difiere Canvas con IntersectionObserver y no solicita GLB inicial; eso funciona correctamente. | Buen patrón que conviene preservar. | P3 | XS | No tocar; aplicar el mismo criterio al bundle de código. |
| F56 | Imágenes sin dimensiones crean riesgo de CLS; no se midió CLS real. | Posible inestabilidad visual en carga lenta. | P2 | S | Reservar geometría y medir en navegador real. |
| F57 | Logo/favicon están sobredimensionados respecto de uso. | Transferencia y decodificación evitables. | P2 | S | Derivados optimizados y cacheables. |
| F58 | Iframes usan `loading="lazy"` y no existen en home inicial. | Correcto, pero el tiempo de interacción depende de terceros. | P3 | XS | Conservar lazy y monitorear disponibilidad. |

**CWV:** LCP no fue medido; candidatos probables son imágenes hero o Canvas según ruta. CLS no fue medido; el riesgo concreto está en imágenes sin dimensiones. INP no fue medido; el riesgo está en parseo del bundle 3D y trabajo WebGL. No hay valores numéricos inventados.

### Accesibilidad y mobile

| ID | Finding concreto | Impacto | Sev. | Esf. | Recomendación |
|---|---|---|---:|---:|---|
| F59 | Los viewers 3D dependen de drag/pointer; no ofrecen rotación equivalente por teclado. | Parte central de la experiencia no es operable por teclado. | P1 | M | Añadir controles semánticos o comandos de cámara accesibles. |
| F60 | Tras validar vacío, el foco queda en submit y los errores de campo no usan live region. | Usuarios de lector/teclado pueden no descubrir el primer error. | P2 | S | Enfocar primer campo inválido y anunciar resumen. |
| F61 | Canvas no tiene fallback funcional si WebGL/modelo falla; el texto circundante sigue visible. | La demostración principal puede quedar incompleta sin recuperación. | P1 | M | Error boundary y alternativa visual/textual útil. |
| F62 | Menú mobile abre/cierra y anuncia `aria-expanded`, pero no gestiona Escape, foco inicial ni confinamiento. | Navegación menos predecible para teclado/lector. | P2 | S | Implementar patrón de disclosure/dialog consistente. |
| F63 | Reduced motion está contemplado en CSS y observers/listeners inspeccionados limpian recursos. | Buen soporte que debe preservarse. | P3 | XS | No tocar salvo pruebas con tecnología asistiva. |
| F64 | No hubo overflow horizontal; controles mobile caben. El costo es una longitud y densidad altas. | Técnicamente responsive, no siempre cómodo. | P3 | M | Optimizar ritmo solo con datos de uso, sin comprimir controles. |

## Conteo de findings

| Severidad | Cantidad |
|---|---:|
| P0 | 0 |
| P1 | 18 |
| P2 | 35 |
| P3 | 11 |
| **Total** | **64** |

## Arquitectura técnica y robustez

- Next App Router y export estático compilan sin errores TypeScript.
- Componentes interactivos están aislados como client components; metadata y contenido estructural permanecen server-side.
- Observers y listeners inspeccionados incluyen cleanup. No existe GSAP/ScrollTrigger en dependencias ni código activo.
- `ProjectCaseStudy.tsx` importa dinámicamente ambos viewers, pero el chunk base compartido continúa incluyendo Three en todas las rutas.
- Formspree usa `fetch`, valida antes de enviar, bloquea doble submit, preserva datos ante error y redirige solo con `response.ok`.
- Links locales, direct route access, refresh, anchors y browser back funcionaron en el export local.
- Terrambú y Mapa Punilla externos respondieron 200 durante la auditoría; siguen siendo dependencias de terceros.
- No se observaron errores de consola graves durante las interacciones auditadas.
- Fullscreen tiene implementación y controles habilitados; el entorno del navegador embebido no permitió validar fullscreen nativo de punta a punta.
- No hay suite de tests ni script de lint en `package.json`; la cobertura de regresión depende de TypeScript, build y QA manual.

## Funnel actual

```text
ENTRA      Hero claro + CTA + evidencia visual temprana
ENTIENDE   Problema/soluciones explican el caso de uso
SE INTERESA Demo y sistema conectado amplían la posibilidad
PRUEBA     Configurador real, pero con acción final inerte
CONFÍA     Proyectos + equipo; faltan resultados/testimonios/gobernanza
VALORA     Datos e integración elevan valor, con claims aún no probados
CONTACTA   Formulario simple + CTA sticky; medición incompleta
```

Los mayores quiebres son `PRUEBA → CONFÍA` y `CONFÍA → VALORA`: la experiencia demuestra habilidad técnica, pero no reduce completamente el riesgo comercial.

## Consultas SEO razonables

- Argentina/LATAM: “configuradores 3D para productos”, “visualización 3D interactiva”, “desarrollo web interactivo”, “showroom digital”, “configurador 3D web”.
- Sectores: arquitectura/construcción, muebles/equipamiento, piscinas/exteriores, industria, real estate y hotelería/turismo.
- Internacional: hoy el contenido en español y la señal geográfica Argentina limitan intención no hispanohablante; no hay base para asumir posicionamiento global.

## Matriz impacto / esfuerzo

### HACER AHORA

- Resolver el CTA final de la demo.
- Diferenciar demo propia vs. cliente.
- Instrumentar funnel mínimo.
- Gestionar errores de formulario accesiblemente.
- Unificar etiquetas y relación ATLAS/H2O.
- Reservar espacio de imágenes.

### SIGUIENTE ITERACIÓN

- Aclarar oferta núcleo y diferencial.
- Enriquecer proyectos con evidencia factual.
- Incorporar privacidad/gobernanza de datos.
- Reordenar confianza y prueba según analytics.
- Mejorar controles 3D para teclado y fallos.

### DESPUÉS

- Separar bundles 3D por ruta y por interacción.
- Optimizar GLB con presupuesto técnico.
- Evolucionar la demo hacia un caso con aha comercial.
- Preparar arquitectura de proyectos para 10+ casos.
- Diseñar estrategia de contenidos por mercado e industria.

### NO TOCAR

- El ritmo visual dark/light/dark ya validado.
- La estructura responsive que evita overflow en los seis viewports.
- El lazy mounting de Canvas por IntersectionObserver.
- La conservación de datos del formulario ante error.
- `noindex,nofollow` y exclusión de sitemap de `/industrial/`.
- Canonicals, robots, sitemap actual y JSON-LD base.
- Reduced motion, labels de iframe y nombres accesibles actuales.
- La demo interactiva como pieza central; mejorar su resultado, no eliminarla.

## Roadmap sugerido

### Sprint 1 — Conversion & clarity

Oferta núcleo, CTA demo, distinción demo/cliente, evidencia mínima y tracking del funnel.

### Sprint 2 — UX/UI polish

Longitud mobile, jerarquía de proyectos, tipografía mínima, navegación y accesibilidad de formularios.

### Sprint 3 — SEO/GEO

Contenido específico por proyecto, consistencia de entidades, privacidad y disponibilidad real de servicios.

### Sprint 4 — Performance/accessibility

Code splitting real, optimización GLB/assets, medición CWV, fallbacks y operación 3D por teclado.

### Sprint 5 — Product demo evolution

Momento aha ligado a negocio, configuración transferible al lead y resultados medibles.

## Validación del único cambio visual

- `Trabajo seleccionado` usa `var(--accent)` como fondo oscuro existente y `var(--bg)` como foreground.
- Eyebrow/descripción, borders, cards, metadata y hover fueron adaptados dentro del mismo CSS Module.
- Bento, tamaños, proyectos, links e interacción permanecen intactos.
- Fondo computado verificado: `rgb(32, 33, 31)` en los seis viewports.
- Sin overflow horizontal en desktop, laptop, tablet y mobile.
- TypeScript: OK.
- `npm run build`: OK, 23 páginas estáticas.
- `git diff --check`: OK; solo avisos informativos de conversión LF/CRLF.
