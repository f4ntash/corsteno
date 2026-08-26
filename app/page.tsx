import CommercialIntro from "@/components/CommercialIntro";
import Contact from "@/components/Contact";
import MobileCTA from "@/components/MobileCTA";
import Navigation from "@/components/Navigation";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import ConnectedSystemSection from "@/components/home/ConnectedSystemSection";
import InteractiveDemoSection from "@/components/home/InteractiveDemoSection";
import ProductDataSection from "@/components/home/ProductDataSection";
import SelectedWorkSection from "@/components/home/SelectedWorkSection";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Navigation home />
      <main id="main-content">
        <CommercialIntro />
        <InteractiveDemoSection />
        <ConnectedSystemSection />
        <ProductDataSection />
        <SelectedWorkSection />
        <Team />
        <Testimonials />
        <Contact />
      </main>
      <MobileCTA />
    </>
  );
}
