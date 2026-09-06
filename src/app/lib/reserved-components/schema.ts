import { z } from "../schema";
import { profileCardRegistry } from "../profile-chat/types";
import { CardPresentationSchema } from "./presentation";

export const ReservedComponentSchema = z.object({
    id: z.enum(Object.keys(profileCardRegistry) as [keyof typeof profileCardRegistry]),
    enabled: z.boolean(),
    sourceIds: z.array(z.string().regex(/^[a-z0-9][a-z0-9._-]{0,119}$/)).max(20),
    presentation: CardPresentationSchema.nullable(),
});
export type ReservedComponent = z.infer<typeof ReservedComponentSchema>;

export const defaultReservedComponents: ReservedComponent[] = Object.keys(profileCardRegistry).map((id) => ({
    id: id as keyof typeof profileCardRegistry, enabled: true, sourceIds: [id], presentation: null,
}));
