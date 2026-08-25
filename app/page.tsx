import Capabilities from "@/components/Capabilities";
import CommercialIntro from "@/components/CommercialIntro";
import Contact from "@/components/Contact";
import MobileCTA from "@/components/MobileCTA";
import Navigation from "@/components/Navigation";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import JsonLd from "@/components/seo/JsonLd";
import Workspace from "@/components/workspace/Workspace";
import { organizationJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Navigation />
      <main>
        <CommercialIntro />
        <Workspace />
        <Capabilities />
        <Team />
        <Testimonials />
        <Contact />
      </main>
      <MobileCTA />
    </>
  );
}
