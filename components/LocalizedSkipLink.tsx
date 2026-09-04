"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { enHome } from "@/lib/i18n/en/home";
import { esHome } from "@/lib/i18n";

export default function LocalizedSkipLink() {
  const pathname = usePathname();
  const englishHome = /\/en\/?$/.test(pathname);
  const dictionary = englishHome ? enHome : esHome;
  useEffect(() => {
    document.documentElement.lang = dictionary.htmlLang;
  }, [dictionary.htmlLang]);
  return <a className="skip-link" href="#main-content">{dictionary.skipLink}</a>;
}
