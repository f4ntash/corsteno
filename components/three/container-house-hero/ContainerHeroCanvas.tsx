"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import type * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { HOME_VIEW, MAX_POLAR_DEG, MIN_MAX_DISTANCE, MAX_ZOOM_OUT, PAN_DOWN_MARGIN, type CameraRequest, type HeroCameraEntry } from "./cameras";
import CameraController from "./CameraController";
import HotspotMarkers from "./HotspotMarkers";
import Lighting from "./Lighting";
import Model from "./Model";
import PanLimit from "./PanLimit";
import { atmosphereAt } from "./presets";
import type { ModelLightEntry } from "./lights";
import type { SectionEntry } from "./sections";
import Sky from "./Sky";
import { withBasePath } from "@/lib/assetPath";

type CameraInfo = { key: string; label: string };

function Loader() {
  const { progress } = useProgress();
  return <Html center className="container-hero-loader">{Math.round(progress)}%</Html>;
}

export default function ContainerHeroCanvas({
  time,
  azimuth,
  elevation,
  intensity,
  hidden,
  lightsOff,
  cameraRequest,
  onSelectCamera,
  onSelectLight,
  viewFromLabel = "Ver desde",
  hotspotMode,
  activeCameraKey,
  activeLightKey,
  onSections,
  onLights,
  onCameras,
}: {
  time: number;
  azimuth: number;
  elevation: number;
  intensity: number;
  hidden: Set<string>;
  lightsOff: Set<string>;
  cameraRequest: CameraRequest;
  /** Se llama al tocar el botón de una cámara dentro del modelo 3D. */
  onSelectCamera: (key: string) => void;
  /** Se llama al tocar el punto de una luz dentro del modelo 3D. */
  onSelectLight: (key: string) => void;
  /** Texto del punto de cada cámara (por ejemplo "Ver desde"), tomado del diccionario i18n. */
  viewFromLabel?: string;
  /** Qué puntos se muestran sobre el modelo: los de las cámaras, los de las luces o ninguno. */
  hotspotMode: "cameras" | "lights" | null;
  activeCameraKey: string | null;
  activeLightKey: string | null;
  onSections: (sections: Omit<SectionEntry, "node">[]) => void;
  onLights: (lights: ModelLightEntry[]) => void;
  onCameras: (cameras: CameraInfo[]) => void;
}) {
  const [radius, setRadius] = useState(8);
  const [modelHeight, setModelHeight] = useState(0);
  const [cameraList, setCameraList] = useState<CameraInfo[]>([]);
  const [lightList, setLightList] = useState<ModelLightEntry[]>([]);
  const camerasRef = useRef<Map<string, HeroCameraEntry>>(new Map());
  const lightsRef = useRef<Map<string, THREE.Light>>(new Map());
  const phase = atmosphereAt(time);

  const handleBounds = useCallback((modelRadius: number, height: number) => {
    setRadius(modelRadius);
    setModelHeight(height);
  }, []);

  // Las listas de luces y cámaras también se guardan acá para dibujar un punto sobre cada una
  const handleLights = useCallback(
    (lights: ModelLightEntry[]) => {
      setLightList(lights);
      onLights(lights);
    },
    [onLights],
  );

  const handleCameras = useCallback(
    (cameras: CameraInfo[]) => {
      setCameraList(cameras);
      onCameras(cameras);
    },
    [onCameras],
  );

  return (
    <Canvas shadows camera={{ position: HOME_VIEW.position, fov: HOME_VIEW.fov }}>
      <Lighting azimuth={azimuth} elevation={elevation} intensity={intensity} phase={phase} radius={radius} />
      <Sky phase={phase} radius={radius} />
      <Suspense fallback={<Loader />}>
        <Model
          url={withBasePath("/models/Container.glb")}
          hidden={hidden}
          onSections={onSections}
          lightsOff={lightsOff}
          onLights={handleLights}
          lightsRef={lightsRef}
          onBounds={handleBounds}
          camerasRef={camerasRef}
          onCameras={handleCameras}
        />
      </Suspense>
      {/* Los puntos aparecen solo cuando está abierta la pestaña Cámaras o la pestaña Luces */}
      {hotspotMode === "cameras" && (
        <HotspotMarkers
          items={cameraList}
          getObject={(key) => camerasRef.current.get(key)?.object}
          activeKey={activeCameraKey}
          onSelect={onSelectCamera}
          ariaLabel={(label) => `${viewFromLabel} ${label}`}
          hideDistance={1.2}
        />
      )}
      {hotspotMode === "lights" && (
        <HotspotMarkers
          items={lightList}
          getObject={(key) => lightsRef.current.get(key)}
          activeKey={activeLightKey}
          dimmedKeys={lightsOff}
          onSelect={onSelectLight}
          ariaLabel={(label) => label}
          toggleable
        />
      )}
      <OrbitControls
        makeDefault
        enableDamping
        target={HOME_VIEW.target}
        maxDistance={Math.max(MIN_MAX_DISTANCE, radius * MAX_ZOOM_OUT)}
        maxPolarAngle={(MAX_POLAR_DEG * Math.PI) / 180}
      />
      {/* Al desplazar con clic derecho, el punto que se mira no baja del nivel del piso */}
      <PanLimit minY={modelHeight > 0 ? -modelHeight / 2 + PAN_DOWN_MARGIN : Number.NEGATIVE_INFINITY} />
      <CameraController request={cameraRequest} camerasRef={camerasRef} radius={radius} />
    </Canvas>
  );
}
