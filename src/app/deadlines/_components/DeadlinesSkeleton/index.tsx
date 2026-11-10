import Skeleton, { SkeletonGroup } from "@/app/components/DDS/Skeleton";
import DeadlinesHeader from "../DeadlinesHeader";

export function DeadlineListSkeleton() {
    return (
        <SkeletonGroup label="Loading deadlines">
            {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="dds-skeleton-list-item">
                    <Skeleton variant="heading" width={index % 2 ? "medium" : "short"} />
                    <Skeleton width="medium" />
                    <Skeleton width="long" />
                </div>
            ))}
        </SkeletonGroup>
    );
}

export default function DeadlinesSkeleton() {
    return (
        <div className="dds-container deadlines-page">
            <DeadlinesHeader />
            <DeadlineListSkeleton />
        </div>
    );
}
