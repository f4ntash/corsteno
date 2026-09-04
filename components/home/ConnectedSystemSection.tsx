import Eyebrow from "@/components/atoms/Eyebrow";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeExperience.module.css";
import type { HomeDictionary } from "@/lib/i18n";

export default function ConnectedSystemSection({ dictionary: t }: { dictionary: HomeDictionary }) {
  return (
    <HomeSectionReveal className={styles.connectedBackground}>
      <section className={styles.connectedSection} id="soluciones" data-navbar-theme="dark" data-nav-section="soluciones">
        <div className={styles.connectedCopy}>
          <Eyebrow className={styles.eyebrow}>{t.system.eyebrow}</Eyebrow>
          <h2>{t.system.title}</h2>
          <p>{t.system.body}</p>
        </div>

        <div className={styles.systemNetwork} aria-label={t.system.aria}>
          <svg viewBox="0 0 1000 560" aria-hidden="true">
            <g>
              <line x1="500" y1="280" x2="130" y2="90" />
              <line x1="500" y1="280" x2="360" y2="62" />
              <line x1="500" y1="280" x2="660" y2="62" />
              <line x1="500" y1="280" x2="870" y2="90" />
              <line x1="500" y1="280" x2="130" y2="470" />
              <line x1="500" y1="280" x2="360" y2="498" />
              <line x1="500" y1="280" x2="660" y2="498" />
              <line x1="500" y1="280" x2="870" y2="470" />
            </g>
          </svg>
          <strong>{t.system.product}</strong>
          {t.system.nodes.map((node) => <span key={node}>{node}</span>)}
        </div>
      </section>
    </HomeSectionReveal>
  );
}
