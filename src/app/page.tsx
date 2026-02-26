import About from "./sections/About";
import Intro from "./sections/Intro";

export default function Home() {
    return (
        <div className="w-full max-w-4xl mx-auto pt-40 pb-30 px-6">
            <main className="flex flex-col items-center gap-30">
                <Intro />

                <About />
            </main>
        </div>
    );
}
