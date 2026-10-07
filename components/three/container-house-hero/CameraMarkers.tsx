import { useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { HeroCameraEntry } from "./cameras";

// Si la vista ya está a esta distancia (en metros) de la cámara, el botón se oculta
// para no quedar tapando la imagen cuando se mira desde esa cámara.
const HIDE_DISTANCE = 1.2;

type CameraInfo = { key: string; label: string };

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CameraMarker({
  cameraKey,
  label,
  camerasRef,
  onSelect,
  viewFromLabel,
}: {
  cameraKey: string;
  label: string;
  camerasRef: RefObject<Map<string, HeroCameraEntry>>;
  onSelect: (key: string) => void;
  viewFromLabel: string;
}) {
  const group = useRef<THREE.Group>(null);
  const position = useMemo(() => new THREE.Vector3(), []);
  // Arranca oculto hasta calcular la posición real (evita un destello en el origen)
  const [hidden, setHidden] = useState(true);
  const hiddenRef = useRef(true);

  useFrame(({ camera }) => {
    const entry = camerasRef.current.get(cameraKey);
    const anchor = group.current;
    if (!entry || !anchor) return;

    // Posición actual de la cámara importada, ya con el modelo centrado y escalado
    entry.object.getWorldPosition(position);
    anchor.position.copy(position);

    const tooClose = camera.position.distanceTo(position) < HIDE_DISTANCE;
    if (tooClose !== hiddenRef.current) {
      hiddenRef.current = tooClose;
      setHidden(tooClose);
    }
  });

  return (
    <group ref={group}>
      <Html center zIndexRange={[20, 0]}>
        <button
          type="button"
          className="container-hero-camera-marker"
          data-hidden={hidden ? "true" : undefined}
          tabIndex={hidden ? -1 : 0}
          aria-label={`${viewFromLabel} ${label}`}
          onClick={() => onSelect(cameraKey)}
        >
          <CameraIcon />
          <span className="container-hero-camera-tooltip">{label}</span>
        </button>
      </Html>
    </group>
  );
}

export default function CameraMarkers({
  cameras,
  camerasRef,
  onSelect,
  viewFromLabel = "Ver desde",
}: {
  cameras: CameraInfo[];
  camerasRef: RefObject<Map<string, HeroCameraEntry>>;
  onSelect: (key: string) => void;
  viewFromLabel?: string;
}) {
  return (
    <>
      {cameras.map((camera) => (
        <CameraMarker
          key={camera.key}
          cameraKey={camera.key}
          label={camera.label}
          camerasRef={camerasRef}
          onSelect={onSelect}
          viewFromLabel={viewFromLabel}
        />
      ))}
    </>
  );
}
