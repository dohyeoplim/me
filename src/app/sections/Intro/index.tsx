import Bio from "./_components/Bio";
import Name from "./_components/Name";
import Profile from "./_components/Profile";

export default function Intro() {
    return (
        <section className="w-full flex items-center justify-between">
            <div className="flex flex-col gap-15">
                <Name />
                <Bio />
            </div>

            <Profile />
        </section>
    );
}
