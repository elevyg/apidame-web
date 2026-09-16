type RequestErrorInfo = {
  headers: {
    cookie?: string | string[];
  };
};

function distinctIdFromRequest(request: RequestErrorInfo) {
  const cookieHeader = request.headers.cookie;
  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join("; ")
    : cookieHeader;
  if (!cookieString) return undefined;

  const match = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/);
  const raw = match?.[1];
  if (!raw) return undefined;

  try {
    const data = JSON.parse(decodeURIComponent(raw)) as {
      distinct_id?: unknown;
    };
    return typeof data.distinct_id === "string" ? data.distinct_id : undefined;
  } catch (error) {
    console.error("Error parsing PostHog cookie:", error);
    return undefined;
  }
}

export function register() {
  return;
}

export const onRequestError = async (
  err: unknown,
  request: RequestErrorInfo,
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { getPostHogServer } = await import("./lib/posthog-server");
  const posthog = getPostHogServer();
  if (!posthog) return;

  await posthog.captureExceptionImmediate(err, distinctIdFromRequest(request));
};
