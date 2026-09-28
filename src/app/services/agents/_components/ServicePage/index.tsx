import Link from "next/link";
import { service, type ServiceDocument } from "../../_data/content";

export default function ServicePage({ document }: { document: ServiceDocument }) {
    return (
        <main id="main-content" className="dds-container agents-service-page">
            <article className="agents-service-document">
                <nav aria-label="hq-agents pages" className="agents-service-navigation font-support">
                    {service.links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={document.path === link.href ? "page" : undefined}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <header className="grid gap-dds-sm">
                    <h1 className="font-head01-medium text-ink">{document.title}</h1>
                    <p className="font-body02-light text-muted">{document.description}</p>
                    {document.updated && (
                        <p className="font-support text-muted">Last updated {document.updated}</p>
                    )}
                </header>
                <div className="prose">
                    {document.sections.map((section) => (
                        <section key={section.title}>
                            <h2>{section.title}</h2>
                            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                            {section.links?.map((link) => (
                                <p key={link.href}><a href={link.href}>{link.label}</a></p>
                            ))}
                        </section>
                    ))}
                    <section>
                        <h2>Contact</h2>
                        <p>
                            {service.operator}<br />
                            <a href={`mailto:${service.email}`}>{service.email}</a>
                        </p>
                    </section>
                </div>
                <nav aria-label="Service information" className="agents-service-navigation font-support">
                    {service.links.filter((link) => link.href !== document.path).map((link) => (
                        <Link key={link.href} href={link.href}>{link.label}</Link>
                    ))}
                </nav>
            </article>
        </main>
    );
}
