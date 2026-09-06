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
import MotionProvider from "./components/DDS/Motion/Provider";
import { site } from "./lib/site";

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: site.name,
    description: site.description,
    openGraph: { type: "website", siteName: site.name, title: site.name, description: site.description },
    twitter: { card: "summary_large_image", title: site.name, description: site.description },
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
                <MotionProvider>
                    <ProfileChatProvider>
                        <PreviousPathProvider>
                            <HeaderSlotProvider>
                                <Header />
                                {children}
                                <Footer />
                            </HeaderSlotProvider>
                        </PreviousPathProvider>
                    </ProfileChatProvider>
                </MotionProvider>
                <Analytics />
            </body>
        </html>
    );
}
