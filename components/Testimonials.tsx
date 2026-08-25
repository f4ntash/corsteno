import { testimonials } from "@/lib/content";

export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="testimonials" aria-labelledby="testimonials-title" data-navbar-theme="light">
      <header>
        <span className="label">Experiencias de clientes</span>
        <h2 id="testimonials-title">Lo que dicen quienes trabajaron con nosotros.</h2>
      </header>
      <div className="testimonial-list">
        {testimonials.map((testimonial) => (
          <figure key={`${testimonial.company}-${testimonial.name}`}>
            <blockquote>{testimonial.quote}</blockquote>
            <figcaption>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role} · {testimonial.company}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
