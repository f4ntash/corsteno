import type { Metadata } from "next";
import { contactChannels } from "@/lib/contact";
import { BASE_PATH } from "@/lib/assetPath";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://corsteno.com").replace(/\/$/, "");

export const site = {
  name: "Corsteno",
  basePath: BASE_PATH,
  url: SITE_URL,
  locale: "es_AR",
  defaultImage: "/projects/terrambu-hotel-web.webp",
};

const businessId = `${site.url}/#business`;
const serviceCatalog = [
  "Configuradores 3D interactivos",
  "Visualización 3D",
  "Desarrollo web interactivo",
  "Realidad aumentada",
  "Realidad virtual",
];

export type SeoLink = {
  label: string;
  href: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type SeoPage = {
  slug: string;
  path: string;
  cluster: "3D" | "WEB" | "INMERSIVO";
  category: "home" | "servicio" | "sector" | "proyecto";
  intent: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  cta: string;
  takeaways: string[];
  sections: Array<{
    title: string;
    body: string;
    items?: string[];
  }>;
  faqs: Faq[];
  links: SeoLink[];
  image?: string;
  imageAlt?: string;
};

const p = (path: string) => `${site.basePath}${path}`;
export const canonicalUrl = (path: string) => `${site.url}${path === "/" || path.includes(".") ? path : `${path}/`}`;
export const assetUrl = (path: string) => `${site.url}${path}`;

export const seoPages: SeoPage[] = [
  {
    slug: "configuradores-3d",
    path: "/servicios/configuradores-3d",
    cluster: "3D",
    category: "servicio",
    intent: "contratar desarrollo de configuradores 3D de productos",
    title: "Configuradores 3D de Productos | Corsteno",
    description: "Desarrollo de configuradores 3D para empresas que necesitan mostrar productos con materiales, colores y variantes desde la web.",
    h1: "Configuradores 3D de productos para empresas",
    eyebrow: "Servicio",
    intro: "Creamos configuradores 3D para que tus clientes puedan explorar un producto, comparar variantes y entender opciones antes de consultar o comprar.",
    cta: "Quiero mostrar mi producto en 3D",
    takeaways: [
      "El cliente puede configurar el producto desde el navegador.",
      "Los cambios se visualizan en tiempo real cuando el modelo lo permite.",
      "Puede integrarse dentro de una web existente o una landing nueva.",
      "Reduce la dependencia de renders estáticos para cada combinación.",
      "La experiencia se adapta al catálogo y al proceso comercial de la empresa.",
    ],
    sections: [
      {
        title: "Para qué sirve",
        body: "Un configurador 3D ayuda a explicar productos con variantes, terminaciones o componentes sin obligar al cliente a imaginar el resultado final.",
        items: ["Muebles y equipamiento", "Piscinas y exteriores", "Aberturas", "Productos industriales", "Arquitectura y terminaciones"],
      },
      {
        title: "Cómo se implementa",
        body: "Partimos del producto, sus opciones reales y el objetivo comercial. Luego definimos interfaz, modelo 3D, variantes y forma de contacto o integración.",
      },
      {
        title: "Proyecto relacionado",
        body: "ATLAS muestra cómo un producto puede explorarse con materiales y terminaciones configurables desde el navegador.",
      },
    ],
    faqs: [
      { question: "¿Qué es un configurador 3D?", answer: "Es una experiencia web donde una persona puede ver un producto en 3D y modificar opciones como materiales, colores o componentes." },
      { question: "¿Puede integrarse en mi web actual?", answer: "Sí. Según el caso, puede integrarse en una web existente o desarrollarse como una página nueva orientada a conversión." },
      { question: "¿Funciona desde celular?", answer: "El objetivo es que funcione desde navegador en desktop y mobile, adaptando la interfaz al tipo de producto y complejidad." },
      { question: "¿Necesito tener un modelo 3D?", answer: "No necesariamente. Si no existe un modelo utilizable, se evalúa cómo prepararlo a partir de referencias, planos, fotografías o archivos disponibles." },
      { question: "¿Puede conectarse con un e-commerce?", answer: "Puede evaluarse una integración cuando el catálogo, las variantes y el flujo comercial lo requieren." },
    ],
    links: [
      { label: "Ver proyecto ATLAS", href: p("/proyectos/h2o") },
      { label: "Soluciones para muebles y equipamiento", href: p("/sectores/muebles-equipamiento") },
      { label: "Soluciones para industria", href: p("/sectores/industria") },
    ],
  },
  {
    slug: "visualizacion-3d",
    path: "/servicios/visualizacion-3d",
    cluster: "3D",
    category: "servicio",
    intent: "contratar visualización 3D interactiva para productos y proyectos",
    title: "Visualización 3D Interactiva para Empresas | Corsteno",
    description: "Visualización 3D interactiva para presentar productos, espacios y proyectos de forma clara antes de fabricarlos o construirlos.",
    h1: "Visualización 3D interactiva para productos y proyectos",
    eyebrow: "Servicio",
    intro: "Desarrollamos experiencias 3D navegables para que un producto, espacio o proyecto pueda entenderse visualmente antes de estar terminado.",
    cta: "Consultar visualización 3D",
    takeaways: [
      "Permite presentar productos y espacios con mayor claridad.",
      "Ayuda a explicar proyectos antes de construirlos o fabricarlos.",
      "Puede combinarse con variantes de materiales o terminaciones.",
      "Funciona como herramienta comercial y de presentación.",
    ],
    sections: [
      { title: "Qué problema resuelve", body: "Cuando una propuesta depende de planos, renders aislados o explicaciones largas, la visualización 3D permite que el cliente vea y comprenda mejor la idea." },
      { title: "Casos habituales", body: "Se aplica en arquitectura, construcción, productos configurables, piscinas, exteriores y productos técnicos.", items: ["Preventa", "Presentaciones comerciales", "Catálogos interactivos", "Showrooms digitales"] },
      { title: "Proyecto relacionado", body: "Exterior House muestra cómo presentar terminaciones y materiales antes de que el proyecto esté construido." },
    ],
    faqs: [
      { question: "¿La visualización 3D es lo mismo que un render?", answer: "No. Un render es una imagen fija; una visualización interactiva permite explorar, navegar o cambiar opciones desde la web." },
      { question: "¿Puede usarse para preventa?", answer: "Sí. Es especialmente útil cuando el producto, espacio o construcción todavía no está terminado." },
      { question: "¿Se pueden cambiar terminaciones?", answer: "Sí, cuando el proyecto lo requiere pueden incorporarse variantes de materiales, colores o componentes." },
      { question: "¿Funciona sin instalar una app?", answer: "La experiencia puede funcionar desde navegador, evitando instalaciones cuando el alcance técnico lo permite." },
    ],
    links: [
      { label: "Ver Exterior House", href: p("/proyectos/exterior-house") },
      { label: "Arquitectura y construcción", href: p("/sectores/arquitectura-construccion") },
      { label: "Piscinas y exteriores", href: p("/sectores/piscinas-exteriores") },
    ],
  },
  {
    slug: "desarrollo-web",
    path: "/servicios/desarrollo-web",
    cluster: "WEB",
    category: "servicio",
    intent: "contratar desarrollo web profesional orientado a negocio",
    title: "Desarrollo Web para Empresas | Corsteno",
    description: "Desarrollo web interactivo para empresas que necesitan presentar servicios, productos o experiencias con claridad y foco comercial.",
    h1: "Desarrollo web interactivo para empresas",
    eyebrow: "Servicio",
    intro: "Diseñamos y desarrollamos sitios y plataformas web donde la experiencia ayuda a presentar mejor una empresa, un servicio o un proyecto.",
    cta: "Hablemos de tu web",
    takeaways: [
      "La web se diseña alrededor del objetivo comercial.",
      "Puede incluir contenido interactivo, mapas, iframes o visualización 3D.",
      "Sirve para presentar servicios, productos y experiencias.",
      "Puede conectar con proyectos reales como Terrambú y Mapa Punilla.",
    ],
    sections: [
      { title: "Para quién sirve", body: "Para empresas que necesitan una presencia digital clara, profesional y orientada a explicar mejor lo que ofrecen." },
      { title: "Qué puede incluir", body: "Arquitectura de contenido, diseño de interfaz, desarrollo frontend, integración de experiencias interactivas y CTAs comerciales.", items: ["Sitios institucionales", "Landings comerciales", "Experiencias turísticas", "Mapas y plataformas navegables"] },
      { title: "Proyectos relacionados", body: "Terrambú y Mapa Punilla muestran cómo una web puede comunicar mejor un lugar, una experiencia o un territorio." },
    ],
    faqs: [
      { question: "¿Desarrollan sitios web completos?", answer: "Sí. El alcance puede ir desde una landing hasta una experiencia web más compleja, según el objetivo del proyecto." },
      { question: "¿Puede integrarse contenido interactivo?", answer: "Sí. La web puede incorporar mapas, iframes, visualización 3D o módulos interactivos cuando aportan claridad." },
      { question: "¿Trabajan con empresas fuera de Córdoba?", answer: "Sí. Corsteno puede trabajar de forma remota con empresas de Argentina y otros mercados." },
      { question: "¿La web puede orientarse a conversión?", answer: "Sí. Se priorizan mensajes claros, CTAs, estructura semántica y recorridos que ayuden al usuario a consultar." },
    ],
    links: [
      { label: "Ver Terrambú", href: p("/proyectos/terrambu") },
      { label: "Ver Mapa Punilla", href: p("/proyectos/mapa-punilla") },
      { label: "Hotelería y turismo", href: p("/sectores/hoteleria-turismo") },
    ],
    image: "/projects/terrambu-hotel-web.webp",
    imageAlt: "Experiencia web para hotel boutique Terrambú desarrollada por Corsteno",
  },
  {
    slug: "realidad-aumentada",
    path: "/servicios/realidad-aumentada",
    cluster: "INMERSIVO",
    category: "servicio",
    intent: "evaluar realidad aumentada para visualizar productos y espacios",
    title: "Realidad Aumentada para Productos y Espacios | Corsteno",
    description: "Experiencias de realidad aumentada para visualizar productos, espacios y proyectos en contexto real desde dispositivos compatibles.",
    h1: "Realidad aumentada para productos y espacios",
    eyebrow: "Servicio",
    intro: "La realidad aumentada permite evaluar cómo podría verse un producto, espacio o proyecto dentro de un contexto real.",
    cta: "Consultar experiencia AR",
    takeaways: [
      "Ayuda a visualizar escala, presencia y contexto.",
      "Puede complementar configuradores 3D y visualización web.",
      "Es útil para arquitectura, real estate, industria y producto.",
      "El alcance depende del modelo 3D, dispositivo y objetivo de uso.",
    ],
    sections: [
      { title: "Cuándo conviene", body: "Conviene cuando el cliente necesita entender cómo un producto o espacio se comporta dentro de un entorno real." },
      { title: "Cómo se evalúa", body: "Se revisa el modelo 3D, la experiencia deseada, el dispositivo objetivo y la forma de acceso más adecuada." },
    ],
    faqs: [
      { question: "¿La realidad aumentada requiere una app?", answer: "Depende del alcance. Algunos casos pueden resolverse con experiencias web compatibles y otros pueden requerir una app o plataforma específica." },
      { question: "¿Sirve para arquitectura?", answer: "Sí. Puede ayudar a visualizar espacios, objetos o terminaciones en contexto." },
      { question: "¿Se puede combinar con un configurador 3D?", answer: "Sí. Puede plantearse como extensión de una experiencia 3D cuando el producto y el flujo lo justifican." },
    ],
    links: [
      { label: "Visualización 3D", href: p("/servicios/visualizacion-3d") },
      { label: "Real estate", href: p("/sectores/real-estate") },
      { label: "Arquitectura y construcción", href: p("/sectores/arquitectura-construccion") },
    ],
  },
  {
    slug: "realidad-virtual",
    path: "/servicios/realidad-virtual",
    cluster: "INMERSIVO",
    category: "servicio",
    intent: "evaluar realidad virtual para presentar proyectos y espacios",
    title: "Realidad Virtual para Proyectos y Showrooms | Corsteno",
    description: "Experiencias de realidad virtual para presentar espacios, productos y proyectos en entornos inmersivos orientados a negocio.",
    h1: "Realidad virtual para proyectos y showrooms",
    eyebrow: "Servicio",
    intro: "La realidad virtual puede transformar una presentación en una experiencia inmersiva para recorrer espacios, productos o proyectos.",
    cta: "Consultar experiencia VR",
    takeaways: [
      "Permite recorrer espacios o proyectos de forma inmersiva.",
      "Puede ser útil para showrooms, real estate y arquitectura.",
      "Se define según público, dispositivo y objetivo comercial.",
      "Puede complementar una estrategia web o 3D existente.",
    ],
    sections: [
      { title: "Para qué sirve", body: "Sirve para presentaciones donde la escala, la inmersión y la sensación espacial ayudan a tomar decisiones." },
      { title: "Qué evaluar antes", body: "Antes de producir una experiencia VR se revisa el caso de uso, el equipamiento disponible y el contenido 3D necesario." },
    ],
    faqs: [
      { question: "¿La realidad virtual sirve para vender proyectos?", answer: "Puede ayudar en presentaciones y preventa cuando el recorrido inmersivo aporta claridad al cliente." },
      { question: "¿Necesito visores?", answer: "Depende del tipo de experiencia. Se define según el público, el lugar de uso y el objetivo del proyecto." },
      { question: "¿Puede partir de un proyecto 3D existente?", answer: "Sí, si el material técnico y visual tiene calidad suficiente o puede adaptarse." },
    ],
    links: [
      { label: "Realidad aumentada", href: p("/servicios/realidad-aumentada") },
      { label: "Real estate", href: p("/sectores/real-estate") },
      { label: "Visualización 3D", href: p("/servicios/visualizacion-3d") },
    ],
  },
  {
    slug: "arquitectura-construccion",
    path: "/sectores/arquitectura-construccion",
    cluster: "3D",
    category: "sector",
    intent: "visualización 3D interactiva para arquitectura y construcción",
    title: "Visualización 3D para Arquitectura y Construcción | Corsteno",
    description: "Soluciones interactivas para arquitectura y construcción: visualizar proyectos, terminaciones y espacios antes de construir.",
    h1: "Visualización digital para arquitectura y construcción",
    eyebrow: "Sector",
    intro: "Ayudamos a estudios, constructoras y desarrollistas a presentar proyectos y terminaciones de forma visual, clara e interactiva.",
    cta: "Consultar proyecto arquitectónico",
    takeaways: [
      "Permite mostrar proyectos antes de construirlos.",
      "Ayuda a comparar terminaciones y materiales.",
      "Puede apoyar preventa, presentación y aprobación interna.",
      "Se conecta naturalmente con visualización 3D y AR/VR.",
    ],
    sections: [
      { title: "Aplicaciones", body: "La visualización interactiva puede aplicarse a viviendas, espacios exteriores, piscinas, terminaciones y desarrollos en etapa comercial." },
      { title: "Servicio relacionado", body: "La visualización 3D interactiva permite convertir una idea o proyecto en una experiencia navegable." },
    ],
    faqs: [
      { question: "¿Puedo mostrar un proyecto antes de construirlo?", answer: "Sí. Esa es una de las aplicaciones principales de la visualización 3D interactiva." },
      { question: "¿El cliente puede cambiar terminaciones?", answer: "Sí, si el alcance incluye variantes de materiales, colores o componentes." },
      { question: "¿Funciona desde navegador?", answer: "Puede funcionar desde navegador cuando el modelo y la experiencia se optimizan para web." },
    ],
    links: [
      { label: "Visualización 3D", href: p("/servicios/visualizacion-3d") },
      { label: "Realidad aumentada", href: p("/servicios/realidad-aumentada") },
      { label: "Ver Exterior House", href: p("/proyectos/exterior-house") },
    ],
  },
  {
    slug: "muebles-equipamiento",
    path: "/sectores/muebles-equipamiento",
    cluster: "3D",
    category: "sector",
    intent: "configuradores 3D para muebles y equipamiento",
    title: "Configuradores 3D para Muebles y Equipamiento | Corsteno",
    description: "Configuradores 3D para fabricantes de muebles y equipamiento con materiales, colores y componentes personalizables.",
    h1: "Configuradores 3D para muebles y equipamiento",
    eyebrow: "Sector",
    intro: "Los productos con variantes pueden ser difíciles de explicar en un catálogo. Un configurador permite mostrar opciones sin producir imágenes para cada combinación.",
    cta: "Consultar configurador para mi producto",
    takeaways: [
      "El cliente puede comparar materiales y colores.",
      "Reduce dudas antes de pedir presupuesto.",
      "Puede adaptarse a catálogos con variantes reales.",
      "Funciona como apoyo comercial para fabricantes y vendedores.",
    ],
    sections: [
      { title: "Qué productos pueden configurarse", body: "Muebles, cocinas, equipamiento, aberturas y productos con terminaciones o componentes variables." },
      { title: "Servicio relacionado", body: "Los configuradores 3D son la solución principal para productos que necesitan personalización visual." },
    ],
    faqs: [
      { question: "¿Se pueden mostrar telas, colores o maderas?", answer: "Sí. Pueden configurarse materiales y terminaciones cuando existen referencias visuales adecuadas." },
      { question: "¿Sirve para pedir presupuesto?", answer: "Sí. El configurador puede orientar al cliente y facilitar una consulta más precisa." },
      { question: "¿Hace falta fotografiar cada variante?", answer: "No siempre. La experiencia 3D puede reducir la necesidad de producir imágenes para cada combinación." },
    ],
    links: [
      { label: "Configuradores 3D", href: p("/servicios/configuradores-3d") },
      { label: "Industria", href: p("/sectores/industria") },
      { label: "Ver ATLAS", href: p("/proyectos/h2o") },
    ],
  },
  {
    slug: "piscinas-exteriores",
    path: "/sectores/piscinas-exteriores",
    cluster: "3D",
    category: "sector",
    intent: "visualización 3D y configuración para piscinas y exteriores",
    title: "Visualización 3D para Piscinas y Exteriores | Corsteno",
    description: "Visualización y configuración 3D para piscinas, exteriores y terminaciones orientadas a preventa y presentación comercial.",
    h1: "Visualización 3D para piscinas y exteriores",
    eyebrow: "Sector",
    intro: "Las piscinas y espacios exteriores se venden mejor cuando el cliente puede ver materiales, escala y terminaciones antes de construir.",
    cta: "Consultar visualización para exteriores",
    takeaways: [
      "Ayuda a explicar terminaciones y materiales.",
      "Sirve para preventa y presentación de proyectos.",
      "Puede mostrar variantes de revestimientos y pisos.",
      "Conecta con arquitectura, construcción y real estate.",
    ],
    sections: [
      { title: "Aplicaciones", body: "Piscinas, galerías, patios, espacios exteriores, revestimientos y materiales de terminación." },
      { title: "Proyecto relacionado", body: "Exterior House muestra un caso de configuración de materiales para un proyecto exterior." },
    ],
    faqs: [
      { question: "¿Puedo mostrar una piscina antes de construirla?", answer: "Sí. La visualización 3D ayuda a presentar el proyecto antes de la obra." },
      { question: "¿Se pueden comparar revestimientos?", answer: "Sí. Puede incorporarse selección de materiales o terminaciones si el alcance lo contempla." },
      { question: "¿Sirve para constructoras?", answer: "Sí. Puede apoyar venta, presentación y comunicación con clientes." },
    ],
    links: [
      { label: "Ver Exterior House", href: p("/proyectos/exterior-house") },
      { label: "Visualización 3D", href: p("/servicios/visualizacion-3d") },
      { label: "Arquitectura y construcción", href: p("/sectores/arquitectura-construccion") },
    ],
  },
  {
    slug: "industria",
    path: "/sectores/industria",
    cluster: "3D",
    category: "sector",
    intent: "configuradores y visualización digital de productos industriales",
    title: "Visualización Digital para Industria | Corsteno",
    description: "Configuradores y visualización digital para productos industriales, técnicos o configurables que necesitan explicación clara.",
    h1: "Visualización digital para productos industriales",
    eyebrow: "Sector",
    intro: "Los productos técnicos pueden requerir mucha explicación. Una experiencia visual permite mostrar funcionamiento, variantes o configuración con mayor claridad.",
    cta: "Consultar solución para industria",
    takeaways: [
      "Ayuda a explicar productos complejos.",
      "Puede mostrar componentes, variantes o terminaciones.",
      "Sirve para equipos comerciales y clientes no técnicos.",
      "Puede integrarse en presentaciones o sitios existentes.",
    ],
    sections: [
      { title: "Problemas frecuentes", body: "Catálogos extensos, variantes difíciles de comparar, productos técnicos y procesos comerciales que dependen de mucha explicación." },
      { title: "Soluciones posibles", body: "Configuradores 3D, visualización interactiva, módulos web de presentación y experiencias de producto." },
    ],
    faqs: [
      { question: "¿Sirve para productos técnicos?", answer: "Sí. La visualización digital puede ayudar a explicar productos complejos a clientes no técnicos." },
      { question: "¿Puede mostrar partes o componentes?", answer: "Sí, si el modelo y el alcance del proyecto lo contemplan." },
      { question: "¿Puede usarse por equipos comerciales?", answer: "Sí. Puede funcionar como herramienta de venta, presentación o capacitación comercial." },
    ],
    links: [
      { label: "Configuradores 3D", href: p("/servicios/configuradores-3d") },
      { label: "Visualización 3D", href: p("/servicios/visualizacion-3d") },
      { label: "Muebles y equipamiento", href: p("/sectores/muebles-equipamiento") },
    ],
  },
  {
    slug: "real-estate",
    path: "/sectores/real-estate",
    cluster: "INMERSIVO",
    category: "sector",
    intent: "presentación interactiva para desarrollos inmobiliarios",
    title: "Experiencias Interactivas para Real Estate | Corsteno",
    description: "Experiencias web, 3D y potencialmente inmersivas para presentar desarrollos inmobiliarios antes de su finalización.",
    h1: "Experiencias interactivas para real estate",
    eyebrow: "Sector",
    intro: "Los desarrollos inmobiliarios necesitan mostrar ubicación, espacios, terminaciones y valor del proyecto antes de estar terminados.",
    cta: "Consultar proyecto real estate",
    takeaways: [
      "Ayuda a presentar desarrollos antes de su finalización.",
      "Puede combinar visualización 3D, web y recorridos inmersivos.",
      "Facilita la comunicación con compradores e inversores.",
      "Se adapta a preventa y showrooms comerciales.",
    ],
    sections: [
      { title: "Qué puede incluir", body: "Visualización de unidades, terminaciones, espacios comunes, ubicación, recorridos y material comercial interactivo." },
      { title: "Servicios relacionados", body: "La visualización 3D, realidad aumentada y realidad virtual pueden combinarse según el objetivo del desarrollo." },
    ],
    faqs: [
      { question: "¿Sirve para preventa inmobiliaria?", answer: "Sí. Permite explicar y mostrar desarrollos antes de que estén terminados." },
      { question: "¿Puede incluir recorridos?", answer: "Sí, si el alcance y los modelos disponibles lo permiten." },
      { question: "¿Puede combinar web y 3D?", answer: "Sí. Una landing o plataforma puede integrar contenido visual, 3D y CTAs comerciales." },
    ],
    links: [
      { label: "Visualización 3D", href: p("/servicios/visualizacion-3d") },
      { label: "Realidad virtual", href: p("/servicios/realidad-virtual") },
      { label: "Arquitectura y construcción", href: p("/sectores/arquitectura-construccion") },
    ],
  },
  {
    slug: "hoteleria-turismo",
    path: "/sectores/hoteleria-turismo",
    cluster: "WEB",
    category: "sector",
    intent: "experiencias web para hotelería y turismo",
    title: "Experiencias Web para Hotelería y Turismo | Corsteno",
    description: "Experiencias web para hotelería y turismo orientadas a comunicar mejor lugares, recorridos, servicios y propuestas.",
    h1: "Experiencias web para hotelería y turismo",
    eyebrow: "Sector",
    intro: "En hotelería y turismo, la web puede transmitir el lugar antes de que el visitante llegue y ayudar a entender mejor la experiencia.",
    cta: "Consultar experiencia web",
    takeaways: [
      "Ayuda a comunicar el lugar, la propuesta y el entorno.",
      "Puede integrar mapas, recorridos, contenido visual e interacción.",
      "Sirve para hoteles, destinos, turismo y experiencias territoriales.",
      "Conecta naturalmente con proyectos como Terrambú y Mapa Punilla.",
    ],
    sections: [
      { title: "Aplicaciones", body: "Hoteles, alojamientos, destinos, mapas turísticos, experiencias territoriales y servicios vinculados al lugar." },
      { title: "Proyectos relacionados", body: "Terrambú presenta una experiencia hotelera; Mapa Punilla transforma información territorial en una plataforma navegable." },
    ],
    faqs: [
      { question: "¿Una web puede comunicar mejor un hotel?", answer: "Sí. Puede mostrar entorno, servicios, habitaciones y experiencia de forma más clara y emocional." },
      { question: "¿Puede incluir mapas?", answer: "Sí. Cuando el territorio importa, un mapa interactivo puede ser parte central de la experiencia." },
      { question: "¿Sirve para destinos turísticos?", answer: "Sí. Puede organizar información, recorridos y propuestas para que el usuario entienda mejor el lugar." },
    ],
    links: [
      { label: "Desarrollo web", href: p("/servicios/desarrollo-web") },
      { label: "Ver Terrambú", href: p("/proyectos/terrambu") },
      { label: "Ver Mapa Punilla", href: p("/proyectos/mapa-punilla") },
    ],
    image: "/projects/terrambu-hotel-web.webp",
    imageAlt: "Sitio web interactivo para hotelería y turismo desarrollado por Corsteno",
  },
  {
    slug: "h2o",
    path: "/proyectos/h2o",
    cluster: "3D",
    category: "proyecto",
    intent: "ver ejemplo real de configurador 3D de producto",
    title: "ATLAS Configurador 3D | Proyecto Corsteno",
    description: "Proyecto ATLAS: configurador 3D interactivo para explorar materiales y terminaciones de producto desde el navegador.",
    h1: "ATLAS: configurador 3D interactivo",
    eyebrow: "Proyecto",
    intro: "ATLAS muestra cómo un producto puede convertirse en una experiencia configurable, pensada para explorar materiales y terminaciones desde la web.",
    cta: "Quiero una experiencia como ATLAS",
    takeaways: [
      "Configuración de materiales desde navegador.",
      "Interacción 3D con foco comercial.",
      "Panel de opciones y detalle del material seleccionado.",
      "Ejemplo aplicable a productos configurables.",
    ],
    sections: [
      { title: "Qué demuestra", body: "El proyecto muestra cómo una interfaz puede ordenar variantes, explicar terminaciones y mantener el producto como protagonista." },
      { title: "Servicio relacionado", body: "Se vincula directamente con configuradores 3D y visualización 3D interactiva." },
    ],
    faqs: [
      { question: "¿ATLAS es un configurador 3D?", answer: "Sí. Es un ejemplo de experiencia interactiva para explorar materiales y terminaciones." },
      { question: "¿Puede aplicarse a otros productos?", answer: "Sí. La lógica puede adaptarse a otros productos con variantes reales." },
      { question: "¿Funciona desde navegador?", answer: "Sí. La experiencia está pensada para web." },
    ],
    links: [
      { label: "Configuradores 3D", href: p("/servicios/configuradores-3d") },
      { label: "Muebles y equipamiento", href: p("/sectores/muebles-equipamiento") },
      { label: "Industria", href: p("/sectores/industria") },
    ],
  },
  {
    slug: "exterior-house",
    path: "/proyectos/exterior-house",
    cluster: "3D",
    category: "proyecto",
    intent: "ver ejemplo de visualización 3D arquitectónica interactiva",
    title: "Exterior House Visualización 3D | Proyecto Corsteno",
    description: "Exterior House: visualización 3D interactiva para presentar materiales y terminaciones de un proyecto exterior.",
    h1: "Exterior House: visualización 3D de exteriores",
    eyebrow: "Proyecto",
    intro: "Exterior House muestra cómo un proyecto exterior puede presentarse con materiales y terminaciones configurables antes de construirse.",
    cta: "Quiero una demo con mi proyecto",
    takeaways: [
      "Visualización 3D para preventa y presentación.",
      "Configuración de materiales exteriores.",
      "Experiencia aplicable a arquitectura, piscinas y construcción.",
      "Modelo 3D como herramienta comercial.",
    ],
    sections: [
      { title: "Qué demuestra", body: "El proyecto permite explicar decisiones visuales antes de la obra y ayuda a comparar terminaciones de manera clara." },
      { title: "Servicios relacionados", body: "Conecta con visualización 3D, arquitectura y piscinas/exteriores." },
    ],
    faqs: [
      { question: "¿Exterior House sirve para arquitectura?", answer: "Sí. Es un ejemplo de presentación visual para proyectos exteriores y terminaciones." },
      { question: "¿Se pueden cambiar materiales?", answer: "Sí. La experiencia muestra variantes de materiales y terminaciones." },
      { question: "¿Puede usarse para preventa?", answer: "Sí. Ayuda a mostrar un proyecto antes de construirlo." },
    ],
    links: [
      { label: "Visualización 3D", href: p("/servicios/visualizacion-3d") },
      { label: "Arquitectura y construcción", href: p("/sectores/arquitectura-construccion") },
      { label: "Piscinas y exteriores", href: p("/sectores/piscinas-exteriores") },
    ],
  },
  {
    slug: "terrambu",
    path: "/proyectos/terrambu",
    cluster: "WEB",
    category: "proyecto",
    intent: "ver ejemplo real de experiencia web para hotelería",
    title: "Terrambú Experiencia Web | Proyecto Corsteno",
    description: "Terrambú: experiencia web para comunicar un hotel boutique, su entorno y propuesta antes de la visita.",
    h1: "Terrambú: experiencia web para hotelería",
    eyebrow: "Proyecto",
    intro: "Terrambú muestra cómo una experiencia web puede transmitir un lugar, su entorno y su propuesta antes de que el huésped llegue.",
    cta: "Quiero una experiencia como Terrambú",
    takeaways: [
      "Proyecto web orientado a hotelería.",
      "Comunicación visual del lugar y su experiencia.",
      "Estructura pensada para presentar servicios y entorno.",
      "Aplicable a turismo, alojamiento y marcas territoriales.",
    ],
    sections: [
      { title: "Qué demuestra", body: "La web funciona como parte de la experiencia de marca, no solo como una pieza informativa." },
      { title: "Sector relacionado", body: "Se vincula con hotelería, turismo y desarrollo web interactivo." },
    ],
    faqs: [
      { question: "¿Terrambú es una web hotelera?", answer: "Sí. Es una experiencia web orientada a comunicar un hotel boutique y su entorno." },
      { question: "¿Puede aplicarse a otros hoteles?", answer: "Sí. El enfoque puede adaptarse a alojamientos, destinos o experiencias turísticas." },
      { question: "¿Incluye una experiencia navegable?", answer: "Sí. El proyecto está pensado como una web explorable desde navegador." },
    ],
    links: [
      { label: "Desarrollo web", href: p("/servicios/desarrollo-web") },
      { label: "Hotelería y turismo", href: p("/sectores/hoteleria-turismo") },
      { label: "Ver Mapa Punilla", href: p("/proyectos/mapa-punilla") },
    ],
    image: "/projects/terrambu-hotel-web.webp",
    imageAlt: "Página web de Terrambú, hotel boutique, desarrollada por Corsteno",
  },
  {
    slug: "mapa-punilla",
    path: "/proyectos/mapa-punilla",
    cluster: "WEB",
    category: "proyecto",
    intent: "ver ejemplo de plataforma web territorial y turística",
    title: "Mapa Punilla Plataforma Web | Proyecto Corsteno",
    description: "Mapa Punilla: plataforma web que organiza información territorial y turística en una experiencia navegable.",
    h1: "Mapa Punilla: plataforma web territorial",
    eyebrow: "Proyecto",
    intro: "Mapa Punilla muestra cómo una experiencia web puede transformar información territorial en una plataforma útil y navegable.",
    cta: "Quiero una plataforma interactiva",
    takeaways: [
      "Proyecto web orientado a territorio y turismo.",
      "Información organizada en una experiencia navegable.",
      "Aplicable a destinos, mapas y servicios territoriales.",
      "Conecta desarrollo web, diseño de información e interacción.",
    ],
    sections: [
      { title: "Qué demuestra", body: "El proyecto organiza información territorial para que el usuario pueda explorarla con mayor claridad." },
      { title: "Sector relacionado", body: "Se vincula con hotelería, turismo, desarrollo web y plataformas interactivas." },
    ],
    faqs: [
      { question: "¿Mapa Punilla es una plataforma turística?", answer: "Sí. Es una experiencia web orientada a información territorial y turística." },
      { question: "¿Puede aplicarse a otros destinos?", answer: "Sí. El enfoque puede adaptarse a regiones, municipios, rutas o propuestas turísticas." },
      { question: "¿Puede integrar mapas o datos?", answer: "Sí. Cuando el proyecto lo requiere, puede incorporar recursos visuales, mapas o estructuras de información." },
    ],
    links: [
      { label: "Desarrollo web", href: p("/servicios/desarrollo-web") },
      { label: "Hotelería y turismo", href: p("/sectores/hoteleria-turismo") },
      { label: "Ver Terrambú", href: p("/proyectos/terrambu") },
    ],
    image: "/projects/mapa-punilla-web.webp",
    imageAlt: "Plataforma web Mapa Punilla desarrollada por Corsteno",
  },
];

export const servicePages = seoPages.filter((page) => page.category === "servicio");
export const sectorPages = seoPages.filter((page) => page.category === "sector");
export const projectPages = seoPages.filter((page) => page.category === "proyecto");
export const indexablePages = seoPages;

export const homeSeo = {
  path: "/",
  intent: "empresa que desarrolla experiencias digitales, web y 3D para empresas",
  title: "Corsteno | Experiencias Web y 3D para Empresas",
  description: "Corsteno desarrolla configuradores 3D, visualización interactiva y experiencias web para empresas que necesitan mostrar mejor sus productos.",
  h1: "Hacemos que tus productos se puedan ver, probar y entender antes de comprarlos.",
};

export function findSeoPage(category: SeoPage["category"], slug: string) {
  return seoPages.find((page) => page.category === category && page.slug === slug);
}

export function pageMetadata(page: Pick<SeoPage, "title" | "description" | "path" | "image" | "imageAlt">): Metadata {
  const url = canonicalUrl(page.path);
  const image = assetUrl(page.image ?? site.defaultImage);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: image, alt: page.imageAlt ?? "Experiencia digital interactiva desarrollada por Corsteno" }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [image],
    },
  };
}

export function organizationJsonLd() {
  const contactPoint = contactChannels.email || contactChannels.whatsappUrl
    ? {
        "@type": "ContactPoint",
        ...(contactChannels.whatsappUrl ? { url: contactChannels.whatsappUrl } : {}),
        ...(contactChannels.email ? { email: contactChannels.email } : {}),
        contactType: "sales",
        availableLanguage: ["Spanish"],
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: site.name,
        url: site.url,
        areaServed: ["Argentina", "Córdoba", "Remoto"],
        ...(contactPoint ? { contactPoint } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios Corsteno",
          itemListElement: serviceCatalog.map((serviceName) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: serviceName,
              provider: { "@id": businessId },
              areaServed: ["Argentina", "Córdoba", "Remoto"],
            },
          })),
        },
      },
    ],
  };
}

export function serviceJsonLd(page: SeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    description: page.description,
    provider: {
      "@id": businessId,
    },
    areaServed: ["Argentina", "Córdoba", "Remoto"],
    url: canonicalUrl(page.path),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: SeoLink[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${site.url}${item.href.replace(site.basePath, "")}`,
    })),
  };
}
