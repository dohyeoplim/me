import Link from "next/link";
import Item from "./Item";

export default function Nav() {
    return (
        <nav className="w-full flex items-center justify-between">
            <Link href="/">
                <Item label="Dohyeop Lim" className="select-none" />
            </Link>
            <Item label="About" className="select-none" />
        </nav>
    );
}
