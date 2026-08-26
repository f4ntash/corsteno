"use client";

import H2OScene from "@/components/workspace/H2OScene";
import styles from "./projectCaseStudy.module.css";

const sceneStyle = {};

export default function H2OProjectExperience() {
  return (
    <div className={styles.threeExperience} data-project-viewer="h2o">
      <H2OScene sceneStyle={sceneStyle} active onSceneLink={() => undefined} presentation="project" />
    </div>
  );
}
