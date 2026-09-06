import Skeleton, { SkeletonGroup, SkeletonText } from "@/app/components/DDS/Skeleton";
import styles from "./signin.module.css";

export default function SignInLoading() {
    return (
        <SkeletonGroup label="Loading sign in" className={styles.signIn}>
            <div className={styles.header}>
                <Skeleton variant="section" width="medium" />
                <SkeletonText lines={2} lastLine="long" />
            </div>
            <div className={styles.form}>
                <div className={styles.fields}>
                    {Array.from({ length: 2 }, (_, index) => (
                        <div key={index} className="dds-skeleton-field">
                            <Skeleton width="short" />
                            <Skeleton variant="control" />
                        </div>
                    ))}
                </div>
                <div className={styles.actions}><Skeleton variant="control" width="short" /></div>
            </div>
        </SkeletonGroup>
    );
}
