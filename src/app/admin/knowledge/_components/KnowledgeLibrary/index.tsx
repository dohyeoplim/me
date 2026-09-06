"use client";

import Link from "next/link";
import { useState, type Dispatch, type SetStateAction, type MouseEvent } from "react";
import Button from "@/app/components/DDS/Button";
import type { KnowledgeSource } from "@/app/lib/knowledge/schema";

type Source = KnowledgeSource & { searchStatus?: string };
type Props = {
    sources: Source[];
    selectedId?: string;
    checked: string[];
    setChecked: Dispatch<SetStateAction<string[]>>;
    pending: boolean;
    onVisibility: (status: "draft" | "published") => void;
    onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const views = [
    { value: "published", label: "Published" }, { value: "draft", label: "Excluded" }, { value: "all", label: "All" },
] as const;

export default function KnowledgeLibrary({
    sources, selectedId, checked, setChecked, pending, onVisibility, onNavigate,
}: Props) {
    const [status, setStatus] = useState("published");
    const [kind, setKind] = useState("all");
    const [owner, setOwner] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 30;
    const owners = [...new Set(sources.flatMap((source) => source.repository ? [source.repository.owner] : []))].sort();
    const matches = sources.filter((source) => (status === "all" || source.status === status) &&
        (kind === "all" || source.kind === kind) &&
        (kind !== "repository" || owner === "all" || source.repository?.owner === owner) &&
        `${source.title} ${source.repository?.owner ?? ""} ${source.keywords.join(" ")}`
            .toLowerCase().includes(search.toLowerCase()));
    const currentPage = Math.min(page, Math.max(0, Math.ceil(matches.length / pageSize) - 1));
    const visible = matches.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    const allSelected = visible.length > 0 && visible.every(({ id }) => checked.includes(id));

    return (
        <section className="knowledge-library" aria-label="Knowledge sources">
            <div className="knowledge-library-heading">
                <h2 className="font-work-title">Sources</h2>
                <span className="knowledge-help">{matches.length} sources</span>
            </div>
            <div className="knowledge-tabs" role="group" aria-label="Source visibility">
                {views.map(({ value, label }) => <Button key={value} variant="text" aria-pressed={status === value}
                    onClick={() => { setStatus(value); setPage(0); }}>
                    {label} {sources.filter((source) => value === "all" || source.status === value).length}
                </Button>)}
            </div>
            <div className="knowledge-filters">
                <label className="knowledge-field">
                    <span className="sr-only">Search sources</span>
                    <input type="search" placeholder="Find a source or repository" value={search}
                        onChange={(event) => { setSearch(event.target.value); setPage(0); }} />
                </label>
                <label className="knowledge-field">
                    <span className="sr-only">Category</span>
                    <select value={kind} onChange={(event) => { setKind(event.target.value); setPage(0); }}>
                        <option value="all">All categories</option>
                        <option value="profile">Profile</option><option value="research">Research</option>
                        <option value="project">Projects</option><option value="repository">Repositories</option>
                        <option value="education">Education</option><option value="experience">Experience</option>
                    </select>
                </label>
                {kind === "repository" && <label className="knowledge-field knowledge-owner-filter">
                    <span className="sr-only">Repository owner</span>
                    <select value={owner} onChange={(event) => { setOwner(event.target.value); setPage(0); }}>
                        <option value="all">All owners</option>
                        {owners.map((name) => <option key={name}>{name}</option>)}
                    </select>
                </label>}
            </div>
            <div className="knowledge-bulkbar">
                <label className="knowledge-selection">
                    <input type="checkbox" checked={allSelected} onChange={() => setChecked((current) => allSelected
                        ? current.filter((id) => !visible.some((source) => source.id === id))
                        : [...new Set([...current, ...visible.map(({ id }) => id)])])} />
                    {checked.length ? `${checked.length} selected` : "Select page"}
                </label>
                {checked.length > 0 && <div className="knowledge-actions">
                    {matches.length > pageSize && <Button variant="text" onClick={() =>
                        setChecked((current) => [...new Set([...current, ...matches.map(({ id }) => id)])])}>
                        Select all {matches.length}
                    </Button>}
                    <Button variant="text" disabled={pending} onClick={() => onVisibility("published")}>Publish</Button>
                    <Button variant="text" disabled={pending} onClick={() => onVisibility("draft")}>Exclude</Button>
                    <Button variant="text" onClick={() => setChecked([])}>Clear</Button>
                </div>}
            </div>
            <div className="knowledge-source-list">
                {visible.map((source) => <div className="knowledge-source-row" key={source.id}
                    data-active={selectedId === source.id}>
                    <input type="checkbox" aria-label={`Select ${source.title}`} checked={checked.includes(source.id)}
                        onChange={(event) => setChecked((current) => event.target.checked
                            ? [...new Set([...current, source.id])] : current.filter((id) => id !== source.id))} />
                    <Link href={`/admin/knowledge?source=${encodeURIComponent(source.id)}`} onClick={onNavigate}
                        aria-current={source.id === selectedId ? "page" : undefined}>
                        <span className="knowledge-source-title">{source.title}</span>
                        <span className="knowledge-source-meta">{source.kind}</span>
                        <span className="knowledge-source-status">
                            {source.searchStatus ?? (source.status === "draft" ? "Excluded" : "Published")}
                        </span>
                    </Link>
                </div>)}
                {!visible.length && <p className="knowledge-empty">No matching sources.</p>}
            </div>
            {matches.length > pageSize && <div className="knowledge-pagination">
                <Button variant="outline" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
                    Previous
                </Button>
                <span>{currentPage + 1} / {Math.ceil(matches.length / pageSize)}</span>
                <Button variant="outline" disabled={(currentPage + 1) * pageSize >= matches.length}
                    onClick={() => setPage(currentPage + 1)}>Next</Button>
            </div>}
        </section>
    );
}
