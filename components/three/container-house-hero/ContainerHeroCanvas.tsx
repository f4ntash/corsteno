"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { MAX_POLAR_DEG, MIN_MAX_DISTANCE, MAX_ZOOM_OUT, type CameraRequest, type HeroCameraEntry } from "./cameras";
import CameraController from "./CameraController";
import Lighting from "./Lighting";
import Model from "./Model";
import { atmosphereAt } from "./presets";
import type { ModelLightEntry } from "./lights";
import type { SectionEntry } from "./sections";
import Sky from "./Sky";
import { withBasePath } from "@/lib/assetPath";

function Loader() {
  const { progress } = useProgress();
  return <Html center className="container-hero-loader">{Math.round(progress)} %</Html>;
}

export default function ContainerHeroCanvas({
  time,
  azimuth,
  elevation,
  intensity,
  showClouds,
  showStars,
  hidden,
  lightsOff,
  showMarkers,
  cameraRequest,
  onSections,
  onLights,
  onCameras,
}: {
  time: number;
  azimuth: number;
  elevation: number;
  intensity: number;
  showClouds: boolean;
  showStars: boolean;
  hidden: Set<string>;
  lightsOff: Set<string>;
  showMarkers: boolean;
  cameraRequest: CameraRequest;
  onSections: (sections: Omit<SectionEntry, "node">[]) => void;
  onLights: (lights: ModelLightEntry[]) => void;
  onCameras: (cameras: { key: string; label: string }[]) => void;
}) {
  const [radius, setRadius] = useState(8);
  const camerasRef = useRef<Map<string, HeroCameraEntry>>(new Map());
  const phase = atmosphereAt(time);

  return (
    <Canvas shadows camera={{ position: [3, 2, 7], fov: 45 }}>
      <Lighting azimuth={azimuth} elevation={elevation} intensity={intensity} phase={phase} radius={radius} />
      <Sky phase={phase} radius={radius} showClouds={showClouds} showStars={showStars} />
      <Suspense fallback={<Loader />}>
        <Model
          url={withBasePath("/models/Container.glb")}
          hidden={hidden}
          onSections={onSections}
          lightsOff={lightsOff}
          showMarkers={showMarkers}
          onLights={onLights}
          onBounds={setRadius}
          camerasRef={camerasRef}
          onCameras={onCameras}
        />
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        maxDistance={Math.max(MIN_MAX_DISTANCE, radius * MAX_ZOOM_OUT)}
        maxPolarAngle={(MAX_POLAR_DEG * Math.PI) / 180}
      />
      <CameraController request={cameraRequest} camerasRef={camerasRef} radius={radius} />
    </Canvas>
  );
}
