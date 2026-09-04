import Eyebrow from "@/components/atoms/Eyebrow";
import { teamMembers } from "@/lib/content";
import type { HomeDictionary } from "@/lib/i18n";

export default function Team({ dictionary: t }: { dictionary: HomeDictionary }) {
  return (
    <section className="team" id="equipo" aria-labelledby="team-title" data-navbar-theme="light" data-nav-section="soluciones">
      <header className="team-head">
        <Eyebrow className="label">{t.team.eyebrow}</Eyebrow>
        <div>
          <h2 id="team-title">{t.team.title}</h2>
          {t.team.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </header>
      <div className="team-list">
        {teamMembers.map((member, index) => (
          <article className="team-member" key={member.name}>
            <span className="cap-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{member.name}</h3>
              <p className="team-role">{t.team.roles[index].role}</p>
              <p className="team-specialties">{t.team.roles[index].specialties}</p>
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
