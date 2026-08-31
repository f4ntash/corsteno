"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assetPath";
import CinematicCanvas from "./CinematicCanvas";
import styles from "./cinematic.module.css";

const SCENE_COUNT = 3;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function CinematicExperience() {
  const experienceRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const updateProgress = useCallback(() => {
    frameRef.current = null;
    const experience = experienceRef.current;
    if (!experience) return;

    const rect = experience.getBoundingClientRect();
    const scrollRange = Math.max(experience.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-rect.top / scrollRange, 0, 1);
    const scene = clamp(Math.round(progress * (SCENE_COUNT - 1)), 0, SCENE_COUNT - 1);

    progressRef.current = progress;
    experience.style.setProperty("--cinematic-progress", progress.toFixed(4));
    setActiveScene((current) => (current === scene ? current : scene));
  }, []);

  const requestUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [requestUpdate]);

  return (
    <main ref={experienceRef} className={styles.experience} id="main-content" data-scene={activeScene}>
      <div className={styles.canvasLayer} aria-hidden="true">
        <CinematicCanvas progressRef={progressRef} reducedMotion={reducedMotion} />
      </div>

      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <header className={styles.chrome}>
        <a className={styles.wordmark} href={withBasePath("/")} aria-label="Volver a Corsteno">
          Corsteno
        </a>
        <span className={styles.location}>ESTUDIO / ARGENTINA</span>
      </header>

      <aside className={styles.progressRail} aria-label={`Escena ${activeScene} de 2`}>
        <span className={styles.progressNumber}>0{activeScene}</span>
        <span className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressFill} />
        </span>
        <span className={styles.progressTotal}>02</span>
      </aside>

      <section className={styles.scene} data-visible={activeScene === 0} aria-labelledby="cinematic-intro-title">
        <div className={`${styles.sceneFrame} ${styles.introFrame}`}>
          <div className={styles.introCopy}>
            <span className={styles.sceneIndex}>00 / INTRO</span>
            <h1 id="cinematic-intro-title">Corsteno</h1>
            <p>Diseño que toma forma.</p>
          </div>
          <span className={styles.scrollCue}>SCROLL TO EXPLORE</span>
        </div>
      </section>

      <section className={styles.scene} data-visible={activeScene === 1} aria-labelledby="cinematic-surfaces-title">
        <div className={`${styles.sceneFrame} ${styles.surfacesFrame}`}>
          <div className={styles.chapterCopy}>
            <span className={styles.sceneIndex}>01 / SUPERFICIES</span>
            <h2 id="cinematic-surfaces-title">
              Materialidad.<br />
              Textura.<br />
              Escala.
            </h2>
          </div>
          <div className={styles.materialNote} aria-label="Material de la escena">
            <span>01A</span>
            <span>Yeso mineral</span>
            <span>Roughness / 0.78</span>
          </div>
        </div>
      </section>

      <section className={styles.scene} data-visible={activeScene === 2} aria-labelledby="cinematic-light-title">
        <div className={`${styles.sceneFrame} ${styles.lightFrame}`}>
          <div className={styles.lightCopy}>
            <span className={styles.sceneIndex}>02 / LIGHT</span>
            <h2 id="cinematic-light-title">La luz también construye espacio.</h2>
          </div>
          <span className={styles.lightNote}>BRUSHED METAL / WARM LIGHT / 2700K</span>
        </div>
      </section>
    </main>
  );
}
