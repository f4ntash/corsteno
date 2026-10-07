type Labels = {
  timelapseOff: string;
  timelapseOn: string;
};

const DEFAULT_LABELS: Labels = {
  timelapseOff: "Comenzar timelapse",
  timelapseOn: "Detener timelapse",
};

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
  timelapseRunning,
  onToggleTimelapse,
  labels,
}: {
  timelapseRunning: boolean;
  onToggleTimelapse: () => void;
  /** Textos opcionales (por ejemplo, para traducciones). */
  labels?: Partial<Labels>;
}) {
  const text = { ...DEFAULT_LABELS, ...labels };

  return (
    <div className="interactive-hero-actions">
      <button type="button" className="interactive-hero-action" data-active={timelapseRunning} onClick={onToggleTimelapse}>
        {timelapseRunning ? <StopIcon /> : <PlayIcon />}
        <span>{timelapseRunning ? text.timelapseOn : text.timelapseOff}</span>
      </button>
    </div>
  );
}