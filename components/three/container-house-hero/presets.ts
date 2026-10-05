import * as THREE from "three";

export type TimePreset = {
  id: string;
  label: string;
  hour: number;
  azimuth: number;
  elevation: number;
  intensity: number;
  sunColor: string;
  skyColor: string;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  cloudColor: string;
  cloudOpacity: number;
  starOpacity: number;
};

export type Atmosphere = Omit<TimePreset, "id" | "label" | "hour" | "azimuth" | "elevation" | "intensity">;

export const PRESETS: TimePreset[] = [
  { id: "dawn", label: "06:00", hour: 6, azimuth: 90, elevation: 12, intensity: 1.8, sunColor: "#ffb27a", skyColor: "#e9a27a", hemiSky: "#ffcf9e", hemiGround: "#3b2a3a", hemiIntensity: 0.55, cloudColor: "#ffb98e", cloudOpacity: 0.85, starOpacity: 0 },
  { id: "noon", label: "12:00", hour: 12, azimuth: 0, elevation: 78, intensity: 3.2, sunColor: "#fff4e0", skyColor: "#8ec5ff", hemiSky: "#bfe0ff", hemiGround: "#6b6558", hemiIntensity: 0.9, cloudColor: "#ffffff", cloudOpacity: 0.95, starOpacity: 0 },
  { id: "dusk", label: "18:00", hour: 18, azimuth: 270, elevation: 10, intensity: 2.0, sunColor: "#ff8a4c", skyColor: "#c4623f", hemiSky: "#ff9f7a", hemiGround: "#2e2333", hemiIntensity: 0.5, cloudColor: "#ff9a6b", cloudOpacity: 0.85, starOpacity: 0 },
  { id: "night", label: "24:00", hour: 24, azimuth: 135, elevation: 45, intensity: 0.45, sunColor: "#9db4ff", skyColor: "#05070f", hemiSky: "#1a2444", hemiGround: "#05060a", hemiIntensity: 0.3, cloudColor: "#2b3350", cloudOpacity: 0.55, starOpacity: 1 },
];

const EXTRA: TimePreset[] = [
  { id: "late-dusk", label: "21:00", hour: 21, azimuth: 250, elevation: 4, intensity: 0.5, sunColor: "#8a82c0", skyColor: "#2a2440", hemiSky: "#4a4466", hemiGround: "#15121d", hemiIntensity: 0.35, cloudColor: "#5a5078", cloudOpacity: 0.7, starOpacity: 0.6 },
  { id: "predawn", label: "03:00", hour: 27, azimuth: 110, elevation: 6, intensity: 0.5, sunColor: "#8a95c9", skyColor: "#1a1c34", hemiSky: "#2c3358", hemiGround: "#0a0b12", hemiIntensity: 0.3, cloudColor: "#3a4066", cloudOpacity: 0.6, starOpacity: 0.7 },
];

const KEYS = (() => {
  const sequence = [...PRESETS, ...EXTRA, { ...PRESETS[0], hour: 30 }].sort((a, b) => a.hour - b.hour);
  let azimuth = sequence[0].azimuth;
  return sequence.map((preset, index) => {
    if (index > 0) azimuth -= (((azimuth - preset.azimuth) % 360) + 360) % 360;
    return { ...preset, az: azimuth };
  });
})();

function segment(hour: number) {
  let time = ((hour % 24) + 24) % 24;
  if (time < 6) time += 24;
  for (let index = 0; index < KEYS.length - 1; index += 1) {
    const from = KEYS[index];
    const to = KEYS[index + 1];
    if (time >= from.hour && time <= to.hour) return { from, to, fraction: (time - from.hour) / (to.hour - from.hour) };
  }
  return { from: KEYS[0], to: KEYS[0], fraction: 0 };
}

const lerp = (from: number, to: number, fraction: number) => from + (to - from) * fraction;
const mix = (from: string, to: string, fraction: number) => `#${new THREE.Color(from).lerp(new THREE.Color(to), fraction).getHexString()}`;

export function sunAt(hour: number) {
  const { from, to, fraction } = segment(hour);
  return {
    azimuth: Math.round((((lerp(from.az, to.az, fraction) % 360) + 360) % 360)),
    elevation: Math.round(lerp(from.elevation, to.elevation, fraction)),
    intensity: Math.round(lerp(from.intensity, to.intensity, fraction) * 100) / 100,
  };
}

export function atmosphereAt(hour: number): Atmosphere {
  const { from, to, fraction } = segment(hour);
  return {
    sunColor: mix(from.sunColor, to.sunColor, fraction),
    skyColor: mix(from.skyColor, to.skyColor, fraction),
    hemiSky: mix(from.hemiSky, to.hemiSky, fraction),
    hemiGround: mix(from.hemiGround, to.hemiGround, fraction),
    hemiIntensity: lerp(from.hemiIntensity, to.hemiIntensity, fraction),
    cloudColor: mix(from.cloudColor, to.cloudColor, fraction),
    cloudOpacity: lerp(from.cloudOpacity, to.cloudOpacity, fraction),
    starOpacity: lerp(from.starOpacity, to.starOpacity, fraction),
  };
}

export function formatHour(hour: number) {
  const totalMinutes = Math.round(hour * 60);
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}
