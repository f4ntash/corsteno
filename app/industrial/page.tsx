import type { Metadata } from "next";
import IndustrialExperience from "@/components/industrial/IndustrialExperience";

export const metadata: Metadata = {
  title: "Industrial Concept | Corsteno",
  description: "Concepto experimental de experiencias digitales para productos físicos.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
  },
};

export default function IndustrialPage() {
  return <IndustrialExperience />;
}
