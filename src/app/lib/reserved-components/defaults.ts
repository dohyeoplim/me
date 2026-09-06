import { hero } from "../../portfolio/_data/hero";
import { projects } from "../../portfolio/_data/projects";
import { research } from "../../portfolio/_data/research";
import type { ProfileCardId } from "../profile-chat/types";

export function componentDefaults(id: ProfileCardId) {
    if (id === "profile") return { title: hero.name, description: hero.title, body: hero.bio };
    if (id === "eact") return { title: research.eact.name, description: research.eact.description,
        body: [research.eact.contributions, research.eact.result, research.eact.paper].join("\n\n") };
    const project = projects.find((project) => project.name.toLowerCase() === id);
    return { title: project?.name ?? id, description: project?.title ?? "",
        body: [project?.contribution, project?.outcome, project?.recognition].filter(Boolean).join("\n\n") };
}
