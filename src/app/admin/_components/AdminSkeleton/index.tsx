import Skeleton, { SkeletonGroup, SkeletonText } from "@/app/components/DDS/Skeleton";
import MarkdownSkeleton from "@/app/components/Markdown/Skeleton";

type Props = { variant: "dashboard" | "editor" | "intro" | "knowledge" };

function Fields({ count = 3 }: { count?: number }) {
    return Array.from({ length: count }, (_, index) => (
        <div key={index} className="dds-skeleton-field">
            <Skeleton width="short" />
            <Skeleton variant="control" />
        </div>
    ));
}

function List({ count = 4 }: { count?: number }) {
    return Array.from({ length: count }, (_, index) => (
        <div key={index} className="dds-skeleton-list-item">
            <Skeleton variant="heading" width={index % 2 ? "long" : "medium"} />
            <Skeleton width="short" />
        </div>
    ));
}

export default function AdminSkeleton({ variant }: Props) {
    return (
        <SkeletonGroup label="Loading admin content" className="dds-skeleton-document">
            <div className="dds-skeleton-stack">
                <Skeleton variant="title" width="medium" />
                <Skeleton width="long" />
            </div>
            {variant === "dashboard" ? (
                <>
                    <div className="dds-skeleton-stack"><List count={3} /><Skeleton variant="control" /></div>
                    <div className="dds-skeleton-stack"><Skeleton variant="heading" width="short" /><List /></div>
                </>
            ) : variant === "intro" ? (
                <div className="dds-skeleton-editor">
                    <div className="dds-skeleton-sheet"><Skeleton variant="avatar" /><SkeletonText lines={2} /></div>
                    <div className="dds-skeleton-stack"><Fields count={4} /><Skeleton variant="media" /></div>
                </div>
            ) : variant === "knowledge" ? (
                <div className="dds-skeleton-editor">
                    <div className="dds-skeleton-stack"><Skeleton variant="control" /><List /></div>
                    <div className="dds-skeleton-sheet">
                        <Fields count={2} />
                        <SkeletonText lines={6} lastLine="long" />
                        <Skeleton variant="control" width="short" />
                    </div>
                </div>
            ) : (
                <>
                    <Fields count={2} />
                    <div className="dds-skeleton-toolbar">
                        {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} variant="control" />)}
                    </div>
                    <MarkdownSkeleton />
                </>
            )}
        </SkeletonGroup>
    );
}
