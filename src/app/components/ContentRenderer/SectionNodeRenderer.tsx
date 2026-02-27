import type { SectionNode } from "./types";
import Item from "./_components/Item";
import Enumerate from "./_components/Enumerate";

type Props = {
    node: SectionNode;
};

export default function SectionNodeRenderer({ node }: Props) {
    switch (node.type) {
        case "item":
            return (
                <Item
                    title={node.title}
                    subtitle={node.subtitle}
                    meta={node.meta}
                />
            );

        case "enumerate":
            return <Enumerate items={node.items} />;

        default:
            return null;
    }
}
