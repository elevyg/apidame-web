export function assertDev() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Solo disponible en development");
  }
}

export function isDev() {
  return process.env.NODE_ENV === "development";
}
