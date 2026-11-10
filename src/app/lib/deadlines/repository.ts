import "server-only";
import { unstable_cache } from "next/cache";
import { sql } from "../db";
import { ensureDeadlinesSchema } from "./database";
import { ConferenceSchema, type Conference } from "./schema";

const columns = sql`id, name, year, area, url, location, starts_on::text as "startsOn", ends_on::text as "endsOn",
    deadlines, status`;

export async function listConferences(): Promise<Conference[]> {
    await ensureDeadlinesSchema();
    const rows = await sql`select ${columns} from conference_deadlines order by year desc, name`;
    return rows.map((row) => ConferenceSchema.parse(row));
}

export async function getConference(id: string): Promise<Conference | null> {
    await ensureDeadlinesSchema();
    const [row] = await sql`select ${columns} from conference_deadlines where id = ${id}`;
    return row ? ConferenceSchema.parse(row) : null;
}

export async function saveConference(input: Conference) {
    const conference = ConferenceSchema.parse(input);
    await ensureDeadlinesSchema();
    await sql`insert into conference_deadlines
        (id, name, year, area, url, location, starts_on, ends_on, deadlines, status)
        values (${conference.id}, ${conference.name}, ${conference.year}, ${conference.area}, ${conference.url},
            ${conference.location}, ${conference.startsOn}, ${conference.endsOn},
            ${JSON.stringify(conference.deadlines)}::jsonb, ${conference.status})
        on conflict(id) do update set name = excluded.name, year = excluded.year, area = excluded.area,
            url = excluded.url, location = excluded.location, starts_on = excluded.starts_on,
            ends_on = excluded.ends_on, deadlines = excluded.deadlines, status = excluded.status,
            updated_at = now()`;
    return conference;
}

export async function deleteConference(id: string) {
    await ensureDeadlinesSchema();
    await sql`delete from conference_deadlines where id = ${id}`;
}

export const listPublishedConferences = unstable_cache(async (): Promise<Conference[]> => {
    await ensureDeadlinesSchema();
    const rows = await sql`select ${columns} from conference_deadlines where status = 'published'`;
    return rows.map((row) => ConferenceSchema.parse(row));
}, ["published-conference-deadlines"], { tags: ["deadlines"], revalidate: 3600 });
