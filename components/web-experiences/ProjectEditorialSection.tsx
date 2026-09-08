import styles from "./projectEditorialSection.module.css";

export default function ProjectEditorialSection({ image, imageAlt }: { image: string; imageAlt: string }) {
  return <section className={styles.section} aria-label="Terrambú"><div className={styles.imagePanel}><img src={image} alt={imageAlt} /><div className={styles.label}><span>01 —</span><span>TERRAMBÚ</span></div></div><div className={styles.paperPanel}><p className={styles.statement}>Cada proyecto pide<br />una forma distinta<br />de ser recorrido.</p><span className={styles.arrow} aria-hidden="true">↓</span></div></section>;
}
