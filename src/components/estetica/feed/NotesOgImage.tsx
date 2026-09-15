type NotesOgImageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
};

export default function NotesOgImage({
  eyebrow,
  title,
  subtitle,
  imageSrc,
}: NotesOgImageProps) {
  const kicker = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 18,
    letterSpacing: 4,
    textTransform: "uppercase",
  } as const;

  const heading = {
    display: "flex",
    fontStyle: "italic",
    lineHeight: 0.96,
    letterSpacing: -2,
  } as const;

  const footer = {
    display: "flex",
    alignItems: "center",
    gap: 16,
    fontSize: 16,
    letterSpacing: 4,
    textTransform: "uppercase",
  } as const;

  const bar = {
    display: "flex",
    height: 12,
    width: 64,
    background: "#12110f",
  } as const;

  if (imageSrc) {
    return (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "#e8e2d4",
          color: "#12110f",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori OG */}
        <img
          src={imageSrc}
          alt=""
          width={624}
          height={630}
          style={{
            width: 624,
            height: 630,
            objectFit: "cover",
            objectPosition: "40% 62%",
          }}
        />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            borderLeft: "3px solid #12110f",
            padding: "46px 48px 42px",
          }}
        >
          <div style={kicker}>
            <span>{eyebrow}</span>
            <span>Apidame</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ ...heading, fontSize: 58 }}>{title}</div>
            <div style={{ display: "flex", fontSize: 24, lineHeight: 1.2 }}>
              {subtitle}
            </div>
          </div>
          <div style={footer}>
            <span style={bar} />
            <span>Chile Chico</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        background: "#e8e2d4",
        color: "#12110f",
        padding: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          border: "3px solid #12110f",
          padding: "46px 52px 42px",
        }}
      >
        <div style={kicker}>
          <span>{eyebrow}</span>
          <span>Apidame</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ ...heading, fontSize: 76 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 24, lineHeight: 1.2 }}>
            {subtitle}
          </div>
        </div>
        <div style={footer}>
          <span style={bar} />
          <span>Chile Chico</span>
        </div>
      </div>
    </div>
  );
}
