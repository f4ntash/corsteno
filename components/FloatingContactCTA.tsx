import { site } from "@/lib/seo";

export default function FloatingContactCTA() {
  return (
    <a
      className="floating-contact-cta"
      href={`${site.basePath}/#contacto`}
      data-analytics="cta"
    >
      Hablemos
    </a>
  );
}
