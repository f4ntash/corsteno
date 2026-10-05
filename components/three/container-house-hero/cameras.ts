import type * as THREE from "three";

export const isCameraName = (name: string) => /^camera/i.test(name);

export const MAX_ZOOM_OUT = 2.5;
export const MIN_MAX_DISTANCE = 20;
export const MAX_POLAR_DEG = 90;

export const HOME_VIEW = {
  position: [3, 2, 7] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
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

