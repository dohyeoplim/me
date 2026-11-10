import type { ConferenceArea } from "./schema";

export type TrackedConference = { key: string; id: string; area: ConferenceArea; name?: string };

export const CCFDDL_FEED_URL = "https://ccfddl.com/conference/allconf.yml";

export const trackedConferences: readonly TrackedConference[] = [
    { key: "AI/nips", id: "neurips", area: "ml" },
    { key: "AI/icml", id: "icml", area: "ml" },
    { key: "AI/iclr", id: "iclr", area: "ml" },
    { key: "AI/colt", id: "colt", area: "theory" },
    { key: "AI/alt", id: "alt", area: "theory" },
    { key: "AI/cvpr", id: "cvpr", area: "cv" },
    { key: "AI/iccv", id: "iccv", area: "cv" },
    { key: "AI/eccv", id: "eccv", area: "cv" },
    { key: "AI/wacv", id: "wacv", area: "cv" },
    { key: "AI/acl", id: "acl", area: "nlp" },
    { key: "AI/emnlp", id: "emnlp", area: "nlp" },
    { key: "AI/naacl", id: "naacl", area: "nlp" },
    { key: "CG/icassp", id: "icassp", area: "speech" },
    { key: "CG/interspeech", id: "interspeech", area: "speech", name: "Interspeech" },
    { key: "CG/slt", id: "slt", area: "speech" },
    { key: "AI/aaai", id: "aaai", area: "ai" },
    { key: "AI/ijcai", id: "ijcai", area: "ai" },
    { key: "DB/sigkdd", id: "kdd", area: "dm", name: "KDD" },
    { key: "AI/icdar", id: "icdar", area: "docai" },
];
