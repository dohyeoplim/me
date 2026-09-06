"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import Reveal from "@/app/components/DDS/Reveal";
import Surface from "@/app/components/DDS/Surface";

export default function MotionShowcase() {
    const [replay, setReplay] = useState(0);

    return (
        <div className="dds-motion-sample">
            <Reveal key={replay}>
                <Surface padding="comfortable" variant="subtle">
                    <p className="font-body">Content appears as it enters the viewport.</p>
                </Surface>
            </Reveal>
            <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>
                <RotateCcw size={16} aria-hidden="true" /> Replay
            </Button>
        </div>
    );
}
