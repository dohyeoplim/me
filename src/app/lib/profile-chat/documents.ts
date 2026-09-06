import { background, beyondTheLab, experience } from "../../portfolio/_data/background";
import { hero } from "../../portfolio/_data/hero";
import { projects } from "../../portfolio/_data/projects";
import { research } from "../../portfolio/_data/research";
import type { ProfileCardId, ProfileSource } from "./types";
import type { SourceEmbedding } from "../knowledge/embedding-schema";
import type { CardPresentation } from "../reserved-components/presentation";

export type ProfileDocument = ProfileSource & {
    id: string;
    text: string;
    keywords: string[];
    cardId?: ProfileCardId | null;
    kind?: string;
    embedding?: SourceEmbedding;
    cardPresentation?: CardPresentation;
    repository?: {
        fullName: string;
        url: string;
        description: string;
        owner: string;
        ownerType: "User" | "Organization";
        language: string | null;
        topics?: string[];
        archived?: boolean;
        fork?: boolean;
    };
};

const projectKeywords: Record<string, string[]> = {
    MochiCall: ["모치콜", "음성", "병원", "교통", "전화", "speech", "asr", "lora", "transportation"],
    Collog: ["콜로그", "콜록", "가족", "건강", "음성", "전화", "노인", "health", "family", "calls"],
    WONNIT: [
        "워닛", "공간", "대여", "모바일", "온디바이스", "아이폰", "iphone", "ios", "core ml", "vision",
    ],
    DocFusionX: ["독퓨전", "독일", "울름", "문서", "검색", "graphrag", "retrieval", "ulm"],
    DriverNet: ["드라이버넷", "운전자", "깊이", "뎁스", "driver", "depth", "gated", "projection", "distraction"],
};

const joinSentences = (values: Array<string | undefined>) => values
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => value.trim().replace(/\.+$/, ""))
    .join(". ") + ".";

export const profileDocuments: ProfileDocument[] = [
    {
        id: "profile",
        title: "Dohyeop Lim",
        url: "/portfolio",
        text: `${hero.name}. ${hero.title}. ${hero.bio} ${research.affiliation}`,
        keywords: ["소개", "누구", "연구", "연구실", "지도교수", "about", "background", "lab", "advisor"],
    },
    {
        id: "eact",
        title: research.eact.name,
        url: "/portfolio#research",
        text: joinSentences([
            research.eact.paper,
            research.eact.authors,
            research.eact.role,
            research.eact.status,
            research.eact.description,
            research.eact.contributions,
            research.eact.result,
            research.eact.errorResult,
        ]),
        keywords: [
            "이액트", "연구", "논문", "체크섬", "식별", "인식",
            "eact", "ctc", "checksum", "wacv", "research",
        ],
    },
    {
        id: "research-interests",
        title: "Research interests",
        url: "/portfolio#research",
        text: research.interests,
        keywords: ["관심", "향후", "연구", "계획", "future", "interests", "next", "training", "composition"],
        kind: "research",
        cardId: null,
    },
    {
        id: "table-recognition",
        title: "Table recognition paper",
        url: research.additionalPublications[0].url,
        text: joinSentences([
            research.additionalPublications[0].title,
            research.additionalPublications[0].authors,
            research.additionalPublications[0].status,
            "Dohyeop Lim is the second author. Individual contributions are not listed in the CV.",
        ]),
        keywords: [
            "논문", "표", "공동저자", "연구", "table", "recognition", "wacv", "publication", "research",
        ],
        kind: "research",
        cardId: null,
    },
    {
        id: "industrial-ocr",
        title: research.industrial.name,
        url: "/portfolio#research",
        text: joinSentences([
            `Part of the ${research.programs.industrial.title} R&D project`,
            research.industrial.description,
            `${research.industrial.count} ${research.industrial.countLabel}`,
            research.industrial.insight,
        ]),
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
        kind: "research",
        cardId: null,
    },
    {
        id: "kraftbox",
        title: research.kraftbox.name,
        url: "/portfolio#research",
        text: `Part of the ${research.programs.industrial.title} R&D project. ` +
            `${research.kraftbox.description} ${research.kraftbox.insight}`,
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
        kind: "research",
        cardId: null,
    },
    ...projects.map((project) => ({
        id: project.name.toLowerCase(),
        kind: "project",
        title: project.name,
        url: project.href,
        text: joinSentences([project.title, project.period, project.contribution, project.outcome, project.recognition]),
        keywords: [...(projectKeywords[project.name] ?? []), "프로젝트", "수상", "project", "award"],
    })),
    {
        id: "infrastructure",
        title: research.programs.title,
        url: "/portfolio#research",
        text: joinSentences([
            `${research.programs.industrial.title}, ${research.programs.industrial.description}`,
            "Industrial OCR data and evaluation and Kraftbox are both part of this industrial AI project",
            `${research.programs.computing.title} with IITP. ` +
                `Project: ${research.programs.computing.projectTitle}. ${research.programs.computing.details}`,
            research.programs.computing.infrastructure,
        ]),
        keywords: ["과제", "산업AI", "교육", "VLA", "요구사항", "개발보조", "gpu", "research", "education"],
        kind: "research",
        cardId: null,
    },
    {
        id: "community",
        title: "Community experience",
        url: "/portfolio#beyond-the-lab",
        text: beyondTheLab.communities
            .map(({ name, period, role, description }) => joinSentences([name, period, role, description]))
            .join("\n"),
        keywords: [
            "동아리", "멋사", "멋쟁이사자", "운영", "부회장", "세션", "likelion", "gdg", "community",
            "outside", "leadership",
        ],
        kind: "experience",
        cardId: null,
    },
    {
        id: "international-experience",
        title: "Visiting student in Germany",
        url: "/portfolio#beyond-the-lab",
        text: beyondTheLab.visits
            .map(({ name, role, period, description }) => `${name}. ${role}. ${period}. ${description}`)
            .join("\n"),
        keywords: ["독일", "울름", "방문", "경험", "germany", "ulm", "visiting", "docfusionx", "experience"],
        kind: "experience",
        cardId: null,
    },
    {
        id: "education",
        title: "Education",
        url: "/portfolio#background",
        text: [
            ...background.education.map(({ school, course, period }) => `${school}. ${course}. ${period}`),
            background.achievement,
        ].join("\n"),
        keywords: ["학력", "학교", "학점", "성적", "장학", "전공", "gpa", "degree", "scholarship", "grade"],
        kind: "education",
        cardId: null,
    },
    {
        id: "skills",
        title: background.experienceTitle,
        url: "/portfolio#background",
        text: experience.map(({ label, items }) => `${label}. ${items}`).join("\n"),
        keywords: [
            "기술", "도구", "언어", "개발", "스택", "영어", "skill", "tools", "programming", "language",
            "english", "korean", "toefl", "spoken",
        ],
        kind: "experience",
        cardId: null,
    },
];
