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
        label: "Madera Natural",
        value: "woodA",
        description: "Revestimiento de madera en tonos cálidos y naturales, ideal para aportar calidez y un estilo moderno y acogedor a la barra.",
        details: [{ label: "Terminación", value: "Natural" }, { label: "Aplicación", value: "Barra" }],
      },
      {
        id: "woodB",
        label: "Elegance",
        value: "woodB",
        description: "Madera de tonalidad media con una estética sofisticada y equilibrada, perfecta para ambientes contemporáneos y elegantes.",
        details: [{ label: "Terminación", value: "Madera Blanca" }, { label: "Aplicación", value: "Barra" }],
      },
      {
        id: "Mármol Premium",
        label: "Mármol",
        value: "marble",
        description: "Superficie de mármol de apariencia sofisticada que aporta elegancia, luminosidad y un acabado de alta gama.",
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
        label: "Laminado",
        value: "floorA",
        description: "Piso de instalación sencilla, aporta amplitud, luminosidad y una estética limpia.",
        details: [{ label: "Variante", value: "PVC" }, { label: "Aplicación", value: "Piso" }],
      },
      {
        id: "floorB",
        label: "Madera Parquet",
        value: "floorB",
        description: "Piso multicapa de maderas duras de fuentes sostenibles. En tonos naturales y cálidos, diseñado para un estilo atemporal.",
        details: [{ label: "Variante", value: "Madera" }, { label: "Aplicación", value: "Piso" }],
      },
      {
        id: "floorC",
        label: "Herringbone",
        value: "floorC",
        description: "Piso de madera en tonos profundos que aporta carácter, contraste y una sensación de sofisticación al espacio.",
        details: [{ label: "Variante", value: "Madera" }, { label: "Aplicación", value: "Piso" }],
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
        description: "Revestimiento de ladrillos en una combinación de tres tonalidades que aporta textura, personalidad y un marcado estilo arquitectónico.",
        details: [{ label: "Terminación", value: "Ladrillo" }, { label: "Aplicación", value: "Pared" }],
      },
      {
        id: "brick",
        label: "Ladrillo Visto Interior",
        value: "brick",
        description: "Revestimiento de ladrillo con una estética clásica y cálida, ideal para crear ambientes con carácter y textura.",
        details: [{ label: "Terminación", value: "Ladrillo Visto" }, { label: "Aplicación", value: "Pared" }],
      },
      {
        id: "black",
        label: "Latex Interior",
        value: "black",
        description: "Pintura para interiores de tono oscuro, apariencia sobria y con un contraste fuerte.",
        details: [{ label: "Terminación", value: "Pintura" }, { label: "Aplicación", value: "Pared" }],
      },
      {
        id: "stone",
        label: "Panel Poliuretano Rígido",
        value: "stone",
        description: "Las paneles de PU ofrecen la belleza natural con una instalacion limpia y sencilla.",
        details: [{ label: "Terminación", value: "Poliuretano" }, { label: "Aplicación", value: "Pared" }],
      },
    ],
  },
  {
    id: "opening",
    label: "Aberturas",
    options: [
      {
        id: "windowA",
        label: "Negro Mate",
        value: "windowA",
        description: "Aberturas en negro de estética moderna y elegante, ideales para generar contraste y definir visualmente el espacio.",
        details: [{ label: "Variante", value: "Negro Mate" }, { label: "Aplicación", value: "Abertura" }],
      },
      {
        id: "windowB",
        label: "Blanco Brillante",
        value: "windowB",
        description: "Acabado laqueado, color blanco brillante.",
        details: [{ label: "Variante", value: "Metalico Brillante" }, { label: "Aplicación", value: "Abertura" }],
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
