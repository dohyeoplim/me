import { requireAdminPage } from "@/app/lib/admin-session";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import { listConferences } from "@/app/lib/deadlines/repository";
import ExitLink from "../_components/shared/ExitLink";
import SignOutButton from "../_components/shared/SignOutButton";
import DeadlineManager from "./_components/DeadlineManager";
import "../../styles/dds-knowledge.css";

export const dynamic = "force-dynamic";

export default async function AdminDeadlinesPage() {
    await requireAdminPage();
    const conferences = await listConferences();
    return <main className="knowledge-page font-support">
        <HeaderActions><ExitLink /><SignOutButton /></HeaderActions>
        <h1 className="font-section-title">Deadlines</h1>
        <DeadlineManager conferences={conferences} />
    </main>;
}
