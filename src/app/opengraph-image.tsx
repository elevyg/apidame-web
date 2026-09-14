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
          background: "#F3EFE8",
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
            color: "#6A645C",
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
            APIDAME BOULDER
          </div>
          <div style={{ fontSize: 32, color: "#6A645C" }}>
            Topos y escalada en el Parque Nacional Patagonia
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#6A645C",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div>Cerro Apidame</div>
          <div>apidameboulder.com</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
