import Illustration from "@/app/components/DDS/Illustration";
import type { Project } from "../../_data/projects";
import { projectScenes } from "../../_data/project-scenes";
import DepthProjection from "../DepthProjection";

export default function ProjectVisual({ kind }: { kind: Project["visual"] }) {
    if (kind === "driving") return <DepthProjection />;
    return <Illustration scene={projectScenes[kind]} />;
}
