import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Atmosphere } from "./presets";

const MIN_DIST = 14;
const SHADOW_MAP = 4096;

export function sunPosition(azimuthDeg: number, elevationDeg: number, distance = MIN_DIST) {
  const azimuth = THREE.MathUtils.degToRad(azimuthDeg);
  const elevation = THREE.MathUtils.degToRad(elevationDeg);
  return new THREE.Vector3(
    distance * Math.cos(elevation) * Math.sin(azimuth),
    distance * Math.sin(elevation),
    distance * Math.cos(elevation) * Math.cos(azimuth),
  );
}

export default function Lighting({
  azimuth,
  elevation,
  intensity,
  phase,
  radius = 8,
}: {
  azimuth: number;
  elevation: number;
  intensity: number;
  phase: Atmosphere;
  radius?: number;
}) {
  const scene = useThree((state) => state.scene);
  const light = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const marker = useRef<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>>(null);
  const markerMat = useRef<THREE.MeshBasicMaterial>(null);
  const distance = Math.max(MIN_DIST, radius * 1.6);

  const initial = useRef({
    position: sunPosition(azimuth, elevation, distance).toArray() as [number, number, number],
    intensity,
    sunColor: phase.sunColor,
    hemiSky: phase.hemiSky,
    hemiGround: phase.hemiGround,
    hemiIntensity: phase.hemiIntensity,
  });

  const background = useMemo(() => new THREE.Color(phase.skyColor), []);
  useEffect(() => {
    scene.background = background;
  }, [scene, background]);

  useEffect(() => {
    const directional = light.current;
    if (!directional) return;
    const bounds = radius * 1.15;
    const shadowCamera = directional.shadow.camera;
    shadowCamera.left = -bounds;
    shadowCamera.right = bounds;
    shadowCamera.top = bounds;
    shadowCamera.bottom = -bounds;
    shadowCamera.near = 0.1;
    shadowCamera.far = distance + bounds * 1.2;
    shadowCamera.updateProjectionMatrix();
    directional.shadow.normalBias = Math.max(0.02, radius * 0.002);
  }, [radius, distance]);

  const colors = useMemo(
    () => ({
      sun: new THREE.Color(phase.sunColor),
      sky: new THREE.Color(phase.skyColor),
      hemiSky: new THREE.Color(phase.hemiSky),
      hemiGround: new THREE.Color(phase.hemiGround),
    }),
    [phase],
  );

  useFrame((_, delta) => {
    const directional = light.current;
    const hemisphere = hemi.current;
    const sunMarker = marker.current;
    const sunMarkerMaterial = markerMat.current;
    if (!directional || !hemisphere || !sunMarker || !sunMarkerMaterial) return;

    const speed = 3;
    const colorBlend = 1 - Math.exp(-speed * delta);
    const target = sunPosition(azimuth, elevation, distance);
    directional.position.x = THREE.MathUtils.damp(directional.position.x, target.x, speed, delta);
    directional.position.y = THREE.MathUtils.damp(directional.position.y, target.y, speed, delta);
    directional.position.z = THREE.MathUtils.damp(directional.position.z, target.z, speed, delta);
    directional.intensity = THREE.MathUtils.damp(directional.intensity, intensity, speed, delta);
    directional.color.lerp(colors.sun, colorBlend);

    hemisphere.intensity = THREE.MathUtils.damp(hemisphere.intensity, phase.hemiIntensity, speed, delta);
    hemisphere.color.lerp(colors.hemiSky, colorBlend);
    hemisphere.groundColor.lerp(colors.hemiGround, colorBlend);
    background.lerp(colors.sky, colorBlend);

    sunMarker.position.copy(directional.position).multiplyScalar(1.5);
    sunMarker.scale.setScalar(distance / MIN_DIST);
    sunMarkerMaterial.color.copy(directional.color);
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={[initial.current.hemiSky, initial.current.hemiGround, initial.current.hemiIntensity]} />
      <directionalLight
        ref={light}
        position={initial.current.position}
        intensity={initial.current.intensity}
        color={initial.current.sunColor}
        castShadow
        shadow-mapSize={[SHADOW_MAP, SHADOW_MAP]}
        shadow-bias={-0.0004}
      />
      <mesh ref={marker}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial ref={markerMat} toneMapped={false} fog={false} />
      </mesh>
    </>
  );
}
