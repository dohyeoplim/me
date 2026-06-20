import type { Metadata, Viewport } from "next";
import { pretendard } from "@/assets/fonts/pretendard";
import "./globals.css";
import Header from "./components/Header";
import { HeaderSlotProvider } from "./components/Header/HeaderSlot";
import { PreviousPathProvider } from "./components/PreviousPath";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
    title: "Dohyeop Lim",
    description:
        "Undergraduate researcher in computer vision and generative AI.",
};

export const viewport: Viewport = {
    themeColor: "#FAFAFC",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${pretendard.variable} antialiased`}>
                <PreviousPathProvider>
                    <HeaderSlotProvider>
                        <Header />
                        {children}
                        <Footer />
                    </HeaderSlotProvider>
                </PreviousPathProvider>
                <Analytics />
            </body>
        </html>
    );
}
