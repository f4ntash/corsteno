"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { MAX_POLAR_DEG, MIN_MAX_DISTANCE, MAX_ZOOM_OUT, PAN_DOWN_MARGIN, type CameraRequest, type HeroCameraEntry } from "./cameras";
import CameraController from "./CameraController";
import CameraMarkers from "./CameraMarkers";
import Lighting from "./Lighting";
import Model from "./Model";
import PanLimit from "./PanLimit";
import { atmosphereAt } from "./presets";
import type { ModelLightEntry } from "./lights";
import type { SectionEntry } from "./sections";
import Sky from "./Sky";
import { withBasePath } from "@/lib/assetPath";

// Velocidad de la rotación automática: 1 ≈ una vuelta por minuto (2 = una vuelta cada 30 s).
const AUTO_ROTATE_SPEED = 1;

type CameraInfo = { key: string; label: string };

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
  cameraRequest,
  autoRotate,
  onAutoRotateChange,
  onSelectCamera,
  viewFromLabel = "Ver desde",
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
  cameraRequest: CameraRequest;
  /** Rotación automática alrededor del modelo. */
  autoRotate: boolean;
  /** Se llama con `false` cuando la persona toma el control o elige una cámara. */
  onAutoRotateChange?: (value: boolean) => void;
  /** Se llama al tocar el botón de una cámara dentro del modelo 3D. */
  onSelectCamera: (key: string) => void;
  /** Texto del botón de cada cámara (por ejemplo "Ver desde"), tomado del diccionario i18n. */
  viewFromLabel?: string;
  onSections: (sections: Omit<SectionEntry, "node">[]) => void;
  onLights: (lights: ModelLightEntry[]) => void;
  onCameras: (cameras: CameraInfo[]) => void;
}) {
  const [radius, setRadius] = useState(8);
  const [modelHeight, setModelHeight] = useState(0);
  const [cameraList, setCameraList] = useState<CameraInfo[]>([]);
  const camerasRef = useRef<Map<string, HeroCameraEntry>>(new Map());
  const phase = atmosphereAt(time);

  const handleBounds = useCallback((modelRadius: number, height: number) => {
    setRadius(modelRadius);
    setModelHeight(height);
  }, []);

  // La lista de cámaras también se guarda acá para dibujar un botón sobre cada una
  const handleCameras = useCallback(
    (cameras: CameraInfo[]) => {
      setCameraList(cameras);
      onCameras(cameras);
    },
    [onCameras],
  );

  // Al ir a la vista de una cámara (desde el panel o desde su botón 3D) se detiene la rotación automática
  useEffect(() => {
    if (cameraRequest?.mode === "view") onAutoRotateChange?.(false);
  }, [cameraRequest]); // eslint-disable-line react-hooks/exhaustive-deps

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
          onLights={onLights}
          onBounds={handleBounds}
          camerasRef={camerasRef}
          onCameras={handleCameras}
        />
      </Suspense>
      <CameraMarkers cameras={cameraList} camerasRef={camerasRef} onSelect={onSelectCamera} viewFromLabel={viewFromLabel} />
      <OrbitControls
        makeDefault
        enableDamping
        maxDistance={Math.max(MIN_MAX_DISTANCE, radius * MAX_ZOOM_OUT)}
        maxPolarAngle={(MAX_POLAR_DEG * Math.PI) / 180}
        autoRotate={autoRotate}
        autoRotateSpeed={AUTO_ROTATE_SPEED}
        onStart={() => onAutoRotateChange?.(false)}
      />
      {/* Al desplazar con clic derecho, el punto que se mira no baja del nivel del piso */}
      <PanLimit minY={modelHeight > 0 ? -modelHeight / 2 + PAN_DOWN_MARGIN : Number.NEGATIVE_INFINITY} />
      <CameraController request={cameraRequest} camerasRef={camerasRef} radius={radius} />
    </Canvas>
  );
}