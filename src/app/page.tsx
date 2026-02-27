import Intro from "./sections/Intro";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";

export default function Home() {
    return (
        <div className="w-full max-w-4xl mx-auto md:pt-40 pb-30 px-6">
            <main className="flex flex-col items-center gap-30">
                <Intro />
                <About />
                <Projects />
                <Experience />
            </main>
        </div>
    );
}
