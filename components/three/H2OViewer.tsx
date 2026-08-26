"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import H2OModel from "./H2OModel";
import type { H2OVariantState } from "./h2oVariants";

// ============================================================
// H2O CAMERA CONFIG
// CAMBIAR ZOOM / ROTACIÓN / LÍMITES ACÁ
// ============================================================
const H2O_CAMERA_CONFIG = {
  position: [4.500291314024279, 1.342457801982873, 3.3901251595143806] as [number, number, number],
  target: [0.3507116138935088, 0.19906431199371288, -0.03292148037829423] as [number, number, number],
  initialZoom: 100,
  fov: 40,
  near: 0.05,
  far: 1000,
  minDistance: 2.5,
  maxDistance: 8,
  minAzimuthAngle: Math.PI / 32,
  maxAzimuthAngle: (Math.PI * 17) / 32,
  minPolarAngle: THREE.MathUtils.degToRad(58),
  maxPolarAngle: THREE.MathUtils.degToRad(78),
  enableRotate: true,
  enableZoom: true,
  enablePan: false,
  enableDamping: true,
  dampingFactor: 0.08,
  autoRotate: false,
  autoRotateSpeed: 2,
  rotateSpeed: 1,
  zoomSpeed: 1,
  initialViewOffset: 0,
  minViewOffset: -38,
  maxViewOffset: 60,
  debug: false,
};

// minDistance = zoom máximo hacia adentro; maxDistance = zoom máximo hacia afuera.
// min/maxAzimuthAngle = rotación izquierda/derecha; min/maxPolarAngle = arriba/abajo.

const FALLBACK_CENTER = new THREE.Vector3(0, 0.2, 0);
const FALLBACK_SIZE = new THREE.Vector3(2.1, 1.7, 3.2);

const clampViewOffset = (value: number) =>
  Math.min(H2O_CAMERA_CONFIG.maxViewOffset, Math.max(H2O_CAMERA_CONFIG.minViewOffset, value));

const isValidVector = (value: THREE.Vector3) =>
  Number.isFinite(value.x) &&
  Number.isFinite(value.y) &&
  Number.isFinite(value.z) &&
  !Number.isNaN(value.x) &&
  !Number.isNaN(value.y) &&
  !Number.isNaN(value.z);

const getModelMetrics = (object?: THREE.Object3D) => {
  if (!object) {
    return {
      center: FALLBACK_CENTER.clone(),
      size: FALLBACK_SIZE.clone(),
    };
  }

  try {
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    box.getCenter(center);
    box.getSize(size);

    if (
      !isValidVector(center) ||
      !isValidVector(size) ||
      size.lengthSq() <= 0
    ) {
      return {
        center: FALLBACK_CENTER.clone(),
        size: FALLBACK_SIZE.clone(),
      };
    }

    return { center, size };
  } catch {
    return {
      center: FALLBACK_CENTER.clone(),
      size: FALLBACK_SIZE.clone(),
    };
  }
};

export type H2OViewerHandle = {
  reset: () => void;
  nudge: (azimuthDelta: number, polarDelta: number) => void;
};

type H2OViewerProps = {
  active: boolean;
  presentation?: "default" | "project";
  variants: H2OVariantState;
  onEngaged: () => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
  onReady: () => void;
};

function ResizeOnFullscreen() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const onFullscreenChange = () =>
      window.requestAnimationFrame(() => invalidate());

    document.addEventListener(
      "fullscreenchange",
      onFullscreenChange,
    );
    window.addEventListener("resize", onFullscreenChange);

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        onFullscreenChange,
      );
      window.removeEventListener("resize", onFullscreenChange);
    };
  }, [invalidate]);

  return null;
}

type H2OCameraRigProps = {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  presentation: "default" | "project";
  variants: H2OVariantState;
  onReady: () => void;
  setResetHandler: (handler: () => void) => void;
};

function H2OCameraRig({
  controlsRef,
  presentation,
  variants,
  onReady,
  setResetHandler,
}: H2OCameraRigProps) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const initialZoom = presentation === "project" && size.width >= size.height
    ? 116
    : H2O_CAMERA_CONFIG.initialZoom;
  const zoomRef = useRef(initialZoom);
  const viewOffsetRef = useRef(
    clampViewOffset(H2O_CAMERA_CONFIG.initialViewOffset),
  );

  const applyInitialView = useCallback(
    (model: THREE.Object3D | null = modelRef.current) => {
      if (!(camera instanceof THREE.PerspectiveCamera)) return;

      const { center, size } = getModelMetrics(
        model || undefined,
      );

      const viewOffset = clampViewOffset(
        viewOffsetRef.current,
      );

      const target = new THREE.Vector3(...H2O_CAMERA_CONFIG.target);
      const basePosition = new THREE.Vector3(...H2O_CAMERA_CONFIG.position);
      const baseDistance = basePosition.distanceTo(target);
      const distance = baseDistance * (100 / initialZoom);
      const position = target.clone().add(basePosition.sub(target).normalize().multiplyScalar(distance));

      camera.position.copy(position);
      camera.fov = H2O_CAMERA_CONFIG.fov;
      camera.near = H2O_CAMERA_CONFIG.near;
      camera.far = H2O_CAMERA_CONFIG.far;
      camera.updateProjectionMatrix();

      const controls = controlsRef.current;

      if (controls) {
        controls.target.copy(target);
        controls.minDistance = H2O_CAMERA_CONFIG.minDistance;
        controls.maxDistance = H2O_CAMERA_CONFIG.maxDistance;
        controls.update();
        controls.saveState();
      } else {
        camera.lookAt(target);
      }

      if (H2O_CAMERA_CONFIG.debug) {
        console.log({
          position: camera.position.toArray(),
          target:
            controlsRef.current?.target.toArray(),
          zoom: zoomRef.current,
          viewOffset,
          polarAngle:
            controlsRef.current?.getPolarAngle(),
          azimuthAngle:
            controlsRef.current?.getAzimuthalAngle(),
          distance:
            camera.position.distanceTo(target),
          center: center.toArray(),
          size: size.toArray(),
        });
      }

      invalidate();
    },
    [camera, controlsRef, initialZoom, invalidate],
  );

  const handleModelReady = useCallback(
    (object: THREE.Object3D) => {
      modelRef.current = object;

      viewOffsetRef.current =
        clampViewOffset(H2O_CAMERA_CONFIG.initialViewOffset);

      zoomRef.current = initialZoom;

      applyInitialView(object);

      setResetHandler(() => {
        viewOffsetRef.current =
          clampViewOffset(H2O_CAMERA_CONFIG.initialViewOffset);

        zoomRef.current = initialZoom;

        applyInitialView(modelRef.current);
      });
    },
    [applyInitialView, initialZoom, setResetHandler],
  );

  return (
    <H2OModel
      onReady={onReady}
      onModelReady={handleModelReady}
      variants={variants}
    />
  );
}

const H2OViewer = forwardRef<
  H2OViewerHandle,
  H2OViewerProps
>(function H2OViewer(
  {
    active,
    presentation = "default",
    variants,
    onEngaged,
    onInteractionStart,
    onInteractionEnd,
    onReady,
  },
  ref,
) {
  const controlsRef =
    useRef<OrbitControlsImpl>(null);

  const fitModelRef = useRef<() => void>(
    () => undefined,
  );

  const reset = useCallback(() => {
    fitModelRef.current();
  }, []);

  const nudge = useCallback((azimuthDelta: number, polarDelta: number) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const camera = controls.object;
    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta += azimuthDelta;
    spherical.phi = THREE.MathUtils.clamp(
      spherical.phi + polarDelta,
      H2O_CAMERA_CONFIG.minPolarAngle,
      H2O_CAMERA_CONFIG.maxPolarAngle,
    );
    camera.position.copy(controls.target.clone().add(offset.setFromSpherical(spherical)));
    camera.lookAt(controls.target);
    controls.update();
  }, []);

  const registerResetHandler = useCallback(
    (handler: () => void) => {
      fitModelRef.current = handler;
    },
    [],
  );

  const startInteraction = useCallback(() => {
    onEngaged();
    onInteractionStart();
  }, [onEngaged, onInteractionStart]);

  useImperativeHandle(
    ref,
    () => ({ reset, nudge }),
    [nudge, reset],
  );

  return (
    <div
      className="h2o-viewer"
      onPointerDown={startInteraction}
      onTouchStart={startInteraction}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "demand" : "never"}
        gl={{
          alpha: true,
          antialias: true,
        }}
      >
        <PerspectiveCamera
          makeDefault
          fov={H2O_CAMERA_CONFIG.fov}
          near={H2O_CAMERA_CONFIG.near}
          far={H2O_CAMERA_CONFIG.far}
          position={H2O_CAMERA_CONFIG.position}
        />

        <ambientLight intensity={1.7} />

        <directionalLight
          position={[4, 7, 5]}
          intensity={2.2}
        />

        <directionalLight
          position={[-5, 3, -4]}
          intensity={0.7}
        />

        <Suspense fallback={null}>
          <H2OCameraRig
            controlsRef={controlsRef}
            presentation={presentation}
            variants={variants}
            onReady={onReady}
            setResetHandler={registerResetHandler}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={H2O_CAMERA_CONFIG.target}
          enableRotate={H2O_CAMERA_CONFIG.enableRotate}
          enableZoom={H2O_CAMERA_CONFIG.enableZoom}
          enablePan={H2O_CAMERA_CONFIG.enablePan}
          enableDamping={H2O_CAMERA_CONFIG.enableDamping}
          dampingFactor={H2O_CAMERA_CONFIG.dampingFactor}
          autoRotate={H2O_CAMERA_CONFIG.autoRotate}
          autoRotateSpeed={H2O_CAMERA_CONFIG.autoRotateSpeed}
          rotateSpeed={H2O_CAMERA_CONFIG.rotateSpeed}
          zoomSpeed={H2O_CAMERA_CONFIG.zoomSpeed}
          minDistance={H2O_CAMERA_CONFIG.minDistance}
          maxDistance={H2O_CAMERA_CONFIG.maxDistance}
          minAzimuthAngle={H2O_CAMERA_CONFIG.minAzimuthAngle}
          maxAzimuthAngle={H2O_CAMERA_CONFIG.maxAzimuthAngle}
          minPolarAngle={H2O_CAMERA_CONFIG.minPolarAngle}
          maxPolarAngle={H2O_CAMERA_CONFIG.maxPolarAngle}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
          onStart={startInteraction}
          onEnd={onInteractionEnd}
        />

        <ResizeOnFullscreen />
      </Canvas>
    </div>
  );
});

export default H2OViewer;
