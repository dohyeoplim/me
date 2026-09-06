"use client";

import { useState } from "react";
import { ArrowRight, Bell, Check, Heart, RotateCcw } from "lucide-react";
import Button from "@/app/components/DDS/Button";
import IconButton from "@/app/components/DDS/IconButton";
import SectionHeading from "@/app/components/DDS/SectionHeading";
import Surface from "@/app/components/DDS/Surface";
import { buttonSizes, buttonStates, buttonVariants } from "../../data";

export default function ButtonShowcase() {
    const [saved, setSaved] = useState(false);
    const [notifications, setNotifications] = useState(false);
    const [continued, setContinued] = useState(false);

    return (
        <>
            <div className="dds-guide-group">
                <SectionHeading title="Sizes" variant="subsection" />
                <div className="dds-button-scale">
                    {buttonSizes.map(({ size, label, height }) => (
                        <div key={size}>
                            <div className="dds-button-scale-sample">
                                <Button size={size} variant="outline">Continue</Button>
                            </div>
                            <p className="font-support">{label}, {height}px</p>
                        </div>
                    ))}
                    <div>
                        <div className="dds-button-scale-sample">
                            <IconButton size="large" variant="outline" aria-label="Notifications size example">
                                <Bell size={18} aria-hidden="true" />
                            </IconButton>
                        </div>
                        <p className="font-support">Icon, {buttonSizes[2].height}px</p>
                    </div>
                </div>
            </div>
            <div className="dds-guide-group">
                <SectionHeading title="States" variant="subsection" />
                <div
                    className="dds-state-table-wrap"
                    tabIndex={0}
                    role="region"
                    aria-label="Button states, horizontally scrollable"
                >
                    <table className="dds-state-table font-support">
                        <thead>
                            <tr>
                                <th scope="col">State</th>
                                {buttonVariants.map(({ value, label }) => <th key={value} scope="col">{label}</th>)}
                                <th scope="col">With icon</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buttonStates.map(({ id, label }) => (
                                <tr key={id}>
                                    <th scope="row">{label}</th>
                                    {buttonVariants.map(({ value }) => (
                                        <td key={value}>
                                            <Button
                                                variant={value}
                                                data-preview-state={id}
                                                disabled={id === "disabled"}
                                                aria-pressed={id === "selected" ? true : undefined}
                                                tabIndex={-1}
                                            >
                                                Button
                                            </Button>
                                        </td>
                                    ))}
                                    <td>
                                        <Button
                                            variant="outline"
                                            data-preview-state={id}
                                            disabled={id === "disabled"}
                                            aria-pressed={id === "selected" ? true : undefined}
                                            tabIndex={-1}
                                        >
                                            Button <ArrowRight size={16} aria-hidden="true" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="dds-guide-group dds-specimen-grid">
                <div>
                    <SectionHeading title="Icon buttons" variant="subsection" />
                    <table className="dds-state-table font-support">
                        <thead>
                            <tr>
                                <th scope="col">State</th>
                                {buttonVariants.map(({ value, label }) => <th key={value} scope="col">{label}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {buttonStates.map(({ id, label }) => (
                                <tr key={id}>
                                    <th scope="row">{label}</th>
                                    {buttonVariants.map(({ value }) => (
                                        <td key={value}>
                                            <IconButton
                                                variant={value}
                                                data-preview-state={id}
                                                disabled={id === "disabled"}
                                                aria-pressed={id === "selected" ? true : undefined}
                                                aria-label={`${label} ${value} example`}
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
                </div>
                <div>
                    <SectionHeading title="Try the controls" variant="subsection" />
                    <Surface
                        padding="compact"
                        className="dds-specimen-stack"
                        role="region"
                        aria-label="Interactive button examples"
                    >
                        <div className="dds-example-actions">
                            <Button onClick={() => setContinued(true)} disabled={continued}>
                                {continued ? "Done" : "Continue"}
                                {continued
                                    ? <Check size={16} aria-hidden="true" />
                                    : <ArrowRight size={16} aria-hidden="true" />}
                            </Button>
                            <Button variant="outline" aria-pressed={saved} onClick={() => setSaved(!saved)}>
                                <Heart size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
                                {saved ? "Saved" : "Save"}
                            </Button>
                        </div>
                        <div className="dds-example-actions">
                            <IconButton
                                variant="outline"
                                aria-label="Toggle notifications"
                                aria-pressed={notifications}
                                onClick={() => setNotifications(!notifications)}
                            >
                                <Bell size={17} aria-hidden="true" />
                            </IconButton>
                            <p className="font-support" aria-live="polite">
                                Notifications {notifications ? "on" : "off"}
                            </p>
                        </div>
                        <div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSaved(false);
                                    setNotifications(false);
                                    setContinued(false);
                                }}
                            >
                                <RotateCcw size={16} aria-hidden="true" /> Reset examples
                            </Button>
                        </div>
                    </Surface>
                </div>
            </div>
        </>
    );
}
