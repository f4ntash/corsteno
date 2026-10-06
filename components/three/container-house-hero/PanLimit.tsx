import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type * as THREE from "three";

type ControlsApi = {
  target: THREE.Vector3;
  addEventListener: (type: "start" | "end", listener: () => void) => void;
  removeEventListener: (type: "start" | "end", listener: () => void) => void;
};

// Tiempo extra después de soltar el mouse: el desplazamiento sigue un rato por inercia.
const SETTLE_MS = 1500;

/**
 * Limita cuánto se puede desplazar la vista hacia abajo (clic derecho o dos dedos).
 * El punto que se mira no baja de `minY`; la cámara sube lo mismo para que la vista no se deforme.
 * Solo actúa mientras la persona interactúa, así las vistas de las cámaras importadas
 * ("Ver desde") llegan a su posición exacta.
 */
export default function PanLimit({ minY }: { minY: number }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as ControlsApi | null;
  const active = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!controls) return;
    const onStart = () => {
      clearTimeout(timer.current);
      active.current = true;
    };
    const onEnd = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        active.current = false;
      }, SETTLE_MS);
    };
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);
    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      clearTimeout(timer.current);
    };
  }, [controls]);

  // Corre después de la actualización de OrbitControls, antes de dibujar el cuadro
  useFrame(() => {
    if (!controls || !active.current) return;
    const below = minY - controls.target.y;
    if (below > 0) {
      controls.target.y = minY;
      camera.position.y += below;
    }
  });

  return null;
}
