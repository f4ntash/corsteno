import type * as THREE from "three";

// La cámara 7 no se usa: no aparece en la lista ni como punto sobre el modelo
// Excluye cualquier nombre con un "7" suelto: Camera_7, Camera 7, Camera.007, Camera_07, Camera_7_Sala...
// (no afecta a números como 17 o 70)
const isSevenCamera = (name: string) => /(?:^|[^0-9])0*7(?![0-9])/.test(name);

export const isCameraName = (name: string) => /^camera/i.test(name) && !isSevenCamera(name);

export const MAX_ZOOM_OUT = 2.5;
export const MIN_MAX_DISTANCE = 20;
export const MAX_POLAR_DEG = 90;

// Límite para DESPLAZAR la vista hacia abajo (clic derecho): el punto que se mira no baja del
// nivel del piso del modelo más este margen, en metros (negativo = deja bajar un poco más).
export const PAN_DOWN_MARGIN = 2;

export const HOME_VIEW = {
  position: [3, 4.2, 28] as [number, number, number],
  target: [0, 0.25, 0] as [number, number, number],
  fov: 45,
};

export type CameraRequest =
  | { key: string | null; mode: "home" | "view"; n: number }
  | null;

export type HeroCameraEntry = {
  key: string;
  label: string;
  object: THREE.Object3D;
  fov: number | null;
};
