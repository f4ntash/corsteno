import { esHome } from "./es/home";

type DeepWiden<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly DeepWiden<U>[] : T extends object ? { readonly [K in keyof T]: DeepWiden<T[K]> } : T;
export type HomeDictionary = DeepWiden<typeof esHome>;
export type Locale = "es" | "en";

export async function getDictionary(locale: Locale): Promise<HomeDictionary> {
  if (locale === "en") return (await import("./en/home")).enHome;
  return esHome;
}

export { esHome };
export { localizedRoutes, homePath, serviceRoute, sectorRoute } from "./routes";
