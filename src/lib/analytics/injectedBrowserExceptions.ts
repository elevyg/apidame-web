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

// Every script the app ships loads from one of these paths. Chrome on iOS
// labels the scripts it injects with the page address instead, for example
// "https://www.apidame.com/login", and keeps that label after a client-side
// navigation.
const APP_SCRIPT_PATHS = ["/_next/", "/ingest/", "/vendor/"];

function pathOf(frame: StackFrame): string | null {
  if (!frame.filename) return null;
  try {
    const url = new URL(frame.filename);
    return APP_SCHEMES.has(url.protocol.slice(0, -1)) ? url.pathname : null;
  } catch {
    return null;
  }
}

function isAppScriptFrame(frame: StackFrame): boolean {
  const path = pathOf(frame);
  return !!path && APP_SCRIPT_PATHS.some((prefix) => path.startsWith(prefix));
}

// A page address has no file extension in its last path segment.
function isPageAddressFrame(frame: StackFrame): boolean {
  const path = pathOf(frame);
  return !!path && !/\.[^/]*$/.test(path);
}

function framesOf(event: CaptureResult): StackFrame[] {
  const list = event.properties?.$exception_list as CapturedException[] | undefined;
  if (!Array.isArray(list)) return [];
  return list.flatMap((exception) => exception.stacktrace?.frames ?? []);
}

// Drops $exception events that come from an injected browser script: either
// every stack frame uses an in-app browser scheme, or no frame comes from an
// app script and at least one frame names a page address. Genuine app
// exceptions keep at least one app script frame, so they pass through.
export function dropInjectedBrowserExceptions(
  event: CaptureResult | null,
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;
  const frames = framesOf(event);
  if (frames.length > 0 && frames.every(isInjectedFrame)) return null;
  if (!frames.some(isAppScriptFrame) && frames.some(isPageAddressFrame)) return null;
  return event;
}
