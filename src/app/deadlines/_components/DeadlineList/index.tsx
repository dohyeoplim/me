import SectionHeading from "@/app/components/DDS/SectionHeading";
import { CONFERENCE_AREAS, type Conference, type Deadline } from "@/app/lib/deadlines/schema";
import {
    formatDeadline,
    formatSeoulTime,
    remainingLabel,
    type DeadlineBoard,
} from "@/app/lib/deadlines/timeline";
import { deadlinesPage } from "../../_data/content";

type Props = { board: DeadlineBoard; now: number };

export default function DeadlineList({ board, now }: Props) {
    const { sections } = deadlinesPage;
    return (
        <div className="deadlines-board">
            <section className="deadlines-section">
                <SectionHeading title={sections.upcoming} variant="subsection" as="h2" />
                {board.upcoming.length === 0 ? (
                    <p className="font-body text-muted">{deadlinesPage.empty}</p>
                ) : (
                    <ul className="deadlines-list">
                        {board.upcoming.map(({ conference, next }) => (
                            <ConferenceItem key={conference.id} conference={conference} next={next} now={now} />
                        ))}
                    </ul>
                )}
            </section>
            {board.unannounced.length > 0 && (
                <section className="deadlines-section">
                    <SectionHeading title={sections.unannounced} variant="subsection" as="h2" />
                    <ul className="deadlines-list">
                        {board.unannounced.map((conference) => (
                            <ConferenceItem key={conference.id} conference={conference} now={now} />
                        ))}
                    </ul>
                </section>
            )}
            {board.past.length > 0 && (
                <section className="deadlines-section">
                    <SectionHeading title={sections.past} variant="subsection" as="h2" />
                    <ul className="deadlines-list" data-state="past">
                        {board.past.map((conference) => (
                            <ConferenceItem key={conference.id} conference={conference} now={now} />
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

type ItemProps = { conference: Conference; next?: Deadline; now: number };

function ConferenceItem({ conference, next, now }: ItemProps) {
    return (
        <li className="deadlines-item">
            <div className="deadlines-item-heading">
                <h3 className="font-work-title text-ink">
                    <a href={conference.url} target="_blank" rel="noreferrer" className="dds-link">
                        {conference.name} {conference.year}
                    </a>
                </h3>
                {next && (
                    <p className="font-body text-ink">{next.label}, {remainingLabel(next.at, now).toLowerCase()}</p>
                )}
            </div>
            <p className="deadlines-meta font-support text-muted">
                <span>{CONFERENCE_AREAS[conference.area]}</span>
                {conference.dates && <span>{conference.dates}</span>}
                {conference.location && <span>{conference.location}</span>}
            </p>
            {conference.deadlines.length > 0 && (
                <dl className="deadlines-dates">
                    {conference.deadlines.map((deadline) => (
                        <div
                            key={`${deadline.label}-${deadline.at}`}
                            className="deadlines-date"
                            data-state={Date.parse(deadline.at) <= now ? "passed" : undefined}
                        >
                            <dt className="font-support text-muted">{deadline.label}</dt>
                            <dd className="font-support text-ink">
                                <time dateTime={deadline.at}>{formatDeadline(deadline.at)}</time>
                                <span className="text-muted">{formatSeoulTime(deadline.at)}</span>
                            </dd>
                        </div>
                    ))}
                </dl>
            )}
        </li>
    );
}
