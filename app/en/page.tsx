import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";
import { getDictionary } from "@/lib/i18n";
import { homeMetadata } from "@/lib/seo";

export const metadata: Metadata = homeMetadata("en");

export default async function EnglishHome() {
  return <HomePage locale="en" dictionary={await getDictionary("en")} />;
}
