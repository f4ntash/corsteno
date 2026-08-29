export type ExteriorHouseCascade = "marble" | "stone" | "whiteStone";
export type ExteriorHouseInterior = "aqua" | "dark" | "jade";
export type ExteriorHouseExterior = "white" | "colorado" | "wood";

export type ExteriorHouseState = {
  water: boolean;
  cascade: ExteriorHouseCascade;
  interior: ExteriorHouseInterior;
  exterior: ExteriorHouseExterior;
  borderColor: string;
};

export type ExteriorHouseOptionGroupId = "cascade" | "interior" | "exterior";
export type ExteriorHouseOptionValue =
  | ExteriorHouseCascade
  | ExteriorHouseInterior
  | ExteriorHouseExterior;

export type ExteriorHouseOption = {
  id: string;
  label: string;
  value: ExteriorHouseOptionValue;
  description: string;
  details: Array<{ label: string; value: string }>;
};

export type ExteriorHouseOptionGroup = {
  id: ExteriorHouseOptionGroupId;
  label: string;
  options: ExteriorHouseOption[];
};

export const EXTERIOR_HOUSE_MESHES = {
  water: ["agua_cascada", "agua_superficie"],
  cascade: {
    marble: "Cascada_Marmol",
    stone: "Cascada_Piedra",
    whiteStone: "Cascada_PiedraBlanca",
  },
  border: "Pileta_Borde",
  interior: {
    aqua: "Pileta_Interior_Aqua",
    dark: "Pileta_Interior_Dark",
    jade: "Pileta_Interior_Jade",
  },
  exterior: {
    white: "Pileta_Piso_Exterior_Blanco",
    colorado: "Pileta_Piso_Exterior_Colorado",
    wood: "Pileta_Piso_Exterior_Madera",
  },
} as const;

export const EXTERIOR_HOUSE_REQUIRED_MESHES = [
  ...EXTERIOR_HOUSE_MESHES.water,
  ...Object.values(EXTERIOR_HOUSE_MESHES.cascade),
  EXTERIOR_HOUSE_MESHES.border,
  ...Object.values(EXTERIOR_HOUSE_MESHES.interior),
  ...Object.values(EXTERIOR_HOUSE_MESHES.exterior),
] as const;

export const EXTERIOR_HOUSE_GROUPS: ExteriorHouseOptionGroup[] = [
  {
    id: "cascade",
    label: "Cascada",
    options: [
      {
        id: "marble",
        label: "Mármol",
        value: "marble",
        description: "Terminación de mármol incluida para la pieza de cascada.",
        details: [{ label: "Terminación", value: "Mármol" }, { label: "Aplicación", value: "Cascada" }],
      },
      {
        id: "stone",
        label: "Piedra",
        value: "stone",
        description: "Terminación de piedra incluida para la pieza de cascada.",
        details: [{ label: "Terminación", value: "Piedra" }, { label: "Aplicación", value: "Cascada" }],
      },
      {
        id: "whiteStone",
        label: "Piedra Blanca",
        value: "whiteStone",
        description: "Terminación de piedra blanca incluida para la pieza de cascada.",
        details: [{ label: "Terminación", value: "Piedra Blanca" }, { label: "Aplicación", value: "Cascada" }],
      },
    ],
  },
  {
    id: "interior",
    label: "Interior",
    options: [
      {
        id: "aqua",
        label: "Aqua",
        value: "aqua",
        description: "Revestimiento Aqua aplicado al interior de la pileta.",
        details: [{ label: "Terminación", value: "Aqua" }, { label: "Aplicación", value: "Interior" }],
      },
      {
        id: "dark",
        label: "Dark",
        value: "dark",
        description: "Revestimiento oscuro aplicado al interior de la pileta.",
        details: [{ label: "Terminación", value: "Dark" }, { label: "Aplicación", value: "Interior" }],
      },
      {
        id: "jade",
        label: "Jade",
        value: "jade",
        description: "Revestimiento Jade aplicado al interior de la pileta.",
        details: [{ label: "Terminación", value: "Jade" }, { label: "Aplicación", value: "Interior" }],
      },
    ],
  },
  {
    id: "exterior",
    label: "Exterior",
    options: [
      {
        id: "white",
        label: "Blanco",
        value: "white",
        description: "Piso exterior blanco incluido en el modelo.",
        details: [{ label: "Terminación", value: "Blanco" }, { label: "Aplicación", value: "Piso exterior" }],
      },
      {
        id: "colorado",
        label: "Colorado",
        value: "colorado",
        description: "Piso exterior Colorado incluido en el modelo.",
        details: [{ label: "Terminación", value: "Colorado" }, { label: "Aplicación", value: "Piso exterior" }],
      },
      {
        id: "wood",
        label: "Madera",
        value: "wood",
        description: "Piso exterior de madera incluido en el modelo.",
        details: [{ label: "Terminación", value: "Madera" }, { label: "Aplicación", value: "Piso exterior" }],
      },
    ],
  },
];

export const DEFAULT_EXTERIOR_HOUSE_STATE: ExteriorHouseState = {
  water: true,
  cascade: "marble",
  interior: "aqua",
  exterior: "white",
  borderColor: "#ffffff",
};

export function getExteriorHouseVisibility(state: ExteriorHouseState) {
  const visibility = new Map<string, boolean>();

  EXTERIOR_HOUSE_MESHES.water.forEach((meshName) => visibility.set(meshName, state.water));

  const groups = [
    [Object.values(EXTERIOR_HOUSE_MESHES.cascade), EXTERIOR_HOUSE_MESHES.cascade[state.cascade]],
    [Object.values(EXTERIOR_HOUSE_MESHES.interior), EXTERIOR_HOUSE_MESHES.interior[state.interior]],
    [Object.values(EXTERIOR_HOUSE_MESHES.exterior), EXTERIOR_HOUSE_MESHES.exterior[state.exterior]],
  ] as const;

  groups.forEach(([meshNames, selectedMeshName]) => {
    meshNames.forEach((meshName) => visibility.set(meshName, meshName === selectedMeshName));
  });

  return visibility;
}

export function updateExteriorHouseOption(
  state: ExteriorHouseState,
  groupId: ExteriorHouseOptionGroupId,
  value: ExteriorHouseOptionValue,
) {
  return { ...state, [groupId]: value } as ExteriorHouseState;
}
