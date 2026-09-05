import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/app/lib/utils";

export type TextFieldProps = Omit<ComponentProps<"input">, "size"> & {
    label: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    variant?: "outlined" | "line";
    size?: "medium" | "large";
    invalid?: boolean;
};

export default function TextField({
    id: providedId,
    label,
    hint,
    error,
    variant = "outlined",
    size = "medium",
    invalid = false,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
}: TextFieldProps) {
    const generatedId = useId();
    const inputId = providedId ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;
    const resolvedAriaInvalid = invalid || error ? true : ariaInvalid;
    const isInvalid = resolvedAriaInvalid !== undefined && resolvedAriaInvalid !== false
        && resolvedAriaInvalid !== "false";

    return (
        <div
            className="dds-text-field"
            data-variant={variant}
            data-size={size}
            data-invalid={isInvalid || undefined}
        >
            <label className="dds-text-field-label font-body03-regular" htmlFor={inputId}>{label}</label>
            <input
                {...props}
                id={inputId}
                className={cn(
                    "dds-text-field-input",
                    size === "large" ? "font-body02-regular" : "font-body03-regular",
                    className,
                )}
                aria-describedby={describedBy}
                aria-invalid={resolvedAriaInvalid}
            />
            {hint && <p className="dds-text-field-hint font-support" id={hintId}>{hint}</p>}
            {error && <p className="dds-text-field-error font-support" id={errorId} role="alert">{error}</p>}
        </div>
    );
}
