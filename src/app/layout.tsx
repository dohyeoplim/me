import type { Metadata, Viewport } from "next";
import { pretendard } from "@/assets/fonts/pretendard";
import "./globals.css";
import "./styles/dds-components.css";
import Header from "./components/Header";
import { HeaderSlotProvider } from "./components/Header/HeaderSlot";
import { PreviousPathProvider } from "./components/PreviousPath";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { ProfileChatProvider } from "./components/ProfileChat/Context";

export const metadata: Metadata = {
    title: "Dohyeop",
    description: "Interested in computer vision and generative AI.",
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
                <ProfileChatProvider>
                    <PreviousPathProvider>
                        <HeaderSlotProvider>
                            <Header />
                            {children}
                            <Footer />
                        </HeaderSlotProvider>
                    </PreviousPathProvider>
                </ProfileChatProvider>
                <Analytics />
            </body>
        </html>
    );
}
