"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AnimationItem } from "lottie-web";
import { RotateCcw } from "lucide-react";

type Props = {
    src: string;
    children: ReactNode;
};

export default function LottieGraphic({ src, children }: Props) {
    const container = useRef<HTMLDivElement>(null);
    const animation = useRef<AnimationItem | null>(null);
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const [reducedMotion, setReducedMotion] = useState(false);
    const ready = loadedSrc === src;

    useEffect(() => {
        const element = container.current;
        if (!element) return;

        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        let disposed = false;
        let loading = false;
        let visible = false;

        const sync = () => {
            setReducedMotion(preference.matches);
            if (!animation.current) return;
            if (preference.matches) animation.current.goToAndStop(animation.current.totalFrames - 1, true);
            else if (visible) animation.current.play();
            else animation.current.pause();
        };

        const start = async () => {
            if (loading || disposed) return;
            loading = true;
            try {
                const { default: lottie } = await import("lottie-web/build/player/lottie_light");
                if (disposed) return;
                const player = lottie.loadAnimation({
                    container: element,
                    renderer: "svg",
                    loop: false,
                    autoplay: false,
                    path: src,
                    rendererSettings: { preserveAspectRatio: "xMidYMid meet", progressiveLoad: true },
                });
                animation.current = player;
                player.addEventListener("DOMLoaded", () => {
                    if (disposed) return;
                    setLoadedSrc(src);
                    sync();
                });
                player.addEventListener("data_failed", () => {
                    if (disposed) return;
                    player.destroy();
                    animation.current = null;
                    loading = false;
                    setLoadedSrc(null);
                });
            } catch {
                loading = false;
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                visible = entry?.isIntersecting ?? false;
                if (visible) void start();
                sync();
            },
            { threshold: 0.15 },
        );

        observer.observe(element);
        preference.addEventListener("change", sync);
        sync();
        return () => {
            disposed = true;
            observer.disconnect();
            preference.removeEventListener("change", sync);
            animation.current?.destroy();
            animation.current = null;
        };
    }, [src]);

    return (
        <div className="dds-lottie" data-ready={ready}>
            <div className="dds-lottie-fallback" aria-hidden="true">
                {children}
            </div>
            <div ref={container} className="dds-lottie-player" aria-hidden="true" />
            {ready && !reducedMotion && (
                <button
                    type="button"
                    className="dds-lottie-replay"
                    aria-label="Replay project animation"
                    onClick={() => {
                        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                            animation.current?.goToAndPlay(0, true);
                        }
                    }}
                >
                    <RotateCcw size={16} aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
