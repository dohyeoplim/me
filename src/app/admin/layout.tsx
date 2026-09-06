import { DirtyProvider } from "./_components/shared/dirty";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-shell w-full max-w-4xl mx-auto px-6 pt-28 md:pt-40 pb-30">
            <DirtyProvider>{children}</DirtyProvider>
        </div>
    );
}
