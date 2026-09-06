import Illustration from "@/app/components/DDS/Illustration";
import type { Project } from "../../_data/projects";
import { projectScenes } from "../../_data/project-scenes";

export default function ProjectVisual({ kind }: { kind: Project["visual"] }) {
    return <Illustration scene={projectScenes[kind]} />;
}
