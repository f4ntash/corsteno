"use client";

import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/assetPath";
import { enHome } from "@/lib/i18n/en/home";
import { esHome } from "@/lib/i18n";

export default function FloatingContactCTA() {
  const pathname = usePathname();
  const english = pathname === "/en" || pathname.startsWith("/en/");
  const dictionary = english ? enHome : esHome;
  return (
    <a
      className="floating-contact-cta"
      href={`${withBasePath(english ? "/en/" : "/")}#contacto`}
      data-analytics="cta"
    >
      {dictionary.floatingContact}
    </a>
  );
}
