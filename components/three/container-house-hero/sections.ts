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

/* ---------------------------------------------------------------------------
   Botones combinados: varios nodos del modelo se prenden/apagan con un solo botón
   --------------------------------------------------------------------------- */

export type SectionRow = { id: string; label: string; keys: string[] };

type Bucket = { id: string; es: string; en: string; test: (name: string) => boolean };

// Nombre normalizado: sin el prefijo del grupo, sin "#n", sin "_" ni espacios, en minúsculas
const normalize = (key: string, group: SectionGroup) =>
  key.slice(group.length + 1).replace(/#\d+$/, "").replace(/[_\s]/g, "").toLowerCase();

const decoration: Bucket = { id: "decoration", es: "Decoración", en: "Decoration", test: (n) => n.startsWith("decoration") };

// Los elementos que no entran en ninguna regla siguen con su botón individual
const BUCKETS: Partial<Record<SectionGroup, Bucket[]>> = {
  Base: [
    decoration,
    { id: "windows", es: "Ventanas", en: "Windows", test: (n) => n.startsWith("windows") },
  ],
  Kitchen: [decoration],
  Living: [
    { id: "chairs", es: "Sillas", en: "Chairs", test: (n) => n.startsWith("chair") },
    decoration,
    // Table y TableDecoration comparten botón
    { id: "table", es: "Mesa", en: "Table", test: (n) => n.startsWith("table") },
  ],
  Second: [
    decoration,
    // Exterior Wall y Wall comparten botón
    { id: "walls", es: "Paredes", en: "Walls", test: (n) => n.startsWith("exteriorwall") || n.startsWith("wall") },
  ],
};

export function buildRows(
  group: SectionGroup,
  items: { key: string; label: string }[],
  lang: "es" | "en",
): SectionRow[] {
  const rules = BUCKETS[group] ?? [];
  const rows: SectionRow[] = [];
  const byId = new Map<string, SectionRow>();
  for (const item of items) {
    const rule = rules.find((candidate) => candidate.test(normalize(item.key, group)));
    if (!rule) {
      rows.push({ id: item.key, label: item.label, keys: [item.key] });
      continue;
    }
    const id = `${group}:${rule.id}`;
    let row = byId.get(id);
    if (!row) {
      row = { id, label: rule[lang], keys: [] };
      byId.set(id, row);
      rows.push(row);
    }
    row.keys.push(item.key);
  }
  return rows;
}