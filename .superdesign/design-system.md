# Corsteno Cinematic Study

## Intent
Boutique architecture studio, premium editorial catalogue, cinematic 3D experience, invisible technology. The experience is continuous rather than a sequence of conventional landing-page sections.

## Palette
- Warm graphite: `#0b0c0b`
- Deep stone: `#151613`
- Soft bone: `#e7e3da`
- Muted limestone: `#a7a197`
- Architectural plaster: `#c8c2b6`
- Brushed metal: `#4b4a45`
- Restrained practical amber: `#d49a54`

## Typography
Use the existing Helvetica Neue / Helvetica / Arial stack. Display lines are large, light, and tightly composed without viewport-scaled font calculations. Metadata is 10–11px uppercase with generous tracking. Important copy remains selectable HTML above WebGL.

## Composition
One fixed fullscreen Canvas behind three 100svh narrative sections. Every shot contains foreground occlusion, a primary subject, and a receding background. UI is sparse and aligned to a disciplined gutter. No cards, service grids, large CTA buttons, rounded containers, or decorative gradients.

## Motion
Scroll maps to a continuous 0–1 progress value. Camera position, target, and FOV interpolate between authored keyframes. Objects provide natural wipes. Idle motion is limited to subtle light breathing, object drift, and camera sway. Reduced-motion users receive stable authored shots.

## Lighting and material
Architectural side light, near-zero fill, selective rim light, deep shadow, subtle fog. Materials prioritize plaster, stone, brushed metal, and translucent/emissive glass with controlled roughness. Postprocessing is optional and must remain restrained.

## Responsive
Desktop uses the full camera choreography. Mobile keeps the narrative and hierarchy with simplified camera paths, larger subjects, lower DPR, and reduced geometry. No horizontal overflow.
