import type { FrameColor, GlassType, OpeningType, WindowConfiguration, WindowModel } from "./types";
import { WINDOW_LABELS } from "./types";
import styles from "./productConfigurator.module.css";
import type { HomeDictionary } from "@/lib/i18n";

type ControlsProps = {
  configuration: WindowConfiguration;
  onChange: <Key extends keyof WindowConfiguration>(key: Key, value: WindowConfiguration[Key]) => void;
  dictionary: HomeDictionary;
};

const models = Object.keys(WINDOW_LABELS.model) as WindowModel[];
const frameColors = Object.keys(WINDOW_LABELS.frameColor) as FrameColor[];
const glassTypes = Object.keys(WINDOW_LABELS.glassType) as GlassType[];
const openings = Object.keys(WINDOW_LABELS.opening) as OpeningType[];

export default function ProductConfiguratorControls({ configuration, onChange, dictionary: t }: ControlsProps) {
  const update = <Key extends keyof WindowConfiguration>(key: Key, value: WindowConfiguration[Key]) => {
    onChange(key, value);
  };

  return (
    <div className={styles.configuratorControls}>
      <fieldset>
        <legend>{t.configurator.fields.model}</legend>
        <div className={styles.segmentedControl}>
          {models.map((model) => (
            <button key={model} type="button" aria-pressed={configuration.model === model} onClick={() => update("model", model)}>
              {t.configurator.labels.model[model]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t.configurator.fields.dimensions}</legend>
        <label className={styles.rangeControl}>
          <span>{t.configurator.fields.width} <output>{configuration.width} mm</output></span>
          <input aria-label={t.configurator.fields.widthAria} type="range" min="800" max="3000" step="50" value={configuration.width} onChange={(event) => update("width", Number(event.target.value))} />
        </label>
        <label className={styles.rangeControl}>
          <span>{t.configurator.fields.height} <output>{configuration.height} mm</output></span>
          <input aria-label={t.configurator.fields.heightAria} type="range" min="800" max="2600" step="50" value={configuration.height} onChange={(event) => update("height", Number(event.target.value))} />
        </label>
      </fieldset>

      <fieldset>
        <legend>{t.configurator.fields.frame}</legend>
        <div className={styles.swatches}>
          {frameColors.map((color) => (
            <button key={color} type="button" aria-pressed={configuration.frameColor === color} onClick={() => update("frameColor", color)}>
              <span data-color={color} aria-hidden="true" />
              {t.configurator.labels.frameColor[color]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t.configurator.fields.glass}</legend>
        <div className={styles.segmentedControl}>
          {glassTypes.map((glass) => (
            <button key={glass} type="button" aria-pressed={configuration.glassType === glass} onClick={() => update("glassType", glass)}>
              {t.configurator.labels.glassType[glass]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t.configurator.fields.opening}</legend>
        <div className={styles.segmentedControl}>
          {openings.map((opening) => (
            <button key={opening} type="button" aria-pressed={configuration.opening === opening} onClick={() => update("opening", opening)}>
              {t.configurator.labels.opening[opening]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{t.configurator.fields.extras}</legend>
        <div className={styles.checkList}>
          <label><input type="checkbox" checked={configuration.mosquitoNet} onChange={(event) => update("mosquitoNet", event.target.checked)} /> {t.configurator.labels.extras.mosquitoNet}</label>
          <label><input type="checkbox" checked={configuration.blind} onChange={(event) => update("blind", event.target.checked)} /> {t.configurator.labels.extras.blind}</label>
          <label><input type="checkbox" checked={configuration.security} onChange={(event) => update("security", event.target.checked)} /> {t.configurator.labels.extras.security}</label>
        </div>
      </fieldset>
    </div>
  );
}
