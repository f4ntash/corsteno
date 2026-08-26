"use client";

import { Bounds, Center, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { withBasePath } from "@/lib/assetPath";
import styles from "./industrial.module.css";

const INDUSTRIAL_HERO_MODEL_URL = withBasePath("/models/exterior_house.glb");

function LoadingStatus() {
  const { active, progress } = useProgress();
  if (!active && progress >= 100) return null;
  return <span className={styles.modelLoading}>Cargando modelo · {Math.round(progress)}%</span>;
}

function HeroAsset({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);
  const gltf = useGLTF(INDUSTRIAL_HERO_MODEL_URL);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useFrame((state, delta) => {
    if (!active || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.035;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.025;
  });

  return (
    <Bounds fit clip observe margin={1.12}>
      <Center>
        <group ref={groupRef} rotation={[0, -0.5, 0]}>
          <primitive object={scene} />
        </group>
      </Center>
    </Bounds>
  );
}

export default function IndustrialHeroModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const media = window.matchMedia("(max-width: 700px)");
    const updateMobile = () => setMobile(media.matches);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.02 });

    updateMobile();
    media.addEventListener("change", updateMobile);
    observer.observe(element);
    return () => {
      media.removeEventListener("change", updateMobile);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.heroCanvas} data-three-slot="industrial-hero">
      <Canvas
        dpr={[1, mobile ? 1.15 : 1.45]}
        frameloop={active ? "always" : "demand"}
        camera={{ fov: mobile ? 48 : 38, near: 0.05, far: 500, position: [7, 4.5, 8] }}
        gl={{ alpha: true, antialias: !mobile, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.4} />
        <hemisphereLight args={[0xf4f1e8, 0x1a1b19, 1.8]} />
        <directionalLight position={[7, 9, 6]} intensity={2.8} />
        <directionalLight position={[-6, 3, -4]} intensity={0.9} color="#9ca69e" />
        <Suspense fallback={null}>
          {/* Temporary 20 MB asset. Replace and optimize the definitive window GLB with Blender or gltf-transform. */}
          <HeroAsset active={active} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={4}
          maxDistance={18}
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.48}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
      <LoadingStatus />
    </div>
  );
}
