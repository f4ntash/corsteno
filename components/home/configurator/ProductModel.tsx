"use client";

import { useGLTF } from "@react-three/drei";
import { Component, useEffect, useMemo, type ErrorInfo, type ReactNode } from "react";
import * as THREE from "three";
import type { WindowConfiguration } from "./types";

// PRODUCT_GLTF_PATH
const PRODUCT_GLTF_PATH = "/models/Window.glb";

// PRODUCT_MESH_MAPPING
const PRODUCT_MESHES = {
  cornerBottomRight: "C1_ESQUINA_LOW_DER",
  cornerBottomLeft: "C1_ESQUINA_LOW_IZQ",
  cornerTopLeft: "C1_ESQUINA_TOP_IZQ",
  cornerTopRight: "C1_ESQUINA_TOP_DER",
  frameTop: "C1_FRAME_TOP",
  frameBottom: "C1_FRAME_LOW",
  frameLeft: "C1_FRAME_IZQ",
  frameRight: "C1_FRAME_DER",
  glass: "Window_C",
} as const;

// PRODUCT_MODEL_TRANSFORM
const PRODUCT_MODEL_TRANSFORM = {
  position: [0, 0, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: [1, 1, 1] as [number, number, number],
};

const PRODUCT_MODEL_DEBUG = false;

// PRODUCT_DIMENSION_MAPPING: Forma 3d stores millimetres; the GLB is metres.
const MILLIMETRES_PER_MODEL_UNIT = 1000;

// PRODUCT_FRAME_MATERIALS
const FRAME_COLORS = {
  black: "#141514",
  white: "#e7e7e2",
  aluminum: "#a7aaa7",
  graphite: "#444844",
} as const;

// PRODUCT_GLASS_MATERIALS
const GLASS_PRESETS = {
  single: { color: "#a8c4c7", transmission: 1, roughness: 0.04, ior: 1.5, thickness: 0.02 },
  double: { color: "#91adb0", transmission: 0.9, roughness: 0.05, ior: 1.52, thickness: 0.06 },
  laminated: { color: "#738e93", transmission: 0.9, roughness: 0.55, ior: 1.5, thickness: 0.02 },
} as const;

type CornerKey = "cornerBottomRight" | "cornerBottomLeft" | "cornerTopLeft" | "cornerTopRight";
type FrameKey = "frameTop" | "frameBottom" | "frameLeft" | "frameRight";
type PreparedModel = {
  scene: THREE.Object3D;
  glass: THREE.Object3D;
  corners: Record<CornerKey, THREE.Object3D>;
  frames: Record<FrameKey, THREE.Object3D>;
  originalGlassScale: THREE.Vector3;
  originalGlassSize: THREE.Vector3;
  glassCenter: THREE.Vector3;
  insetX: number;
  insetY: number;
  cornerData: Record<CornerKey, { signX: number; signY: number; scale: THREE.Vector3; z: number }>;
  frameData: Record<FrameKey, { axis: "x" | "y"; a: CornerKey; b: CornerKey; length: number; fixed: number; scale: THREE.Vector3; offset: THREE.Vector3 }>;
  originalMaterials: Map<THREE.Mesh, THREE.Material | THREE.Material[]>;
};

export class ProductModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") console.error("Product GLB: no se pudo cargar Window.glb", error, info.componentStack);
  }
  render() {
    if (this.state.failed) return <mesh><boxGeometry args={[1.8, 1.4, 0.08]} /><meshBasicMaterial color="#4f504a" wireframe /></mesh>;
    return this.props.children;
  }
}

function find(root: THREE.Object3D, name: string) {
  return root.getObjectByName(name);
}

function setWorldPosition(object: THREE.Object3D, position: THREE.Vector3) {
  if (!object.parent) return object.position.copy(position);
  object.parent.updateWorldMatrix(true, false);
  object.position.copy(object.parent.worldToLocal(position.clone()));
}

function setWorldScale(object: THREE.Object3D, scale: THREE.Vector3) {
  if (!object.parent) return object.scale.copy(scale);
  const parentScale = object.parent.getWorldScale(new THREE.Vector3());
  object.scale.set(scale.x / (parentScale.x || 1), scale.y / (parentScale.y || 1), scale.z / (parentScale.z || 1));
}

function applyMaterial(root: THREE.Object3D, material: THREE.Material) {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) child.material = material;
  });
}

function prepareModel(source: THREE.Object3D): PreparedModel | null {
  const scene = source.clone(true);
  const names = Object.values(PRODUCT_MESHES);
  const objects = names.map((name) => find(scene, name));
  if (objects.some((object) => !object)) {
    if (process.env.NODE_ENV !== "production") console.warn("Product GLB: faltan meshes requeridos", names.filter((_, index) => !objects[index]));
    return null;
  }

  const corners = {
    cornerBottomRight: objects[0]!, cornerBottomLeft: objects[1]!, cornerTopLeft: objects[2]!, cornerTopRight: objects[3]!,
  };
  const frames = { frameTop: objects[4]!, frameBottom: objects[5]!, frameLeft: objects[6]!, frameRight: objects[7]! };
  const glass = objects[8]!;
  scene.updateMatrixWorld(true);
  const glassBox = new THREE.Box3().setFromObject(glass);
  const originalGlassSize = glassBox.getSize(new THREE.Vector3());
  const glassCenter = glassBox.getCenter(new THREE.Vector3());
  const originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  scene.traverse((child) => { if (child instanceof THREE.Mesh) originalMaterials.set(child, child.material); });

  const cornerData = {} as PreparedModel["cornerData"];
  (Object.keys(corners) as CornerKey[]).forEach((key) => {
    const position = corners[key].getWorldPosition(new THREE.Vector3());
    cornerData[key] = { signX: Math.sign(position.x - glassCenter.x) || 1, signY: Math.sign(position.y - glassCenter.y) || 1, scale: corners[key].getWorldScale(new THREE.Vector3()), z: position.z };
  });
  const reference = corners.cornerBottomRight.getWorldPosition(new THREE.Vector3());
  const insetX = originalGlassSize.x / 2 - Math.abs(reference.x - glassCenter.x);
  const insetY = originalGlassSize.y / 2 - Math.abs(reference.y - glassCenter.y);
  const frameData = {
    frameRight: { axis: "y" as const, a: "cornerBottomRight" as CornerKey, b: "cornerTopRight" as CornerKey },
    frameLeft: { axis: "y" as const, a: "cornerBottomLeft" as CornerKey, b: "cornerTopLeft" as CornerKey },
    frameTop: { axis: "x" as const, a: "cornerTopLeft" as CornerKey, b: "cornerTopRight" as CornerKey },
    frameBottom: { axis: "x" as const, a: "cornerBottomLeft" as CornerKey, b: "cornerBottomRight" as CornerKey },
  } as const;
  const preparedFrames = {} as PreparedModel["frameData"];
  (Object.keys(frameData) as FrameKey[]).forEach((key) => {
    const data = frameData[key]; const a = corners[data.a].getWorldPosition(new THREE.Vector3()); const b = corners[data.b].getWorldPosition(new THREE.Vector3());
    const box = new THREE.Box3().setFromObject(frames[key]); const size = box.getSize(new THREE.Vector3()); const length = data.axis === "x" ? size.x : size.y;
    const midpoint = a.clone().add(b).multiplyScalar(0.5); const offset = frames[key].getWorldPosition(new THREE.Vector3()).sub(midpoint);
    preparedFrames[key] = { ...data, length, fixed: (data.axis === "x" ? Math.abs(b.x - a.x) : Math.abs(b.y - a.y)) - length, scale: frames[key].scale.clone(), offset };
  });
  return { scene, glass, corners, frames, originalGlassScale: glass.scale.clone(), originalGlassSize, glassCenter, insetX, insetY, cornerData, frameData: preparedFrames, originalMaterials };
}

function resizeModel(model: PreparedModel, configuration: WindowConfiguration) {
  // TODO PRODUCT_OPTION: opening — el GLB actual no contiene hojas móviles.
  // TODO PRODUCT_OPTION: mosquitoScreen — el GLB actual no contiene mosquitero.
  // TODO PRODUCT_OPTION: shutter — el GLB actual no contiene persiana.
  // TODO PRODUCT_OPTION: security — el GLB actual no contiene accesorios de seguridad.
  void configuration.model;
  void configuration.opening;
  void configuration.mosquitoNet;
  void configuration.blind;
  void configuration.security;
  const width = THREE.MathUtils.clamp(configuration.width / MILLIMETRES_PER_MODEL_UNIT, 0.4, 3);
  const height = THREE.MathUtils.clamp(configuration.height / MILLIMETRES_PER_MODEL_UNIT, 0.4, 3);
  model.glass.scale.set(model.originalGlassScale.x * width / model.originalGlassSize.x, model.originalGlassScale.y * height / model.originalGlassSize.y, model.originalGlassScale.z);
  model.scene.updateMatrixWorld(true);
  (Object.keys(model.corners) as CornerKey[]).forEach((key) => { const data = model.cornerData[key]; setWorldPosition(model.corners[key], new THREE.Vector3(model.glassCenter.x + data.signX * (width / 2 - model.insetX), model.glassCenter.y + data.signY * (height / 2 - model.insetY), data.z)); const cornerScale = data.scale.clone(); cornerScale.z = 1.01; setWorldScale(model.corners[key], cornerScale); });
  if (PRODUCT_MODEL_DEBUG && process.env.NODE_ENV !== "production") console.debug("Product model resized", { width, height, glassCenter: model.glassCenter });
  model.scene.updateMatrixWorld(true);
  (Object.keys(model.frames) as FrameKey[]).forEach((key) => { const data = model.frameData[key]; const a = model.corners[data.a].getWorldPosition(new THREE.Vector3()); const b = model.corners[data.b].getWorldPosition(new THREE.Vector3()); const distance = data.axis === "x" ? Math.abs(b.x - a.x) : Math.abs(b.y - a.y); const scale = data.scale.clone(); scale[data.axis] *= Math.max((distance - data.fixed + 0.02) / data.length, 0.001); model.frames[key].scale.copy(scale); setWorldPosition(model.frames[key], a.clone().add(b).multiplyScalar(0.5).add(data.offset)); });
}

export default function ProductModel({ configuration }: { configuration: WindowConfiguration }) {
  const gltf = useGLTF(PRODUCT_GLTF_PATH);
  const model = useMemo(() => prepareModel(gltf.scene), [gltf.scene]);
  const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: FRAME_COLORS[configuration.frameColor], roughness: 0.38, metalness: 0.48 }), [configuration.frameColor]);
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ ...GLASS_PRESETS[configuration.glassType], transparent: true, metalness: 0 }), [configuration.glassType]);
  useEffect(() => { if (!model) return; resizeModel(model, configuration); applyMaterial(model.glass, glassMaterial); (Object.values(model.frames).concat(Object.values(model.corners))).forEach((object) => applyMaterial(object, frameMaterial)); }, [configuration, frameMaterial, glassMaterial, model]);
  useEffect(() => () => { frameMaterial.dispose(); glassMaterial.dispose(); }, [frameMaterial, glassMaterial]);
  if (!model) return null;
  return <primitive object={model.scene} position={PRODUCT_MODEL_TRANSFORM.position} rotation={PRODUCT_MODEL_TRANSFORM.rotation} scale={PRODUCT_MODEL_TRANSFORM.scale} />;
}
