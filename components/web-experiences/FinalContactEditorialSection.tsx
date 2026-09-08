import styles from "./finalContactEditorialSection.module.css";

export default function FinalContactEditorialSection({ href }: { href: string }) {
  return (
    <section className={styles.section} aria-label="Contacto">
      <div className={styles.content}>
        <span className={styles.index}>03 —</span>
        <h2>
          <span>HABLEMOS DE</span>
          <span>{" "}TU PRÓXIMO PROYECTO.</span>
        </h2>
        <p>Hablemos de tu próximo proyecto.</p>
        <a className={styles.cta} href={href} data-analytics="cta" data-capability="web_experiences">
          CONTACTAR <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
