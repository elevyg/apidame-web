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

// App code runs from script files such as "/_next/static/chunks/x.js". WebKit
// labels scripts that Chrome on iOS injects with the page document URL, such as
// "https://www.apidame.com/topos", so an http(s) frame with no script file is
// also injected.
const SCRIPT_FILE = /\.[cm]?js$/i;

function isInjectedFrame(frame: StackFrame): boolean {
  const filename = frame.filename;
  const match = filename?.match(SCHEME);
  if (!filename || !match) return false;
  if (!APP_SCHEMES.has(match[1].toLowerCase())) return true;
  const path = filename.split(/[?#]/)[0];
  return !SCRIPT_FILE.test(path);
}

function framesOf(event: CaptureResult): StackFrame[] {
  const list = event.properties?.$exception_list as CapturedException[] | undefined;
  if (!Array.isArray(list)) return [];
  return list.flatMap((exception) => exception.stacktrace?.frames ?? []);
}

// Drops $exception events whose every stack frame comes from an injected
// browser script. Genuine app exceptions keep at least one frame from an
// http(s) script file, so they pass through untouched.
export function dropInjectedBrowserExceptions(
  event: CaptureResult | null,
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;
  const frames = framesOf(event);
  if (frames.length > 0 && frames.every(isInjectedFrame)) return null;
  return event;
}
