"use client";


import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Water } from "three-stdlib";
import {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { withBasePath } from "@/lib/assetPath";
import {
  DEFAULT_EXTERIOR_HOUSE_STATE,
  EXTERIOR_HOUSE_MESHES,
  EXTERIOR_HOUSE_REQUIRED_MESHES,
  getExteriorHouseVisibility,
  type ExteriorHouseState,
} from "./exteriorHouseVariants";

const EXTERIOR_HOUSE_MODEL_URL = withBasePath("/models/exterior_house.glb");
const EXTERIOR_HOUSE_WATER_NORMALS_URL = withBasePath("/textures/waternormals.jpg");

const EXTERIOR_HOUSE_CAMERA_CONFIG = {
  direction: [4.4, 1.5, 4] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
  fov: 36,
  fitPadding: 0.82,
  minDistanceFactor: 0,
  maxDistanceFactor: 1.8,
  azimuthRange: THREE.MathUtils.degToRad(40),
  minPolarAngle: THREE.MathUtils.degToRad(10),
  maxPolarAngle: THREE.MathUtils.degToRad(60),
};

const INITIAL_AZIMUTH = Math.atan2(
  EXTERIOR_HOUSE_CAMERA_CONFIG.direction[0],
  EXTERIOR_HOUSE_CAMERA_CONFIG.direction[2],
);

type ExteriorHouseModelProps = {
  configuration: ExteriorHouseState;
  presentation?: "default" | "project";
};

export type ExteriorHouseSceneHandle = {
  nudge: (azimuthDelta: number, polarDelta: number) => void;
};

type IndexedObjects = Map<string, THREE.Object3D[]>;

function applyExteriorHouseVisibility(objects: IndexedObjects, configuration: ExteriorHouseState) {
  getExteriorHouseVisibility(configuration).forEach((visible, meshName) => {
    objects.get(meshName)?.forEach((object) => {
      object.visible = visible;
    });
  });
}

function prepareBorderMaterials(objects: IndexedObjects) {
  const materials: THREE.Material[] = [];

  objects.get(EXTERIOR_HOUSE_MESHES.border)?.forEach((object) => {
    if (!(object instanceof THREE.Mesh)) return;

    if (Array.isArray(object.material)) {
      const clonedMaterials = object.material.map((material) => material.clone());
      object.material = clonedMaterials;
      materials.push(...clonedMaterials);
      return;
    }

    const clonedMaterial = object.material.clone();
    object.material = clonedMaterial;
    materials.push(clonedMaterial);
  });

  return materials;
}

function applyBorderColor(materials: THREE.Material[], color: string) {
  materials.forEach((material) => {
    if ("color" in material && material.color instanceof THREE.Color) {
      material.color.set(color);
      material.needsUpdate = true;
    }
  });
}

function replaceWaterMeshesWithWaterSurface(
  objects: IndexedObjects,
  waterNormals: THREE.Texture,
): WaterMesh[] {
  const createdWaterMeshes: WaterMesh[] = [];

  WATER_SURFACE_MESH_NAMES.forEach((meshName) => {
    const originalNodes = objects.get(meshName);
    if (!originalNodes || originalNodes.length === 0) return;

    const replacedNodes = originalNodes.map((originalNode) => {
      if (!(originalNode instanceof THREE.Mesh)) return originalNode;

      // agua_superficie ya es un plano: reutilizamos su propia geometría
      // (forma y tamaño reales) en vez de reconstruir una nueva a partir
      // de position/scale.
      const waterMesh = new Water(originalNode.geometry.clone(), {
        textureWidth: EXTERIOR_HOUSE_WATER_CONFIG.textureWidth,
        textureHeight: EXTERIOR_HOUSE_WATER_CONFIG.textureHeight,
        waterNormals,
        sunDirection: new THREE.Vector3(...EXTERIOR_HOUSE_WATER_CONFIG.sunDirection),
        sunColor: 0xffffff,
        waterColor: new THREE.Color(EXTERIOR_HOUSE_WATER_CONFIG.color),
        distortionScale: EXTERIOR_HOUSE_WATER_CONFIG.distortionScale,
        alpha: EXTERIOR_HOUSE_WATER_CONFIG.opacity,
        fog: false,
      });

      waterMesh.name = originalNode.name;
      waterMesh.position.copy(originalNode.position);
      waterMesh.rotation.copy(originalNode.rotation);
      waterMesh.scale.copy(originalNode.scale);
      waterMesh.material.transparent = true;

      originalNode.parent?.add(waterMesh);
      originalNode.parent?.remove(originalNode);

      originalNode.geometry.dispose();
      (Array.isArray(originalNode.material) ? originalNode.material : [originalNode.material])
        .forEach((material) => material.dispose());

      createdWaterMeshes.push(waterMesh);
      return waterMesh;
    });

    objects.set(meshName, replacedNodes);
  });

  return createdWaterMeshes;
}

const WATER_SURFACE_MESH_NAMES = ["agua_cascada", "agua_superficie"] as const;

const EXTERIOR_HOUSE_WATER_CONFIG = {
  color: "#6ac5f3",
  opacity: 0.45,
  distortionScale: 1.0,
  textureWidth: 1024,
  textureHeight: 1024,
  sunDirection: [0, 1, 0] as [number, number, number],
};

type WaterMesh = InstanceType<typeof Water>;

function createWaterSurfaceMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#2f7fa6"),
    roughness: 0.08,
    metalness: 0,
    transmission: 0.55,
    thickness: 0.2,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  });
}

/**
 * Ignora la malla original de "agua_cascada" y "agua_superficie"
 * (geometría con volumen) y la reemplaza por un plano simple.
 * Solo se conservan position y scale ya definidos en el .glb;
 * la rotation se resetea porque la orientación horizontal queda
 * horneada directamente en la geometría del plano.
 */
function replaceWaterMeshesWithSurfacePlane(objects: IndexedObjects) {
  const waterMaterial = createWaterSurfaceMaterial();
  const flatPlaneGeometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  let replacedAny = false;

  WATER_SURFACE_MESH_NAMES.forEach((meshName) => {
    objects.get(meshName)?.forEach((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.geometry.dispose();
      object.geometry = flatPlaneGeometry.clone();
      object.rotation.set(0, 0, 0);

      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
      object.material = waterMaterial;

      replacedAny = true;
    });
  });

  if (!replacedAny) {
    console.warn(
      `Exterior House: no se encontró ningún mesh de agua (${WATER_SURFACE_MESH_NAMES.join(", ")}) para reemplazar por el plano de superficie.`,
    );
  }
}

function ExteriorHouseModel({
  configuration,
  presentation = "default",
  controlsRef,
}: ExteriorHouseModelProps & { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const gltf = useGLTF(EXTERIOR_HOUSE_MODEL_URL);
  const waterNormals = useTexture(EXTERIOR_HOUSE_WATER_NORMALS_URL);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  }, [waterNormals]);

  const { scene, center, radius, objects, borderMaterials, waterMeshes } = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    const indexedObjects: IndexedObjects = new Map();

    clonedScene.traverse((object) => {
      if (!object.name) return;
      const matches = indexedObjects.get(object.name) ?? [];
      matches.push(object);
      indexedObjects.set(object.name, matches);
    });

    const waterSurfaceMeshes = replaceWaterMeshesWithWaterSurface(indexedObjects, waterNormals);

    const missingMeshes = EXTERIOR_HOUSE_REQUIRED_MESHES.filter(
      (meshName) => !indexedObjects.has(meshName),
    );
    if (missingMeshes.length > 0) {
      console.error(`Exterior House: faltan meshes requeridos: ${missingMeshes.join(", ")}`);
    }

    const preparedBorderMaterials = prepareBorderMaterials(indexedObjects);
    applyExteriorHouseVisibility(indexedObjects, DEFAULT_EXTERIOR_HOUSE_STATE);
    applyBorderColor(preparedBorderMaterials, DEFAULT_EXTERIOR_HOUSE_STATE.borderColor);
    clonedScene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const modelCenter = box.getCenter(new THREE.Vector3());
    const sphere = box.getBoundingSphere(new THREE.Sphere());

    return {
      scene: clonedScene,
      center: modelCenter,
      radius: sphere.radius,
      objects: indexedObjects,
      borderMaterials: preparedBorderMaterials,
      waterMeshes: waterSurfaceMeshes,
    };
  }, [gltf.scene, waterNormals]);

  useEffect(() => {
    applyExteriorHouseVisibility(objects, configuration);
    applyBorderColor(borderMaterials, configuration.borderColor);
    invalidate();
  }, [borderMaterials, configuration, invalidate, objects]);

  useFrame((_, delta) => {
    if (!configuration.water) return;
    waterMeshes.forEach((waterMesh) => {
      waterMesh.material.uniforms.time.value += delta;
    });
  });

  return (
    <>
      <CameraAndControls radius={radius} presentation={presentation} controlsRef={controlsRef} />
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
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
  const config = EXTERIOR_HOUSE_CAMERA_CONFIG;
  const aspect = Math.max(size.width / Math.max(size.height, 1), 0.01);
  const verticalFov = THREE.MathUtils.degToRad(config.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const fitPadding = presentation === "project" && aspect >= 1 ? 0.64 : config.fitPadding;
  const fitDistance = (radius / Math.sin(Math.min(verticalFov, horizontalFov) / 2)) * fitPadding;

  useLayoutEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const direction = new THREE.Vector3(...config.direction).normalize();

    perspectiveCamera.fov = config.fov;
    perspectiveCamera.near = 0.01;
    perspectiveCamera.far = Math.max(100, fitDistance * 12);
    perspectiveCamera.position.copy(direction.multiplyScalar(fitDistance));
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
      minDistance={fitDistance * config.minDistanceFactor}
      maxDistance={fitDistance * config.maxDistanceFactor}
      minAzimuthAngle={INITIAL_AZIMUTH - config.azimuthRange}
      maxAzimuthAngle={INITIAL_AZIMUTH + config.azimuthRange}
      minPolarAngle={config.minPolarAngle}
      maxPolarAngle={config.maxPolarAngle}
    />
  );
}

const ExteriorHouseScene = forwardRef<ExteriorHouseSceneHandle, ExteriorHouseModelProps>(
  function ExteriorHouseScene({ configuration, presentation = "default" }, ref) {
    const controlsRef = useRef<OrbitControlsImpl>(null);

    const nudge = useCallback((azimuthDelta: number, polarDelta: number) => {
      const controls = controlsRef.current;
      if (!controls) return;

      const camera = controls.object;
      const offset = camera.position.clone().sub(controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);

      spherical.theta = THREE.MathUtils.clamp(
        spherical.theta + azimuthDelta,
        INITIAL_AZIMUTH - EXTERIOR_HOUSE_CAMERA_CONFIG.azimuthRange,
        INITIAL_AZIMUTH + EXTERIOR_HOUSE_CAMERA_CONFIG.azimuthRange,
      );
      spherical.phi = THREE.MathUtils.clamp(
        spherical.phi + polarDelta,
        EXTERIOR_HOUSE_CAMERA_CONFIG.minPolarAngle,
        EXTERIOR_HOUSE_CAMERA_CONFIG.maxPolarAngle,
      );

      camera.position.copy(controls.target.clone().add(offset.setFromSpherical(spherical)));
      camera.lookAt(controls.target);
      controls.update();
    }, []);

    useImperativeHandle(ref, () => ({ nudge }), [nudge]);

    return (
      <div className="exterior-house-viewer" aria-hidden="true">
        <Canvas
          frameloop={configuration.water ? "always" : "demand"}
          dpr={[1, 1.5]}
          camera={{ fov: EXTERIOR_HOUSE_CAMERA_CONFIG.fov, near: 0.01, far: 100 }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <ambientLight intensity={1.25} />
          <hemisphereLight args={[0xffffff, 0x8a8074, 1.2]} />
          <directionalLight position={[5, 8, 6]} intensity={2.1} />
          <directionalLight position={[-4, 3, -5]} intensity={0.65} />
          <Suspense fallback={null}>
            <ExteriorHouseModel
              configuration={configuration}
              presentation={presentation}
              controlsRef={controlsRef}
            />
          </Suspense>
        </Canvas>
      </div>
    );
  },
);

export default ExteriorHouseScene;
