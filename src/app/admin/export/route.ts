import { auth } from "@/auth";
import { listAllRows } from "@/app/lib/content/repository";

export const dynamic = "force-dynamic";

const COLUMNS = [
    "id",
    "type",
    "slug",
    "title",
    "status",
    "order_index",
    "doc",
    "updated_at",
] as const;

function cell(value: unknown): string {
    const s = value == null ? "" : String(value);
    return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
    const session = await auth();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const rows = await listAllRows();
    const lines = [COLUMNS.join(",")];
    for (const r of rows) {
        lines.push(
            [
                cell(r.id),
                cell(r.type),
                cell(r.slug),
                cell(r.title),
                cell(r.status),
                cell(r.order_index),
                cell(JSON.stringify(r.doc)),
                cell(new Date(r.updated_at).toISOString()),
            ].join(","),
        );
    }

    const csv = "﻿" + lines.join("\r\n");
    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="content-entries.csv"',
        },
    });
}
