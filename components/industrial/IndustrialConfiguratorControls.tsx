import type { FrameColor, GlassType, OpeningType, WindowConfiguration, WindowModel } from "./types";
import { WINDOW_LABELS } from "./types";
import styles from "./industrial.module.css";

type ControlsProps = {
  configuration: WindowConfiguration;
  onChange: <Key extends keyof WindowConfiguration>(key: Key, value: WindowConfiguration[Key]) => void;
};

const models = Object.keys(WINDOW_LABELS.model) as WindowModel[];
const frameColors = Object.keys(WINDOW_LABELS.frameColor) as FrameColor[];
const glassTypes = Object.keys(WINDOW_LABELS.glassType) as GlassType[];
const openings = Object.keys(WINDOW_LABELS.opening) as OpeningType[];

export default function IndustrialConfiguratorControls({ configuration, onChange }: ControlsProps) {
  const update = <Key extends keyof WindowConfiguration>(key: Key, value: WindowConfiguration[Key]) => {
    onChange(key, value);
  };

  return (
    <div className={styles.configuratorControls}>
      <fieldset>
        <legend>Modelo</legend>
        <div className={styles.segmentedControl}>
          {models.map((model) => (
            <button key={model} type="button" aria-pressed={configuration.model === model} onClick={() => update("model", model)}>
              {WINDOW_LABELS.model[model]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Medidas</legend>
        <label className={styles.rangeControl}>
          <span>Ancho <output>{configuration.width} mm</output></span>
          <input type="range" min="800" max="3000" step="50" value={configuration.width} onChange={(event) => update("width", Number(event.target.value))} />
        </label>
        <label className={styles.rangeControl}>
          <span>Alto <output>{configuration.height} mm</output></span>
          <input type="range" min="800" max="2600" step="50" value={configuration.height} onChange={(event) => update("height", Number(event.target.value))} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Marco</legend>
        <div className={styles.swatches}>
          {frameColors.map((color) => (
            <button key={color} type="button" aria-pressed={configuration.frameColor === color} onClick={() => update("frameColor", color)}>
              <span data-color={color} aria-hidden="true" />
              {WINDOW_LABELS.frameColor[color]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Vidrio</legend>
        <div className={styles.segmentedControl}>
          {glassTypes.map((glass) => (
            <button key={glass} type="button" aria-pressed={configuration.glassType === glass} onClick={() => update("glassType", glass)}>
              {WINDOW_LABELS.glassType[glass]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Apertura</legend>
        <div className={styles.segmentedControl}>
          {openings.map((opening) => (
            <button key={opening} type="button" aria-pressed={configuration.opening === opening} onClick={() => update("opening", opening)}>
              {WINDOW_LABELS.opening[opening]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Extras</legend>
        <div className={styles.checkList}>
          <label><input type="checkbox" checked={configuration.mosquitoNet} onChange={(event) => update("mosquitoNet", event.target.checked)} /> Mosquitero</label>
          <label><input type="checkbox" checked={configuration.blind} onChange={(event) => update("blind", event.target.checked)} /> Persiana</label>
          <label><input type="checkbox" checked={configuration.security} onChange={(event) => update("security", event.target.checked)} /> Seguridad</label>
        </div>
      </fieldset>
    </div>
  );
}
