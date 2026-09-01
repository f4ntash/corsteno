import type { WindowConfiguration } from "@/components/home/configurator/types";
import { WINDOW_LABELS } from "@/components/home/configurator/types";

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
): ProductDemoPayload {
  const extras = [
    configuration.mosquitoNet ? "Mosquitero" : null,
    configuration.blind ? "Persiana" : null,
    configuration.security ? "Seguridad" : null,
  ].filter((item): item is string => Boolean(item));

  return {
    demoId: createDemoId(),
    email,
    marketingConsent,
    timestamp: new Date().toISOString(),
    source: "configurator-demo",
    page,
    modelo: WINDOW_LABELS.model[configuration.model],
    dimensiones: `${configuration.width} × ${configuration.height} mm`,
    marco: WINDOW_LABELS.frameColor[configuration.frameColor],
    vidrio: WINDOW_LABELS.glassType[configuration.glassType],
    apertura: WINDOW_LABELS.opening[configuration.opening],
    extras: extras.length > 0 ? extras.join(", ") : "Sin extras",
  };
}

async function postPayload(endpoint: string, payload: unknown): Promise<DeliveryResult> {
  if (!endpoint) return { status: "error", message: DELIVERY_ERROR };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { status: "error", message: DELIVERY_ERROR };
    }

    return { status: "sent" };
  } catch {
    return { status: "error", message: DELIVERY_ERROR };
  }
}

export function sendProductDemo(payload: ProductDemoPayload) {
  return postPayload(demoEndpoint, payload);
}
