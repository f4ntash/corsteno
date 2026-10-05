import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Atmosphere } from "./presets";

const STAR_SHELL = 300;

function randomGenerator(seed: number) {
  let state = seed >>> 0;
  return () => ((state = (state * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function makeCloudTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const random = randomGenerator(7);
  for (let index = 0; index < 14; index += 1) {
    const x = size * (0.25 + 0.5 * random());
    const y = size * (0.35 + 0.3 * random());
    const radius = size * (0.14 + 0.12 * random());
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeStars(count: number, seed: number) {
  const random = randomGenerator(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const y = -0.1 + 1.1 * random();
    const phi = Math.PI * 2 * random();
    const horizontalRadius = Math.sqrt(1 - y * y);
    positions[index * 3] = Math.cos(phi) * horizontalRadius * STAR_SHELL;
    positions[index * 3 + 1] = y * STAR_SHELL;
    positions[index * 3 + 2] = Math.sin(phi) * horizontalRadius * STAR_SHELL;
    const brightness = 0.35 + 0.65 * random() * random();
    const warmth = random();
    colors[index * 3] = brightness * (0.85 + 0.15 * warmth);
    colors[index * 3 + 1] = brightness * 0.92;
    colors[index * 3 + 2] = brightness * (1 - 0.15 * warmth);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

export default function Sky({
  phase,
  radius = 8,
  showClouds = true,
  showStars = true,
}: {
  phase: Atmosphere;
  radius?: number;
  showClouds?: boolean;
  showStars?: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const starsRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  const first = useRef(phase);
  const scale = Math.max(radius, 10);

  const cloudTexture = useMemo(() => makeCloudTexture(), []);
  const cloudMaterial = useMemo(
    () => new THREE.SpriteMaterial({
      map: cloudTexture,
      color: first.current.cloudColor,
      opacity: first.current.cloudOpacity,
      transparent: true,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    }),
    [cloudTexture],
  );

  const puffs = useMemo(() => {
    const random = randomGenerator(21);
    const list: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    const cloudCount = 10;
    for (let index = 0; index < cloudCount; index += 1) {
      const angle = (index / cloudCount) * Math.PI * 2 + random() * 0.4;
      const ring = scale * (2 + random() * 0.8);
      const height = scale * (0.9 + random() * 0.7);
      const centerX = Math.sin(angle) * ring;
      const centerZ = Math.cos(angle) * ring;
      const puffCount = 4 + Math.floor(random() * 3);
      for (let puff = 0; puff < puffCount; puff += 1) {
        const width = scale * (0.9 + random() * 0.8);
        list.push({
          position: [centerX + (random() - 0.5) * scale * 1.4, height + (random() - 0.5) * scale * 0.25, centerZ + (random() - 0.5) * scale * 1.4],
          scale: [width, width * (0.45 + random() * 0.2), 1],
        });
      }
    }
    return list;
  }, [scale]);

  const stars = useMemo(() => {
    const makeMaterial = (size: number) => new THREE.PointsMaterial({
      size,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: first.current.starOpacity,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    });
    return {
      smallGeometry: makeStars(1500, 5),
      bigGeometry: makeStars(220, 11),
      smallMaterial: makeMaterial(1.4),
      bigMaterial: makeMaterial(2.6),
    };
  }, []);

  useEffect(() => () => {
    cloudTexture.dispose();
    cloudMaterial.dispose();
    stars.smallGeometry.dispose();
    stars.bigGeometry.dispose();
    stars.smallMaterial.dispose();
    stars.bigMaterial.dispose();
  }, [cloudTexture, cloudMaterial, stars]);

  const cloudTarget = useMemo(() => new THREE.Color(phase.cloudColor), [phase.cloudColor]);

  useFrame(({ clock }, delta) => {
    const clouds = cloudsRef.current;
    const starsGroup = starsRef.current;
    if (!clouds || !starsGroup) return;
    const speed = 3;
    const colorBlend = 1 - Math.exp(-speed * delta);
    cloudMaterial.color.lerp(cloudTarget, colorBlend);
    cloudMaterial.opacity = THREE.MathUtils.damp(cloudMaterial.opacity, phase.cloudOpacity, speed, delta);
    clouds.visible = showClouds && cloudMaterial.opacity > 0.01;
    clouds.rotation.y += delta * 0.004;
    stars.smallMaterial.opacity = THREE.MathUtils.damp(stars.smallMaterial.opacity, phase.starOpacity, speed, delta);
    stars.bigMaterial.opacity = stars.smallMaterial.opacity * (0.85 + 0.15 * Math.sin(clock.elapsedTime * 1.8));
    starsGroup.visible = showStars && stars.smallMaterial.opacity > 0.01;
    starsGroup.position.copy(camera.position);
  });

  return (
    <>
      <group ref={cloudsRef}>
        {puffs.map((puff, index) => <sprite key={index} position={puff.position} scale={puff.scale} material={cloudMaterial} />)}
      </group>
      <group ref={starsRef}>
        <points geometry={stars.smallGeometry} material={stars.smallMaterial} frustumCulled={false} />
        <points geometry={stars.bigGeometry} material={stars.bigMaterial} frustumCulled={false} />
      </group>
    </>
  );
}
