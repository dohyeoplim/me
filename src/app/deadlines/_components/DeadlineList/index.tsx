import SectionHeading from "@/app/components/DDS/SectionHeading";
import { CONFERENCE_AREAS, type Conference, type Deadline } from "@/app/lib/deadlines/schema";
import { formatDeadline, formatSeoulTime, remainingLabel, type DeadlineBoard } from "@/app/lib/deadlines/timeline";
import { deadlinesPage } from "../../_data/content";

type Props = { board: DeadlineBoard; now: number };

export default function DeadlineList({ board, now }: Props) {
    const { sections } = deadlinesPage;
    return (
        <div className="deadlines-board">
            <section>
                <SectionHeading title={sections.upcoming} variant="subsection" as="h2" />
                {board.upcoming.length === 0 ? (
                    <p className="font-body text-muted">{deadlinesPage.empty}</p>
                ) : (
                    <ul className="deadlines-list">
                        {board.upcoming.map(({ conference, next }) => (
                            <UpcomingItem key={conference.id} conference={conference} next={next} now={now} />
                        ))}
                    </ul>
                )}
            </section>
            {board.unannounced.length > 0 && (
                <section>
                    <SectionHeading title={sections.unannounced} variant="subsection" as="h2" />
                    <CompactList conferences={board.unannounced} />
                </section>
            )}
            {board.past.length > 0 && (
                <section>
                    <SectionHeading title={sections.past} variant="subsection" as="h2" />
                    <CompactList conferences={board.past} />
                </section>
            )}
        </div>
    );
}

function details(conference: Conference) {
    return [CONFERENCE_AREAS[conference.area], conference.dates, conference.location].filter(Boolean);
}

function UpcomingItem({ conference, next, now }: { conference: Conference; next: Deadline; now: number }) {
    const submissions = conference.deadlines.filter(({ kind }) => kind === "submission");
    return (
        <li className="deadlines-item">
            <div className="deadlines-item-heading">
                <h3 className="font-work-title text-ink">
                    <a href={conference.url} target="_blank" rel="noreferrer" className="deadlines-title-link">
                        {conference.name} {conference.year}
                    </a>
                </h3>
                <p className="deadlines-countdown font-work-title text-ink">{remainingLabel(next.at, now)}</p>
                <p className="deadlines-meta font-support text-muted">
                    {details(conference).map((value) => <span key={value}>{value}</span>)}
                </p>
                <p className="deadlines-next font-support text-muted">{next.label}</p>
            </div>
            <dl className="deadlines-dates font-support">
                {submissions.map((deadline) => (
                    <div
                        key={`${deadline.label}-${deadline.at}`}
                        className="deadlines-date"
                        data-state={Date.parse(deadline.at) <= now ? "passed" : undefined}
                    >
                        <dt className="text-muted">{deadline.label}</dt>
                        <dd>
                            <time dateTime={deadline.at} className="text-ink">{formatDeadline(deadline.at)}</time>
                            <span className="text-muted">{formatSeoulTime(deadline.at)}</span>
                        </dd>
                    </div>
                ))}
            </dl>
        </li>
    );
}

function CompactList({ conferences }: { conferences: Conference[] }) {
    return (
        <ul className="deadlines-list">
            {conferences.map((conference) => (
                <li key={conference.id} className="deadlines-row">
                    <a href={conference.url} target="_blank" rel="noreferrer"
                        className="deadlines-title-link font-body text-ink">
                        {conference.name} {conference.year}
                    </a>
                    <span className="font-support text-muted">{details(conference).slice(0, 2).join(", ")}</span>
                </li>
            ))}
        </ul>
    );
}
