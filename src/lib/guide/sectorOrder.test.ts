import { describe, expect, it } from "vitest";
import { moveSectorId, rankNorthToSouth } from "./sectorOrder";

describe("moveSectorId", () => {
  it("swaps a sector with its neighbor", () => {
    expect(moveSectorId(["a", "b", "c"], "b", "up")).toEqual(["b", "a", "c"]);
    expect(moveSectorId(["a", "b", "c"], "b", "down")).toEqual(["a", "c", "b"]);
  });

  it("does nothing at the edges", () => {
    expect(moveSectorId(["a", "b"], "a", "up")).toEqual(["a", "b"]);
    expect(moveSectorId(["a", "b"], "b", "down")).toEqual(["a", "b"]);
  });
});

describe("rankNorthToSouth", () => {
  it("numbers Chile Chico sectors from north to south", () => {
    expect(
      rankNorthToSouth([
        {
          id: "queso",
          position: 3,
          latitude: -46.55849291,
          longitude: -71.71930602,
        },
        {
          id: "sol",
          position: 5,
          latitude: -46.55358254,
          longitude: -71.72157605,
        },
        {
          id: "vaina",
          position: 1,
          latitude: -46.55645598,
          longitude: -71.72141448,
        },
      ]),
    ).toEqual(["sol", "vaina", "queso"]);
  });
});
