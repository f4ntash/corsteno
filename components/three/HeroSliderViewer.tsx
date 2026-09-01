"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import {
  BEFORE_HERO_SLIDER_STATE,
  BEFORE_HERO_SLIDER_VISIBLE_MESHES,
  DEFAULT_HERO_SLIDER_STATE,
  HERO_SLIDER_CHAIR_PREFIXES,
  getHeroSliderVisibility,
  type HeroSliderState,
} from "./heroSliderVariants";

const HERO_SLIDER_MODEL_URL =
  process.env.NEXT_PUBLIC_HERO_SLIDER_MODEL_URL;

const HERO_SLIDER_MISSING_MODEL_URL_MESSAGE =
  "NEXT_PUBLIC_HERO_SLIDER_MODEL_URL is required for the hero 3D slider.";

if (!HERO_SLIDER_MODEL_URL && process.env.NODE_ENV !== "production") {
  console.warn(HERO_SLIDER_MISSING_MODEL_URL_MESSAGE);
}

const RESOLVED_HERO_SLIDER_MODEL_URL =
  HERO_SLIDER_MODEL_URL ?? "";

// HERO CAMERA X POSITION OFFSET
// Valor negativo = mueve fisicamente la camara hacia la izquierda
// Valor positivo = mueve fisicamente la camara hacia la derecha
const HERO_CAMERA_X_OFFSET = -12;

// HERO 3D INITIAL ZOOM
const HERO_CAMERA_DISTANCE_MULTIPLIER = 0.2;

const HERO_SLIDER_CAMERA_CONFIG = {
  direction: [0, 0, 0] as [number, number, number],
  target: [0, 0.05, 0] as [number, number, number],
  fov: 24,
  fitPadding: 0.64,
  minPolarAngle: THREE.MathUtils.degToRad(90),
  maxPolarAngle: THREE.MathUtils.degToRad(50),
};

type HeroSliderViewerProps = {
  variants: HeroSliderState;
  comparison: number;
};

type IndexedObjects = Map<string, THREE.Object3D[]>;

function indexSceneObjects(scene: THREE.Object3D) {
  const objects: IndexedObjects = new Map();

  scene.traverse((object) => {
    if (object.name) {
      const instances = objects.get(object.name) ?? [];
      instances.push(object);
      objects.set(object.name, instances);
    }
  });

  return objects;
}

function setObjectsVisibleByPrefix(
  objects: IndexedObjects,
  prefix: string,
  visible: boolean,
) {
  objects.forEach((objectInstances, name) => {
    if (name.startsWith(prefix)) {
      objectInstances.forEach((object) => {
        object.visible = visible;
      });
    }
  });
}

function applyHeroSliderVisibility(
  objects: IndexedObjects,
  variants: HeroSliderState,
) {
  getHeroSliderVisibility(variants).forEach(
    (visible, selector) => {
      const objectInstances = objects.get(selector);

      if (objectInstances) {
        objectInstances.forEach((object) => {
          object.visible = visible;
        });
        return;
      }

      setObjectsVisibleByPrefix(
        objects,
        selector,
        visible,
      );
    },
  );
}

function setNamedObjectsVisible(
  objects: IndexedObjects,
  names: readonly string[],
  visible: boolean,
) {
  names.forEach((name) => {
    const objectInstances = objects.get(name);

    if (objectInstances) {
      objectInstances.forEach((object) => {
        object.visible = visible;
      });
    }
  });
}

function hideInactiveChairVariants(
  objects: IndexedObjects,
  variants: HeroSliderState,
) {
  const activePrefix =
    HERO_SLIDER_CHAIR_PREFIXES[variants.chair];

  Object.values(HERO_SLIDER_CHAIR_PREFIXES).forEach(
    (prefix) => {
      setObjectsVisibleByPrefix(
        objects,
        prefix,
        prefix === activePrefix,
      );
    },
  );
}

/*
 * Apaga las luces importadas desde Blender/GLB.
 * Siempre debe ejecutarse ANTES de addHeroLights().
 */
function disableImportedLights(scene: THREE.Scene) {
  scene.traverse((object) => {
    if ((object as THREE.Light).isLight) {
      (object as THREE.Light).intensity = 0;
    }
  });
}

/*
 * Habilita sombras en la geometría del GLB.
 *
 * castShadow:
 * el objeto puede proyectar sombra.
 *
 * receiveShadow:
 * el objeto puede recibir la sombra de otro.
 */
function enableModelShadows(model: THREE.Object3D) {
  model.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

function addHeroLights(scene: THREE.Scene) {
  /*
   * =========================================================
   * ILUMINACIÓN GENERAL
   * =========================================================
   *
   * Bajamos un poco Ambient/Hemisphere respecto de antes.
   * Si son demasiado fuertes, rellenan todas las sombras
   * y la escena vuelve a verse plana.
   */

  const ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      0.75,
    );

  scene.add(ambientLight);

  const hemisphereLight =
    new THREE.HemisphereLight(
      0xffffff,
      0x9a8977,
      0.75,
    );

  scene.add(hemisphereLight);

  /*
   * Luz principal general.
   */

  const keyLight =
    new THREE.DirectionalLight(
      0xffffff,
      1.7,
    );

  keyLight.position.set(
    -4,
    7,
    5,
  );

  scene.add(keyLight);

  /*
   * Relleno suave.
   */

  const fillLight =
    new THREE.DirectionalLight(
      0xffffff,
      0.4,
    );

  fillLight.position.set(
    4,
    3,
    -5,
  );

  scene.add(fillLight);

  /*
   * =========================================================
   * HERO LIGHT - POINT ORIGINAL
   * =========================================================
   *
   * La dejamos apagada.
   */

  const heroPointLight =
    new THREE.PointLight(
      0xffffff,
      0,
      4.2,
      2,
    );

  heroPointLight.position.set(
    1.5984745025634766,
    0.9965009093284607,
    1.3477318286895752,
  );

  scene.add(heroPointLight);

  /*
   * =========================================================
   * HERO LIGHT - RIGHT / TOP
   * =========================================================
   *
   * Esta es ahora la luz que debe dar profundidad.
   *
   * Viene desde arriba + derecha y proyecta sombras.
   */

const heroRightLight =
  new THREE.DirectionalLight(
    0xfff1dd,
    10,
  );

// Derecha + atrás, con algo de altura
heroRightLight.position.set(
  2.2,  // X
  2.8,  // Y - altura
  5,    // Z - atrás
);

// Apunta hacia adelante atravesando la habitación
heroRightLight.target.position.set(
  0,
  0.8,
  -20,
);

  /*
   * SOMBRAS
   */

  heroRightLight.castShadow = true;

  // Resolución de la sombra.
  // 1024 para no matar rendimiento en el hero.
  heroRightLight.shadow.mapSize.width = 1024;
  heroRightLight.shadow.mapSize.height = 1024;

  heroRightLight.shadow.camera.near = 0.1;
  heroRightLight.shadow.camera.far = 25;

  /*
   * Área que puede recibir sombras.
   * Si algún objeto queda fuera de las sombras,
   * estos son los valores que se pueden ampliar.
   */
  heroRightLight.shadow.camera.left = -6;
  heroRightLight.shadow.camera.right = 6;
  heroRightLight.shadow.camera.top = 6;
  heroRightLight.shadow.camera.bottom = -6;

  /*
   * Ayuda con artefactos / shadow acne.
   */
  heroRightLight.shadow.bias = -0.0003;
  heroRightLight.shadow.normalBias = 0.025;

  scene.add(heroRightLight.target);
  scene.add(heroRightLight);

  heroRightLight.target.updateMatrixWorld(true);
  heroRightLight.updateMatrixWorld(true);
}

function HeroScissorRenderer({
  beforeScene,
  afterScene,
  comparison,
}: {
  beforeScene: THREE.Scene;
  afterScene: THREE.Scene;
  comparison: number;
}) {
  const { gl, camera } = useThree();

  const drawingBufferSize =
    useMemo(
      () => new THREE.Vector2(),
      [],
    );

  useEffect(() => {
    gl.autoClear = false;

    return () => {
      gl.setScissorTest(false);
      gl.autoClear = true;
    };
  }, [gl]);

  useFrame(() => {
    gl.getDrawingBufferSize(
      drawingBufferSize,
    );

    const width = Math.max(
      1,
      Math.floor(
        drawingBufferSize.x,
      ),
    );

    const height = Math.max(
      1,
      Math.floor(
        drawingBufferSize.y,
      ),
    );

    const split =
      THREE.MathUtils.clamp(
        Math.round(
          width *
            (comparison / 100),
        ),
        0,
        width,
      );

    gl.setViewport(
      0,
      0,
      width,
      height,
    );

    gl.setScissorTest(false);

    gl.clear(
      true,
      true,
      true,
    );

    gl.setScissorTest(true);

    if (split > 0) {
      gl.setScissor(
        0,
        0,
        split,
        height,
      );

      gl.render(
        beforeScene,
        camera,
      );
    }

    if (split < width) {
      gl.setScissor(
        split,
        0,
        width - split,
        height,
      );

      gl.render(
        afterScene,
        camera,
      );
    }

    gl.setScissorTest(false);
  }, 1);

  return null;
}

function CameraAndControls({
  radius,
  controlsRef,
}: {
  radius: number;
  controlsRef:
    React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera, size } =
    useThree();

  const config =
    HERO_SLIDER_CAMERA_CONFIG;

  const aspect = Math.max(
    size.width /
      Math.max(
        size.height,
        1,
      ),
    0.01,
  );

  const verticalFov =
    THREE.MathUtils.degToRad(
      config.fov,
    );

  const horizontalFov =
    2 *
    Math.atan(
      Math.tan(
        verticalFov / 2,
      ) * aspect,
    );

  const fitPadding =
    aspect >= 1
      ? 0.6
      : config.fitPadding;

  const fitDistance =
    (radius /
      Math.sin(
        Math.min(
          verticalFov,
          horizontalFov,
        ) / 2,
      )) *
    fitPadding *
    HERO_CAMERA_DISTANCE_MULTIPLIER;

  const cameraTarget =
    useMemo(
      () =>
        new THREE.Vector3(
          config.target[0],
          config.target[1],
          config.target[2],
        ),
      [config],
    );

  useLayoutEffect(() => {
    const perspectiveCamera =
      camera as THREE.PerspectiveCamera;

    const direction =
      new THREE.Vector3(
        ...config.direction,
      ).normalize();

    perspectiveCamera.fov =
      config.fov;

    perspectiveCamera.near =
      0.01;

    perspectiveCamera.far =
      Math.max(
        100,
        fitDistance * 12,
      );

    const calculatedPosition =
      cameraTarget
        .clone()
        .add(
          direction.multiplyScalar(
            fitDistance,
          ),
        );

    /*
     * IMPORTANTE:
     * NO CAMBIAR ESTA CÁMARA.
     */

    perspectiveCamera.position.set(
      calculatedPosition.x +
        HERO_CAMERA_X_OFFSET,
      calculatedPosition.y,
      calculatedPosition.z,
    );

    perspectiveCamera.lookAt(
      cameraTarget,
    );

    perspectiveCamera.updateProjectionMatrix();

    controlsRef.current?.target.copy(
      cameraTarget,
    );

    controlsRef.current?.update();

    controlsRef.current?.saveState();
  }, [
    camera,
    cameraTarget,
    config,
    controlsRef,
    fitDistance,
  ]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={cameraTarget.toArray()}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      enableRotate={false}
      enableZoom={false}
      minPolarAngle={
        config.minPolarAngle
      }
      maxPolarAngle={
        config.maxPolarAngle
      }
    />
  );
}

function HeroSliderComparison({
  variants,
  comparison,
  controlsRef,
}: HeroSliderViewerProps & {
  controlsRef:
    React.RefObject<OrbitControlsImpl | null>;
}) {
  const gltf =
    useGLTF(
      RESOLVED_HERO_SLIDER_MODEL_URL,
    );

  const invalidate =
    useThree(
      (state) =>
        state.invalidate,
    );

  const {
    beforeScene,
    afterScene,
    afterObjects,
    radius,
  } = useMemo(() => {
    const beforeModel =
      gltf.scene.clone(true);

    const afterModel =
      gltf.scene.clone(true);

    /*
     * Activamos sombras en todos los meshes.
     */
    enableModelShadows(
      beforeModel,
    );

    enableModelShadows(
      afterModel,
    );

    const beforeObjects =
      indexSceneObjects(
        beforeModel,
      );

    const indexedAfterObjects =
      indexSceneObjects(
        afterModel,
      );

    applyHeroSliderVisibility(
      beforeObjects,
      BEFORE_HERO_SLIDER_STATE,
    );

    applyHeroSliderVisibility(
      indexedAfterObjects,
      DEFAULT_HERO_SLIDER_STATE,
    );

    hideInactiveChairVariants(
      beforeObjects,
      BEFORE_HERO_SLIDER_STATE,
    );

    hideInactiveChairVariants(
      indexedAfterObjects,
      DEFAULT_HERO_SLIDER_STATE,
    );

    setNamedObjectsVisible(
      beforeObjects,
      BEFORE_HERO_SLIDER_VISIBLE_MESHES,
      true,
    );

    afterModel.updateMatrixWorld(
      true,
    );

    const box =
      new THREE.Box3().setFromObject(
        afterModel,
      );

    const center =
      box.getCenter(
        new THREE.Vector3(),
      );

    const sphere =
      box.getBoundingSphere(
        new THREE.Sphere(),
      );

    const offset =
      new THREE.Vector3(
        -center.x,
        -center.y,
        -center.z,
      );

    beforeModel.position.copy(
      offset,
    );

    afterModel.position.copy(
      offset,
    );

    /*
     * Actualizamos matrices después de mover los modelos.
     */
    beforeModel.updateMatrixWorld(
      true,
    );

    afterModel.updateMatrixWorld(
      true,
    );

    const baseScene =
      new THREE.Scene();

    const designedScene =
      new THREE.Scene();

    baseScene.add(
      beforeModel,
    );

    designedScene.add(
      afterModel,
    );

    /*
     * Primero apagamos luces del GLB.
     */
    disableImportedLights(
      baseScene,
    );

    disableImportedLights(
      designedScene,
    );

    /*
     * Después agregamos exclusivamente
     * nuestra iluminación.
     */
    addHeroLights(
      baseScene,
    );

    addHeroLights(
      designedScene,
    );

    return {
      beforeScene:
        baseScene,
      afterScene:
        designedScene,
      afterObjects:
        indexedAfterObjects,
      radius:
        sphere.radius,
    };
  }, [gltf.scene]);

  useLayoutEffect(() => {
    applyHeroSliderVisibility(
      afterObjects,
      variants,
    );

    hideInactiveChairVariants(
      afterObjects,
      variants,
    );

    const frame =
      window.requestAnimationFrame(
        invalidate,
      );

    return () =>
      window.cancelAnimationFrame(
        frame,
      );
  }, [
    afterObjects,
    invalidate,
    variants,
  ]);

  useLayoutEffect(() => {
    const frame =
      window.requestAnimationFrame(
        invalidate,
      );

    return () =>
      window.cancelAnimationFrame(
        frame,
      );
  }, [
    comparison,
    invalidate,
  ]);

  return (
    <>
      <CameraAndControls
        radius={radius}
        controlsRef={
          controlsRef
        }
      />

      <HeroScissorRenderer
        beforeScene={
          beforeScene
        }
        afterScene={
          afterScene
        }
        comparison={
          comparison
        }
      />
    </>
  );
}

export default function HeroSliderViewer({
  variants,
  comparison,
}: HeroSliderViewerProps) {
  const controlsRef =
    useRef<OrbitControlsImpl>(
      null,
    );

  if (
    !HERO_SLIDER_MODEL_URL
  ) {
    return null;
  }

  return (
    <div
      className="interior-finishes-viewer"
      aria-hidden="true"
    >
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{
          fov:
            HERO_SLIDER_CAMERA_CONFIG.fov,
          near: 0.01,
          far: 100,
        }}
        gl={{
          alpha: true,
          antialias: true,
        }}
        onCreated={({
          gl,
        }) => {
          gl.setClearColor(
            0x000000,
            0,
          );

          /*
           * Shadow map de Three.js.
           */
          gl.shadowMap.enabled = true;
          gl.shadowMap.type =
            THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense
          fallback={null}
        >
          <HeroSliderComparison
            variants={
              variants
            }
            comparison={
              comparison
            }
            controlsRef={
              controlsRef
            }
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
