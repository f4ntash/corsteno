"use client";

import ExteriorHouseConfigurator from "@/components/workspace/ExteriorHouseConfigurator";
import styles from "./projectCaseStudy.module.css";

export default function ExteriorHouseProjectExperience() {
  return (
    <div className={styles.threeExperience} data-project-viewer="exterior-house">
      <ExteriorHouseConfigurator presentation="project" />
    </div>
  );
}
