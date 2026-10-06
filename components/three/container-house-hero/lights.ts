export const isLightName = (name: string) => /^light/i.test(name);

export const LIGHT_DEFAULTS = {
  color: "#ffd9a0",
  intensity: 15,
  distance: 8,
  decay: 2,
};

export const LIGHT_SHADOWS = false;
export const FALLBACK_LIGHTS: { name: string; blender: [number, number, number] }[] = [];
export const LIGHT_INTENSITY = 0.01;

export const blenderToThree = ([x, y, z]: [number, number, number]): [number, number, number] => [x, z, -y];

export type ModelLightEntry = { key: string; label: string; origin: "glb" | "three" };
