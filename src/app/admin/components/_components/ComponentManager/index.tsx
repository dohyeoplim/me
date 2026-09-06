"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Button from "@/app/components/DDS/Button";
import Sheet from "@/app/components/DDS/Sheet";
import AnswerCards from "@/app/components/ProfileChat/_components/AnswerCards";
import { profileCardRegistry } from "@/app/lib/profile-chat/types";
import { componentDefaults } from "@/app/lib/reserved-components/defaults";
import type { ReservedComponent } from "@/app/lib/reserved-components/schema";
import { useDirty, useRegisterDirty } from "../../../_components/shared/dirty";
import { saveComponentAction } from "../../actions";

type Source = { id: string; title: string; status: string };
type Props = { components: ReservedComponent[]; sources: Source[] };

export default function ComponentManager({ components, sources }: Props) {
    const [selected, setSelected] = useState<ReservedComponent | null>(null);
    const dirty = useDirty();
    return <>
        <nav className="knowledge-actions"><Link className="dds-link" href="/admin">Back to admin</Link>
            <Link className="dds-link" href="/admin/knowledge">Knowledge</Link></nav>
        <div className="knowledge-library"><div className="knowledge-table-wrap"><table className="knowledge-table">
            <thead><tr><th>Component</th><th>Type</th><th>Evidence sources</th><th>Visibility</th></tr></thead>
            <tbody>{components.map((component) => <tr key={component.id}>
                <td><button type="button" className="dds-link" onClick={() => setSelected(component)}>
                    {component.presentation?.title ?? componentDefaults(component.id).title}
                </button></td>
                <td>{profileCardRegistry[component.id].type}</td><td>{component.sourceIds.length}</td>
                <td>{component.enabled ? "Enabled" : "Disabled"}</td>
            </tr>)}</tbody>
        </table></div></div>
        <Sheet open={Boolean(selected)} title={selected ? componentDefaults(selected.id).title : "Component"}
            size="wide"
            beforeClose={() => !dirty || window.confirm("Discard unsaved changes?")} onClose={() => setSelected(null)}>
            {selected && <ComponentEditor key={selected.id} component={selected} sources={sources} />}
        </Sheet>
    </>;
}

function ComponentEditor({ component, sources }: { component: ReservedComponent; sources: Source[] }) {
    const router = useRouter();
    const defaults = componentDefaults(component.id);
    const [enabled, setEnabled] = useState(component.enabled);
    const [custom, setCustom] = useState(Boolean(component.presentation));
    const [text, setText] = useState(component.presentation ?? { ...defaults, enabled: true });
    const [sourceIds, setSourceIds] = useState(component.sourceIds);
    const [baseline, setBaseline] = useState(JSON.stringify(component));
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [pending, startTransition] = useTransition();
    const value: ReservedComponent = { id: component.id, enabled, sourceIds,
        presentation: custom ? { ...text, enabled } : null };
    const dirty = JSON.stringify(value) !== baseline;
    useRegisterDirty(dirty);
    useEffect(() => {
        if (!dirty) return;
        const warn = (event: BeforeUnloadEvent) => event.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);
    return <form className="knowledge-editor" onSubmit={(event) => {
        event.preventDefault(); setError("");
        startTransition(async () => {
            try {
            const result = await saveComponentAction(value);
            if (!result.ok) { setError(result.error); return; }
            setText(result.value.presentation ?? { ...defaults, enabled: result.value.enabled });
            setEnabled(result.value.enabled); setSourceIds(result.value.sourceIds);
            setBaseline(JSON.stringify(result.value));
            setMessage(result.warning ?? "Component saved."); router.refresh();
            } catch { setError("The component could not be saved. Try again."); }
        });
    }}>
        <fieldset className="knowledge-fields" disabled={pending}>
            <label className="knowledge-selection"><input type="checkbox" checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)} />Allow in answers</label>
            <label className="knowledge-selection"><input type="checkbox" checked={custom}
                onChange={(event) => setCustom(event.target.checked)} />Customize text</label>
            {custom && (["title", "description", "body"] as const).map((key) => (
            <label className="knowledge-field" key={key}>
                {key === "body" ? "Content" : key === "title" ? "Title" : "Description"}
                {key === "body" ? <textarea value={text[key]} required maxLength={2400}
                    onChange={(event) => setText({ ...text, [key]: event.target.value })} />
                    : <input value={text[key]} required={key === "title"} maxLength={key === "title" ? 200 : 300}
                        onChange={(event) => setText({ ...text, [key]: event.target.value })} />}
            </label>))}
            <h3 className="font-body">Evidence sources</h3>
            <div className="component-evidence-list">
                {sources.map((source) => <label className="knowledge-selection" key={source.id}>
                    <input type="checkbox" checked={sourceIds.includes(source.id)}
                        disabled={!sourceIds.includes(source.id) && sourceIds.length >= 20}
                        onChange={(event) => setSourceIds(event.target.checked
                            ? [...sourceIds, source.id] : sourceIds.filter((id) => id !== source.id))} />
                    {source.title}{source.status === "draft" ? " (excluded)" : ""}
                </label>)}
            </div>
        </fieldset>
        <div className="knowledge-save-actions"><Button type="submit" disabled={pending || !dirty}>
            {pending ? "Saving..." : "Save component"}
        </Button></div>
        {error && <p role="alert">{error}</p>}<p role="status">{message}</p>
        <h3 className="font-body">Preview</h3>
        <AnswerCards cards={[{
            ...profileCardRegistry[component.id], presentation: value.presentation ?? undefined,
        }]} />
    </form>;
}
