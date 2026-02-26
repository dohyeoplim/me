import Bio from "./_components/Bio";
import Name from "./_components/Name";

export default function Intro() {
    return (
        <section>
            <div className="flex flex-col gap-15">
                <Name />
                <Bio />
            </div>
        </section>
    );
}
