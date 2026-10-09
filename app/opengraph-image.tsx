import { ImageResponse } from "next/og";

export const alt = "Vira Voto";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px 80px",
        background:
          "linear-gradient(135deg, #1d4ed8 0%, #0f172a 52%, #0f766e 100%)",
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.12)",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 2,
          marginBottom: 28,
        }}
      >
        VIRA VOTO
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 84,
          lineHeight: 1.05,
          fontWeight: 800,
          letterSpacing: -3,
          maxWidth: 900,
        }}
      >
        <div style={{ display: "block" }}>IDEIAS GANHAM</div>
        <div style={{ display: "block" }}>MOVIMENTO.</div>
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 32,
          color: "rgba(248,250,252,0.88)",
          maxWidth: 820,
        }}
      >
        ferramentas e conteúdos para transformar consciência em ação coletiva.
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
