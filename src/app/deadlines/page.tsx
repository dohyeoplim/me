import { Suspense } from "react";
import { connection } from "next/server";
import SlideTransition from "@/app/components/SlideTransition";
import { listPublishedConferences } from "@/app/lib/deadlines/repository";
import { buildDeadlineBoard } from "@/app/lib/deadlines/timeline";
import DeadlineList from "./_components/DeadlineList";
import DeadlinesHeader from "./_components/DeadlinesHeader";
import { DeadlineListSkeleton } from "./_components/DeadlinesSkeleton";
import { deadlinesPage } from "./_data/content";

export const metadata = {
    title: "Deadlines :: Dohyeop",
    description: deadlinesPage.description,
};

async function loadBoard() {
    await connection();
    const now = Date.now();
    return { board: buildDeadlineBoard(await listPublishedConferences(), now), now };
}

async function PublishedDeadlines() {
    const { board, now } = await loadBoard();
    return <DeadlineList board={board} now={now} />;
}

export default function DeadlinesPage() {
    return (
        <SlideTransition>
            <div className="dds-container deadlines-page">
                <DeadlinesHeader />
                <Suspense fallback={<DeadlineListSkeleton />}>
                    <PublishedDeadlines />
                </Suspense>
            </div>
        </SlideTransition>
    );
}
