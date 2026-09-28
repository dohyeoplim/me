import type { Metadata } from "next";
import ServicePage from "./_components/ServicePage";
import { overview } from "./_data/content";

export const metadata: Metadata = {
    title: "hq-agents :: Dohyeop",
    description: overview.description,
    alternates: { canonical: overview.path },
};

export default function AgentsPage() {
    return <ServicePage document={overview} />;
}
