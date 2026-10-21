import type { CaptureResult } from "posthog-js";

type CapturedException = {
  type?: string;
  value?: string;
};

// Chrome rejects a view transition's promises with this DOMException when it
// aborts the animation, for example when the mobile viewport resizes. The
// navigation still completes, so the exception is noise.
const ABORTED_TRANSITION = "InvalidStateError: Transition was aborted";

function isAbortedTransition(exception: CapturedException): boolean {
  return (
    exception.type === "DOMException" &&
    !!exception.value?.startsWith(ABORTED_TRANSITION)
  );
}

// Drops $exception events where every exception is an aborted view transition.
export function dropAbortedViewTransitionExceptions(
  event: CaptureResult | null,
): CaptureResult | null {
  if (!event || event.event !== "$exception") return event;
  const list = event.properties?.$exception_list as CapturedException[] | undefined;
  if (Array.isArray(list) && list.length > 0 && list.every(isAbortedTransition)) {
    return null;
  }
  return event;
}
