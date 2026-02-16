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
          position: "relative",
          fontFamily: "sans-serif",
          color: "#F4F5F6",
          background:
            "radial-gradient(circle at 20% 25%, rgba(89,248,232,0.3), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,89,100,0.28), transparent 45%), #100B00",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 40,
            border: "3px solid rgba(89,248,232,0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px 46px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: 4,
              color: "#59F8E8",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#FF5964",
              }}
            />
            Patagonia Chilena
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 78, fontWeight: 800, letterSpacing: 2 }}>
              APIDAME BOULDER
            </div>
            <div style={{ fontSize: 38, color: "#F4F5F6" }}>
              Topos, rutas y escalada en Chile Chico
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 28,
            }}
          >
            <div style={{ color: "#FF5964" }}>Nuevo: topos del cerro</div>
            <div style={{ color: "#59F8E8" }}>apidameboulder.com</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
