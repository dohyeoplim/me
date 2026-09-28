export type ServiceDocument = {
    title: string;
    description: string;
    path: string;
    updated?: string;
    sections: readonly {
        title: string;
        paragraphs: readonly string[];
        links?: readonly { label: string; href: string }[];
    }[];
};

export const service = {
    name: "hq-agents",
    operator: "Dohyeop Lim",
    email: "dhlim0817@gmail.com",
    links: [
        { label: "Overview", href: "/services/agents" },
        { label: "Privacy", href: "/services/agents/privacy" },
        { label: "Terms", href: "/services/agents/terms" },
    ],
} as const;

export const overview: ServiceDocument = {
    title: "hq-agents",
    description: "A personal assistant for Slack, operated by Dohyeop Lim.",
    path: "/services/agents",
    sections: [
        {
            title: "What it does",
            paragraphs: [
                "hq-agents provides daily briefings, weather forecasts, calendar summaries, " +
                    "research paper recommendations, and conversations in Slack threads.",
                "It is a private, self-hosted service for authorized users. Public registration is not available.",
            ],
        },
        {
            title: "Google Calendar access",
            paragraphs: [
                "With your permission, hq-agents reads events from your selected Google calendars " +
                    "to summarize appointments and answer schedule questions. " +
                    "It cannot create, edit, or delete events.",
                "Relevant calendar information is sent to OpenAI to generate responses, " +
                    "which are delivered to the configured Slack channel or thread.",
            ],
        },
    ],
};

export const privacy: ServiceDocument = {
    title: "Privacy Policy",
    description: "How hq-agents handles your information.",
    path: "/services/agents/privacy",
    updated: "September 28, 2026",
    sections: [
        {
            title: "Information we use",
            paragraphs: [
                "hq-agents processes messages and files you provide in authorized Slack conversations, " +
                    "saved preferences and notes, and a configured location for weather forecasts.",
                "If you authorize Google Calendar, it reads event titles, dates, times, locations, " +
                    "and event links from selected calendars. " +
                    "OAuth credentials and tokens are used to maintain access.",
            ],
        },
        {
            title: "Purpose and sharing",
            paragraphs: [
                "This information is used to provide requested answers, briefings, research assistance, " +
                    "and saved notes. Google user data is not sold or used for advertising.",
                "Relevant messages, calendar information, documents, and images may be sent to OpenAI " +
                    "to generate responses. hq-agents does not use Google user data to develop or train AI models.",
                "Responses are sent to Slack and are visible to people with access to the destination conversation. " +
                    "Apple receives the configured location for weather requests. arXiv receives paper search " +
                    "and download requests. " +
                    "These providers process data under their own applicable terms and policies.",
            ],
        },
        {
            title: "Storage and retention",
            paragraphs: [
                "Credentials, preferences, notes, downloaded papers, and task records are stored on the " +
                    "operator-managed server. Credentials are excluded from the public source repository.",
                "Calendar information and other context may remain in agent conversation history and generated " +
                    "Slack messages. Saved information is retained while needed for the service or until deleted. " +
                    "Slack and OpenAI may retain their copies under their respective policies and account settings.",
            ],
        },
        {
            title: "Your choices",
            paragraphs: [
                "You can revoke Google access through your Google Account at any time. " +
                    "Revocation stops future access but does not automatically erase previously stored information.",
                "Contact the operator to request deletion of server-held credentials, notes, " +
                    "and conversation records. " +
                    "Copies held by Slack or OpenAI are subject to those services' deletion controls.",
            ],
            links: [{ label: "Manage Google Account connections", href: "https://myaccount.google.com/connections" }],
        },
        {
            title: "These public pages",
            paragraphs: [
                "These information pages use Vercel hosting and Vercel Web Analytics. " +
                    "They do not provide public access to the private assistant or its stored information.",
                "Policy updates will be published here with an updated date.",
            ],
        },
    ],
};

export const terms: ServiceDocument = {
    title: "Terms of Service",
    description: "Terms for using hq-agents.",
    path: "/services/agents/terms",
    updated: "September 28, 2026",
    sections: [
        {
            title: "Using the service",
            paragraphs: [
                "hq-agents is a personal, self-hosted assistant operated by Dohyeop Lim for authorized users. " +
                    "By using it, you agree to these terms and the Privacy Policy.",
                "Only provide information you are entitled to use, and use the service lawfully. " +
                    "You are responsible for your connected accounts and the audiences of your Slack conversations.",
            ],
        },
        {
            title: "AI responses and availability",
            paragraphs: [
                "AI responses may be inaccurate, incomplete, or outdated. Verify important information " +
                    "against original sources. The service is not a substitute for professional advice.",
                "Briefings and integrations depend on the host and third-party services. " +
                    "Availability, delivery times, and uninterrupted operation are not guaranteed. " +
                    "The service is provided as available, subject to rights that cannot be excluded by law.",
            ],
        },
        {
            title: "Third-party services and content",
            paragraphs: [
                "Google, Slack, OpenAI, Apple Weather, and arXiv have their own terms. " +
                    "You remain responsible for complying with them and respecting rights in papers and other content.",
                "Connecting an account grants only the permissions shown during authorization. " +
                    "You can stop using the service and revoke connected-account access at any time.",
            ],
        },
        {
            title: "Changes and contact",
            paragraphs: [
                "Features may change or be discontinued. Updated terms will be published on this page. " +
                    "For questions or to request removal of stored information, contact the operator below.",
            ],
        },
    ],
};
