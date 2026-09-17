import { ImageResponse } from "next/og";

export const runtime = "nodejs";
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
          background: "#12110F",
          color: "#FFFFFF",
          padding: "52px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#E8E2D4",
          }}
        >
          <div style={{ display: "flex" }}>
            Escalar / Entrenar / Crear
          </div>
          <div style={{ display: "flex" }}>Chile Chico · Aysén</div>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 148,
              lineHeight: 0.82,
              letterSpacing: -7,
              textTransform: "uppercase",
            }}
          >
            APIDAME
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 42,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 170,
                height: 12,
                background: "#E8E2D4",
              }}
            />
            <div
              style={{
                display: "flex",
                marginLeft: 24,
                fontSize: 47,
                fontStyle: "italic",
                letterSpacing: -2,
              }}
            >
              Escalada en Chile Chico
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #E8E2D4",
            paddingTop: 20,
            fontSize: 17,
            color: "#E8E2D4",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Muro / Cerro / Deportiva</div>
          <div style={{ display: "flex" }}>apidameboulder.com</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
