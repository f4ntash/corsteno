export type WindowModel = "single" | "double" | "triple";
export type FrameColor = "black" | "white" | "aluminum" | "graphite";
export type GlassType = "single" | "double" | "laminated";
export type OpeningType = "fixed" | "sliding" | "casement";

export type WindowConfiguration = {
  model: WindowModel;
  width: number;
  height: number;
  frameColor: FrameColor;
  glassType: GlassType;
  opening: OpeningType;
  mosquitoNet: boolean;
  blind: boolean;
  security: boolean;
};

export const DEFAULT_WINDOW_CONFIGURATION: WindowConfiguration = {
  model: "double",
  width: 1800,
  height: 1400,
  frameColor: "graphite",
  glassType: "double",
  opening: "sliding",
  mosquitoNet: false,
  blind: false,
  security: false,
};

export const WINDOW_LABELS = {
  model: {
    single: "Simple",
    double: "Doble",
    triple: "Triple",
  },
  frameColor: {
    black: "Negro",
    white: "Blanco",
    aluminum: "Aluminio",
    graphite: "Grafito",
  },
  glassType: {
    single: "Simple",
    double: "DVH",
    laminated: "Laminado",
  },
  opening: {
    fixed: "Fija",
    sliding: "Corrediza",
    casement: "Batiente",
  },
} as const;
