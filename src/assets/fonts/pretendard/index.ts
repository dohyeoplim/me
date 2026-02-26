import localFont from "next/font/local";

export const pretendard = localFont({
    variable: "--font-pretendard",
    display: "swap",
    src: [
        {
            path: "./woff2/Pretendard-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./woff/Pretendard-Medium.woff",
            weight: "500",
            style: "normal",
        },
        {
            path: "./woff2/Pretendard-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./woff/Pretendard-Regular.woff",
            weight: "400",
            style: "normal",
        },
        {
            path: "./woff2/Pretendard-Light.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "./woff/Pretendard-Light.woff",
            weight: "300",
            style: "normal",
        },
    ],
});
