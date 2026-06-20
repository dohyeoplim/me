import { DirtyProvider } from "./_components/shared/dirty";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full max-w-4xl mx-auto px-6 pt-28 md:pt-40 pb-30">
            <DirtyProvider>{children}</DirtyProvider>
        </div>
    );
}
