import { requireAdminPage } from "@/app/lib/admin-session";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import { ensureKnowledgeSeeded, listKnowledgeSources } from "@/app/lib/knowledge/repository";
import ExitLink from "../_components/shared/ExitLink";
import SignOutButton from "../_components/shared/SignOutButton";
import KnowledgeManager from "./_components/KnowledgeManager";
import "../../styles/dds-knowledge.css";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type Props = { searchParams: Promise<{ source?: string }> };

export default async function KnowledgePage({ searchParams }: Props) {
    await requireAdminPage();
    const { source } = await searchParams;
    await ensureKnowledgeSeeded();
    const sources = await listKnowledgeSources();

    return (
        <main className="knowledge-page font-support">
            <HeaderActions>
                <ExitLink />
                <SignOutButton />
            </HeaderActions>
            <header className="knowledge-heading">
                <h1 className="font-section-title">AI knowledge</h1>
                <p>Manage the information used to answer profile questions and suggest repositories.</p>
            </header>
            <KnowledgeManager sources={sources} selectedId={source} />
        </main>
    );
}
