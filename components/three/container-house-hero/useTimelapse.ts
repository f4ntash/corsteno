import { useCallback, useEffect, useRef, useState } from "react";

const EMIT_INTERVAL_MS = 50; // actualiza la escena ~20 veces por segundo (la luz ya suaviza los saltos)
const MANUAL_CHANGE_HOURS = 0.5; // si la hora cambia más que esto desde afuera, se asume un cambio manual
const MAX_FRAME_SECONDS = 0.25; // evita saltos de hora al volver a una pestaña que estaba en segundo plano

const circularDiff = (a: number, b: number) => {
  const diff = Math.abs(a - b) % 24;
  return Math.min(diff, 24 - diff);
};

/**
 * Timelapse del día: hace avanzar la hora (0–24) automáticamente, empezando desde la hora actual.
 * Se detiene solo si la persona cambia el horario a mano (slider, campo de hora o botones de horario).
 *
 * - `time`: hora actual en horas decimales (22:40 = 22.666…)
 * - `onTimeChange`: la misma función que ya se usa al mover el slider (debe actualizar hora y sol)
 * - `secondsPerDay`: cuánto dura un día completo en segundos
 */
export function useTimelapse({
  time,
  onTimeChange,
  secondsPerDay = 30,
}: {
  time: number;
  onTimeChange: (hour: number) => void;
  secondsPerDay?: number;
}) {
  const [running, setRunning] = useState(false);
  const latest = useRef({ time, onTimeChange });
  const lastEmitted = useRef<number | null>(null);

  useEffect(() => {
    latest.current = { time, onTimeChange };
  });

  // Si la hora cambió por fuera del timelapse, se detiene
  useEffect(() => {
    if (!running || lastEmitted.current === null) return;
    if (circularDiff(time, lastEmitted.current) > MANUAL_CHANGE_HOURS) setRunning(false);
  }, [time, running]);

  useEffect(() => {
    if (!running) return;
    let current = latest.current.time;
    let last = performance.now();
    let lastEmit = last;
    let frame = 0;
    lastEmitted.current = current;

    const tick = (now: number) => {
      const seconds = Math.min(MAX_FRAME_SECONDS, (now - last) / 1000);
      last = now;
      current = (current + seconds * (24 / secondsPerDay)) % 24;
      if (now - lastEmit >= EMIT_INTERVAL_MS) {
        lastEmit = now;
        lastEmitted.current = current;
        latest.current.onTimeChange(current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      lastEmitted.current = null;
    };
  }, [running, secondsPerDay]);

  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);
  const toggle = useCallback(() => setRunning((value) => !value), []);

  return { running, start, stop, toggle };
}
