"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import type { WindowConfiguration } from "./types";
import styles from "./productConfigurator.module.css";
import ProductModel, { ProductModelErrorBoundary } from "./ProductModel";

export default function ProductConfiguratorCanvas({ configuration }: { configuration: WindowConfiguration }) {
  return (
    <div className={styles.configuratorCanvas} data-three-slot="product-window-configurator">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.35]}
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ fov: 65, near: 0.05, far: 500, position: [2.4, 1.45, 3.15] }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.2} />
        <hemisphereLight args={[0xf4f1e8, 0x242724, 1.5]} />
        <directionalLight castShadow position={[5, 8, 6]} intensity={2.5} shadow-mapSize-width={512} shadow-mapSize-height={512} />
        <Environment files="/environments/grasslands_sunset.exr" background />
        <Suspense fallback={null}>
          <ProductModelErrorBoundary>
            <ProductModel configuration={configuration} />
          </ProductModelErrorBoundary>
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.4}
          maxDistance={6}
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.48}
        />
      </Canvas>
      <span className={styles.canvasHint}>Arrastrar · Rotar · Zoom</span>
    </div>
  );
}
