export type HeroTableVariant = "tableA" | "tableB" | "tableC";
export type HeroChairVariant = "chairA" | "chairB" | "chairC";
export type HeroRugVariant = "rug01" | "rug02";
export type HeroDecorVariant = "decorOff" | "decorOn";
export type HeroArmchairVariant = "armchair1" | "armchair2";

export type HeroSliderState = {
  table: HeroTableVariant;
  chair: HeroChairVariant;
  rug: HeroRugVariant;
  decor: HeroDecorVariant;
  armchair: HeroArmchairVariant;
};

export type HeroSliderGroupId = keyof HeroSliderState;
export type HeroSliderValue = HeroSliderState[HeroSliderGroupId];

export type HeroSliderOption = {
  id: string;
  label: string;
  value: HeroSliderValue;
};

export type HeroSliderGroup = {
  id: HeroSliderGroupId;
  label: string;
  options: HeroSliderOption[];
};

export const HERO_SLIDER_TABLE_MESHES = {
  tableA: "TABLE_A",
  tableB: "TABLE_B",
  tableC: "TABLE_C",
} as const;

export const HERO_SLIDER_CHAIR_PREFIXES = {
  chairA: "CHAIR_A_",
  chairB: "CHAIR_B_",
  chairC: "CHAIR_C_",
} as const;

export const HERO_SLIDER_RUG_MESHES = {
  rug01: "FURNITURE_RUG_01",
  rug02: "FURNITURE_RUG_02",
} as const;

export const HERO_SLIDER_ARMCHAIR_MESHES = {
  armchair1: ["FURNITURE_ARMCHAIR_1", "FURNITURE_ARMCHAIR_1001"],
  armchair2: ["FURNITURE_ARMCHAIR_2", "FURNITURE_ARMCHAIR_2001"],
} as const;

export const HERO_SLIDER_DECOR_MESHES = [
  "FURNITURE_SIDE_BOARD",
  "FURNITURE_DRESSER",
  "FURNITURE_MIRROR",
  "FURNITURE_ARMCHAIR_1",
  "FURNITURE_ARMCHAIR_2",
  "FURNITURE_ARMCHAIR_1001",
  "FURNITURE_ARMCHAIR_2001",
  "FURNITURE_SMALLTABLE",
  "FURNITURE_VASE",
  "FURNITURE_FRAME_01",
  "FURNITURE_FRAME_02",
  "FURNITURE_PLATES",
  "LAMP",
  "LIGHT_PENDANT",
] as const;

export const HERO_SLIDER_DECOR_VISIBLE_MESHES = [
  "FURNITURE_SIDE_BOARD",
  "FURNITURE_MIRROR",
  "FURNITURE_SMALLTABLE",
  "FURNITURE_VASE",
  "FURNITURE_FRAME_01",
  "FURNITURE_FRAME_02",
  "FURNITURE_PLATES",
  "LAMP",
  "LIGHT_PENDANT",
] as const;

export const BEFORE_HERO_SLIDER_VISIBLE_MESHES = [
  "FURNITURE_SIDE_BOARD",
  "FURNITURE_RUG_01",
  "FURNITURE_ARMCHAIR_1",
  "FURNITURE_MIRROR",
  "FURNITURE_SMALLTABLE",
  "FURNITURE_PLATES",
  "LAMP",
  "FURNITURE_VASE",
  "FURNITURE_FRAME_01",
] as const;

export const HERO_SLIDER_GROUPS: HeroSliderGroup[] = [
  {
    id: "table",
    label: "Mesa",
    options: [
      { id: "tableA", label: "Roble claro", value: "tableA" },
      { id: "tableB", label: "Nogal medio", value: "tableB" },
      { id: "tableC", label: "Nogal oscuro", value: "tableC" },
    ],
  },
  {
    id: "chair",
    label: "Sillas",
    options: [
      { id: "chairA", label: "Celeste suave", value: "chairA" },
      { id: "chairB", label: "Madera grafito", value: "chairB" },
      { id: "chairC", label: "Madera nogal", value: "chairC" },
    ],
  },
  {
    id: "rug",
    label: "Alfombra",
    options: [
      { id: "rug01", label: "Circular bicolor", value: "rug01" },
      { id: "rug02", label: "Geométrica clara", value: "rug02" },
    ],
  },
  {
    id: "armchair",
    label: "Sillón",
    options: [
      { id: "armchair1", label: "Sillón verde", value: "armchair1" },
      { id: "armchair2", label: "Sillón lounge", value: "armchair2" },
    ],
  },
];

export const DEFAULT_HERO_SLIDER_STATE: HeroSliderState = {
  table: "tableA",
  chair: "chairA",
  rug: "rug01",
  decor: "decorOn",
  armchair: "armchair1",
};

export const BEFORE_HERO_SLIDER_STATE: HeroSliderState = {
  ...DEFAULT_HERO_SLIDER_STATE,
  table: "tableB",
  chair: "chairB",
  rug: "rug01",
  decor: "decorOff",
  armchair: "armchair1",
};

export function getHeroSliderVisibility(state: HeroSliderState) {
  const visibility = new Map<string, boolean>();

  Object.values(HERO_SLIDER_TABLE_MESHES).forEach((meshName) => {
    visibility.set(meshName, meshName === HERO_SLIDER_TABLE_MESHES[state.table]);
  });

  Object.values(HERO_SLIDER_RUG_MESHES).forEach((meshName) => {
    visibility.set(meshName, state.decor === "decorOn" && meshName === HERO_SLIDER_RUG_MESHES[state.rug]);
  });

  const activeChairPrefix = HERO_SLIDER_CHAIR_PREFIXES[state.chair];
  Object.values(HERO_SLIDER_CHAIR_PREFIXES).forEach((prefix) => {
    visibility.set(prefix, prefix === activeChairPrefix);
  });

  HERO_SLIDER_DECOR_MESHES.forEach((meshName) => {
    visibility.set(meshName, false);
  });

  HERO_SLIDER_DECOR_VISIBLE_MESHES.forEach((meshName) => {
    visibility.set(meshName, state.decor === "decorOn");
  });

  const activeArmchairMeshes = new Set(HERO_SLIDER_ARMCHAIR_MESHES[state.armchair]);
  Object.values(HERO_SLIDER_ARMCHAIR_MESHES).forEach((meshNames) => {
    meshNames.forEach((meshName) => {
      visibility.set(meshName, activeArmchairMeshes.has(meshName));
    });
  });

  return visibility;
}

export function updateHeroSliderVariant(
  state: HeroSliderState,
  groupId: HeroSliderGroupId,
  value: HeroSliderValue,
): HeroSliderState {
  return { ...state, [groupId]: value } as HeroSliderState;
}
