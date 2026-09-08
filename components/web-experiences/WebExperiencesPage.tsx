import JsonLd from "@/components/seo/JsonLd";
import Navigation from "@/components/Navigation";
import type { Locale } from "@/lib/i18n";
import { site, canonicalUrl, breadcrumbJsonLd, organizationJsonLd, serviceJsonLd, faqJsonLd, type SeoPage } from "@/lib/seo";
import { localizedRoutes } from "@/lib/i18n/routes";
import CapabilityPageTracking from "@/components/analytics/CapabilityPageTracking";
import WebExperiencesHeroExperimental from "./WebExperiencesHeroExperimental";
import ProjectEditorialSection from "./ProjectEditorialSection";
import MapaPunillaEditorialSection from "./MapaPunillaEditorialSection";
import FinalContactEditorialSection from "./FinalContactEditorialSection";
import styles from "./webExperiencesPage.module.css";
type Props={page:SeoPage&Partial<{spanishPath:string;englishPath:string}>;locale:Locale};
export default function WebExperiencesPage({page,locale}:Props){
  const en=locale==="en",base=site.basePath;
  const c=en?{home:"Home",services:"Services",eyebrow:"Web experiences",title:["WEB","EXPERIENCES"],intro:["Your business can","look as good as","it really is."],view:"View project"}:{home:"Inicio",services:"Servicios",eyebrow:"Experiencias Web",title:["EXPERIENCIAS","WEB"],intro:["Tu negocio puede","verse tan bien como","realmente es."],view:"Ver proyecto"};
  const terr=`${base}${localizedRoutes.projects.terrambu[locale]}`;
  const mapa=`${base}${localizedRoutes.projects["mapa-punilla"][locale]}`;
  const contactHref=`${base}/${en?"en/":""}#contacto`;
  const crumb=[{label:c.home,href:`${base}/${en?"en/":""}`},{label:c.services,href:`${base}/${en?"en/services/":"servicios/"}`},{label:page.h1,href:canonicalUrl(page.path)}];
  return <>
    <Navigation locale={locale} languageHref={en?page.spanishPath:page.englishPath}/>
    <JsonLd data={organizationJsonLd(locale)}/><JsonLd data={serviceJsonLd(page)}/><JsonLd data={faqJsonLd(page.faqs)}/><JsonLd data={breadcrumbJsonLd(crumb)}/>
    <CapabilityPageTracking capability="web_experiences"/>
    <main id="main-content" className={styles.page}>
      <div className={styles.content}>
        <WebExperiencesHeroExperimental base={base} href={terr} eyebrow={c.eyebrow} title={c.title} intro={c.intro} cta={c.view} alt={en?"Terrambú website project":"Proyecto web Terrambú"}/>
        <ProjectEditorialSection image={`${base}/projects/terrambu-hotel-web.webp`} imageAlt={en?"Terrambú website project":"Proyecto web Terrambú"}/>
        <MapaPunillaEditorialSection href={mapa} image={`${base}/projects/mapa-punilla-web.webp`} imageAlt="Proyecto web Mapa Punilla"/>
        <FinalContactEditorialSection href={contactHref}/>
      </div>
    </main>
  </>;
}
