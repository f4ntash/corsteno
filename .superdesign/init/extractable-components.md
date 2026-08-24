# Extractable Components

## Navigation
- Source: `components/Navigation.tsx`
- Category: layout
- Description: Fixed Corsteno navigation for the existing light/dark workspace.
- Extractable props: activeItem, dark, compact
- Hardcoded: Corsteno wordmark, Trabajo/Capacidades/Contacto labels, CSS classes.

## Contact
- Source: `components/Contact.tsx`
- Category: layout
- Description: Existing full-width dark contact section.
- Extractable props: none
- Hardcoded: title, email, footer labels.

These components are intentionally not reused in the isolated cinematic experiment because that route needs its own fullscreen composition and must not alter the approved V4 home.
