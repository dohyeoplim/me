import { deadlinesPage } from "../../_data/content";

export default function DeadlinesHeader() {
    return (
        <header className="deadlines-heading">
            <h1 className="font-page-title text-ink">{deadlinesPage.title}</h1>
            <p className="font-body text-muted">{deadlinesPage.description}</p>
        </header>
    );
}
