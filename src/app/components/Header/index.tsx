import Nav from "./_components/Nav";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-6 pt-16 pb-4">
                <Nav />
            </div>
        </header>
    );
}
