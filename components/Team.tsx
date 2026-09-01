import Eyebrow from "@/components/atoms/Eyebrow";
import { teamMembers } from "@/lib/content";

export default function Team() {
  return (
    <section className="team" id="equipo" aria-labelledby="team-title" data-navbar-theme="light">
      <header className="team-head">
        <Eyebrow className="label">Quiénes somos</Eyebrow>
        <div>
          <h2 id="team-title">Un estudio tecnológico argentino.</h2>
          <p>
            Somos un estudio tecnológico argentino especializado en desarrollo web, experiencias digitales y
            visualización interactiva 3D.
          </p>
          <p>
            Diseñamos y desarrollamos herramientas que ayudan a empresas a mostrar, explicar y presentar mejor sus
            productos y servicios.
          </p>
        </div>
      </header>
      <div className="team-list">
        {teamMembers.map((member, index) => (
          <article className="team-member" key={member.name}>
            <span className="cap-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-specialties">{member.specialties}</p>
              {member.linkedinUrl ? (
                <a href={member.linkedinUrl} target="_blank" rel="noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
