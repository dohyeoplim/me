import SectionHeading from "@/app/components/DDS/SectionHeading";
import { CONFERENCE_AREAS, type Conference, type Deadline } from "@/app/lib/deadlines/schema";
import { locationFlags } from "@/app/lib/deadlines/location";
import { formatDeadline, remainingLabel, type DeadlineBoard } from "@/app/lib/deadlines/timeline";
import { deadlinesPage } from "../../_data/content";

type Props = { board: DeadlineBoard; now: number };

export default function DeadlineList({ board, now }: Props) {
    const { sections } = deadlinesPage;
    const groups = [
        { title: sections.unannounced, conferences: board.unannounced },
        { title: sections.closed, conferences: board.past },
    ].filter(({ conferences }) => conferences.length > 0);
    if (board.upcoming.length === 0 && groups.length === 0) {
        return <p className="font-body02-light text-faint">{deadlinesPage.empty}</p>;
    }
    return (
        <div className="deadlines-board">
            {board.upcoming.length > 0 && (
                <ul className="deadlines-list">
                    {board.upcoming.map(({ conference, next }) => (
                        <ConferenceItem key={conference.id} conference={conference} next={next} now={now} />
                    ))}
                </ul>
            )}
            {groups.map(({ title, conferences }) => (
                <section key={title}>
                    <SectionHeading title={title} variant="subsection" as="h2" />
                    <ul className="deadlines-list">
                        {conferences.map((conference) => (
                            <ConferenceItem key={conference.id} conference={conference} now={now} nested />
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}

type ItemProps = { conference: Conference; next?: Deadline; now: number; nested?: boolean };

function ConferenceItem({ conference, next, now, nested = false }: ItemProps) {
    const Heading = nested ? "h3" : "h2";
    const submissions = conference.deadlines.filter(({ kind }) => kind === "submission");
    const flags = locationFlags(conference.location);
    return (
        <li>
            <a href={conference.url} target="_blank" rel="noreferrer" className="deadlines-item group">
                <span className="font-caption01-light text-faint">{CONFERENCE_AREAS[conference.area]}</span>
                <span className="deadlines-item-heading">
                    <Heading className="font-head01-medium text-ink transition-colors group-hover:text-muted">
                        {conference.name} {conference.year}
                    </Heading>
                    {next && (
                        <span className="deadlines-countdown">
                            <time dateTime={next.at} title={formatDeadline(next.at)}
                                className="font-head01-medium text-ink">
                                {remainingLabel(next.at, now)}
                            </time>
                            <span className="font-support text-muted">{next.label}</span>
                        </span>
                    )}
                    {conference.location && (
                        <span className="deadlines-details font-support text-muted">
                            {flags && <span aria-hidden="true">{flags} </span>}
                            {conference.location}
                        </span>
                    )}
                </span>
                {next && submissions.length > 0 && (
                    <dl className="deadlines-dates font-support">
                        {submissions.map(({ label, at }) => (
                            <div key={`${label}-${at}`} className="deadlines-date"
                                data-state={Date.parse(at) <= now ? "passed" : undefined}>
                                <dt className="text-muted">{label}</dt>
                                <dd className="text-ink">
                                    <time dateTime={at} title={formatDeadline(at)}>{remainingLabel(at, now)}</time>
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </a>
        </li>
    );
}
