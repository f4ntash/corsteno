function Arrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path d={direction === "prev" ? "M16 4 7 12l9 8z" : "M8 4l9 8-9 8z"} fill="currentColor" />
    </svg>
  );
}

/**
 * Selector central, abajo: flechas para pasar de una cámara (o luz) a la siguiente y el nombre del elemento actual.
 * Si se pasa `onLabelClick`, el nombre funciona como interruptor (encender y apagar la luz).
 */
export default function HotspotSwitcher({
  label,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  onLabelClick,
  labelPressed,
}: {
  label: string;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onLabelClick?: () => void;
  labelPressed?: boolean;
}) {
  return (
    <div className="container-hero-switcher">
      <button type="button" className="container-hero-switcher-arrow" aria-label={prevLabel} onClick={onPrev}>
        <Arrow direction="prev" />
      </button>
      {onLabelClick ? (
        <button type="button" className="container-hero-switcher-label" aria-pressed={labelPressed} onClick={onLabelClick}>
          <span className="container-hero-switcher-dot" aria-hidden="true" />
          {label}
        </button>
      ) : (
        <span className="container-hero-switcher-label" aria-live="polite">{label}</span>
      )}
      <button type="button" className="container-hero-switcher-arrow" aria-label={nextLabel} onClick={onNext}>
        <Arrow direction="next" />
      </button>
    </div>
  );
}
