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
        <div className="space-y-14">
            <div>
                <h3 className="font-head01-medium mb-8">Button scale</h3>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                    {buttonSizes.map(({ size, label, height }) => (
                        <div key={size} className="flex flex-col items-center gap-5">
                            <p className="ds-label w-24 border-b border-grey-300 pb-2 text-center">{height}px</p>
                            <div className="flex h-14 items-center">
                                <Button size={size} variant="outline">
                                    Button
                                </Button>
                            </div>
                            <p className="text-sm">{label}</p>
                        </div>
                    ))}
                    <div className="flex flex-col items-center gap-5">
                        <p className="ds-label w-24 border-b border-grey-300 pb-2 text-center">52 × 52px</p>
                        <div className="flex h-14 items-center">
                            <IconButton size="large" variant="outline" aria-label="Notifications example">
                                <Bell size={18} aria-hidden="true" />
                            </IconButton>
                        </div>
                        <p className="text-sm">Icon button</p>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-head01-medium mb-3">Basic states</h3>
                <p className="ds-label mb-6">Fixed state samples. Use the examples below to try the interactions.</p>
                <Surface
                    className="overflow-x-auto p-4 sm:p-7"
                    tabIndex={0}
                    role="region"
                    aria-label="Button state matrix"
                >
                    <table className="w-full min-w-160 border-separate border-spacing-y-5 text-sm">
                        <thead>
                            <tr>
                                {["State", "Solid", "Outline", "Text", "Right icon", "Left icon"].map((label) => (
                                    <th
                                        key={label}
                                        scope="col"
                                        className="px-2 pb-3 text-left font-normal text-grey-500"
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {buttonStates.map(({ id, label }) => (
                                <tr key={id}>
                                    <th scope="row" className="pr-5 text-left font-normal">
                                        {label}
                                    </th>
                                    {buttonVariants.map((variant) => (
                                        <td key={variant} className="px-2">
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
                                    <td className="px-2">
                                        <Button data-preview-state={id} disabled={id === "disabled"} tabIndex={-1}>
                                            Button <ArrowRight size={16} aria-hidden="true" />
                                        </Button>
                                    </td>
                                    <td className="px-2">
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
            <div className="grid gap-10 md:grid-cols-2">
                <div>
                    <h3 className="font-head01-medium mb-6">Icon buttons</h3>
                    <Surface className="overflow-x-auto p-5">
                        <table className="w-full border-separate border-spacing-y-4 text-sm">
                            <thead>
                                <tr>
                                    {["State", "Solid", "Outline", "Text"].map((label) => (
                                        <th
                                            key={label}
                                            scope="col"
                                            className="pb-2 text-left font-normal text-grey-500"
                                        >
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {buttonStates.map(({ id, label }) => (
                                    <tr key={id}>
                                        <th scope="row" className="pr-3 text-left font-normal">
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
                    <h3 className="font-head01-medium mb-6">Try the components</h3>
                    <Surface className="flex min-h-92 flex-col items-start justify-center gap-8 p-7">
                        <div className="flex flex-wrap gap-3">
                            <Button onClick={() => setContinued(true)} disabled={continued}>
                                {continued ? "Done" : "Continue"}
                                {continued ? <Check size={16} /> : <ArrowRight size={16} />}
                            </Button>
                            <Button variant="outline" aria-pressed={saved} onClick={() => setSaved(!saved)}>
                                <Heart size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
                                {saved ? "Saved" : "Save"}
                            </Button>
                        </div>
                        <div className="flex items-center gap-3">
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
