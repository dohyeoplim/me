import PageFade from "@/app/components/PageFade";

export default function BlogTemplate({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PageFade>{children}</PageFade>;
}
