import type * as THREE from "three";

export const GROUPS = ["Base", "Kitchen", "Living", "Second", "Top"] as const;
export type SectionGroup = (typeof GROUPS)[number];

export const GROUP_LABELS: Record<SectionGroup, "base" | "kitchen" | "living" | "second" | "top"> = {
  Base: "base",
  Kitchen: "kitchen",
  Living: "living",
  Second: "second",
  Top: "top",
};

export type SectionEntry = {
  key: string;
  label: string;
  group: SectionGroup;
  locked: boolean;
  node?: THREE.Object3D;
};

export function parseName(name: string): { group: SectionGroup; label: string } | null {
  const group = GROUPS.find((candidate) => name.startsWith(`${candidate}_`));
  if (!group) return null;
  return { group, label: name.slice(group.length + 1).replace(/_/g, " ") };
}

const BASE_TOGGLEABLE = ["Base_Decoration", "Base_Windows"];

export function isLocked(name: string, group: SectionGroup) {
  return group === "Base" && !BASE_TOGGLEABLE.some((prefix) => name.startsWith(prefix));
}
