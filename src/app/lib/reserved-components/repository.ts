import { sql } from "../db";
import { ensureKnowledgeSchema } from "../knowledge/database";
import { defaultReservedComponents, ReservedComponentSchema, type ReservedComponent } from "./schema";

export async function listReservedComponents(): Promise<ReservedComponent[]> {
    await ensureKnowledgeSchema();
    const rows = await sql`select id, enabled, source_ids as "sourceIds", presentation from reserved_components`;
    const saved = new Map(rows.map((row) => {
        const parsed = ReservedComponentSchema.parse(row);
        return [parsed.id, parsed] as const;
    }));
    return defaultReservedComponents.map((component) => saved.get(component.id) ?? component);
}

export async function saveReservedComponent(input: ReservedComponent) {
    const component = ReservedComponentSchema.parse(input);
    await ensureKnowledgeSchema();
    await sql`insert into reserved_components (id, enabled, source_ids, presentation)
        values (${component.id}, ${component.enabled}, ${JSON.stringify(component.sourceIds)}::jsonb,
            ${JSON.stringify(component.presentation)}::jsonb)
        on conflict(id) do update set enabled = excluded.enabled, source_ids = excluded.source_ids,
            presentation = excluded.presentation, updated_at = now()`;
    return component;
}
