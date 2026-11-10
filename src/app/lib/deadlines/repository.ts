import "server-only";
import { unstable_cache } from "next/cache";
import { sql } from "../db";
import { ensureDeadlinesSchema } from "./database";
import { ConferenceSchema, type Conference } from "./schema";

const columns = sql`id, name, year, area, url, location, dates, deadlines, status`;

export async function listConferences(): Promise<Conference[]> {
    await ensureDeadlinesSchema();
    const rows = await sql`select ${columns} from conference_deadlines order by name`;
    return rows.map((row) => ConferenceSchema.parse(row));
}

export async function replaceSyncedConferences(input: Conference[]) {
    const conferences = input.map((conference) => ConferenceSchema.parse(conference));
    await ensureDeadlinesSchema();
    // Synced fields are overwritten, but visibility chosen in admin is kept across syncs.
    await sql.transaction([
        sql`insert into conference_deadlines (id, name, year, area, url, location, dates, deadlines, status)
            select item->>'id', item->>'name', (item->>'year')::int, item->>'area', item->>'url',
                item->>'location', item->>'dates', item->'deadlines', item->>'status'
            from jsonb_array_elements(${JSON.stringify(conferences)}::jsonb) as item
            on conflict(id) do update set name = excluded.name, year = excluded.year, area = excluded.area,
                url = excluded.url, location = excluded.location, dates = excluded.dates,
                deadlines = excluded.deadlines, updated_at = now()`,
        sql`delete from conference_deadlines
            where not (id = any(${conferences.map(({ id }) => id)}::text[]))`,
    ]);
    return conferences.length;
}

export async function setConferenceVisibility(id: string, status: Conference["status"]) {
    await ensureDeadlinesSchema();
    await sql`update conference_deadlines set status = ${status}, updated_at = now() where id = ${id}`;
}

export const listPublishedConferences = unstable_cache(async (): Promise<Conference[]> => {
    await ensureDeadlinesSchema();
    const rows = await sql`select ${columns} from conference_deadlines where status = 'published'`;
    return rows.map((row) => ConferenceSchema.parse(row));
}, ["published-conference-deadlines"], { tags: ["deadlines"], revalidate: 3600 });
