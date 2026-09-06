"use client";

import { useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import Button from "../Button";
import IconButton from "../IconButton";

type Props = { title: string; label: string; children: ReactNode };

export default function DetailDialog({ title, label, children }: Props) {
    const dialog = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    return (
        <>
            <Button variant="outline" onClick={() => dialog.current?.showModal()}>{label}</Button>
            <dialog
                ref={dialog}
                className="dds-detail-dialog"
                aria-labelledby={titleId}
                onClick={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    if (event.clientX < bounds.left || event.clientX > bounds.right ||
                        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
                }}
            >
                <header className="dds-detail-dialog-header">
                    <h3 id={titleId} className="font-section-title">{title}</h3>
                    <IconButton variant="text" aria-label="Close details" onClick={() => dialog.current?.close()}>
                        <X size={20} />
                    </IconButton>
                </header>
                <div className="dds-detail-dialog-content">{children}</div>
            </dialog>
        </>
    );
}
