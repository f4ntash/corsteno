"use client";

// @ts-expect-error The supplied immutable JSX source has no local declaration file.
import Hero from "./hero-runtime/Hero";

export default function WebExperiencesHeroClientAdapter(props: Record<string, unknown>) {
  return <Hero {...props} />;
}
