import type { CaptureResult } from "posthog-js";

type StackFrame = {
  filename?: string;
};

type CapturedException = {
  stacktrace?: {
    frames?: StackFrame[];
  };
};

// A frame's filename carries a URL scheme like "https://" for app code, or
// "iabjs://" for scripts that an in-app browser (Instagram, Facebook) injects.
const SCHEME = /^([a-z][a-z0-9+.-]*):\/\//i;
const APP_SCHEMES = new Set(["http", "https"]);

function isInjectedFrame(frame: StackFrame): boolean {
  const match = frame.filename?.match(SCHEME);
  return !!match && !APP_SCHEMES.has(match[1].toLowerCase());
}

function framesOf(event: CaptureResult): StackFrame[] {
  const list = event.properties?.$exception_list as CapturedException[] | undefined;
  if (!Array.isArray(list)) return [];
  return list.flatMap((exception) => exception.stacktrace?.frames ?? []);
}

// Drops $exception events whose every stack frame comes from an injected
// in-app browser script. Genuine app exceptions keep at least one http(s)
// frame, so they pass through untouched.
export function dropInjectedBrowserExceptions(
  event: CaptureResult | null,
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;
  const frames = framesOf(event);
  if (frames.length > 0 && frames.every(isInjectedFrame)) return null;
  return event;
}
