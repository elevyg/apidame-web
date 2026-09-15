import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          color: "#1C1916",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#5A5550",
          }}
        >
          Desde 2021 · Chile Chico
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              letterSpacing: 8,
              textTransform: "uppercase",
            }}
          >
            APIDAME
          </div>
          <div style={{ fontSize: 32, color: "#5A5550" }}>
            Muro, cerro y escalada deportiva
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#5A5550",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div>Chile Chico</div>
          <div>apidameboulder.com</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
