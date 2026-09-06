import Skeleton, { SkeletonGroup, SkeletonText } from "@/app/components/DDS/Skeleton";

export default function LoadingShowcase() {
    return (
        <div className="dds-loading-showcase">
            <section>
                <h3 className="font-work-title">Text</h3>
                <SkeletonGroup label="Text placeholder example" className="dds-skeleton-stack">
                    <Skeleton variant="heading" width="medium" />
                    <SkeletonText lines={3} />
                </SkeletonGroup>
            </section>
            <section>
                <h3 className="font-work-title">Profile</h3>
                <SkeletonGroup label="Profile placeholder example" className="dds-skeleton-row">
                    <Skeleton variant="avatar" />
                    <SkeletonText lines={2} lastLine="medium" />
                </SkeletonGroup>
            </section>
            <section>
                <h3 className="font-work-title">Content</h3>
                <SkeletonGroup label="Content placeholder example" className="dds-skeleton-stack">
                    <Skeleton variant="media" />
                    <SkeletonText lines={2} lastLine="medium" />
                </SkeletonGroup>
            </section>
            <section>
                <h3 className="font-work-title">Forms</h3>
                <SkeletonGroup label="Form placeholder example" className="dds-skeleton-stack">
                    <div className="dds-skeleton-field"><Skeleton width="short" /><Skeleton variant="control" /></div>
                    <div className="dds-skeleton-field"><Skeleton width="short" /><Skeleton variant="control" /></div>
                    <Skeleton variant="control" width="short" />
                </SkeletonGroup>
            </section>
        </div>
    );
}
