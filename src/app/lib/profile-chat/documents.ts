import { background, beyondTheLab, experience } from "../../portfolio/_data/background";
import { hero } from "../../portfolio/_data/hero";
import { projects } from "../../portfolio/_data/projects";
import { research } from "../../portfolio/_data/research";
import type { ProfileCardId, ProfileSource } from "./types";

export type ProfileDocument = ProfileSource & {
    id: ProfileCardId;
    text: string;
    keywords: string[];
};

const projectKeywords: Record<string, string[]> = {
    MochiCall: ["모치콜", "음성", "병원", "교통", "전화", "speech", "asr", "lora", "transportation"],
    Collog: ["콜로그", "콜록", "가족", "건강", "음성", "전화", "노인", "health", "family", "calls"],
    WONNIT: ["워닛", "공간", "대여", "모바일", "온디바이스", "ios", "core ml", "vision"],
    DocFusionX: ["독퓨전", "독일", "울름", "문서", "검색", "graphrag", "retrieval", "ulm"],
};

export const profileDocuments: ProfileDocument[] = [
    {
        id: "profile",
        title: "Dohyeop Lim",
        url: "/portfolio",
        text: `${hero.name}. ${hero.title}. ${hero.bio}`,
        keywords: ["소개", "누구", "연구", "연구실", "지도교수", "about", "background", "lab", "advisor"],
    },
    {
        id: "eact",
        title: research.eact.name,
        url: "/portfolio#research",
        text: [
            research.eact.paper,
            research.eact.authors,
            research.eact.role,
            research.eact.status,
            research.eact.description,
            research.eact.contributions,
            research.eact.result,
            research.eact.errorResult,
        ].join(". "),
        keywords: ["이액트", "연구", "논문", "체크섬", "식별", "인식", "eact", "ctc", "checksum", "wacv", "research"],
    },
    {
        id: "industrial-ocr",
        title: research.industrial.name,
        url: "/portfolio#research",
        text: [
            research.industrial.description,
            `${research.industrial.count} ${research.industrial.countLabel}`,
            research.industrial.insight,
        ].join(". "),
        keywords: [
            "연구",
            "산업",
            "데이터",
            "합성",
            "라벨링",
            "평가",
            "ocr",
            "keti",
            "annotation",
            "evaluation",
            "research",
        ],
    },
    {
        id: "kraftbox",
        title: research.kraftbox.name,
        url: "/portfolio#research",
        text: `${research.kraftbox.description} ${research.kraftbox.insight}`,
        keywords: [
            "크래프트박스",
            "연구",
            "문서",
            "합성",
            "데이터",
            "서식",
            "qwen",
            "synthetic",
            "document",
            "research",
        ],
    },
    ...projects.map((project) => ({
        id: project.name.toLowerCase() as ProfileCardId,
        title: project.name,
        url: project.href,
        text: [project.title, project.period, project.contribution, project.outcome, project.recognition]
            .filter(Boolean)
            .join(". "),
        keywords: [...(projectKeywords[project.name] ?? []), "프로젝트", "수상", "project", "award"],
    })),
    {
        id: "infrastructure",
        title: beyondTheLab.infrastructure.title,
        url: "/portfolio#beyond-the-lab",
        text: [
            beyondTheLab.infrastructure.description,
            ...beyondTheLab.infrastructure.responsibilities.map(({ title, detail }) => `${title}, ${detail}`),
        ].join(". "),
        keywords: ["인프라", "서버", "클러스터", "분산", "도커", "gpu", "mig", "docker", "infiniband"],
    },
    {
        id: "community",
        title: "Community experience",
        url: "/portfolio#beyond-the-lab",
        text: beyondTheLab.communities
            .map(({ name, period, role, description }) => `${name}. ${period}. ${role}. ${description}`)
            .join("\n"),
        keywords: ["동아리", "멋사", "멋쟁이사자", "운영", "부회장", "세션", "likelion", "gdg", "community"],
    },
    {
        id: "education",
        title: "Education",
        url: "/portfolio#background",
        text: [
            ...background.education.map(({ school, course, period }) => `${school}. ${course}. ${period}`),
            background.achievement,
        ].join("\n"),
        keywords: ["학력", "학교", "학점", "성적", "장학", "전공", "독일", "gpa", "degree", "scholarship", "grade"],
    },
    {
        id: "skills",
        title: background.experienceTitle,
        url: "/portfolio#background",
        text: experience.map(({ label, items }) => `${label}. ${items}`).join("\n"),
        keywords: ["기술", "도구", "언어", "개발", "스택", "skill", "tools", "programming", "language"],
    },
];
