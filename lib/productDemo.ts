import type { WindowConfiguration } from "@/components/home/configurator/types";
import type { HomeDictionary } from "@/lib/i18n";

const demoEndpoint = process.env.NEXT_PUBLIC_DEMO_FORM_ENDPOINT?.trim() ?? "";

export type ProductDemoPayload = {
  demoId: string;
  email: string;
  marketingConsent: boolean;
  timestamp: string;
  source: "configurator-demo";
  page: string;
  modelo: string;
  dimensiones: string;
  marco: string;
  vidrio: string;
  apertura: string;
  extras: string;
};

export type DeliveryResult =
  | { status: "sent" }
  | { status: "error"; message: string };

const DELIVERY_ERROR = "No pudimos enviar la configuración. Probá nuevamente en unos segundos.";

function createDemoId() {
  const values = new Uint32Array(1);
  globalThis.crypto?.getRandomValues(values);
  const token = (values[0] || Math.floor(Math.random() * 0xffffffff))
    .toString(36)
    .toUpperCase()
    .padStart(5, "0")
    .slice(0, 5);
  return `DEMO-CORSTENO-${token}`;
}

export function buildProductDemoPayload(
  email: string,
  marketingConsent: boolean,
  page: string,
  configuration: WindowConfiguration,
  dictionary: HomeDictionary,
): ProductDemoPayload {
  const extras = [
    configuration.mosquitoNet ? dictionary.configurator.labels.extras.mosquitoNet : null,
    configuration.blind ? dictionary.configurator.labels.extras.blind : null,
    configuration.security ? dictionary.configurator.labels.extras.security : null,
  ].filter((item): item is string => Boolean(item));

  return {
    demoId: createDemoId(),
    email,
    marketingConsent,
    timestamp: new Date().toISOString(),
    source: "configurator-demo",
    page,
    modelo: dictionary.configurator.labels.model[configuration.model],
    dimensiones: `${configuration.width} × ${configuration.height} mm`,
    marco: dictionary.configurator.labels.frameColor[configuration.frameColor],
    vidrio: dictionary.configurator.labels.glassType[configuration.glassType],
    apertura: dictionary.configurator.labels.opening[configuration.opening],
    extras: extras.length > 0 ? extras.join(", ") : dictionary.configurator.labels.extras.none,
  };
}

async function postPayload(endpoint: string, payload: unknown, errorMessage: string): Promise<DeliveryResult> {
  if (!endpoint) return { status: "error", message: errorMessage };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { status: "error", message: errorMessage };
    }

    return { status: "sent" };
  } catch {
    return { status: "error", message: errorMessage };
  }
}

export function sendProductDemo(payload: ProductDemoPayload, errorMessage = DELIVERY_ERROR) {
  return postPayload(demoEndpoint, payload, errorMessage);
}
