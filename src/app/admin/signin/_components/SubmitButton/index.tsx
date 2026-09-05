"use client";

import { useFormStatus } from "react-dom";
import Button from "@/app/components/DDS/Button";

export default function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending}
            aria-busy={pending}
        >
            {pending ? "Signing in..." : "Sign in"}
        </Button>
    );
}
