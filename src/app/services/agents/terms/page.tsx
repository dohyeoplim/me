import type { Metadata } from "next";
import ServicePage from "../_components/ServicePage";
import { terms } from "../_data/content";

export const metadata: Metadata = {
    title: "Terms of Service :: hq-agents",
    description: terms.description,
    alternates: { canonical: terms.path },
};

export default function AgentsTermsPage() {
    return <ServicePage document={terms} />;
}
