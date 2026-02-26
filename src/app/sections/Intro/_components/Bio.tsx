import LinkButton from "@/app/components/LinkButton";
import SectionTitle from "@/app/components/SectionTitle";

export default function Bio() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <SectionTitle subtitle="Profile" />
                <p className="font-body02-light text-grey-700">
                    I design and implement vision models,
                    <br />
                    from core algorithms to working systems.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <LinkButton
                    label="Email"
                    href="mailto:dohyeoplim@seoultech.ac.kr"
                />
                <LinkButton
                    label="GitHub"
                    href="https://github.com/dohyeoplim"
                    icon="external"
                />
            </div>
        </div>
    );
}
