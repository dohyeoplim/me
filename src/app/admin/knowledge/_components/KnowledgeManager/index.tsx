"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import Button from "@/app/components/DDS/Button";
import Sheet from "@/app/components/DDS/Sheet";
import type { KnowledgeEdit, KnowledgeSource } from "@/app/lib/knowledge/schema";
import { exportKnowledgeCsv, parseKnowledgeCsv } from "@/app/lib/knowledge/csv";
import { useDirty } from "../../../_components/shared/dirty";
import {
    addRepositoryAction, buildSearchIndexAction, importKnowledgeCsvAction, setSourcesVisibilityAction,
} from "../../actions";
import KnowledgeEditor from "../KnowledgeEditor";
import KnowledgeLibrary from "../KnowledgeLibrary";

type Props = { sources: Array<KnowledgeSource & { searchStatus?: string }>; selectedId?: string };

export default function KnowledgeManager({ sources, selectedId }: Props) {
    const router = useRouter();
    const dirty = useDirty();
    const [pending, startTransition] = useTransition();
    const [indexing, setIndexing] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [repositoryUrl, setRepositoryUrl] = useState("");
    const [repositoryOpen, setRepositoryOpen] = useState(false);
    const [checked, setChecked] = useState<string[]>([]);
    const [csv, setCsv] = useState<{ text: string; rows: KnowledgeEdit[] } | null>(null);
    const stopIndexing = useRef(false);
    const file = useRef<HTMLInputElement>(null);
    useEffect(() => () => { stopIndexing.current = true; }, []);
    const selected = sources.find(({ id }) => id === selectedId);
    const mayChange = () => !dirty || window.confirm("Discard unsaved changes?");
    const run = (task: () => Promise<void>) => {
        if (!mayChange()) return;
        setError(""); setMessage("");
        startTransition(async () => {
            try { await task(); }
            catch (reason) {
                setError(reason instanceof Error ? reason.message : "The change could not be completed.");
            }
        });
    };
    const refresh = () => { router.push("/admin/knowledge"); router.refresh(); };
    const setVisibility = (status: "published" | "draft") => run(async () => {
        const result = await setSourcesVisibilityAction({ ids: checked, status });
        if (!result.ok) throw new Error(result.error);
        setMessage(`${result.value} sources ${status === "draft" ? "excluded" : "published"}.`);
        setChecked([]); refresh();
    });
    const download = () => {
        const selected = checked.length ? sources.filter(({ id }) => checked.includes(id)) : sources;
        const url = URL.createObjectURL(new Blob([exportKnowledgeCsv(selected)], { type: "text/csv;charset=utf-8" }));
        const anchor = document.createElement("a");
        anchor.href = url; anchor.download = "knowledge.csv"; anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    const buildIndex = () => run(async () => {
        stopIndexing.current = false;
        setIndexing(true);
        let indexed = 0;
        try {
        for (let batch = 0; batch < 100 && !stopIndexing.current; batch++) {
            const result = await buildSearchIndexAction();
            if (!result.ok) throw new Error(result.error);
            indexed += result.value.indexed;
            setMessage(`Indexed ${indexed}. Remaining ${result.value.remaining}. Failed ${result.value.failed}.`);
            if (!result.value.remaining || result.value.failed) break;
        }
        } finally { setIndexing(false); }
        router.refresh();
    });

    return (
        <div className="knowledge-manager">
            <div className="knowledge-toolbar">
                <nav className="knowledge-actions">
                    <Link className="dds-link" href="/admin"
                        onClick={(event) => { if (!mayChange()) event.preventDefault(); }}>Back to admin</Link>
                    <Link className="dds-link" href="/admin/components"
                        onClick={(event) => { if (!mayChange()) event.preventDefault(); }}>Reserved components</Link>
                </nav>
                <div className="knowledge-actions">
                    <Link className="ds-button" data-variant="solid" data-size="medium"
                        href="/admin/knowledge?source=new"
                        onClick={(event) => { if (!mayChange()) event.preventDefault(); }}>Add source</Link>
                    <Button variant="outline" aria-expanded={repositoryOpen}
                        onClick={() => setRepositoryOpen(!repositoryOpen)}>Add repository</Button>
                    <Button variant="outline" onClick={download}>
                        {checked.length ? "Export selected" : "Export CSV"}
                    </Button>
                    <Button variant="outline" disabled={pending} onClick={() => file.current?.click()}>
                        Import CSV
                    </Button>
                    <Button variant="outline" disabled={pending} onClick={buildIndex}>Build search index</Button>
                    {indexing && <Button variant="text" onClick={() => { stopIndexing.current = true; }}>
                        Stop indexing
                    </Button>}
                </div>
            </div>
            <input ref={file} type="file" accept=".csv,text/csv" className="sr-only" onChange={async (event) => {
                const selected = event.target.files?.[0];
                event.target.value = "";
                if (!selected) return;
                setError(""); setCsv(null);
                try {
                    if (selected.size > 4_000_000) throw new Error("Choose a CSV smaller than 4 MB.");
                    const text = await selected.text();
                    setCsv({ text, rows: parseKnowledgeCsv(text) });
                } catch (reason) { setError(reason instanceof Error ? reason.message : "Invalid CSV."); }
            }} />
            {repositoryOpen && <form className="knowledge-repository-form" onSubmit={(event) => {
                event.preventDefault();
                run(async () => {
                    const result = await addRepositoryAction(repositoryUrl);
                    if (!result.ok) throw new Error(result.error);
                    setRepositoryUrl("");
                    router.push(`/admin/knowledge?source=${encodeURIComponent(result.value)}`); router.refresh();
                });
            }}>
                <label className="knowledge-field">Repository URL
                    <input type="url" required value={repositoryUrl} maxLength={2000}
                        placeholder="https://github.com/owner/repository"
                        onChange={(event) => setRepositoryUrl(event.target.value)} />
                </label>
                <Button variant="outline" type="submit" disabled={pending}>Import repository</Button>
            </form>}
            {csv && <section className="knowledge-report" aria-label="CSV import preview">
                <h2 className="font-work-title">Import {csv.rows.length} sources</h2>
                <p>Existing IDs will be updated. Empty IDs create new sources. Other sources are unchanged.</p>
                <ul>{csv.rows.slice(0, 10).map((row) => <li key={row.id}>{row.title}, {row.status}</li>)}</ul>
                {csv.rows.length > 10 && <p>And {csv.rows.length - 10} more sources.</p>}
                <div className="knowledge-actions">
                    <Button disabled={pending} onClick={() => run(async () => {
                        const form = new FormData();
                        form.set("csv", new File([csv.text], "knowledge.csv", { type: "text/csv" }));
                        const result = await importKnowledgeCsvAction(form);
                        if (!result.ok) throw new Error(result.error);
                        setMessage(`Imported ${result.value} sources. Build the search index to update embeddings.`);
                        setCsv(null); refresh();
                    })}>Apply import</Button>
                    <Button variant="text" disabled={pending} onClick={() => setCsv(null)}>Cancel</Button>
                </div>
            </section>}
            {error && <p role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}
            <div className="knowledge-workspace" data-editing={Boolean(selected || selectedId === "new")}>
                <KnowledgeLibrary sources={sources} selectedId={selectedId} checked={checked}
                    setChecked={setChecked} pending={pending} onVisibility={setVisibility}
                    onNavigate={(event) => { if (!mayChange()) event.preventDefault(); }} />
                <Sheet open={Boolean(selected || selectedId === "new")} title={selected?.title ?? "New source"}
                    size="wide"
                    beforeClose={mayChange} onClose={() => router.push("/admin/knowledge", { scroll: false })}>
                    {(selected || selectedId === "new") && <KnowledgeEditor
                        key={selected?.id ?? "new"} source={selected ?? null} embedded />}
                </Sheet>
            </div>
        </div>
    );
}
