import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "PrimeTvNashville – Professional TV Mounting in Nashville TN"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Red accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: "#E50914" }} />

        {/* Logo text */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
          <span style={{ color: "#E50914", fontSize: 72, fontWeight: 900, letterSpacing: -2 }}>Prime</span>
          <span style={{ color: "#ffffff", fontSize: 72, fontWeight: 900, letterSpacing: -2 }}>TV</span>
          <span style={{ color: "#ffffff", fontSize: 72, fontWeight: 900, letterSpacing: -2 }}>Nashville</span>
        </div>

        {/* Tagline */}
        <div style={{ color: "#ffffff", fontSize: 32, fontWeight: 600, opacity: 0.85, textAlign: "center", maxWidth: 800 }}>
          Professional TV Mounting &amp; Installation in Nashville, TN
        </div>

        {/* Badges row */}
        <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
          {["Same-Day Service", "Licensed & Insured", "Upfront Pricing"].map((badge) => (
            <div
              key={badge}
              style={{
                background: "#ffffff14",
                border: "1px solid #ffffff22",
                borderRadius: 50,
                padding: "10px 24px",
                color: "#ffffffcc",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {badge}
            </div>
          ))}
        </div>

        {/* Phone */}
        <div style={{ color: "#E50914", fontSize: 26, fontWeight: 700, marginTop: 36, opacity: 0.9 }}>
          (615) 669-0251 · primetvnashville.com
        </div>

        {/* Bottom red bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: "#E50914" }} />
      </div>
    ),
    { ...size },
  )
}
