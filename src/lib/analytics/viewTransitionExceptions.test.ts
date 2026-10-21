import type { CaptureResult } from "posthog-js";
import { describe, expect, it } from "vitest";
import { dropAbortedViewTransitionExceptions } from "./viewTransitionExceptions";

function exceptionEvent(exceptions: { type?: string; value?: string }[]): CaptureResult {
  return {
    uuid: "test",
    event: "$exception",
    properties: { $exception_list: exceptions },
  } as CaptureResult;
}

describe("dropAbortedViewTransitionExceptions", () => {
  it("drops a transition aborted by a viewport resize", () => {
    const event = exceptionEvent([
      {
        type: "DOMException",
        value:
          "InvalidStateError: Transition was aborted because of invalid state. Viewport size changed",
      },
    ]);
    expect(dropAbortedViewTransitionExceptions(event)).toBeNull();
  });

  it("drops a transition aborted by a failed prepaint layout check", () => {
    const event = exceptionEvent([
      {
        type: "DOMException",
        value:
          "InvalidStateError: Transition was aborted because of invalid state. Prepaint layout check failed",
      },
    ]);
    expect(dropAbortedViewTransitionExceptions(event)).toBeNull();
  });

  it("keeps a different InvalidStateError", () => {
    const event = exceptionEvent([
      { type: "DOMException", value: "InvalidStateError: The object is in an invalid state." },
    ]);
    expect(dropAbortedViewTransitionExceptions(event)).toBe(event);
  });

  it("keeps a non-DOMException with the same message", () => {
    const event = exceptionEvent([
      { type: "Error", value: "InvalidStateError: Transition was aborted because of invalid state." },
    ]);
    expect(dropAbortedViewTransitionExceptions(event)).toBe(event);
  });

  it("keeps an event that also carries an app exception", () => {
    const event = exceptionEvent([
      { type: "TypeError", value: "Cannot read properties of undefined" },
      { type: "DOMException", value: "InvalidStateError: Transition was aborted because of invalid state." },
    ]);
    expect(dropAbortedViewTransitionExceptions(event)).toBe(event);
  });

  it("keeps an exception event with no exception list", () => {
    const event = { uuid: "x", event: "$exception", properties: {} } as CaptureResult;
    expect(dropAbortedViewTransitionExceptions(event)).toBe(event);
  });

  it("passes non-exception events through", () => {
    const event = { uuid: "x", event: "$pageview", properties: {} } as CaptureResult;
    expect(dropAbortedViewTransitionExceptions(event)).toBe(event);
  });

  it("passes a null event through", () => {
    expect(dropAbortedViewTransitionExceptions(null)).toBeNull();
  });
});
