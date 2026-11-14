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

  it("drops an exception whose frames name only page addresses", () => {
    const event = exceptionEvent([
      "https://www.apidame.com/login",
      "https://www.apidame.com/login",
      "https://www.apidame.com/topos",
    ]);
    expect(dropInjectedBrowserExceptions(event)).toBeNull();
  });

  it("drops an exception whose frames name the root page address", () => {
    const event = exceptionEvent(["https://www.apidame.com/"]);
    expect(dropInjectedBrowserExceptions(event)).toBeNull();
  });

  it("drops a page address exception that also has an anonymous frame", () => {
    const event = exceptionEvent([undefined, "https://www.apidame.com/topos"]);
    expect(dropInjectedBrowserExceptions(event)).toBeNull();
  });

  it("keeps a page address exception that also has a Next.js chunk frame", () => {
    const event = exceptionEvent([
      "https://www.apidame.com/topos",
      "https://www.apidame.com/_next/static/immutable/chunks/2zk81v7u04s0p.js",
    ]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps a page address exception that also has a PostHog script frame", () => {
    const event = exceptionEvent([
      "https://www.apidame.com/topos",
      "https://www.apidame.com/ingest/static/array.js",
    ]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps a page address exception that also has a vendor script frame", () => {
    const event = exceptionEvent([
      "https://www.apidame.com/topos",
      "https://www.apidame.com/vendor/openseadragon.min.js",
    ]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps an exception with a Next.js chunk frame", () => {
    const event = exceptionEvent([
      "https://www.apidame.com/_next/static/immutable/chunks/2zk81v7u04s0p.js",
    ]);
    expect(dropInjectedBrowserExceptions(event)).toBe(event);
  });

  it("keeps an exception with a script file frame", () => {
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
