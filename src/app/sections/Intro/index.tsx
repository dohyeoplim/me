import Bio from "./_components/Bio";
import Name from "./_components/Name";
import Profile from "./_components/Profile";

export default function Intro() {
    return (
        <section className="w-full flex flex-col md:flex-row items-start md:items-center justify-between pt-16 pb-18 relative gap-12 md:gap-0">
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-screen h-full opacity-[0.015] pointer-events-none">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage:
                            "linear-gradient(#0f0f10 1px, transparent 1px), linear-gradient(90deg, #0f0f10 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="flex flex-col gap-10 md:gap-15">
                <Name />
                <Bio />
            </div>

            <div className="w-full md:w-auto flex justify-end">
                <Profile />
            </div>
        </section>
    );
}
