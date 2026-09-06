import Skeleton, { SkeletonText } from "@/app/components/DDS/Skeleton";

export default function MarkdownSkeleton() {
    return (
        <div className="dds-skeleton-document">
            <SkeletonText lines={3} lastLine="long" />
            <Skeleton variant="heading" width="medium" />
            <SkeletonText lines={4} />
            <Skeleton variant="media" />
            <SkeletonText lines={2} lastLine="long" />
        </div>
    );
}
