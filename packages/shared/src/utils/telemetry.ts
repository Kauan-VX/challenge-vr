export interface TelemetryContext {
  source: string;
  [extra: string]: unknown;
}

export interface TelemetrySink {
  reportError(error: unknown, context: TelemetryContext): void;
}

const consoleSink: TelemetrySink = {
  reportError(error, context) {
    if (process.env.NODE_ENV === "production") return;
    // eslint-disable-next-line no-console
    console.error(`[${context.source}]`, error, context);
  },
};

let activeSink: TelemetrySink = consoleSink;

export function setTelemetrySink(sink: TelemetrySink): void {
  activeSink = sink;
}

export function reportError(error: unknown, context: TelemetryContext): void {
  activeSink.reportError(error, context);
}
