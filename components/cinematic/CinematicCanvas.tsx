"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

type CinematicCanvasProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion: boolean;
};

type CameraKeyframe = {
  progress: number;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};

const DESKTOP_CAMERA: CameraKeyframe[] = [
  { progress: 0, position: [6.2, 3.1, 8.8], target: [0.2, 0.8, 0], fov: 37 },
  { progress: 0.25, position: [4.1, 2.35, 4.2], target: [-0.1, 0.75, -2.4], fov: 34 },
  { progress: 0.5, position: [2.25, 1.45, -3.25], target: [-0.45, 0.55, -8.2], fov: 42 },
  { progress: 0.72, position: [-2.8, 1.65, -8.6], target: [0.3, 1.05, -12.3], fov: 38 },
  { progress: 1, position: [-1.7, 2.15, -13.5], target: [0.35, 1.15, -18.2], fov: 34 },
];

const MOBILE_CAMERA: CameraKeyframe[] = [
  { progress: 0, position: [5.1, 3.2, 8.6], target: [0.2, 0.9, -0.3], fov: 48 },
  { progress: 0.3, position: [3.7, 2.25, 4.4], target: [0, 0.8, -2.6], fov: 45 },
  { progress: 0.55, position: [1.5, 1.45, -3.45], target: [-0.35, 0.65, -8.4], fov: 52 },
  { progress: 0.78, position: [-2.2, 1.8, -9.5], target: [0.25, 1.1, -13.5], fov: 46 },
  { progress: 1, position: [-1.2, 2.2, -14.2], target: [0.25, 1.2, -18.1], fov: 44 },
];

const smoothstep = (value: number) => value * value * (3 - 2 * value);

function getCameraFrame(keyframes: CameraKeyframe[], progress: number) {
  const last = keyframes.length - 1;
  const index = Math.min(
    keyframes.findIndex((_, frameIndex) => frameIndex < last && progress <= keyframes[frameIndex + 1].progress),
    last - 1,
  );
  const safeIndex = Math.max(index, 0);
  const from = keyframes[safeIndex];
  const to = keyframes[safeIndex + 1];
  const localProgress = smoothstep(
    THREE.MathUtils.clamp((progress - from.progress) / Math.max(to.progress - from.progress, 0.001), 0, 1),
  );

  return {
    position: new THREE.Vector3(...from.position).lerp(new THREE.Vector3(...to.position), localProgress),
    target: new THREE.Vector3(...from.target).lerp(new THREE.Vector3(...to.target), localProgress),
    fov: THREE.MathUtils.lerp(from.fov, to.fov, localProgress),
  };
}

function DirectedCamera({ progressRef, reducedMotion }: CinematicCanvasProps) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const target = useRef(new THREE.Vector3(0.2, 0.8, 0));
  const initialized = useRef(false);

  useFrame((state, delta) => {
    const keyframes = size.width < 700 ? MOBILE_CAMERA : DESKTOP_CAMERA;
    const frame = getCameraFrame(keyframes, progressRef.current);
    const damping = reducedMotion ? 1 : 1 - Math.exp(-delta * 4.2);
    const sway = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.012;

    if (!initialized.current) {
      camera.position.copy(frame.position);
      target.current.copy(frame.target);
      initialized.current = true;
    } else {
      camera.position.lerp(frame.position, damping);
      target.current.lerp(frame.target, damping);
    }

    camera.position.x += sway;
    camera.position.y += Math.cos(state.clock.elapsedTime * 0.18) * (reducedMotion ? 0 : 0.007);
    camera.fov = THREE.MathUtils.lerp(camera.fov, frame.fov, damping);
    camera.updateProjectionMatrix();
    camera.lookAt(target.current);
  });

  return null;
}

function ArchitecturalWorld({ reducedMotion }: Pick<CinematicCanvasProps, "reducedMotion">) {
  const lampMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const lampGroup = useRef<THREE.Group>(null);
  const plaster = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c8c2b6", roughness: 0.82, metalness: 0.02 }),
    [],
  );

  useEffect(() => () => plaster.dispose(), [plaster]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (lampMaterial.current) lampMaterial.current.emissiveIntensity = 2.7 + Math.sin(time * 0.45) * 0.16;
    if (lampGroup.current && !reducedMotion) lampGroup.current.rotation.y = Math.sin(time * 0.13) * 0.018;
  });

  return (
    <>
      <color attach="background" args={["#0b0c0b"]} />
      <fog attach="fog" args={["#0b0c0b", 5, 38]} />

      <ambientLight intensity={0.045} />
      <directionalLight
        castShadow
        color="#eee6d8"
        intensity={3.1}
        position={[-7, 8, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={34}
      />
      <directionalLight color="#9a9c93" intensity={0.28} position={[8, 2, -8]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, -10]} receiveShadow>
        <planeGeometry args={[48, 70]} />
        <meshStandardMaterial color="#11120f" roughness={0.96} />
      </mesh>

      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow position={[0.8, 0.1, 0]} rotation={[0, -0.18, 0]}>
          <boxGeometry args={[5.2, 5.8, 2.1]} />
          <meshStandardMaterial color="#252621" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[-2.25, 1.05, 1.7]} rotation={[0, 0.12, 0]}>
          <boxGeometry args={[1.1, 7.4, 1.3]} />
          <meshStandardMaterial color="#0d0e0c" roughness={0.98} />
        </mesh>
        <mesh castShadow position={[3.25, -0.3, -0.7]} rotation={[0.08, -0.28, 0]}>
          <boxGeometry args={[1.3, 4.8, 5.4]} />
          <meshStandardMaterial color="#171814" roughness={0.94} />
        </mesh>
        <mesh position={[-5.2, 0.2, 3.7]} rotation={[0, 0.24, 0]}>
          <boxGeometry args={[3.4, 8.8, 1.2]} />
          <meshStandardMaterial color="#080908" roughness={1} />
        </mesh>
      </group>

      <group position={[0, 0.25, -8.8]} rotation={[0, 0.12, 0]}>
        <mesh castShadow receiveShadow material={plaster}>
          <boxGeometry args={[10.5, 7.6, 0.42]} />
        </mesh>
        {[-3.5, -1.75, 0, 1.75, 3.5].map((x) => (
          <mesh key={x} position={[x, 0, 0.23]}>
            <boxGeometry args={[0.012, 7.1, 0.012]} />
            <meshBasicMaterial color="#8e897f" transparent opacity={0.45} />
          </mesh>
        ))}
        <mesh position={[3.65, -1.4, 0.52]} castShadow>
          <boxGeometry args={[2.15, 2.15, 0.85]} />
          <meshStandardMaterial color="#494842" roughness={0.43} metalness={0.48} />
        </mesh>
      </group>

      <mesh position={[5.8, 0.5, -10.9]} rotation={[0, -0.38, 0]} castShadow>
        <boxGeometry args={[2.4, 9, 1.4]} />
        <meshStandardMaterial color="#121310" roughness={0.96} />
      </mesh>

      <group ref={lampGroup} position={[0.25, 0.95, -18]}>
        <mesh castShadow position={[0, 1.15, 0]}>
          <cylinderGeometry args={[1.55, 2.35, 1.15, 48, 1, true]} />
          <meshStandardMaterial color="#4b4a45" roughness={0.34} metalness={0.72} side={THREE.DoubleSide} />
        </mesh>
        <mesh castShadow position={[0, 1.72, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 2.5, 24]} />
          <meshStandardMaterial color="#34342f" roughness={0.38} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[1.35, 1.75, 0.24, 48]} />
          <meshStandardMaterial
            ref={lampMaterial}
            color="#f2d7a8"
            emissive="#d49a54"
            emissiveIntensity={2.7}
            roughness={0.38}
          />
        </mesh>
        <pointLight castShadow color="#d49a54" intensity={62} distance={12} decay={2} position={[0, 0.15, 0]} />
      </group>

      <mesh position={[-5.6, 0, -17]} rotation={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[2.1, 9.5, 2.2]} />
        <meshStandardMaterial color="#0d0e0c" roughness={0.98} />
      </mesh>
      <mesh position={[6.2, -0.4, -20]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[3.4, 7, 2.8]} />
        <meshStandardMaterial color="#171814" roughness={0.92} />
      </mesh>
      <mesh position={[0, 4.8, -18]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0b0c0b" roughness={1} />
      </mesh>
    </>
  );
}

export default function CinematicCanvas({ progressRef, reducedMotion }: CinematicCanvasProps) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      dpr={[1, mobile ? 1.2 : 1.5]}
      camera={{ fov: 37, near: 0.05, far: 70, position: [6.2, 3.1, 8.8] }}
      gl={{ antialias: !mobile, alpha: false, powerPreference: "high-performance" }}
      shadows={!mobile}
    >
      <DirectedCamera progressRef={progressRef} reducedMotion={reducedMotion} />
      <ArchitecturalWorld reducedMotion={reducedMotion} />
    </Canvas>
  );
}
