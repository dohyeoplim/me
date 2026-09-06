"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import Button from "@/app/components/DDS/Button";
import type { KnowledgeEdit, KnowledgeSource } from "@/app/lib/knowledge/schema";
import { exportKnowledgeCsv, parseKnowledgeCsv } from "@/app/lib/knowledge/csv";
import { useDirty } from "../../../_components/shared/dirty";
import {
    addRepositoryAction, buildSearchIndexAction, importKnowledgeCsvAction, setSourcesVisibilityAction,
} from "../../actions";
import KnowledgeEditor from "../KnowledgeEditor";

type Props = { sources: Array<KnowledgeSource & { searchStatus?: string }>; selectedId?: string };

export default function KnowledgeManager({ sources, selectedId }: Props) {
    const router = useRouter();
    const dirty = useDirty();
    const [pending, startTransition] = useTransition();
    const [indexing, setIndexing] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("all");
    const [owner, setOwner] = useState("all");
    const [search, setSearch] = useState("");
    const [repositoryUrl, setRepositoryUrl] = useState("");
    const [checked, setChecked] = useState<string[]>([]);
    const [csv, setCsv] = useState<{ text: string; rows: KnowledgeEdit[] } | null>(null);
    const stopIndexing = useRef(false);
    const file = useRef<HTMLInputElement>(null);
    useEffect(() => () => { stopIndexing.current = true; }, []);
    const selected = sources.find(({ id }) => id === selectedId);
    const owners = [...new Set(sources.flatMap((source) => source.repository ? [source.repository.owner] : []))].sort();
    const visible = sources.filter((source) => {
        const matches = filter === "all" || source.status === filter || source.origin === filter;
        return matches && (owner === "all" || source.repository?.owner === owner) &&
            `${source.title} ${source.keywords.join(" ")}`.toLowerCase().includes(search.toLowerCase());
    });
    const allSelected = visible.length > 0 && visible.every(({ id }) => checked.includes(id));
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
                <Link className="dds-link" href="/admin"
                    onClick={(event) => { if (!mayChange()) event.preventDefault(); }}>Back to admin</Link>
                <div className="knowledge-actions">
                    <Link className="ds-button" data-variant="outline" data-size="medium"
                        href="/admin/knowledge?source=new"
                        onClick={(event) => { if (!mayChange()) event.preventDefault(); }}>Add source</Link>
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
            <form className="knowledge-repository-form" onSubmit={(event) => {
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
                <Button variant="outline" type="submit" disabled={pending}>Add repository</Button>
            </form>
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
            <div className="knowledge-workspace">
                <aside className="knowledge-library" aria-label="Knowledge sources">
                    <label className="knowledge-field">Find a source
                        <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" />
                    </label>
                    <div className="knowledge-field-pair">
                        <label className="knowledge-field">Show
                            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                                <option value="all">All sources</option><option value="published">Published</option>
                                <option value="draft">Excluded</option><option value="portfolio">Portfolio</option>
                                <option value="manual">Manual</option><option value="github">GitHub</option>
                            </select>
                        </label>
                        <label className="knowledge-field">Owner
                            <select value={owner} onChange={(event) => setOwner(event.target.value)}>
                                <option value="all">All owners</option>
                                {owners.map((item) => <option key={item}>{item}</option>)}
                            </select>
                        </label>
                    </div>
                    <label className="knowledge-selection">
                        <input type="checkbox" checked={allSelected} onChange={() => setChecked((current) => allSelected
                            ? current.filter((id) => !visible.some((source) => source.id === id))
                            : [...new Set([...current, ...visible.map(({ id }) => id)])])} />
                        Select filtered sources ({visible.length})
                    </label>
                    {checked.length > 0 && <div className="knowledge-actions">
                        <span>{checked.length} selected</span>
                        <Button variant="outline" disabled={pending} onClick={() => setVisibility("published")}>
                            Publish
                        </Button>
                        <Button variant="outline" disabled={pending} onClick={() => setVisibility("draft")}>
                            Exclude
                        </Button>
                    </div>}
                    <div className="knowledge-source-list">
                        {visible.map((source) => <div className="knowledge-source-row" key={source.id}>
                            <input type="checkbox" aria-label={`Select ${source.title}`}
                                checked={checked.includes(source.id)}
                                onChange={(event) => setChecked((current) => event.target.checked
                                    ? [...current, source.id] : current.filter((id) => id !== source.id))} />
                            <Link href={`/admin/knowledge?source=${encodeURIComponent(source.id)}`}
                                onClick={(event) => { if (!mayChange()) event.preventDefault(); }}
                                aria-current={source.id === selectedId ? "page" : undefined}>
                                <span>{source.title}</span>
                                <span className="knowledge-help">
                                    {source.searchStatus ?? (source.status === "draft" ? "Excluded" : "Published")}
                                </span>
                            </Link>
                        </div>)}
                        {!visible.length && <p>No matching sources.</p>}
                    </div>
                </aside>
                {selected || selectedId === "new" ? (
                    <KnowledgeEditor key={selected?.id ?? "new"} source={selected ?? null} />)
                    : <div className="knowledge-empty"><h2 className="font-work-title">Select a source</h2>
                        <p>Only published sources are used in answers. New repositories start excluded.</p>
                        <p>CSV edits do not remove sources. Build the index after importing or publishing a batch.</p>
                    </div>}
            </div>
        </div>
    );
}
