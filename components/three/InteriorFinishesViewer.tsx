"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  forwardRef,
  Suspense,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import {
  DEFAULT_INTERIOR_FINISHES,
  getInteriorFinishVisibility,
  type InteriorFinishState,
} from "./interiorFinishVariants";

import { withBasePath } from "@/lib/assetPath";

const INTERIOR_FINISHES_MODEL_URL = withBasePath(
  "/models/previa_house_interior.glb",
);

const INTERIOR_FINISHES_CAMERA_CONFIG = {
  // Dirección / posición inicial desde donde mira la cámara.
  direction: [4.4, 1.5, 4] as [number, number, number],

  // Punto al que apunta la cámara.
  target: [0, 0, 0] as [number, number, number],

  // Zoom visual / perspectiva.
  // Menor valor = más zoom.
  // Mayor valor = más angular / más alejado visualmente.
  fov: 36,

  // Qué tan cerca encuadra automáticamente el modelo.
  // Menor valor = más cerca.
  // Mayor valor = más lejos.
  fitPadding: 0.82,

  // Límites de zoom.
  minDistanceFactor: 0,
  maxDistanceFactor: 1.8,

  // =========================================================
  // LIMITES HORIZONTALES DE LA CAMARA
  // =========================================================
  //
  // AHORA SON INDEPENDIENTES.
  //
  // Izquierda:
  // Menor número = menos puede girar hacia la izquierda.
  // Mayor número = más puede girar hacia la izquierda.
  leftAzimuthRange: THREE.MathUtils.degToRad(150),

  // Derecha:
  // Menor número = menos puede girar hacia la derecha.
  // Mayor número = más puede girar hacia la derecha.
  rightAzimuthRange: THREE.MathUtils.degToRad(-50),

  // =========================================================
  // LIMITES VERTICALES DE LA CAMARA
  // =========================================================
  //
  // Controlan cuánto puede subir/bajar la cámara.
  minPolarAngle: THREE.MathUtils.degToRad(36),
  maxPolarAngle: THREE.MathUtils.degToRad(82),
};

// Calcula el ángulo horizontal inicial a partir de "direction".
const INITIAL_AZIMUTH = Math.atan2(
  INTERIOR_FINISHES_CAMERA_CONFIG.direction[0],
  INTERIOR_FINISHES_CAMERA_CONFIG.direction[2],
);

type InteriorFinishesModelProps = {
  variants: InteriorFinishState;
  presentation?: "default" | "project";
};

export type InteriorFinishesViewerHandle = {
  nudge: (azimuthDelta: number, polarDelta: number) => void;
};

function applyInteriorFinishVisibility(
  objects: Map<string, THREE.Object3D>,
  variants: InteriorFinishState,
) {
  getInteriorFinishVisibility(variants).forEach((visible, meshName) => {
    const object = objects.get(meshName);

    if (object) {
      object.visible = visible;
    }
  });
}

function InteriorFinishesModel({
  variants,
  presentation = "default",
  controlsRef,
}: InteriorFinishesModelProps & {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const gltf = useGLTF(INTERIOR_FINISHES_MODEL_URL);

  const invalidate = useThree((state) => state.invalidate);

  const { scene, center, radius, objects } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    const indexedObjects = new Map<string, THREE.Object3D>();

    clonedScene.traverse((object) => {
      if (object.name) indexedObjects.set(object.name, object);
    });

    applyInteriorFinishVisibility(indexedObjects, DEFAULT_INTERIOR_FINISHES);
    clonedScene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const modelCenter = box.getCenter(new THREE.Vector3());
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    return {
      scene: clonedScene,
      center: modelCenter,
      radius: sphere.radius,
      objects: indexedObjects,
    };
  }, [gltf.scene]);
  useLayoutEffect(() => {
    applyInteriorFinishVisibility(objects, variants);

    const frame = window.requestAnimationFrame(invalidate);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [invalidate, objects, variants]);

  return (
    <>
      <CameraAndControls
        radius={radius}
        presentation={presentation}
        controlsRef={controlsRef}
      />

      <primitive
        object={scene}
        position={[-center.x, -center.y, -center.z]}
      />
    </>
  );
}

function CameraAndControls({
  radius,
  presentation,
  controlsRef,
}: {
  radius: number;
  presentation: "default" | "project";
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera, size } = useThree();

  const config = INTERIOR_FINISHES_CAMERA_CONFIG;

  const aspect = Math.max(
    size.width / Math.max(size.height, 1),
    0.01,
  );

  const verticalFov = THREE.MathUtils.degToRad(config.fov);

  const horizontalFov =
    2 * Math.atan(Math.tan(verticalFov / 2) * aspect);

  const fitPadding =
    presentation === "project" && aspect >= 1
      ? 0.64
      : config.fitPadding;

  const fitDistance =
    (radius /
      Math.sin(
        Math.min(verticalFov, horizontalFov) / 2,
      )) *
    fitPadding;

  useLayoutEffect(() => {
    const perspectiveCamera =
      camera as THREE.PerspectiveCamera;

    const direction = new THREE.Vector3(
      ...config.direction,
    ).normalize();

    perspectiveCamera.fov = config.fov;
    perspectiveCamera.near = 0.01;
    perspectiveCamera.far = Math.max(
      100,
      fitDistance * 12,
    );

    perspectiveCamera.position.copy(
      direction.multiplyScalar(fitDistance),
    );

    perspectiveCamera.lookAt(...config.target);

    perspectiveCamera.updateProjectionMatrix();
  }, [camera, config, fitDistance]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault

      target={config.target}

      enableDamping
      dampingFactor={0.08}

      enablePan={false}
      enableRotate
      enableZoom

      // =====================================================
      // ZOOM
      // =====================================================
      minDistance={
        fitDistance * config.minDistanceFactor
      }
      maxDistance={
        fitDistance * config.maxDistanceFactor
      }

      // =====================================================
      // GIRO HORIZONTAL
      // =====================================================
      //
      // Límite hacia la izquierda.
      minAzimuthAngle={
        INITIAL_AZIMUTH -
        config.leftAzimuthRange
      }

      // Límite hacia la derecha.
      maxAzimuthAngle={
        INITIAL_AZIMUTH +
        config.rightAzimuthRange
      }

      // =====================================================
      // GIRO VERTICAL
      // =====================================================
      minPolarAngle={config.minPolarAngle}
      maxPolarAngle={config.maxPolarAngle}
    />
  );
}

const InteriorFinishesViewer = forwardRef<
  InteriorFinishesViewerHandle,
  InteriorFinishesModelProps
>(function InteriorFinishesViewer(
  {
    variants,
    presentation = "default",
  },
  ref,
) {
  const controlsRef =
    useRef<OrbitControlsImpl>(null);

  const nudge = useCallback(
    (
      azimuthDelta: number,
      polarDelta: number,
    ) => {
      const controls = controlsRef.current;

      if (!controls) {
        return;
      }

      const camera = controls.object;

      const offset = camera.position
        .clone()
        .sub(controls.target);

      const spherical =
        new THREE.Spherical().setFromVector3(
          offset,
        );

      // =====================================================
      // LIMITE HORIZONTAL DEL NUDGE
      // =====================================================
      //
      // IMPORTANTE:
      // Este límite tiene que coincidir con el OrbitControls.
      // Por eso también usamos izquierda y derecha
      // independientemente acá.
      spherical.theta = THREE.MathUtils.clamp(
        spherical.theta + azimuthDelta,

        INITIAL_AZIMUTH -
          INTERIOR_FINISHES_CAMERA_CONFIG.leftAzimuthRange,

        INITIAL_AZIMUTH +
          INTERIOR_FINISHES_CAMERA_CONFIG.rightAzimuthRange,
      );

      // =====================================================
      // LIMITE VERTICAL DEL NUDGE
      // =====================================================
      spherical.phi = THREE.MathUtils.clamp(
        spherical.phi + polarDelta,

        INTERIOR_FINISHES_CAMERA_CONFIG.minPolarAngle,

        INTERIOR_FINISHES_CAMERA_CONFIG.maxPolarAngle,
      );

      offset.setFromSpherical(spherical);

      camera.position.copy(
        controls.target.clone().add(offset),
      );

      camera.lookAt(controls.target);

      controls.update();
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      nudge,
    }),
    [nudge],
  );

  return (
    <div
      className="interior-finishes-viewer"
      aria-hidden="true"
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{
          fov: INTERIOR_FINISHES_CAMERA_CONFIG.fov,
          near: 0.01,
          far: 100,
        }}
        gl={{
          alpha: true,
          antialias: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={1.25} />

        <hemisphereLight
          args={[
            0xffffff,
            0x8a8074,
            1.2,
          ]}
        />

        <directionalLight
          position={[5, 8, 6]}
          intensity={2.1}
        />

        <directionalLight
          position={[-4, 3, -5]}
          intensity={0.65}
        />

        <Suspense fallback={null}>
          <InteriorFinishesModel
            variants={variants}
            presentation={presentation}
            controlsRef={controlsRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default InteriorFinishesViewer;

useGLTF.preload(
  INTERIOR_FINISHES_MODEL_URL,
);
