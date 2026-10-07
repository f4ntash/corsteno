import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { isCameraName } from "./cameras";
import { blenderToThree, FALLBACK_LIGHTS, isLightName, LIGHT_DEFAULTS, LIGHT_INTENSITY, LIGHT_SHADOWS, type ModelLightEntry } from "./lights";
import { isLocked, parseName, type SectionEntry } from "./sections";

type SectionNodeEntry = SectionEntry & { node: THREE.Object3D };
type CameraNodeEntry = { key: string; label: string; object: THREE.Object3D; fov: number | null };
type LightNodeEntry = { key: string; label: string; node: THREE.Object3D };
type RigEntry = { key: string; light: THREE.Light; real: boolean; base: number };

function collectSections(root: THREE.Object3D): SectionNodeEntry[] {
  const found: SectionNodeEntry[] = [];
  const seen = new Map<string, number>();
  const visit = (object: THREE.Object3D) => {
    const original = object.userData?.name ?? object.name;
    const info = original ? parseName(original) : null;
    if (info && original) {
      const count = seen.get(original) ?? 0;
      seen.set(original, count + 1);
      found.push({
        key: count ? `${original}#${count}` : original,
        node: object,
        group: info.group,
        label: info.label,
        locked: isLocked(original, info.group),
      });
      return;
    }
    object.children.forEach(visit);
  };
  visit(root);
  return found;
}

function collectLightNodes(root: THREE.Object3D): LightNodeEntry[] {
  const found: LightNodeEntry[] = [];
  const seen = new Map<string, number>();
  const visit = (object: THREE.Object3D) => {
    const original = object.userData?.name ?? object.name;
    if (original && isLightName(original)) {
      const count = seen.get(original) ?? 0;
      seen.set(original, count + 1);
      found.push({ key: count ? `${original}#${count}` : original, node: object, label: original.replace(/_/g, " ") });
      return;
    }
    object.children.forEach(visit);
  };
  visit(root);
  return found.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}

function findLight(node: THREE.Object3D): THREE.Light | null {
  let found: THREE.Light | null = null;
  node.traverse((object) => {
    if (!found && (object as THREE.Light).isLight) found = object as THREE.Light;
  });
  return found;
}

function collectCameraNodes(root: THREE.Object3D): CameraNodeEntry[] {
  const found: CameraNodeEntry[] = [];
  const seen = new Map<string, number>();
  const visit = (object: THREE.Object3D) => {
    const original = object.userData?.name ?? object.name;
    if (original && isCameraName(original)) {
      let camera: THREE.Camera | undefined;
      object.traverse((child) => {
        if (!camera && (child as THREE.Camera).isCamera) camera = child as THREE.Camera;
      });
      const importedCamera = camera as THREE.Camera | undefined;
      const count = seen.get(original) ?? 0;
      seen.set(original, count + 1);
      const perspective = importedCamera && (importedCamera as THREE.PerspectiveCamera).isPerspectiveCamera
        ? importedCamera as THREE.PerspectiveCamera
        : null;
      found.push({
        key: count ? `${original}#${count}` : original,
        label: original.replace(/_/g, " "),
        object: importedCamera ?? object,
        fov: perspective?.fov ?? null,
      });
      return;
    }
    object.children.forEach(visit);
  };
  visit(root);
  return found.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}

export default function Model({
  url,
  scale = 1,
  hidden,
  onSections,
  lightsOff,
  onLights,
  onBounds,
  camerasRef,
  onCameras,
  lightsRef,
}: {
  url: string;
  scale?: number;
  hidden: Set<string>;
  onSections?: (sections: Omit<SectionEntry, "node">[]) => void;
  lightsOff: Set<string>;
  onLights?: (lights: ModelLightEntry[]) => void;
  onBounds?: (radius: number, height: number) => void;
  camerasRef: React.RefObject<Map<string, CameraNodeEntry>>;
  onCameras?: (cameras: { key: string; label: string }[]) => void;
  /** Registro de las luces (clave → luz) para poder dibujar un punto sobre cada una. */
  lightsRef?: React.RefObject<Map<string, THREE.Light>>;
}) {
  const { scene } = useGLTF(url);
  const sections = useMemo(() => collectSections(scene), [scene]);
  const lightNodes = useMemo(() => collectLightNodes(scene), [scene]);
  const rig = useRef<RigEntry[]>([]);

  const bounds = useMemo(() => {
    const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    const modelRadius = (size.length() / 2) * scale;
    const modelHeight = size.y * scale;
    return {
      radius: Number.isFinite(modelRadius) && modelRadius > 0 ? modelRadius : 8,
      height: Number.isFinite(modelHeight) && modelHeight > 0 ? modelHeight : 0,
    };
  }, [scene, scale]);

  useEffect(() => {
    onBounds?.(bounds.radius, bounds.height);
  }, [bounds]); // Matches the source viewer's model bounds update.

  const cameraNodes = useMemo(() => collectCameraNodes(scene), [scene]);
  useEffect(() => {
    camerasRef.current = new Map(cameraNodes.map((camera) => [camera.key, camera]));
    onCameras?.(cameraNodes.map(({ key, label }) => ({ key, label })));
    return () => {
      camerasRef.current = new Map();
    };
  }, [cameraNodes]); // Matches the source viewer's imported-camera registry.

  useEffect(() => {
    onSections?.(sections.map(({ node: _node, ...section }) => section));
  }, [sections]);

  useEffect(() => {
    for (const section of sections) section.node.visible = section.locked || !hidden.has(section.key);
  }, [sections, hidden]);

  useEffect(() => {
    const added: THREE.Object3D[] = [];
    const entries: RigEntry[] = [];
    const newPointLight = () => {
      const defaults = LIGHT_DEFAULTS;
      return new THREE.PointLight(defaults.color, defaults.intensity, defaults.distance, defaults.decay);
    };
    const register = (key: string, light: THREE.Light, real: boolean) => {
      light.userData.baseIntensity ??= light.intensity;
      light.castShadow = LIGHT_SHADOWS;
      entries.push({ key, light, real, base: light.userData.baseIntensity as number });
    };

    if (lightNodes.length > 0) {
      for (const { key, node } of lightNodes) {
        let light = (node as THREE.Light).isLight ? node as THREE.Light : findLight(node);
        const real = Boolean(light);
        if (!light) {
          light = newPointLight();
          node.add(light);
          added.push(light);
        }
        register(key, light, real);
      }
    } else {
      for (const { name, blender } of FALLBACK_LIGHTS) {
        const light = newPointLight();
        light.position.set(...blenderToThree(blender));
        scene.add(light);
        added.push(light);
        register(name, light, false);
      }
    }

    rig.current = entries;
    if (lightsRef) lightsRef.current = new Map(entries.map((entry) => [entry.key, entry.light]));
    onLights?.(entries.map(({ key, real }) => ({ key, label: lightNodes.find((entry) => entry.key === key)?.label ?? key.replace(/_/g, " "), origin: real ? "glb" : "three" })));

    return () => {
      added.forEach((object) => object.parent?.remove(object));
      entries.forEach((entry) => {
        if (entry.real) entry.light.intensity = entry.base;
      });
      rig.current = [];
      if (lightsRef) lightsRef.current = new Map();
    };
  }, [lightNodes, scene]);

  useFrame((_, delta) => {
    for (const entry of rig.current) {
      const off = lightsOff.has(entry.key);
      const target = off ? 0 : entry.base * LIGHT_INTENSITY;
      const next = THREE.MathUtils.damp(entry.light.intensity, target, 8, delta);
      entry.light.intensity = Math.abs(next - target) < 1e-3 ? target : next;
    }
  });

  useEffect(() => {
    scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center>
      <primitive object={scene} scale={scale} />
    </Center>
  );
}

export type { CameraNodeEntry };