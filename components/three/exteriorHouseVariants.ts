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
        label: "Travertino Pulido",
        value: "marble",
        description: "Acabado suave al tacto, donde los poros naturales han sido sellados para ofrecer una superficie elegante",
        details: [{ label: "Terminación", value: "Mármol Travertino" }, { label: "Aplicación", value: "Cascada" }],
      },
      {
        id: "stone",
        label: "Piedra",
        value: "stone",
        description: "Panel de piedra natural de aspecto realista y colocacion sencilla.",
        details: [{ label: "Terminación", value: "Natural" }, { label: "Aplicación", value: "Cascada" }],
      },
      {
        id: "whiteStone",
        label: "Mix Arena",
        value: "whiteStone",
        description: "Terminacion de ladrillos de piedra tricolor, facil de combinar.",
        details: [{ label: "Terminación", value: "Ladrillo Tricolor" }, { label: "Aplicación", value: "Cascada" }],
      },
    ],
  },
  {
    id: "interior",
    label: "Interior",
    options: [
      {
        id: "aqua",
        label: "Venecita Cyan",
        value: "aqua",
        description: "Venecita sin bordes, no raspa, no se raya y no se mancha. Ideal para el interior de la pileta.",
        details: [{ label: "Terminación", value: "Color: Aqua" }, { label: "Aplicación", value: "Interior" }],
      },
      {
        id: "dark",
        label: "Mix Dark Volcano",
        value: "dark",
        description: "Revestimiento de tonos oscuros y entramado complejo.",
        details: [{ label: "Terminación", value: "Color: Dark" }, { label: "Aplicación", value: "Interior" }],
      },
      {
        id: "jade",
        label: "Mosaicos Jade",
        value: "jade",
        description: "Revestimiento de mosaicos perfeccionados para aplicacion en profundidad.",
        details: [{ label: "Terminación", value: "Color: Jade" }, { label: "Aplicación", value: "Interior" }],
      },
    ],
  },
  {
    id: "exterior",
    label: "Exterior",
    options: [
      {
        id: "white",
        label: "Eucalipto",
        value: "white",
        description: "Deck de madera blanca maciza de eucalipto, eco friendly, para uso en seco.",
        details: [{ label: "Terminación", value: "Eucalipto" }, { label: "Aplicación", value: "Deck Exterior" }],
      },
      {
        id: "colorado",
        label: "Colorado",
        value: "colorado",
        description: "Simil madera de WPC (wood plastic composite). Superficie totalmente impermeable.",
        details: [{ label: "Terminación", value: "WPC" }, { label: "Aplicación", value: "Deck Exterior" }],
      },
      {
        id: "wood",
        label: "Madera",
        value: "wood",
        description: "Deck especializado, tonos calidos y superficie resistente a la humedad.",
        details: [{ label: "Terminación", value: "Natural" }, { label: "Aplicación", value: "Deck Exterior" }],
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
