import type { Metadata } from "next";
import { pretendard } from "@/assets/fonts/pretendard";
import "./globals.css";

export const metadata: Metadata = {
    title: "Dohyeop Lim",
    description:
        "Undergraduate researcher in computer vision and generative AI.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${pretendard.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
