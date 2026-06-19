"use client";

import { useState } from "react";

export default function PaperAbstract({ text }: { text: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <div className="relative">
                <p
                    className={`font-body03-light leading-6 text-grey-500 ${
                        open ? "" : "line-clamp-2"
                    }`}
                >
                    {text}
                </p>
                {!open && (
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-5 backdrop-blur-[1.5px] [mask-image:linear-gradient(to_top,black,transparent)]"
                    />
                )}
            </div>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-fit font-body05-light text-grey-400 transition-colors hover:text-grey-600"
            >
                {open ? "Show less" : "Read more"}
            </button>
        </div>
    );
}
