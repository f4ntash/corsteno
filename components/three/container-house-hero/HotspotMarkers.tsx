import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

type HotspotItem = { key: string; label: string };

type HotspotMarkersProps = {
  items: HotspotItem[];
  /** Devuelve el objeto 3D sobre el que se dibuja el punto (la cámara o la luz). */
  getObject: (key: string) => THREE.Object3D | undefined;
  /** Punto seleccionado (se resalta). */
  activeKey: string | null;
  /** Puntos atenuados (por ejemplo, luces apagadas). */
  dimmedKeys?: Set<string>;
  onSelect: (key: string) => void;
  ariaLabel: (label: string) => string;
  /** El punto funciona como interruptor (luces): se anuncia como "pulsado" cuando está encendido. */
  toggleable?: boolean;
  /** Si la vista está a menos de esta distancia (m) del punto, se oculta. 0 = nunca se oculta. */
  hideDistance?: number;
};

function Hotspot({
  item,
  number,
  getObject,
  active,
  dimmed,
  onSelect,
  ariaLabel,
  toggleable,
  hideDistance,
}: {
  item: HotspotItem;
  number: number;
  getObject: HotspotMarkersProps["getObject"];
  active: boolean;
  dimmed: boolean;
  onSelect: (key: string) => void;
  ariaLabel: (label: string) => string;
  toggleable: boolean;
  hideDistance: number;
}) {
  const group = useRef<THREE.Group>(null);
  const position = useMemo(() => new THREE.Vector3(), []);
  // Arranca oculto hasta calcular la posición real (evita un destello en el origen)
  const [hidden, setHidden] = useState(true);
  const hiddenRef = useRef(true);

  useFrame(({ camera }) => {
    const object = getObject(item.key);
    const anchor = group.current;
    if (!object || !anchor) return;

    // Posición actual, ya con el modelo centrado y escalado
    object.getWorldPosition(position);
    anchor.position.copy(position);

    const tooClose = hideDistance > 0 && camera.position.distanceTo(position) < hideDistance;
    if (tooClose !== hiddenRef.current) {
      hiddenRef.current = tooClose;
      setHidden(tooClose);
    }
  });

  return (
    <group ref={group}>
      <Html center zIndexRange={[20, 0]}>
        <button
          type="button"
          className="container-hero-hotspot"
          data-active={active ? "true" : undefined}
          data-dim={dimmed ? "true" : undefined}
          data-hidden={hidden ? "true" : undefined}
          tabIndex={hidden ? -1 : 0}
          aria-label={ariaLabel(item.label)}
          aria-pressed={toggleable ? !dimmed : undefined}
          onClick={() => onSelect(item.key)}
        >
          <span aria-hidden="true">{number}</span>
          <span className="container-hero-hotspot-label" aria-hidden="true">{item.label}</span>
        </button>
      </Html>
    </group>
  );
}

/** Puntos numerados, minimalistas, sobre la posición de cada cámara o luz del modelo. */
export default function HotspotMarkers({
  items,
  getObject,
  activeKey,
  dimmedKeys,
  onSelect,
  ariaLabel,
  toggleable = false,
  hideDistance = 0,
}: HotspotMarkersProps) {
  return (
    <>
      {items.map((item, index) => (
        <Hotspot
          key={item.key}
          item={item}
          number={index + 1}
          getObject={getObject}
          active={item.key === activeKey}
          dimmed={dimmedKeys?.has(item.key) ?? false}
          onSelect={onSelect}
          ariaLabel={ariaLabel}
          toggleable={toggleable}
          hideDistance={hideDistance}
        />
      ))}
    </>
  );
}
