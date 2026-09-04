import CommercialIntro from "@/components/CommercialIntro";
import Navigation from "@/components/Navigation";
import ContactSection from "@/components/organisms/ContactSection";
import Team from "@/components/Team";
import ConnectedSystemSection from "./ConnectedSystemSection";
import DigitalLayerSection from "./DigitalLayerSection";
import InteractiveDemoSection from "./InteractiveDemoSection";
import ProductDataSection from "./ProductDataSection";
import SelectedWorkSection from "./SelectedWorkSection";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import type { HomeDictionary, Locale } from "@/lib/i18n";
import Testimonials from "@/components/Testimonials";

export default function HomePage({ locale, dictionary }: { locale: Locale; dictionary: HomeDictionary }) {
  return <>
    <JsonLd data={organizationJsonLd(locale, dictionary.seo.description)} />
    <Navigation home locale={locale} dictionary={dictionary} />
    <main id="main-content" lang={dictionary.htmlLang}>
      <CommercialIntro dictionary={dictionary} locale={locale} />
      <SelectedWorkSection dictionary={dictionary} />
      <InteractiveDemoSection dictionary={dictionary} locale={locale} />
      <ConnectedSystemSection dictionary={dictionary} />
      <DigitalLayerSection dictionary={dictionary} />
      <ProductDataSection dictionary={dictionary} />
      <Team dictionary={dictionary} />
      <Testimonials />
      <ContactSection dictionary={dictionary} locale={locale} />
    </main>
  </>;
}
