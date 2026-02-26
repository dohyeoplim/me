import Bio from "./_components/Bio";
import Name from "./_components/Name";
import Profile from "./_components/Profile";

export default function Intro() {
    return (
        <section className="w-full flex items-center justify-between py-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage:
                            "linear-gradient(#0f0f10 1px, transparent 1px), linear-gradient(90deg, #0f0f10 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="flex flex-col gap-15">
                <Name />
                <Bio />
            </div>

            <Profile />
        </section>
    );
}
