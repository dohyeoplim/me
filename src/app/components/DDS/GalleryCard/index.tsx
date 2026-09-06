import type { ReactNode } from "react";
import DetailDialog from "../DetailDialog";

type Props = {
    title: string;
    description: string;
    media: ReactNode;
    mediaLabel: string;
    detailsLabel: string;
    children: ReactNode;
};

export default function GalleryCard({ title, description, media, mediaLabel, detailsLabel, children }: Props) {
    return (
        <article className="dds-gallery-card" data-dialog-origin>
            <header className="dds-gallery-card-heading">
                <h3 className="font-work-title">{title}</h3>
                <p className="font-support">{description}</p>
            </header>
            <figure className="dds-gallery-card-media" aria-label={mediaLabel}>{media}</figure>
            <div className="dds-gallery-card-action">
                <DetailDialog title={title} label={detailsLabel} expandFromCard triggerStyle="card"
                    media={<div className="dds-gallery-card-modal-media">{media}</div>}>
                    <p className="font-work-title">{description}</p>
                    {children}
                </DetailDialog>
            </div>
        </article>
    );
}
