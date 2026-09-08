import { useRef } from "react";
import useCornerPin from "./useCornerPin";
const fondo = "/web-experiences-hero/fondo.png";
const mockup = "/projects/terrambu-hotel-web-960.webp";

// Exact corners of the white screen inside fondo.png, measured in pixels
// on the original 1672x941 file and expressed as fractions (0..1) so they
// stay correct at any render size. If you swap in a different fondo.png,
// re-measure these four points against the new image.
const SCREEN_CORNERS = {
  tl: { x: 551 / 1672, y: 212 / 941 },
  tr: { x: 1520 / 1672, y: 210 / 941 },
  br: { x: 1519 / 1672, y: 692 / 941 },
  bl: { x: 551 / 1672, y: 654 / 941 },
};

// Fixed working size for the flat mockup image before it gets warped.
// Keep this near the screen's own aspect ratio (~2.05:1).
const SOURCE = { w: 1000, h: 477 };

export default function Hero({ eyebrow = "Experiencias web", title = ["Experiencias", "web"], intro = ["Tu negocio puede", "verse tan bien como", "realmente es."], href = "#terrambu", alt = "Vista previa del sitio Terrambú proyectada en la pantalla" }) {
  const stageRef = useRef(null);
  const transform = useCornerPin(stageRef, SCREEN_CORNERS, SOURCE);

  return (
    <section className="hero">
      <div className="hero__stage">
        <div className="hero__photo" ref={stageRef}>
          <img className="hero__bg" src={fondo} alt="" draggable="false" />
          <img
            className="hero__mockup"
            src={mockup}
            alt={alt}
            style={{ transform, width: SOURCE.w, height: SOURCE.h }}
            draggable="false"
          />
        </div>

        <div className="hero__nav">
          <span className="hero__brand">Corsteno</span>
          <span className="hero__crumb">servicios / desarrollo&nbsp;web</span>
          <span className="hero__tag">Estudio digital boutique</span>
        </div>

        <div className="hero__copy">
          <p className="hero__kicker">{eyebrow}</p>
          <h1 className="hero__title">
            {title[0]}{" "}
            <br />
            {title[1]}
          </h1>
          <p className="hero__lead">
            {intro.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}
          </p>
          <a className="hero__link" href={href}>
            <span className="hero__index">01</span>
            <span>Terrambú — ver proyecto</span>
            <span className="hero__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      {/* /.hero__stage */}
    </section>
  );
}
