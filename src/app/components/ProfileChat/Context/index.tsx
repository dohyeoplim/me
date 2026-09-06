"use client";

import {
    createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction,
} from "react";
import type { ProfileChatAnswer } from "@/app/lib/profile-chat/types";

export type ProfileExchange = ProfileChatAnswer & { id: string; question: string };

type ChatContext = {
    exchanges: ProfileExchange[];
    setExchanges: Dispatch<SetStateAction<ProfileExchange[]>>;
};

const ProfileChatContext = createContext<ChatContext | null>(null);

export function ProfileChatProvider({ children }: { children: ReactNode }) {
    const [exchanges, setExchanges] = useState<ProfileExchange[]>([]);
    return <ProfileChatContext value={{ exchanges, setExchanges }}>{children}</ProfileChatContext>;
}

export function useProfileChatContext() {
    const context = useContext(ProfileChatContext);
    if (!context) throw new Error("ProfileChat requires ProfileChatProvider");
    return context;
}
