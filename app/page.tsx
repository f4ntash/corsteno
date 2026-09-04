import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";
import { getDictionary } from "@/lib/i18n";
import { homeMetadata } from "@/lib/seo";

export const metadata: Metadata = homeMetadata("es");

export default async function Home() {
  return <HomePage locale="es" dictionary={await getDictionary("es")} />;
}
