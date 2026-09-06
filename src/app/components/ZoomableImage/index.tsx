"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";
import { LayoutMotion } from "@/app/components/DDS/Motion/Provider";
import { useOverlay } from "../useOverlay";

type Props = {
    src?: string;
    alt?: string;
    caption?: ReactNode;
};

export default function ZoomableImage(props: Props) {
    return <LayoutMotion><ZoomableImageContent {...props} /></LayoutMotion>;
}

function ZoomableImageContent({ src, alt = "", caption }: Props) {
    const [open, setOpen] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const layoutId = useId();

    function close() {
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
    }

    useOverlay(open, close, true);

    if (!src) return null;

    return (
        <span className="my-2 flex flex-col items-center gap-2">
            <motion.button
                ref={trigger}
                type="button"
                layoutId={layoutId}
                onClick={() => setOpen(true)}
                aria-label={alt ? `Enlarge image, ${alt}` : "Enlarge image"}
                className="m-0 h-auto max-w-full cursor-zoom-in rounded-md"
            >
                <Image
                    src={src}
                    alt={alt}
                    width={1200}
                    height={800}
                    sizes="(max-width: 896px) calc(100vw - 48px), 848px"
                    className="m-0 h-auto max-w-full rounded-md"
                />
            </motion.button>
            {alt && (
                <span className="text-center font-body04-light text-grey-400">
                    {caption ?? alt}
                </span>
            )}

            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <motion.button
                                type="button"
                                aria-label="Close enlarged image"
                                ref={(element) => element?.focus({ preventScroll: true })}
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={close}
                                className="fixed inset-0 z-200 flex items-center justify-center bg-grey-900/80 p-6"
                            >
                                <motion.span
                                    layoutId={layoutId}
                                    className="flex max-h-[90vh] max-w-[90vw]"
                                >
                                    <Image
                                        src={src}
                                        alt={alt}
                                        width={2000}
                                        height={1333}
                                        sizes="90vw"
                                        className="max-h-[90vh] w-auto cursor-zoom-out rounded-md object-contain"
                                    />
                                </motion.span>
                            </motion.button>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </span>
    );
}
