import { z } from "../schema";

export const CardPresentationSchema = z.object({
    enabled: z.boolean(),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(300),
    body: z.string().trim().min(1).max(2400),
});
export type CardPresentation = z.infer<typeof CardPresentationSchema>;
