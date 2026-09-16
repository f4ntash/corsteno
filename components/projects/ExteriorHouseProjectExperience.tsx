// @ts-nocheck
// Ported from a standalone Three.js sketch (window-scoped renderer/camera/scene)
// into a self-contained React client component. The sketch is heavily dynamic
// (canvas-based textures, shader patches, raycasting), so this file is left
// un-typed (@ts-nocheck) rather than forcing partial/incorrect types onto it.
// If you want full typing later, the cleanest path is to type WheelMachine's
// public surface (update, display, showResult) and leave the internals as any.

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import styles from "./projectCaseStudy.module.css";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setGColor(g, color) {
  const c = new THREE.Color(color);
  g.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(
      Array.from({ length: g.attributes.position.count }, () => [...c]).flat(),
      3
    )
  );
}

let fontsLoadedPromise = null;
function ensureFontsLoaded() {
  if (!fontsLoadedPromise) {
    fontsLoadedPromise = (async () => {
      async function loadFont(fontface) {
        await fontface.load();
        document.fonts.add(fontface);
      }
      const fonts = [
        new FontFace(
          "Anta",
          "url(https://fonts.gstatic.com/s/anta/v1/gyBzhwQ3KsIyVFs7PQ.woff2) format('woff2')"
        ),
      ];
      for (const font of fonts) {
        await loadFont(font);
      }
    })();
  }
  return fontsLoadedPromise;
}

// ---------------------------------------------------------------------------
// WheelMachine
// ---------------------------------------------------------------------------

class WheelMachine extends THREE.Group {
  constructor(renderer, camera, controls) {
    super();

    const rWheel = 5;

    // <body>
    // <main arc>
    const rArc = rWheel + 0.5;
    const arcThickness = 0.5;
    const arcAngle = Math.PI * 0.875;
    const gArc = new THREE.ExtrudeGeometry(
      new THREE.Shape()
        .absarc(0, 0, rArc + arcThickness, 0, arcAngle)
        .absarc(
          Math.cos(arcAngle) * (rArc + arcThickness * 0.5),
          Math.sin(arcAngle) * (rArc + arcThickness * 0.5),
          arcThickness * 0.5,
          arcAngle,
          arcAngle + Math.PI
        )
        .absarc(0, 0, rArc, arcAngle, Math.PI * 2, true)
        .absarc(rArc + arcThickness * 0.5, 0, arcThickness * 0.5, Math.PI, Math.PI * 2),
      {
        curveSegments: 50,
        bevelEnabled: true,
        bevelSegments: 5,
      }
    ).rotateZ(arcAngle * -0.5);
    setGColor(gArc, "#fff");

    const gPointer = new THREE.ExtrudeGeometry(
      new THREE.Shape()
        .moveTo(0, -Math.hypot(0.25, 0.25))
        .lineTo(0.25, 0.25)
        .lineTo(-0.25, 0.25),
      {
        depth: 0.75,
        bevelEnabled: true,
      }
    ).translate(0, rArc + 0.25, 0);
    setGColor(gPointer, "hsl(0, 100%, 75%)");

    const mArc = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.9,
      roughness: 0.7,
    });

    const arc = new THREE.Mesh(
      mergeGeometries([gArc.clone(), gArc.clone().rotateZ(Math.PI), gPointer]),
      mArc
    );

    this.add(arc);
    // </main arc>

    // <wheel>
    const gWheel = new THREE.ExtrudeGeometry(new THREE.Shape().absarc(0, 0, rWheel, 0, Math.PI * 2), {
      depth: 0.5,
      curveSegments: 200,
      bevelEnabled: true,
      bevelSegments: 5,
    });

    this.amountSectors = 12;
    const mWheel = [
      new THREE.MeshStandardMaterial({
        metalness: 0.6,
        roughness: 0.9,
        map: (() => {
          const c = document.createElement("canvas");
          c.width = c.height = 1024;
          const ctx = c.getContext("2d");
          const u = (val) => (val * 0.01 * c.height);

          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, c.width, c.height);

          const amount = this.amountSectors;
          const r = 35;
          const a = (Math.PI * 2) / amount;
          const hA = a * 0.5;
          ctx.font = `${u(10)}px Anta`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.translate(u(50), u(50));
          for (let i = 0; i < amount; i++) {
            const iVal = i + (i % 2) * 4;
            ctx.fillStyle = `hsl(240, 100%, ${(iVal / (amount - 1)) * 10 + 80}%)`;
            ctx.beginPath();
            ctx.moveTo(Math.cos(-hA + Math.PI * 0.5) * u(50), Math.sin(-hA + Math.PI * 0.5) * u(50));
            ctx.arc(0, 0, u(50), -hA - Math.PI * 0.5, hA - Math.PI * 0.5);
            ctx.arc(0, 0, u(5), hA - Math.PI * 0.5, -hA - Math.PI * 0.5, true);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "navy";
            const text = i + 1;
            ctx.fillText(String(text), 0, -u(r));

            ctx.rotate(a);
          }

          ctx.lineWidth = u(2);
          ctx.strokeStyle = "#fff";
          ctx.beginPath();
          ctx.arc(0, 0, u(20), -Math.PI * 0.5 - hA, Math.PI * 0.5 - hA);
          ctx.stroke();

          ctx.strokeStyle = "navy";
          ctx.beginPath();
          ctx.arc(0, 0, u(20), Math.PI * 0.5 - hA, Math.PI * 1.5 - hA);
          ctx.stroke();

          ctx.fillStyle = "navy";
          ctx.beginPath();
          ctx.arc(0, 0, u(5), -hA - Math.PI * 0.5, Math.PI * 0.5 - hA);
          ctx.fill();

          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = "srgb";
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          tex.offset.setScalar(0.5);
          tex.repeat.setScalar(1 / (rWheel * 2));
          return tex;
        })(),
        onBeforeCompile: (shader) => {
          shader.vertexShader = `
                varying float showTexture;
                ${shader.vertexShader}
              `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
                  showTexture = step(0., normal.z);
                `
          );
          shader.fragmentShader = `
                varying float showTexture;
                ${shader.fragmentShader}
              `.replace(
            `#include <map_fragment>`,
            `#include <map_fragment>
                  
                  diffuseColor.rgb = mix(diffuse, diffuseColor.rgb, showTexture);
                `
          );
        },
      }),
      new THREE.MeshStandardMaterial({
        metalness: 0.9,
        roughness: 0.6,
      }),
    ];
    const wheel = new THREE.Mesh(gWheel, mWheel);
    wheel.rotation.z = Math.random() * Math.PI * 2;
    this.add(wheel);
    this.wheel = wheel;
    // </wheel>

    // <spin button>
    // Centered on the wheel's axis (x = 0, y = 0), sitting just in front of
    // the wheel's face along z so it reads as the hub of the wheel.
    const shapeSpinButtonSize = new THREE.Vector2(2, 3);
    const shapeSpinButtonRoundness = 0.5;
    const hW = shapeSpinButtonSize.x * 0.5;
    const hH = shapeSpinButtonSize.y * 0.5;
    const cx = hW - shapeSpinButtonRoundness;
    const cy = hH - shapeSpinButtonRoundness;
    const aStep = Math.PI * 0.5;
    const shapeSpinButton = new THREE.Shape()
      .absarc(cx, cy, shapeSpinButtonRoundness, aStep * 0, aStep * 1)
      .absarc(-cx, cy, shapeSpinButtonRoundness, aStep * 1, aStep * 2)
      .absarc(-cx, -cy, shapeSpinButtonRoundness, aStep * 2, aStep * 3)
      .absarc(cx, -cy, shapeSpinButtonRoundness, aStep * 3, aStep * 4);
    const gSpinButton = new THREE.ExtrudeGeometry(shapeSpinButton, {
      depth: 0.01,
      curveSegments: 20,
      bevelEnabled: true,
      bevelSegments: 5,
    });

    this.spinButtonUniforms = {
      transition: { value: 0 },
    };
    const mSpinButton = [
      new THREE.MeshBasicMaterial({
        map: (() => {
          const c = document.createElement("canvas");
          const ctx = c.getContext("2d");
          const sizeUnit = 512;
          c.width = sizeUnit * 2;
          c.height = sizeUnit * 3;
          const u = (val) => (val * 0.01 * c.height);

          ctx.translate(c.width * 0.5, c.height * 0.55);

          ctx.font = `${u(15)}px Anta`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#fff";
          ["push", "hold", "release"].forEach((l, lIdx, lArr) => {
            const start = -(lArr.length - 1) * 0.5;
            const yPos = (start + lIdx) * 30;
            ctx.fillText(l, 0, u(yPos));
          });

          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = "srgb";
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          tex.offset.setScalar(0.5);
          tex.repeat.set(1 / 2, 1 / 3);
          return tex;
        })(),
        onBeforeCompile: (shader) => {
          shader.uniforms.transition = this.spinButtonUniforms.transition;
          shader.vertexShader = `
                varying float showTexture;
                ${shader.vertexShader}
              `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
                  showTexture = step(0., normal.z);
                `
          );
          shader.fragmentShader = `
                uniform float transition;
                varying float showTexture;
                ${shader.fragmentShader}
              `.replace(
            `#include <map_fragment>`,
            `#include <map_fragment>
                
                  vec3 colOff = mix(vec3(1), vec3(0), diffuseColor.r);
                  vec3 colOn = mix(vec3(0.25, 0.25, 1), vec3(1, 1, 1), diffuseColor.r);
                  
                  float tVal = 1. - transition;
                  float fw = fwidth(vMapUv.y);
                  float fTransition = smoothstep(tVal - fw, tVal + fw, vMapUv.y);
                  
                  diffuseColor.rgb = mix(colOff, colOn, fTransition);
                  
                  diffuseColor.rgb = mix(diffuse, diffuseColor.rgb, showTexture);
                `
          );
        },
      }),
      new THREE.MeshStandardMaterial({
        metalness: 0.9,
        roughness: 0.7,
      }),
    ];
    const spinButton = new THREE.Mesh(gSpinButton, mSpinButton);
    // Centered over the wheel's hub instead of offset to one side.
    spinButton.position.set(0, 0, 1.25);
    this.add(spinButton);
    // </spin button>

    // <screen>
    this.screenCanvas = document.createElement("canvas");
    const sizeUnit = 512;
    this.screenCanvas.width = sizeUnit * 2;
    this.screenCanvas.height = sizeUnit * 3;
    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.colorSpace = "srgb";
    this.screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    this.screenTexture.offset.setScalar(0.5);
    this.screenTexture.repeat.set(1 / 2, 1 / 3);
    const gScreen = gSpinButton.clone();
    const mScreen = [
      new THREE.MeshBasicMaterial({
        map: this.screenTexture,
        onBeforeCompile: (shader) => {
          shader.vertexShader = `
                varying float showTexture;
                ${shader.vertexShader}
              `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
                  showTexture = step(0., normal.z);
                `
          );
          shader.fragmentShader = `
                varying float showTexture;
                ${shader.fragmentShader}
              `.replace(
            `#include <map_fragment>`,
            `#include <map_fragment>
                  diffuseColor.rgb = mix(diffuse, diffuseColor.rgb, showTexture);
                `
          );
        },
      }),
      new THREE.MeshStandardMaterial({
        metalness: 0.9,
        roughness: 0.7,
      }),
    ];
    const screen = new THREE.Mesh(gScreen, mScreen);
    screen.position.set(rArc + 0.2, 0, 1.25);
    this.add(screen);
    // </screen>

    this.speedParams = {
      isRunning: false,
      easing: (val) => THREE.MathUtils.clamp(THREE.MathUtils.smoothstep(val, 0, 1), 0, 1),
      speedScale: 0,
      speedUp: 1 / 1,
      speedDown: -1 / 5, // 2x the previous -1/10, so it decelerates twice as fast
      speedMultiplier: Math.PI * 2,
      speedDir: -1 / 5,
    };

    // <interaction>
    // Two ways to spin the wheel, mutually exclusive via `this.mode`:
    //   - "button-spin": press/hold/release the central button (existing).
    //   - "dragging" -> "flinging": click (or touch) the wheel itself, drag
    //     it around, and release — it keeps spinning and decelerates like a
    //     flicked dial, then settles on a result.
    this.mode = "idle"; // "idle" | "button-spin" | "dragging" | "flinging"
    this.flingVelocity = 0; // rad/s, used while mode === "flinging"

    // A spin only counts once its peak speed clears this bar — a light tap
    // on the button or a weak drag/flick shouldn't be able to land a result.
    // Tune this rad/s value to taste (Math.PI * 2 ≈ one full turn/second).
    this.minSpinSpeed = Math.PI * 1.2;
    this.peakSpeed = 0; // highest angular speed (rad/s) reached during the current attempt

    this.interaction = {
      raycaster: new THREE.Raycaster(),
      pointer: new THREE.Vector2(),
    };
    const drag = {
      pointerId: null,
      centerX: 0,
      centerY: 0,
      lastAngle: 0,
      lastTime: 0,
      velocity: 0,
    };
    const maxFlingSpeed = Math.PI * 6; // cap: 3 full turns per second

    const toNdc = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    // Returns the first of [spinButton, wheel] under the pointer, or null.
    const hitTest = (event) => {
      const ia = this.interaction;
      const ndc = toNdc(event);
      ia.pointer.set(ndc.x, ndc.y);
      ia.raycaster.setFromCamera(ia.pointer, camera);
      const hits = ia.raycaster.intersectObjects([spinButton, wheel], false);
      return hits.length > 0 ? hits[0].object : null;
    };

    // Projects the wheel's current world-space center to screen (page) space
    // so drag angles can be measured around it. Only needs recomputing at
    // drag-start since orbiting is suspended for the duration of the drag.
    const wheelCenterOnScreen = () => {
      const worldPos = new THREE.Vector3();
      wheel.getWorldPosition(worldPos);
      worldPos.project(camera);
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: (worldPos.x * 0.5 + 0.5) * rect.width + rect.left,
        y: (-worldPos.y * 0.5 + 0.5) * rect.height + rect.top,
      };
    };

    // Angle (radians) of the pointer around the wheel's screen-space center.
    // Flipped on Y because screen coordinates increase downward while we
    // want the angle to increase counter-clockwise, matching rotation.z.
    // (If the wheel ever spins opposite to the drag direction, negate this.)
    const angleAround = (event, center) =>
      Math.atan2(-(event.clientY - center.y), event.clientX - center.x);

    const onPointerMove = (event) => {
      if (this.mode === "dragging" && event.pointerId === drag.pointerId) {
        const now = performance.now();
        const dt = Math.max((now - drag.lastTime) / 1000, 1 / 240);
        const angle = angleAround(event, { x: drag.centerX, y: drag.centerY });
        let delta = angle - drag.lastAngle;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        this.wheel.rotation.z += delta;

        const instantVelocity = delta / dt;
        drag.velocity = THREE.MathUtils.lerp(drag.velocity, instantVelocity, 0.35);
        this.peakSpeed = Math.max(this.peakSpeed, Math.abs(drag.velocity));
        drag.lastAngle = angle;
        drag.lastTime = now;
        return;
      }

      // Not dragging: just update the hover cursor.
      const hit = hitTest(event);
      renderer.domElement.style.cursor =
        hit === spinButton ? "pointer" : hit === wheel ? "grab" : "auto";
    };

    const onPointerDown = (event) => {
      const hit = hitTest(event);

      if (hit === spinButton) {
        this.mode = "button-spin";
        this.peakSpeed = 0;
        this.speedParams.isRunning = true;
        this.display();
        this.speedParams.speedDir = this.speedParams.speedUp;
        return;
      }

      if (hit === wheel) {
        this.mode = "dragging";
        this.flingVelocity = 0;
        this.peakSpeed = 0;
        if (controls) controls.enabled = false; // don't orbit while spinning the wheel
        renderer.domElement.setPointerCapture(event.pointerId);
        renderer.domElement.style.cursor = "grabbing";

        const center = wheelCenterOnScreen();
        drag.pointerId = event.pointerId;
        drag.centerX = center.x;
        drag.centerY = center.y;
        drag.lastAngle = angleAround(event, center);
        drag.lastTime = performance.now();
        drag.velocity = 0;
      }
    };

    const onPointerUp = (event) => {
      if (this.mode === "button-spin") {
        // Releasing anywhere ends the hold, same as before.
        this.speedParams.speedDir = this.speedParams.speedDown;
        return;
      }

      if (this.mode === "dragging" && event.pointerId === drag.pointerId) {
        if (controls) controls.enabled = true;
        renderer.domElement.releasePointerCapture(event.pointerId);
        renderer.domElement.style.cursor = "grab";

        drag.pointerId = null;
        this.flingVelocity = THREE.MathUtils.clamp(drag.velocity, -maxFlingSpeed, maxFlingSpeed);
        this.mode = Math.abs(this.flingVelocity) > 0.02 ? "flinging" : "idle";
        if (this.mode === "idle") this.showResult();
      }
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    // Exposed so the component can remove these listeners on unmount.
    this._disposeInteraction = () => {
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
    };
    // </interaction>

    this.display();
    // </body>
  }

  update(dt) {
    if (this.mode === "dragging") {
      // Rotation is driven directly by pointermove while dragging.
      return;
    }

    if (this.mode === "flinging") {
      this.wheel.rotation.z += this.flingVelocity * dt;
      const frictionPerSecond = 2.5; // higher = stops sooner
      this.flingVelocity *= Math.exp(-frictionPerSecond * dt);
      if (Math.abs(this.flingVelocity) < 0.02) {
        this.flingVelocity = 0;
        this.mode = "idle";
        this.finishAttempt();
      }
      return;
    }

    // "idle" or "button-spin": existing push/hold/release ramp.
    const params = this.speedParams;

    params.speedScale += params.speedDir * dt;

    const easedScale = params.easing(THREE.MathUtils.clamp(params.speedScale, 0, 1));
    const instSpeed = easedScale * params.speedMultiplier;
    if (params.isRunning) this.peakSpeed = Math.max(this.peakSpeed, instSpeed);

    if (params.speedScale <= 0 && params.isRunning === true) {
      params.isRunning = false;
      this.mode = "idle";
      this.finishAttempt();
    }
    this.spinButtonUniforms.transition.value = params.speedScale;
    params.speedScale = THREE.MathUtils.clamp(params.speedScale, 0, 1);

    const speedVal = dt * easedScale * params.speedMultiplier;
    this.wheel.rotation.z += speedVal;
  }

  // Called whenever the wheel comes to rest after an attempt (button
  // release or drag-fling). Only counts as a valid throw — and only then
  // shows a sector — if the attempt's peak speed cleared minSpinSpeed.
  finishAttempt() {
    if (this.peakSpeed >= this.minSpinSpeed) {
      this.showResult();
    } else {
      this.display("too soft");
    }
    this.peakSpeed = 0;
  }

  display(content) {
    const c = this.screenCanvas;
    const ctx = c.getContext("2d");
    const u = (val) => (val * 0.01 * c.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.save();

    ctx.translate(c.width * 0.5, c.height * 0.5);

    if (typeof content === "number") {
      ctx.fillStyle = "#88f";
      ctx.font = `${u(55)}px Anta`;
      ctx.fillText(String(content), 0, 0);
    } else if (typeof content === "string") {
      ctx.fillStyle = "#000";
      ctx.font = `${u(14)}px Anta`;
      ctx.fillText(content, 0, 0);
    } else {
      ctx.fillStyle = "#000";
      ctx.font = `${u(14)}px Anta`;
      ctx.fillText("spinning", 0, 0);
    }

    ctx.restore();

    const tex = this.screenTexture;
    tex.needsUpdate = true;
  }

  showResult() {
    const aSector = (Math.PI * 2) / this.amountSectors;
    const twoPi = Math.PI * 2;
    // Normalize into [0, 2π) first — JS's `%` keeps the sign of the
    // dividend, so a wheel that was ever spun with a negative rotation.z
    // (e.g. dragged the other way) could otherwise land on a negative
    // angle here and print a sector number that doesn't exist on the wheel.
    let angle = (this.wheel.rotation.z + aSector * 0.5) % twoPi;
    if (angle < 0) angle += twoPi;

    let sectorId = Math.ceil(angle / aSector);
    if (sectorId <= 0) sectorId = this.amountSectors; // landed exactly on the seam
    if (sectorId > this.amountSectors) sectorId = this.amountSectors;

    this.display(sectorId);
  }

  disposeInteraction() {
    this._disposeInteraction?.();
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExteriorHouseProjectExperience() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isActive = true;
    let renderer = null;
    let wheelMachine = null;
    const cleanupFns = [];

    (async () => {
      await ensureFontsLoaded();
      if (!isActive || !container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        30,
        container.clientWidth / Math.max(container.clientHeight, 1),
        1,
        100
      );
      camera.position.set(-0.25, 0.1, 1).setLength(30);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      container.appendChild(renderer.domElement);

      const handleResize = () => {
        if (!renderer || !container) return;
        const width = container.clientWidth;
        const height = Math.max(container.clientHeight, 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
      cleanupFns.push(() => resizeObserver.disconnect());

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // Right-click (and any two-finger drag) panning is fully disabled —
      // the right mouse button is unmapped so it triggers no camera action.
      controls.enablePan = false;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: null,
      };
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };

      // Left-click orbit is limited to a modest range around the default
      // view so the wheel can't be spun around to odd angles. Tweak these
      // four values to taste.
      controls.minAzimuthAngle = -Math.PI / 4; // -45°
      controls.maxAzimuthAngle = Math.PI / 4; // +45°
      controls.minPolarAngle = Math.PI / 3; // 60° from top
      controls.maxPolarAngle = Math.PI / 1.8; // ~100° from top

      // Limits how much the camera can dolly in/out. Camera starts at a
      // distance of 30, so this allows a moderate zoom range around that.
      controls.minDistance = 18;
      controls.maxDistance = 45;

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      room.children[0].color.set("#a8a");
      const bgTexture = pmremGenerator.fromScene(room, 0.04).texture;
      scene.environment = bgTexture;
      scene.background = bgTexture;
      scene.backgroundIntensity = 0.05;

      wheelMachine = new WheelMachine(renderer, camera, controls);
      scene.add(wheelMachine);

      const clock = new THREE.Clock();

      renderer.setAnimationLoop(() => {
        const dt = clock.getDelta();
        controls.update();
        wheelMachine?.update(dt);
        renderer.render(scene, camera);
      });

      cleanupFns.push(() => {
        renderer?.setAnimationLoop(null);
        wheelMachine?.disposeInteraction();
        controls.dispose();
        pmremGenerator.dispose();

        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
            materials.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              mat.dispose();
            });
          }
        });

        if (renderer) {
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
          renderer.dispose();
        }
      });
    })();

    return () => {
      isActive = false;
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.threeExperience} data-project-viewer="exterior-house" />
  );
}