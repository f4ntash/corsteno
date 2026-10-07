// Nombres visibles (en español) de las cámaras y luces del modelo.
// "Camera_Stairs" → "Cámara Escaleras", "Light_Bathroom" → "Luz Baño", etc.
// Las palabras que no estén en esta lista se muestran tal cual (con la primera letra en mayúscula):
// para traducir una nueva, solo hay que agregarla acá.
const WORDS: Record<string, string> = {
  camera: "Cámara",
  light: "Luz",
  initial: "Inicial",
  inicial: "Inicial",
  stairs: "Escaleras",
  staircase: "Escaleras",
  outdoor: "Exterior",
  outside: "Exterior",
  exterior: "Exterior",
  interior: "Interior",
  indoor: "Interior",
  kitchen: "Cocina",
  bathroom: "Baño",
  bedroom: "Dormitorio",
  living: "Living",
  livingroom: "Living",
  dining: "Comedor",
  diningroom: "Comedor",
  hall: "Pasillo",
  hallway: "Pasillo",
  entrance: "Entrada",
  entry: "Entrada",
  terrace: "Terraza",
  balcony: "Balcón",
  garden: "Jardín",
  patio: "Patio",
  garage: "Garaje",
  laundry: "Lavadero",
  office: "Oficina",
  roof: "Techo",
  top: "Terraza",
  base: "Base",
  main: "Principal",
  front: "Frente",
  back: "Fondo",
  floor: "Piso",
  first: "Primer",
  second: "Segundo",
  third: "Tercer",
  ceiling: "Techo",
  lamp: "Lámpara",
  spot: "Spot",
  table: "Mesa",
  night: "Noche",
  day: "Día",
  desk: "Escritorio",
  fireplace: "Chimenea",
  desktop: "Escritorio",
};

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export function displayName(name: string): string {
  return name
    // Duplicados que agrega el visor ("Light_Kitchen#1" → segunda luz) o Blender ("Light_Kitchen.001")
    .replace(/#(\d+)$/, (_match, n: string) => ` ${Number(n) + 1}`)
    .replace(/\.0*(\d+)$/, " $1")
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => WORDS[word.toLowerCase()] ?? capitalize(word))
    .join(" ");
}
