import { z } from "../schema";

export const embeddingModel = "text-embedding-3-small";
export const embeddingDimensions = 512;
export const EmbeddingSchema = z.object({
    model: z.literal(embeddingModel),
    hash: z.string().length(64),
    vector: z.array(z.number().finite()).length(embeddingDimensions),
});
export type SourceEmbedding = z.infer<typeof EmbeddingSchema>;
