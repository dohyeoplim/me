import type { Metadata } from "next";
import ServicePage from "../_components/ServicePage";
import { privacy } from "../_data/content";

export const metadata: Metadata = {
    title: "Privacy Policy :: hq-agents",
    description: privacy.description,
    alternates: { canonical: privacy.path },
};

export default function AgentsPrivacyPage() {
    return <ServicePage document={privacy} />;
}
