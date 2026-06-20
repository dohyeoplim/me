"use client";

import Link from "next/link";
import { useDirty } from "./dirty";

export default function ExitLink() {
    const dirty = useDirty();
    return (
        <Link
            href="/"
            onClick={(e) => {
                if (dirty && !confirm("Discard unsaved changes?"))
                    e.preventDefault();
            }}
            className="font-body04-light text-grey-500"
        >
            Exit
        </Link>
    );
}
