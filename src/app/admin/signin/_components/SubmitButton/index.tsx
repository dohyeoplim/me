"use client";

import { useFormStatus } from "react-dom";
import Button from "@/app/components/DDS/Button";

type SubmitButtonProps = {
    className?: string;
};

export default function SubmitButton({ className }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            size="large"
            className={className}
            disabled={pending}
            aria-busy={pending}
        >
            {pending ? "Signing in..." : "Sign in"}
        </Button>
    );
}
