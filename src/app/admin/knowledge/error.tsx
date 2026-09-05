"use client";

import Button from "@/app/components/DDS/Button";

export default function KnowledgeError({ reset }: { reset: () => void }) {
    return (
        <div className="flex flex-col items-start gap-dds-lg font-body03-regular text-ink" role="alert">
            <p>Knowledge sources could not be loaded. Your saved information is unchanged.</p>
            <Button onClick={reset}>Try again</Button>
        </div>
    );
}
