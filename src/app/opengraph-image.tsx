import { ImageResponse } from "next/og";
import { ogImageOptions } from "@/components/estetica/feed/ogFont";
import { siteOgAlt } from "./site";

export const runtime = "nodejs";
export const alt = siteOgAlt;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
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
          fontFamily: "Brown",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Brown",
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#E8E2D4",
          }}
        >
          <div style={{ display: "flex" }}>Escalar / Entrenar / Crear</div>
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
              fontFamily: "Holluise",
              fontSize: 128,
              lineHeight: 0.9,
              letterSpacing: 16,
              textTransform: "uppercase",
            }}
          >
            APIDAME
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 36,
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
                fontFamily: "Foregen",
                fontSize: 48,
                lineHeight: 1,
                letterSpacing: -1,
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
            fontFamily: "Brown",
            fontSize: 17,
            color: "#E8E2D4",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Muro / Cerro / Deportiva</div>
          <div style={{ display: "flex" }}>apidame.com</div>
        </div>
      </div>
    ),
    await ogImageOptions(),
  );
}
