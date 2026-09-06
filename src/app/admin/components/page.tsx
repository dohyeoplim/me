import { requireAdminPage } from "@/app/lib/admin-session";
import { listReservedComponents } from "@/app/lib/reserved-components/repository";
import { listKnowledgeSources } from "@/app/lib/knowledge/repository";
import ComponentManager from "./_components/ComponentManager";
import { HeaderActions } from "@/app/components/Header/HeaderSlot";
import ExitLink from "../_components/shared/ExitLink";
import SignOutButton from "../_components/shared/SignOutButton";
import "../../styles/dds-knowledge.css";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function ComponentsPage() {
    await requireAdminPage();
    const [components, sources] = await Promise.all([listReservedComponents(), listKnowledgeSources()]);
    return <main className="knowledge-page font-support">
        <HeaderActions><ExitLink /><SignOutButton /></HeaderActions>
        <h1 className="font-section-title">Reserved components</h1>
        <ComponentManager components={components}
            sources={sources.map(({ id, title, status }) => ({ id, title, status }))} />
    </main>;
}
