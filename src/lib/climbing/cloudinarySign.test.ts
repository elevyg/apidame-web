import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { signCloudinaryParams } from "./cloudinary";

describe("signCloudinaryParams", () => {
  it("signs alphabetically and appends the secret, without file or api_key", () => {
    const timestamp = 1315060510;
    const folder = "apidame/guia/topos";
    const secret = "abcd";
    const expected = createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${secret}`)
      .digest("hex");

    expect(
      signCloudinaryParams(
        {
          api_key: "should-ignore",
          file: "should-ignore",
          folder,
          timestamp,
        },
        secret,
      ),
    ).toBe(expected);
  });
});
