import SectionHeading from "@/components/molecules/SectionHeading";
import type { HomeDictionary, Locale } from "@/lib/i18n";
import styles from "./homeExperience.module.css";
import CapabilityLinks from "./CapabilityLinks";

const capabilities = [
  {
    id: "brand_activation", number: "01", href: "/servicios/activaciones-de-marca/", priority: "primary" as const,
  },
  {
    id: "ar_xr", number: "02", href: "/servicios/realidad-aumentada/", priority: "primary" as const,
  },
  {
    id: "interactive_3d", number: "03", href: "/servicios/configuradores-3d/", priority: "secondary" as const,
  },
  {
    id: "web_experiences", number: "04", href: "/servicios/desarrollo-web/", priority: "secondary" as const,
  },
];

export default function SelectedWorkSection({ dictionary: t, locale }: { dictionary: HomeDictionary; locale: Locale }) {
  return (
    <section className={`${styles.section} ${styles.workSection}`} id="proyectos" data-navbar-theme="light" data-nav-section="proyectos">
      <SectionHeading
        className={styles.sectionHead}
        eyebrow={t.projects.eyebrow}
        eyebrowClassName={styles.eyebrow}
        title={t.projects.title}
        description={t.projects.description}
        wrapContent
      />

      <CapabilityLinks capabilities={capabilities} copy={(t.projects as typeof t.projects & { capabilities?: { title: string; description: string; action: string }[] }).capabilities ?? (locale === "en" ? [
        { title: "Brand activations", description: "Games, campaigns and digital experiences designed to generate participation.", action: "Explore activations" },
        { title: "AR / XR", description: "Experiences that bring digital content into physical space and make audience interaction measurable.", action: "View AR / XR" },
        { title: "Interactive 3D", description: "Products and spaces people can explore, configure and understand in real time.", action: "Explore 3D" },
        { title: "Web experiences", description: "Platforms and sites built around an experience, not a template.", action: "View web experiences" },
      ] : [
        { title: "Activaciones de marca", description: "Juegos, campañas y experiencias digitales diseñadas para generar participación.", action: "Explorar activaciones" },
        { title: "AR / XR", description: "Experiencias que llevan contenido digital al espacio físico y permiten medir cómo interactúa la audiencia.", action: "Ver AR / XR" },
        { title: "3D interactivo", description: "Productos y espacios que se pueden explorar, configurar y entender en tiempo real.", action: "Explorar 3D" },
        { title: "Experiencias Web", description: "Plataformas y sitios construidos alrededor de una experiencia, no de una plantilla.", action: "Ver experiencias web" },
      ])} />
    </section>
  );
}
