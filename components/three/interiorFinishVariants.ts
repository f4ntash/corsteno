export type InteriorBarFinish = "woodA" | "woodB" | "marble";
export type InteriorFloorFinish = "floorA" | "floorB" | "floorC";
export type InteriorWallFinish = "cartago" | "brick" | "black" | "stone";
export type InteriorOpening = "windowA" | "windowB";

export type InteriorFinishState = {
  bar: InteriorBarFinish;
  floor: InteriorFloorFinish;
  wall: InteriorWallFinish;
  opening: InteriorOpening;
};

export type InteriorFinishGroupId = keyof InteriorFinishState;
export type InteriorFinishValue = InteriorFinishState[InteriorFinishGroupId];

export type InteriorFinishOption = {
  id: string;
  label: string;
  value: InteriorFinishValue;
  description: string;
  details: Array<{ label: string; value: string }>;
};

export type InteriorFinishGroup = {
  id: InteriorFinishGroupId;
  label: string;
  options: InteriorFinishOption[];
};

export const INTERIOR_FINISH_MESHES = {
  bar: {
    woodA: "BARRA_MADERA_A",
    woodB: "BARRA_MADERA_B",
    marble: "BARRA_MARMOL",
  },
  floor: {
    floorA: "FLOOR_BASE_A",
    floorB: "FLOOR_BASE_B",
    floorC: "FLOOR_BASE_C",
  },
  wall: {
    cartago: "PARED_CARTAGO",
    brick: "PARED_LADRILLOS",
    black: "PARED_NEGRA",
    stone: "PARED_PIEDRA",
  },
  opening: {
    windowA: "ABERTURA_VENTANA_A",
    windowB: "ABERTURA_VENTANA_B",
  },
} as const;

export const INTERIOR_FINISH_GROUPS: InteriorFinishGroup[] = [
  {
    id: "bar",
    label: "Revestimiento de barra",
    options: [
      {
        id: "woodA",
        label: "Madera A",
        value: "woodA",
        description: "Primera variante de madera incluida para el revestimiento de la barra.",
        details: [{ label: "Terminación", value: "Madera A" }, { label: "Aplicación", value: "Barra" }],
      },
      {
        id: "woodB",
        label: "Madera B",
        value: "woodB",
        description: "Segunda variante de madera incluida para el revestimiento de la barra.",
        details: [{ label: "Terminación", value: "Madera B" }, { label: "Aplicación", value: "Barra" }],
      },
      {
        id: "marble",
        label: "Mármol",
        value: "marble",
        description: "Terminación de mármol incluida para el revestimiento de la barra.",
        details: [{ label: "Terminación", value: "Mármol" }, { label: "Aplicación", value: "Barra" }],
      },
    ],
  },
  {
    id: "floor",
    label: "Piso",
    options: [
      {
        id: "floorA",
        label: "Piso A",
        value: "floorA",
        description: "Primera variante de piso incorporada en el ambiente.",
        details: [{ label: "Variante", value: "Piso A" }, { label: "Aplicación", value: "Piso" }],
      },
      {
        id: "floorB",
        label: "Piso B",
        value: "floorB",
        description: "Segunda variante de piso incorporada en el ambiente.",
        details: [{ label: "Variante", value: "Piso B" }, { label: "Aplicación", value: "Piso" }],
      },
      {
        id: "floorC",
        label: "Piso C",
        value: "floorC",
        description: "Tercera variante de piso incorporada en el ambiente.",
        details: [{ label: "Variante", value: "Piso C" }, { label: "Aplicación", value: "Piso" }],
      },
    ],
  },
  {
    id: "wall",
    label: "Pared",
    options: [
      {
        id: "cartago",
        label: "Cartago",
        value: "cartago",
        description: "Revestimiento Cartago aplicado sobre las paredes del ambiente.",
        details: [{ label: "Terminación", value: "Cartago" }, { label: "Aplicación", value: "Pared" }],
      },
      {
        id: "brick",
        label: "Ladrillos",
        value: "brick",
        description: "Revestimiento de ladrillos aplicado sobre las paredes del ambiente.",
        details: [{ label: "Terminación", value: "Ladrillos" }, { label: "Aplicación", value: "Pared" }],
      },
      {
        id: "black",
        label: "Negra",
        value: "black",
        description: "Terminación negra aplicada sobre las paredes del ambiente.",
        details: [{ label: "Terminación", value: "Negra" }, { label: "Aplicación", value: "Pared" }],
      },
      {
        id: "stone",
        label: "Piedra",
        value: "stone",
        description: "Revestimiento de piedra aplicado sobre las paredes del ambiente.",
        details: [{ label: "Terminación", value: "Piedra" }, { label: "Aplicación", value: "Pared" }],
      },
    ],
  },
  {
    id: "opening",
    label: "Aberturas",
    options: [
      {
        id: "windowA",
        label: "Ventana A",
        value: "windowA",
        description: "Primera variante de abertura incluida en el ambiente.",
        details: [{ label: "Variante", value: "Ventana A" }, { label: "Aplicación", value: "Abertura" }],
      },
      {
        id: "windowB",
        label: "Ventana B",
        value: "windowB",
        description: "Segunda variante de abertura incluida en el ambiente.",
        details: [{ label: "Variante", value: "Ventana B" }, { label: "Aplicación", value: "Abertura" }],
      },
    ],
  },
];

export const DEFAULT_INTERIOR_FINISHES: InteriorFinishState = {
  bar: "woodA",
  floor: "floorA",
  wall: "cartago",
  opening: "windowA",
};

export function getInteriorFinishVisibility(state: InteriorFinishState) {
  const visibility = new Map<string, boolean>();
  const groups = [
    [Object.values(INTERIOR_FINISH_MESHES.bar), INTERIOR_FINISH_MESHES.bar[state.bar]],
    [Object.values(INTERIOR_FINISH_MESHES.floor), INTERIOR_FINISH_MESHES.floor[state.floor]],
    [Object.values(INTERIOR_FINISH_MESHES.wall), INTERIOR_FINISH_MESHES.wall[state.wall]],
    [Object.values(INTERIOR_FINISH_MESHES.opening), INTERIOR_FINISH_MESHES.opening[state.opening]],
  ] as const;

  groups.forEach(([meshNames, selectedMeshName]) => {
    meshNames.forEach((meshName) => visibility.set(meshName, meshName === selectedMeshName));
  });
  return visibility;
}

export function getInteriorFinishOption(group: InteriorFinishGroup, state: InteriorFinishState) {
  return group.options.find((option) => option.value === state[group.id]) ?? group.options[0];
}

export function updateInteriorFinish(
  state: InteriorFinishState,
  groupId: InteriorFinishGroupId,
  value: InteriorFinishValue,
): InteriorFinishState {
  return { ...state, [groupId]: value } as InteriorFinishState;
}
