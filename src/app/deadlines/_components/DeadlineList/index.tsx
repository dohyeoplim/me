import Badge from "@/app/components/DDS/Badge";
import { CONFERENCE_AREAS, type Conference, type Deadline } from "@/app/lib/deadlines/schema";
import { formatDeadline, remainingLabel, type DeadlineBoard } from "@/app/lib/deadlines/timeline";
import { deadlinesPage } from "../../_data/content";

type Props = { board: DeadlineBoard; now: number };

type Item = { conference: Conference; next?: Deadline; status: string };

function boardItems(board: DeadlineBoard): Item[] {
    const { status } = deadlinesPage;
    return [
        ...board.upcoming.map(({ conference, next }) => ({ conference, next, status: next.label })),
        ...board.unannounced.map((conference) => ({ conference, status: status.unannounced })),
        ...board.past.map((conference) => ({ conference, status: status.closed })),
    ];
}

export default function DeadlineList({ board, now }: Props) {
    const items = boardItems(board);
    if (items.length === 0) return <p className="font-body02-light text-faint">{deadlinesPage.empty}</p>;
    return (
        <ul className="deadlines-list">
            {items.map(({ conference, next, status }) => {
                const submissions = conference.deadlines.filter(({ kind }) => kind === "submission");
                const tags = [conference.location].filter(Boolean);
                return (
                    <li key={conference.id}>
                        <a href={conference.url} target="_blank" rel="noreferrer" className="deadlines-item group">
                            <span className="font-caption01-light text-faint">
                                {CONFERENCE_AREAS[conference.area]}
                            </span>
                            <span className="deadlines-item-heading">
                                <h2 className="font-head01-medium text-ink transition-colors group-hover:text-muted">
                                    {conference.name} {conference.year}
                                </h2>
                                {next ? (
                                    <time dateTime={next.at} title={formatDeadline(next.at)}
                                        className="deadlines-countdown font-head01-medium text-ink">
                                        {remainingLabel(next.at, now)}
                                    </time>
                                ) : (
                                    <span className="deadlines-countdown font-support text-faint">{status}</span>
                                )}
                                {tags.length > 0 && (
                                    <span className="deadlines-tags">
                                        {tags.map((tag) => <Badge key={tag} variant="tag">{tag}</Badge>)}
                                    </span>
                                )}
                                {next && <span className="deadlines-next font-support text-muted">{status}</span>}
                            </span>
                            {(submissions.length > 0 || conference.dates) && (
                                <dl className="deadlines-dates font-support">
                                    {submissions.map(({ label, at }) => (
                                        <div key={`${label}-${at}`} className="deadlines-date"
                                            data-state={Date.parse(at) <= now ? "passed" : undefined}>
                                            <dt className="text-muted">{label}</dt>
                                            <dd className="text-ink">
                                                <time dateTime={at} title={formatDeadline(at)}>
                                                    {remainingLabel(at, now)}
                                                </time>
                                            </dd>
                                        </div>
                                    ))}
                                    {conference.dates && (
                                        <div className="deadlines-date">
                                            <dt className="text-muted">{deadlinesPage.conferenceDates}</dt>
                                            <dd className="text-ink">{conference.dates}</dd>
                                        </div>
                                    )}
                                </dl>
                            )}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
