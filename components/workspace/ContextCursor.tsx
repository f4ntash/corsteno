"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = {
  label: string;
  visible: boolean;
  dark: boolean;
};

export default function ContextCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const positionedRef = useRef(false);
  const [cursor, setCursor] = useState<CursorState>({
    label: "VER",
    visible: false,
    dark: false,
  });

  useEffect(() => {
    const getCursorElement = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>("[data-cursor]") : null;

    const onPointerMove = (event: PointerEvent) => {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
      if (!positionedRef.current) {
        positionRef.current.x = event.clientX;
        positionRef.current.y = event.clientY;
        positionedRef.current = true;
      }
    };

    const onPointerOver = (event: PointerEvent) => {
      const element = getCursorElement(event.target);
      if (!element) return;
      setCursor((current) => ({
        ...current,
        label: element.dataset.cursor || "VER",
        visible: true,
        dark: Boolean(element.closest(".dark")),
      }));
    };

    const onPointerOut = (event: PointerEvent) => {
      const element = getCursorElement(event.target);
      const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (!element || (related && element.contains(related))) return;
      setCursor((current) => ({ ...current, visible: false }));
    };

    const onCursorLabel = (event: Event) => {
      const label = (event as CustomEvent<{ label?: string }>).detail.label;
      if (!label) return;
      setCursor((current) => ({ ...current, label }));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("forma3d:cursor-label", onCursorLabel);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("forma3d:cursor-label", onCursorLabel);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const updatePosition = () => {
      const position = positionRef.current;
      const target = targetRef.current;
      position.x += (target.x - position.x) * 0.18;
      position.y += (target.y - position.y) * 0.18;
      cursorRef.current?.style.setProperty("--cursor-x", `${position.x}px`);
      cursorRef.current?.style.setProperty("--cursor-y", `${position.y}px`);
      frame = window.requestAnimationFrame(updatePosition);
    };

    frame = window.requestAnimationFrame(updatePosition);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`context-cursor${cursor.visible ? " visible" : ""}${cursor.dark ? " dark" : ""}`}
      aria-hidden="true"
    >
      {cursor.label}
    </div>
  );
}
