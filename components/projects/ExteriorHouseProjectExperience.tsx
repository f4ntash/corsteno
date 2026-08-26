"use client";

import ProductScene from "@/components/workspace/ProductScene";
import styles from "./projectCaseStudy.module.css";

const sceneStyle = {};

export default function ExteriorHouseProjectExperience() {
  return (
    <div className={styles.threeExperience} data-project-viewer="exterior-house">
      <ProductScene sceneStyle={sceneStyle} active onSceneLink={() => undefined} presentation="project" />
    </div>
  );
}
