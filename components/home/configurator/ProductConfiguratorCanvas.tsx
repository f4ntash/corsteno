"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { WindowConfiguration } from "./types";
import styles from "./productConfigurator.module.css";

const FRAME_COLORS = {
  black: "#141514",
  white: "#e7e7e2",
  aluminum: "#a7aaa7",
  graphite: "#444844",
} as const;

const GLASS_COLORS = {
  single: "#a8c4c7",
  double: "#91adb0",
  laminated: "#738e93",
} as const;

function WindowFrame({ configuration }: { configuration: WindowConfiguration }) {
  const invalidate = useThree((state) => state.invalidate);
  const width = THREE.MathUtils.mapLinear(configuration.width, 800, 3000, 2.4, 5.5);
  const height = THREE.MathUtils.mapLinear(configuration.height, 800, 2600, 2, 4.5);
  const panelCount = configuration.model === "single" ? 1 : configuration.model === "double" ? 2 : 3;
  const frameDepth = 0.24;
  const rail = Math.min(width, height) * 0.075;
  const innerWidth = width - rail * 2;
  const panelWidth = innerWidth / panelCount;
  const glassOpacity = configuration.glassType === "laminated" ? 0.5 : configuration.glassType === "double" ? 0.38 : 0.28;

  const frameMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: FRAME_COLORS[configuration.frameColor], roughness: 0.38, metalness: 0.48 }),
    [configuration.frameColor],
  );

  useEffect(() => {
    invalidate();
    return () => frameMaterial.dispose();
  }, [frameMaterial, invalidate]);

  return (
    <group rotation={[0, -0.16, 0]} position={[0, -0.05, 0]}>
      <mesh material={frameMaterial} position={[0, height / 2 - rail / 2, 0]} castShadow>
        <boxGeometry args={[width, rail, frameDepth]} />
      </mesh>
      <mesh material={frameMaterial} position={[0, -height / 2 + rail / 2, 0]} castShadow>
        <boxGeometry args={[width, rail, frameDepth]} />
      </mesh>
      <mesh material={frameMaterial} position={[-width / 2 + rail / 2, 0, 0]} castShadow>
        <boxGeometry args={[rail, height, frameDepth]} />
      </mesh>
      <mesh material={frameMaterial} position={[width / 2 - rail / 2, 0, 0]} castShadow>
        <boxGeometry args={[rail, height, frameDepth]} />
      </mesh>

      {Array.from({ length: panelCount }).map((_, index) => {
        const x = -innerWidth / 2 + panelWidth * (index + 0.5);
        const slidingOffset = configuration.opening === "sliding" && index === panelCount - 1 ? -frameDepth * 1.6 : 0;
        const casementRotation = configuration.opening === "casement" && index === 0 ? -0.2 : 0;

        return (
          <group key={index} position={[x, 0, slidingOffset]} rotation={[0, casementRotation, 0]}>
            {index > 0 && (
              <mesh material={frameMaterial} position={[-panelWidth / 2, 0, 0.02]} castShadow>
                <boxGeometry args={[rail * 0.72, height - rail * 2, frameDepth * 0.9]} />
              </mesh>
            )}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[Math.max(panelWidth - rail * 0.75, 0.2), height - rail * 2, 0.055]} />
              <meshPhysicalMaterial
                color={GLASS_COLORS[configuration.glassType]}
                transparent
                opacity={glassOpacity}
                roughness={0.08}
                metalness={0.05}
                transmission={0.2}
                thickness={configuration.glassType === "double" ? 0.18 : 0.08}
              />
            </mesh>
          </group>
        );
      })}

      {configuration.mosquitoNet && (
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[innerWidth, height - rail * 2, 18, 18]} />
          <meshBasicMaterial color="#697069" wireframe transparent opacity={0.2} />
        </mesh>
      )}

      {configuration.blind && (
        <group position={[0, height / 2 + 0.22, 0.06]}>
          {Array.from({ length: 7 }).map((_, index) => (
            <mesh key={index} position={[0, -index * 0.11, 0]} material={frameMaterial}>
              <boxGeometry args={[width * 0.92, 0.055, 0.09]} />
            </mesh>
          ))}
        </group>
      )}

      {configuration.security && (
        <mesh material={frameMaterial} position={[0, -height / 2 + rail * 1.8, 0.18]}>
          <boxGeometry args={[innerWidth * 0.8, 0.08, 0.09]} />
        </mesh>
      )}
    </group>
  );
}

export default function ProductConfiguratorCanvas({ configuration }: { configuration: WindowConfiguration }) {
  return (
    <div className={styles.configuratorCanvas} data-three-slot="product-window-configurator">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.35]}
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ fov: 38, near: 0.05, far: 100, position: [6.8, 3.8, 8.6] }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.2} />
        <hemisphereLight args={[0xf4f1e8, 0x242724, 1.5]} />
        <directionalLight castShadow position={[5, 8, 6]} intensity={2.5} shadow-mapSize-width={512} shadow-mapSize-height={512} />
        <Suspense fallback={null}>
          {/* TODO: map this typed configuration to named meshes in the definitive modular-window GLB. */}
          <WindowFrame configuration={configuration} />
        </Suspense>
        <gridHelper args={[18, 18, 0x555a55, 0x303330]} position={[0, -2.35, 0]} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={6}
          maxDistance={14}
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.48}
        />
      </Canvas>
      <span className={styles.canvasHint}>Arrastrar · Rotar · Zoom</span>
    </div>
  );
}
