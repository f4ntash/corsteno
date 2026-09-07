"use client";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
export default function CapabilityPageTracking({ capability }: { capability: string }) {
  useEffect(() => { trackEvent("capability_page_view", { capability, location: "capability_page" }); }, [capability]);
  return null;
}
