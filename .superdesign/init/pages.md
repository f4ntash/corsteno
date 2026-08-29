# Pages

## `/` Home
Entry: `app/page.tsx`

Dependencies:
- `components/Navigation.tsx`
- `components/workspace/Workspace.tsx`
  - `components/workspace/ContextCursor.tsx`
  - `components/workspace/InteriorFinishesScene.tsx`
    - `components/three/InteriorFinishesViewer.tsx`
    - `components/three/interiorFinishVariants.ts`
  - `components/workspace/TerrambuScene.tsx`
  - `components/workspace/DigitalSystemScene.tsx`
  - `components/workspace/workspaceData.ts`
- `components/home/SelectedWorkSection.tsx`
- `components/Contact.tsx`
- `styles/globals.css`
- `styles/workspace.module.css`

## `/experiments/cinematic-home`
New target. Planned dependencies:
- server `page.tsx` with route metadata
- one client experience shell for scroll progress and HTML overlays
- one R3F canvas/world component
- route-scoped CSS module
