export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full max-w-3xl mx-auto px-6 pt-28 md:pt-40 pb-30">
            {children}
        </div>
    );
}
