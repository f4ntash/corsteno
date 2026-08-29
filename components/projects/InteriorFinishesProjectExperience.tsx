"use client";

import InteriorFinishesScene from "@/components/workspace/InteriorFinishesScene";
import styles from "./projectCaseStudy.module.css";

const sceneStyle = {};

export default function InteriorFinishesProjectExperience() {
  return (
    <div className={styles.threeExperience} data-project-viewer="interior-finishes">
      <InteriorFinishesScene sceneStyle={sceneStyle} active onSceneLink={() => undefined} presentation="project" />
    </div>
  );
}
