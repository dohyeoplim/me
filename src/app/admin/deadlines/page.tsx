import { requireAdminPage } from "@/app/lib/admin-session";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import { listConferences } from "@/app/lib/deadlines/repository";
import { formatDeadline, nextSubmission } from "@/app/lib/deadlines/timeline";
import ExitLink from "../_components/shared/ExitLink";
import SignOutButton from "../_components/shared/SignOutButton";
import DeadlineManager, { type ConferenceRow } from "./_components/DeadlineManager";
import "../../styles/dds-knowledge.css";

export const dynamic = "force-dynamic";

async function loadRows(): Promise<ConferenceRow[]> {
    const conferences = await listConferences();
    const now = Date.now();
    return conferences.map((conference) => {
        const next = nextSubmission(conference, now);
        const deadline = next ? `${next.label}, ${formatDeadline(next.at)}`
            : conference.deadlines.length ? "Closed" : "Not announced";
        return { id: conference.id, title: `${conference.name} ${conference.year}`, url: conference.url,
            status: conference.status, deadline };
    });
}

export default async function AdminDeadlinesPage() {
    await requireAdminPage();
    const rows = await loadRows();
    return <main className="knowledge-page font-support">
        <HeaderActions><ExitLink /><SignOutButton /></HeaderActions>
        <header className="knowledge-heading">
            <h1 className="font-section-title">Deadlines</h1>
            <p>Synced daily from ccfddl. Hidden conferences stay hidden after each sync.</p>
        </header>
        <DeadlineManager rows={rows} />
    </main>;
}
