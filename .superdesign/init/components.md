# Components

## Capabilities
Source: `components/Capabilities.tsx`

```tsx
"use client";

import { useState } from "react";

const capabilities = [
  { id: "3d", label: "3D interactivo", items: "Configuradores · Visualizadores · Producto · Espacios" },
  { id: "web", label: "Web", items: "Sitios · Interfaces · Aplicaciones" },
  { id: "sistemas", label: "Sistemas", items: "Herramientas · Integraciones · Experiencias a medida" },
];

export default function Capabilities() {
  const [active, setActive] = useState(capabilities[0]);
  return (
    <section className="capabilities" id="capacidades" data-od-id="capacidades">
      <header className="cap-head">
        <span className="label">Capacidades</span>
        <span className="meta">Herramientas / 01—03</span>
      </header>
      <div className="cap-menu" role="tablist" aria-label="Capacidades de Corsteno">
        {capabilities.map((capability) => (
          <button key={capability.id} className="cap-button" type="button" role="tab"
            aria-selected={active.id === capability.id} aria-controls="cap-output"
            aria-pressed={active.id === capability.id} onClick={() => setActive(capability)}>
            {capability.label}
          </button>
        ))}
      </div>
      <div className="cap-output" id="cap-output" role="tabpanel" aria-live="polite">{active.items}</div>
    </section>
  );
}
```

## Contact
Source: `components/Contact.tsx`

```tsx
export default function Contact() {
  return (
    <section className="contact dark" id="contacto" data-od-id="contacto">
      <h2 data-od-id="contacto-titulo">¿Qué querés construir?</h2>
      <div className="contact-action">
        <span>Canal comercial pendiente de verificación.</span>
      </div>
      <footer className="contact-footer">
        <span className="meta">Corsteno · Argentina</span>
        <span className="meta">3D · Web · Sistemas</span>
      </footer>
    </section>
  );
}
```

## Workspace composition
The current home uses `Workspace`, `H2OScene`, `TerrambuScene`, `ProductScene`, `DigitalSystemScene`, `ProjectIndex`, and `ContextCursor`. The workspace is a 520vh scroll area with a sticky viewport and four absolutely layered scenes. This system remains untouched by the cinematic experiment.
