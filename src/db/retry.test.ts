import { describe, expect, it, vi } from "vitest";
import { backoffDelay, isTransientDbError, withDbRetry } from "./retry";

const noSleep = async () => {};

describe("isTransientDbError", () => {
  it("treats a Turso 502 message as transient", () => {
    expect(
      isTransientDbError(new Error("Server returned HTTP status 502")),
    ).toBe(true);
  });

  it("treats a status field and a socket code as transient", () => {
    expect(isTransientDbError({ status: 503 })).toBe(true);
    expect(isTransientDbError({ code: "ECONNRESET" })).toBe(true);
  });

  it("follows the cause chain", () => {
    const error = new Error("wrapped", {
      cause: new Error("fetch failed"),
    });
    expect(isTransientDbError(error)).toBe(true);
  });

  it("leaves a real SQL fault alone", () => {
    expect(
      isTransientDbError(new Error("no such column: foo")),
    ).toBe(false);
    expect(isTransientDbError(null)).toBe(false);
  });
});

describe("backoffDelay", () => {
  it("grows the ceiling with each attempt and caps it", () => {
    const max = (attempt: number) =>
      backoffDelay(attempt, { baseDelayMs: 100, maxDelayMs: 800, random: () => 1 });
    expect(max(1)).toBe(100);
    expect(max(2)).toBe(200);
    expect(max(3)).toBe(400);
    expect(max(4)).toBe(800);
    expect(max(5)).toBe(800);
  });

  it("stays within the ceiling with jitter", () => {
    const delay = backoffDelay(3, { baseDelayMs: 100, maxDelayMs: 800, random: () => 0.5 });
    expect(delay).toBeGreaterThanOrEqual(0);
    expect(delay).toBeLessThanOrEqual(400);
  });
});

describe("withDbRetry", () => {
  it("returns the result without retrying on success", async () => {
    const operation = vi.fn().mockResolvedValue("ok");
    await expect(withDbRetry(operation, { sleep: noSleep })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("retries a transient failure and then succeeds", async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error("Server returned HTTP status 502"))
      .mockResolvedValue("ok");
    await expect(
      withDbRetry(operation, { sleep: noSleep }),
    ).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("does not retry a non-transient failure", async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(new Error("no such column: foo"));
    await expect(
      withDbRetry(operation, { sleep: noSleep }),
    ).rejects.toThrow("no such column");
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("rethrows and reports after exhausting attempts", async () => {
    const error = new Error("Server returned HTTP status 502");
    const operation = vi.fn().mockRejectedValue(error);
    const onExhausted = vi.fn();
    await expect(
      withDbRetry(operation, { maxAttempts: 3, sleep: noSleep, onExhausted }),
    ).rejects.toBe(error);
    expect(operation).toHaveBeenCalledTimes(3);
    expect(onExhausted).toHaveBeenCalledWith(error, 3);
  });
});
