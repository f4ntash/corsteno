type LiveWebsiteFrameProps = {
  title: string;
  url: string;
  externalUrl: string;
  projectSlug: string;
  className?: string;
};

export default function LiveWebsiteFrame({ title, url, externalUrl, projectSlug, className = "" }: LiveWebsiteFrameProps) {
  return (
    <section className={`live-website-frame ${className}`.trim()} aria-label={`Sitio web de ${title}`}>
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
          Abrir sitio ↗
        </a>
      </header>
      <iframe className="live-website-iframe" src={url} title={`Sitio web navegable de ${title}`} loading="lazy" />
    </section>
  );
}
