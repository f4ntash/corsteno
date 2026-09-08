import { readFileSync } from "node:fs";
import { join } from "node:path";
import WebExperiencesHeroClientAdapter from "./WebExperiencesHeroClientAdapter";

const heroCss = `${readFileSync(join(process.cwd(), "components/web-experiences/hero-runtime/Hero.css"), "utf8")}
.hero__photo::after{content:"";position:absolute;inset:0;z-index:1.5;background:rgba(0,0,0,.68);pointer-events:none}
.hero__stage{height:min(calc(100svh - 76px),1200px);min-height:700px;max-height:1200px;overflow:hidden}
.hero__photo{height:100%;aspect-ratio:auto}
.hero__bg{object-position:center 56%;filter:brightness(.82)}
.hero__title{font-size:clamp(3.9rem,7vw,7.9rem);max-width:34%;line-height:.94}
.hero__mockup{filter:saturate(0.5) brightness(0.7) contrast(1.06);clip-path:inset(0 1.8% 0 0);-webkit-mask-image:radial-gradient(ellipse at center,#000 87%,rgba(0,0,0,.88) 96%,transparent 100%);mask-image:radial-gradient(ellipse at center,#000 87%,rgba(0,0,0,.88) 96%,transparent 100%)}
@media(max-width:720px){.hero__stage{height:auto;min-height:0;max-height:none}.hero__bg{object-position:center 52%}.hero__title{font-size:clamp(2.6rem,13vw,3.4rem)}}`;

export default function WebExperiencesHeroServerAdapter(props: Record<string, unknown>) {
  return <><style dangerouslySetInnerHTML={{ __html: heroCss }} /><WebExperiencesHeroClientAdapter {...props} /></>;
}
