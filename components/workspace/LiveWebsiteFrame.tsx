import type { Locale } from "@/lib/i18n";

type LiveWebsiteFrameProps = {
  title: string;
  url: string;
  externalUrl: string;
  projectSlug: string;
  className?: string;
  locale?: Locale;
};

export default function LiveWebsiteFrame({ title, url, externalUrl, projectSlug, className = "", locale = "es" }: LiveWebsiteFrameProps) {
  const english = locale === "en";
  return (
    <section className={`live-website-frame ${className}`.trim()} aria-label={english ? `Website for ${title}` : `Sitio web de ${title}`}>
      <header className="live-website-toolbar">
        <span>Live website</span>
        <span className="live-website-status">● Live</span>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="external_project_visit"
          data-project={projectSlug}
        >
          {english ? "Open website ↗" : "Abrir sitio ↗"}
        </a>
      </header>
      <iframe
        className="live-website-iframe"
        src={url}
        title={english ? `Interactive website for ${title}` : `Sitio web navegable de ${title}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
