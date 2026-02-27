import Bio from "./_components/Bio";
import Name from "./_components/Name";
import Profile from "./_components/Profile";

export default function Intro() {
    return (
        <section className="w-full flex items-center justify-between h-screen md:h-fit md:pt-16 md:pb-18 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-screen h-full opacity-[0.015] pointer-events-none">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage:
                            "linear-gradient(#0f0f10 1px, transparent 1px), linear-gradient(90deg, #0f0f10 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="flex flex-col gap-8 md:gap-15">
                <Name />
                <Profile className="block md:hidden" />
                <Bio />
            </div>

            <Profile className="hidden md:block" />
        </section>
    );
}
