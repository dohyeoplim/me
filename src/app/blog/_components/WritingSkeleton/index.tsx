import Skeleton, { SkeletonGroup, SkeletonText } from "@/app/components/DDS/Skeleton";
import MarkdownSkeleton from "@/app/components/Markdown/Skeleton";
import WritingHeader from "../WritingHeader";

export function PostListSkeleton() {
    return (
        <SkeletonGroup label="Loading writing" className="writing-list-skeleton">
            <Skeleton variant="control" />
            {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="dds-skeleton-list-item">
                    <Skeleton width="short" />
                    <Skeleton variant="heading" width={index % 2 ? "long" : "medium"} />
                    <SkeletonText lines={2} lastLine={index % 2 ? "medium" : "long"} />
                </div>
            ))}
        </SkeletonGroup>
    );
}

export default function WritingSkeleton({ article = false }: { article?: boolean }) {
    return (
        <div className="dds-container writing-page">
            {article ? (
                <SkeletonGroup label="Loading article" className="dds-skeleton-document">
                    <Skeleton width="short" />
                    <Skeleton variant="title" width="long" />
                    <SkeletonText lines={2} />
                    <MarkdownSkeleton />
                </SkeletonGroup>
            ) : (
                <div className="writing-index">
                    <WritingHeader />
                    <PostListSkeleton />
                </div>
            )}
        </div>
    );
}
