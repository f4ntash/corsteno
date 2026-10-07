type Labels = {
  timelapseOff: string;
  timelapseOn: string;
  fullscreenOff: string;
  fullscreenOn: string;
};

const DEFAULT_LABELS: Labels = {
  timelapseOff: "Comenzar timelapse",
  timelapseOn: "Detener timelapse",
  fullscreenOff: "Pantalla completa",
  fullscreenOn: "Salir de pantalla completa",
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

function EnterFullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExitFullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HeroActionButtons({
  timelapseRunning,
  onToggleTimelapse,
  fullscreen = false,
  onToggleFullscreen,
  labels,
}: {
  timelapseRunning: boolean;
  onToggleTimelapse: () => void;
  /** Si la pantalla completa está activa. */
  fullscreen?: boolean;
  /** Si no se pasa (por ejemplo, navegador sin soporte), el botón no se muestra. */
  onToggleFullscreen?: () => void;
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
      {onToggleFullscreen && (
        <button type="button" className="interactive-hero-action" data-active={fullscreen} aria-pressed={fullscreen} onClick={onToggleFullscreen}>
          {fullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
          <span>{fullscreen ? text.fullscreenOn : text.fullscreenOff}</span>
        </button>
      )}
    </div>
  );
}