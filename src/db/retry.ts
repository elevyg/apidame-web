const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

const RETRYABLE_CODE = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "EPIPE",
  "UND_ERR_SOCKET",
  "UND_ERR_CONNECT_TIMEOUT",
]);

const RETRYABLE_MESSAGE =
  /HTTP status (429|500|502|503|504)|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|socket hang up|network|fetch failed|stream (closed|disconnected)/i;

/**
 * True when a database error looks like a transient upstream blip (a 5xx from
 * Turso, a dropped connection) that a later attempt can recover from, rather
 * than a real query fault.
 */
export function isTransientDbError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as {
    status?: unknown;
    code?: unknown;
    message?: unknown;
    cause?: unknown;
  };

  if (typeof err.status === "number" && RETRYABLE_STATUS.has(err.status)) {
    return true;
  }
  if (typeof err.code === "string" && RETRYABLE_CODE.has(err.code)) {
    return true;
  }
  if (typeof err.message === "string" && RETRYABLE_MESSAGE.test(err.message)) {
    return true;
  }
  if (err.cause && err.cause !== error) {
    return isTransientDbError(err.cause);
  }
  return false;
}

export type BackoffOptions = {
  baseDelayMs?: number;
  maxDelayMs?: number;
  random?: () => number;
};

/**
 * Exponential backoff with full jitter for the given 1-based attempt.
 */
export function backoffDelay(attempt: number, options: BackoffOptions = {}): number {
  const baseDelayMs = options.baseDelayMs ?? 100;
  const maxDelayMs = options.maxDelayMs ?? 1000;
  const random = options.random ?? Math.random;
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  return Math.round(random() * ceiling);
}

export type RetryOptions = BackoffOptions & {
  maxAttempts?: number;
  onExhausted?: (error: unknown, attempts: number) => void;
  sleep?: (ms: number) => Promise<void>;
};

const defaultSleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Runs `operation`, retrying only transient database errors with bounded
 * exponential backoff. A non-transient error throws on the first attempt. When
 * every attempt is a transient failure, `onExhausted` reports it and the last
 * error is rethrown so callers still see the failure.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const sleep = options.sleep ?? defaultSleep;

  for (let attempt = 1; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= maxAttempts || !isTransientDbError(error)) {
        if (attempt > 1 && isTransientDbError(error)) {
          options.onExhausted?.(error, attempt);
        }
        throw error;
      }
      await sleep(backoffDelay(attempt, options));
    }
  }
}
