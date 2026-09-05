"use client";

import { ArrowUpRight } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import type { ProfileFollowUp } from "@/app/lib/profile-chat/types";

type Props = {
    questions: ProfileFollowUp[];
    onSelect: (question: string, sourceIds: string[]) => void;
    disabled?: boolean;
    label?: string;
};

export default function QuestionSuggestions({ questions, onSelect, disabled, label = "Suggested questions" }: Props) {
    if (!questions.length) return null;

    return (
        <div className="dds-question-grid" role="group" aria-label={label}>
            {questions.map(({ label: title, question, sourceIds }) => (
                <Button
                    key={question}
                    variant="outline"
                    className="dds-question-card"
                    onClick={() => onSelect(question, sourceIds)}
                    disabled={disabled}
                >
                    <span>{title}</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                </Button>
            ))}
        </div>
    );
}
