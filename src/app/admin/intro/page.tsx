import { getIntro } from "@/app/lib/content/repository";
import { INTRO_DEFAULT } from "@/app/lib/content/schema";
import IntroEditor from "@/app/admin/_components/IntroEditor";

export const dynamic = "force-dynamic";

export default async function IntroPage() {
    const doc = (await getIntro()) ?? INTRO_DEFAULT;
    return <IntroEditor doc={doc} />;
}
