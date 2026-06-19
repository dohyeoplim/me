"use client";

import { useCallback, useState } from "react";

export default function PaperAbstract({ text }: { text: string }) {
    const [open, setOpen] = useState(false);
    const [expandable, setExpandable] = useState(false);

    const measure = useCallback((el: HTMLParagraphElement | null) => {
        if (el) setExpandable(el.scrollHeight - el.clientHeight > 1);
    }, []);

    return (
        <div className="flex flex-col gap-1.5">
            <div className="relative">
                <p
                    ref={measure}
                    className={`font-body03-light leading-6 text-grey-500 ${
                        open ? "" : "line-clamp-3"
                    }`}
                >
                    {text}
                </p>
                {expandable && !open && (
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="absolute inset-x-0 bottom-0 flex h-6 items-center backdrop-blur-[2px]"
                    >
                        <span className="font-body05-light text-grey-600">
                            Read more
                        </span>
                    </button>
                )}
            </div>
            {expandable && open && (
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-fit font-body05-light text-grey-400 transition-colors hover:text-grey-600"
                >
                    Show less
                </button>
            )}
        </div>
    );
}
