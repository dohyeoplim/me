import SlideTransition from "@/app/components/SlideTransition";
import DeadlinesSkeleton from "./_components/DeadlinesSkeleton";

export default function DeadlinesLoading() {
    return (
        <SlideTransition>
            <DeadlinesSkeleton />
        </SlideTransition>
    );
}
