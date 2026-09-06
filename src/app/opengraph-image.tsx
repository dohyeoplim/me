import { ImageResponse } from "next/og";
import { site } from "./lib/site";

export const alt = "Dohyeop Lim, research and projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%",
            background: "#fafafc", color: "#0f0f10", padding: 88, fontFamily: "sans-serif",
        }}>
            <div style={{ fontSize: 76, letterSpacing: -3 }}>{site.name}</div>
            <div style={{ fontSize: 30, lineHeight: 1.5, marginTop: 32, maxWidth: 880 }}>{site.description}</div>
            <div style={{ fontSize: 24, color: "#5a5a60", marginTop: 80 }}>dohyeoplim.me</div>
        </div>,
        size,
    );
}
