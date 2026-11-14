import type { CaptureResult } from "posthog-js";
import { describe, expect, it } from "vitest";
import { dropInjectedBrowserExceptions } from "./injectedBrowserExceptions";

function exceptionEvent(filenames: (string | undefined)[]): CaptureResult {
  return {
    uuid: "test",
    event: "$exception",
    properties: {
      $exception_list: [
        {
          stacktrace: {
            frames: filenames.map((filename) => ({ filename })),
          },
        },
      ],
    },
  } as CaptureResult;
}

describe("dropInjectedBrowserExceptions", () => {
  it("drops an exception whose only frame is an injected in-app browser script", () => {
    const event = exceptionEvent(["iabjs://navigation_performance_logger_android"]);
    expect(dropInjectedBrowserExceptions(event)).toBeNull();
  });

  it("drops when every frame uses a non-http scheme", () => {
    const event = exceptionEvent(["iabjs://one", "fbjs://two"]);
    expect(dropInjectedBrowserExceptions(event)).toBeNull();
  });

  it("drops when every frame names a page document instead of a script file", () => {
    const event = exceptionEvent([
      "https://www.apidame.com/login",
      "https://www.apidame.com/topos",
      "https://www.apidame.com/",
    ]);
    expect(dropInjectedBrowserExceptions(event)).toBeNull();
  });

  it("drops when document frames mix with non-http frames", () => {
    const event = exceptionEvent(["https://www.apidame.com/topos", "iabjs://one"]);
    expect(dropInjectedBrowserExceptions(event)).toBeNull();
  });

  it("keeps an exception that mixes an app frame with a document frame", () => {
    const event = exceptionEvent([
      "https://www.apidame.com/topos",
      "https://www.apidame.com/_next/static/chunks/main.js",
    ]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps an app frame whose script URL has a query string", () => {
    const event = exceptionEvent(["https://www.apidame.com/_next/static/chunks/main.js?v=1"]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps an exception with an app frame", () => {
    const event = exceptionEvent(["https://www.apidame.com/main.js"]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps an exception that mixes an app frame with an injected frame", () => {
    const event = exceptionEvent([
      "https://www.apidame.com/main.js",
      "iabjs://navigation_performance_logger_android",
    ]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps an exception with an anonymous frame that has no filename", () => {
    const event = exceptionEvent([undefined]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps an exception with no frames", () => {
    const event = exceptionEvent([]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("passes non-exception events through", () => {
    const event = { uuid: "x", event: "$pageview", properties: {} } as CaptureResult;
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("passes a null event through", () => {
    expect(dropInjectedBrowserExceptions(null)).toBeNull();
  });
});
