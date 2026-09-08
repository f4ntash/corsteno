import styles from "./mapaPunillaEditorialSection.module.css";

type Props = {
  href: string;
  image: string;
  imageAlt: string;
};

export default function MapaPunillaEditorialSection({ href, image, imageAlt }: Props) {
  return (
    <section className={styles.section} aria-label="Mapa Punilla">
      <div className={styles.copy}>
        <span className={styles.index}>02 —</span>
        <h2>MAPA PUNILLA</h2>
        <p>Plataforma y mapa digital del turismo en Punilla.</p>
        <ul>
          <li>Mapa interactivo</li>
          <li>Directorio de servicios</li>
          <li>SEO local</li>
          <li>Integración WhatsApp</li>
        </ul>
        <a className={styles.cta} href={href}>VER PROYECTO <span aria-hidden="true">→</span></a>
      </div>

      <div className={styles.visual}>
        <div className={`${styles.sheet} ${styles.backSheet}`} aria-hidden="true">
          <img src={image} alt="" />
        </div>
        <a className={`${styles.sheet} ${styles.mainSheet}`} href={href}>
          <img src={image} alt={imageAlt} />
        </a>
        <div className={`${styles.sheet} ${styles.frontSheet}`} aria-hidden="true">
          <img src="/projects/mapa-punilla-mobile.png" alt="" />
        </div>
      </div>
    </section>
  );
}
