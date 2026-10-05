import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_VIEW, type CameraRequest, type HeroCameraEntry } from "./cameras";

const DURATION = 0.9;

type ControlsApi = {
  target: THREE.Vector3;
  addEventListener: (type: "start", listener: () => void) => void;
  removeEventListener: (type: "start", listener: () => void) => void;
  update: () => void;
};

type CameraAnimation = {
  t: number;
  from: { position: THREE.Vector3; target: THREE.Vector3; fov: number };
  to: { position: THREE.Vector3; target: THREE.Vector3; fov: number };
};

export default function CameraController({
  request,
  camerasRef,
  radius = 8,
}: {
  request: CameraRequest;
  camerasRef: React.RefObject<Map<string, HeroCameraEntry>>;
  radius?: number;
}) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const controls = useThree((state) => state.controls) as ControlsApi | null;
  const animation = useRef<CameraAnimation | null>(null);

  useEffect(() => {
    if (!controls) return;
    const cancel = () => { animation.current = null; };
    controls.addEventListener("start", cancel);
    return () => controls.removeEventListener("start", cancel);
  }, [controls]);

  useEffect(() => {
    if (!request || !controls) return;
    let to: CameraAnimation["to"];
    if (request.mode === "home") {
      to = {
        position: new THREE.Vector3(...HOME_VIEW.position),
        target: new THREE.Vector3(...HOME_VIEW.target),
        fov: HOME_VIEW.fov,
      };
    } else {
      const entry = camerasRef.current.get(request.key ?? "");
      if (!entry) return;
      const object = entry.object;
      object.updateWorldMatrix(true, false);
      const position = new THREE.Vector3();
      object.getWorldPosition(position);
      const quaternion = new THREE.Quaternion();
      object.getWorldQuaternion(quaternion);
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
      if (forward.y > 0) {
        forward.y = 0;
        if (forward.lengthSq() < 1e-6) forward.set(0, 0, -1);
        forward.normalize();
      }
      const distance = Math.max(2, radius * 0.25);
      to = {
        position,
        target: position.clone().addScaledVector(forward, distance),
        fov: entry.fov ?? camera.fov,
      };
    }

    animation.current = {
      t: 0,
      from: { position: camera.position.clone(), target: controls.target.clone(), fov: camera.fov },
      to,
    };
  }, [request]); // Matches the source viewer's smooth camera requests.

  useFrame((_, delta) => {
    const current = animation.current;
    if (!current || !controls) return;
    current.t = Math.min(1, current.t + delta / DURATION);
    const eased = current.t * current.t * (3 - 2 * current.t);
    camera.position.lerpVectors(current.from.position, current.to.position, eased);
    controls.target.lerpVectors(current.from.target, current.to.target, eased);
    camera.fov = THREE.MathUtils.lerp(current.from.fov, current.to.fov, eased);
    camera.updateProjectionMatrix();
    controls.update();
    if (current.t >= 1) animation.current = null;
  });

  return null;
}
