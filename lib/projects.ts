import projectRegistryData from "@/data/project-registry.json";

export type ProjectKind = "client-work" | "corsteno-lab";

export type GeneratedProjectCopy = {
  name: string;
  cardDescription: string;
  description: string;
  challengeTitle: string;
  challengeBody: string;
  solutionTitle: string;
  solutionBody: string;
};

export type GeneratedProject = {
  internalName: string;
  slug: string;
  enSlug: string;
  kind: ProjectKind;
  image: string;
  imageAlt: { es: string; en: string };
  liveUrl: string | null;
  seo: {
    es: { title: string; keywords: string[] };
    en: { title: string; keywords: string[] };
  };
  copy: { es: GeneratedProjectCopy; en: GeneratedProjectCopy };
};

type ProjectRegistry = {
  homeOrder: string[];
  projects: GeneratedProject[];
};

export const projectRegistry = projectRegistryData as ProjectRegistry;
export const projectHomeOrder = projectRegistry.homeOrder;
export const generatedProjects = projectRegistry.projects;
