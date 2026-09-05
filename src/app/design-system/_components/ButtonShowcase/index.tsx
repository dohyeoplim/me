"use client";

import { useState } from "react";
import { ArrowRight, Bell, Check, Heart, RotateCcw, User } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import IconButton from "@/app/components/DDS/IconButton";
import Surface from "@/app/components/DDS/Surface";
import { buttonSizes, buttonStates, buttonVariants } from "../../data";

export default function ButtonShowcase() {
    const [saved, setSaved] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [continued, setContinued] = useState(false);

    return (
        <div className="space-y-dds-3xl">
            <div>
                <h3 className="font-head01-medium mb-dds-xl">Button scale</h3>
                <div className="grid grid-cols-2 gap-dds-xl sm:grid-cols-4">
                    {buttonSizes.map(({ size, label, height }) => (
                        <div key={size} className="flex flex-col items-center gap-dds-lg">
                            <p className="ds-label w-24 border-b border-mark pb-dds-xs text-center">{height}px</p>
                            <div className="flex h-14 items-center">
                                <Button size={size} variant="outline">
                                    Button
                                </Button>
                            </div>
                            <p className="font-body03-regular">{label}</p>
                        </div>
                    ))}
                    <div className="flex flex-col items-center gap-dds-lg">
                        <p className="ds-label w-24 border-b border-mark pb-dds-xs text-center">52 × 52px</p>
                        <div className="flex h-14 items-center">
                            <IconButton size="large" variant="outline" aria-label="Notifications example">
                                <Bell size={18} aria-hidden="true" />
                            </IconButton>
                        </div>
                        <p className="font-body03-regular">Icon button</p>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-head01-medium mb-dds-sm">Basic states</h3>
                <p className="ds-label mb-dds-lg">
                    Fixed state samples. Use the examples below to try the interactions.
                </p>
                <Surface
                    className="overflow-x-auto p-dds-md sm:p-dds-xl"
                    tabIndex={0}
                    role="region"
                    aria-label="Button state matrix"
                >
                    <table className="w-full min-w-160 border-separate border-spacing-y-5 font-body03-regular">
                        <thead>
                            <tr>
                                {["State", "Solid", "Outline", "Text", "Right icon", "Left icon"].map((label) => (
                                    <th
                                        key={label}
                                        scope="col"
                                        className="px-dds-xs pb-dds-sm text-left font-normal text-muted"
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {buttonStates.map(({ id, label }) => (
                                <tr key={id}>
                                    <th scope="row" className="pr-dds-lg text-left font-normal">
                                        {label}
                                    </th>
                                    {buttonVariants.map((variant) => (
                                        <td key={variant} className="px-dds-xs">
                                            <Button
                                                variant={variant}
                                                data-preview-state={id}
                                                disabled={id === "disabled"}
                                                tabIndex={-1}
                                            >
                                                Button
                                            </Button>
                                        </td>
                                    ))}
                                    <td className="px-dds-xs">
                                        <Button data-preview-state={id} disabled={id === "disabled"} tabIndex={-1}>
                                            Button <ArrowRight size={16} aria-hidden="true" />
                                        </Button>
                                    </td>
                                    <td className="px-dds-xs">
                                        <Button data-preview-state={id} disabled={id === "disabled"} tabIndex={-1}>
                                            <User size={16} aria-hidden="true" /> Button
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Surface>
            </div>
            <div className="grid gap-dds-2xl md:grid-cols-2">
                <div>
                    <h3 className="font-head01-medium mb-dds-lg">Icon buttons</h3>
                    <Surface className="overflow-x-auto p-dds-lg">
                        <table className="w-full border-separate border-spacing-y-4 font-body03-regular">
                            <thead>
                                <tr>
                                    {["State", "Solid", "Outline", "Text"].map((label) => (
                                        <th
                                            key={label}
                                            scope="col"
                                            className="pb-dds-xs text-left font-normal text-muted"
                                        >
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {buttonStates.map(({ id, label }) => (
                                    <tr key={id}>
                                        <th scope="row" className="pr-dds-sm text-left font-normal">
                                            {label}
                                        </th>
                                        {buttonVariants.map((variant) => (
                                            <td key={variant}>
                                                <IconButton
                                                    variant={variant}
                                                    data-preview-state={id}
                                                    disabled={id === "disabled"}
                                                    aria-label={`${label} ${variant} example`}
                                                    tabIndex={-1}
                                                >
                                                    <Bell size={17} aria-hidden="true" />
                                                </IconButton>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Surface>
                </div>
                <div>
                    <h3 className="font-head01-medium mb-dds-lg">Try the components</h3>
                    <Surface className="flex min-h-92 flex-col items-start justify-center gap-dds-xl p-dds-xl">
                        <div className="flex flex-wrap gap-dds-sm">
                            <Button onClick={() => setContinued(true)} disabled={continued}>
                                {continued ? "Done" : "Continue"}
                                {continued ? <Check size={16} /> : <ArrowRight size={16} />}
                            </Button>
                            <Button variant="outline" aria-pressed={saved} onClick={() => setSaved(!saved)}>
                                <Heart size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
                                {saved ? "Saved" : "Save"}
                            </Button>
                        </div>
                        <div className="flex items-center gap-dds-sm">
                            <IconButton
                                variant={notifications ? "solid" : "outline"}
                                aria-label="Toggle notifications"
                                aria-pressed={notifications}
                                onClick={() => setNotifications(!notifications)}
                            >
                                <Bell size={17} aria-hidden="true" />
                            </IconButton>
                            <p className="ds-label" aria-live="polite">
                                Notifications {notifications ? "on" : "off"}
                            </p>
                        </div>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                                setSaved(false);
                                setNotifications(false);
                                setContinued(false);
                            }}
                        >
                            <RotateCcw size={14} aria-hidden="true" /> Reset examples
                        </Button>
                        <p className="ds-label">Tab to focus. Enter or Space to activate.</p>
                    </Surface>
                </div>
            </div>
        </div>
    );
}
