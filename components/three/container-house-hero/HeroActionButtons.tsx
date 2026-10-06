type Labels = {
  autoRotateOff: string;
  autoRotateOn: string;
  timelapseOff: string;
  timelapseOn: string;
};

const DEFAULT_LABELS: Labels = {
  autoRotateOff: "Rotar automáticamente",
  autoRotateOn: "Detener rotación",
  timelapseOff: "Comenzar timelapse",
  timelapseOn: "Detener timelapse",
};

function RotateIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 12a9 9 0 1 1-3-6.7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M21 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export default function HeroActionButtons({
  autoRotate,
  onToggleAutoRotate,
  timelapseRunning,
  onToggleTimelapse,
  labels,
}: {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  timelapseRunning: boolean;
  onToggleTimelapse: () => void;
  /** Textos opcionales (por ejemplo, para traducciones). */
  labels?: Partial<Labels>;
}) {
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <div className="interactive-hero-actions">
      <button type="button" className="interactive-hero-action" data-active={autoRotate} onClick={onToggleAutoRotate}>
        <RotateIcon />
        <span>{autoRotate ? text.autoRotateOn : text.autoRotateOff}</span>
      </button>
      <button type="button" className="interactive-hero-action" data-active={timelapseRunning} onClick={onToggleTimelapse}>
        {timelapseRunning ? <StopIcon /> : <PlayIcon />}
        <span>{timelapseRunning ? text.timelapseOn : text.timelapseOff}</span>
      </button>
    </div>
  );
}
