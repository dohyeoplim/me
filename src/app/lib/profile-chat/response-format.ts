import { maximumAnswerCharacters } from "./limits";
import type { AnswerPresentation } from "./presentation";

type JsonSchema = Record<string, unknown>;

function text(maximum: number): JsonSchema {
    return { type: "string", minLength: 1, maxLength: maximum };
}

function object(properties: Record<string, JsonSchema>): JsonSchema {
    return { type: "object", properties, required: Object.keys(properties), additionalProperties: false };
}

function array(items: JsonSchema, maximum: number, minimum = 0): JsonSchema {
    return { type: "array", items, minItems: minimum, maxItems: maximum };
}

function identifier(ids: string[]): JsonSchema {
    return ids.length ? { type: "string", enum: [...new Set(ids)] } : { type: "string" };
}

export function createAnswerFormat(
    sourceIds: string[],
    cardIds: string[],
    suggestionIds: string[],
    repositoryIds: string[] = [],
    presentation: AnswerPresentation = null,
) {
    const source = identifier(sourceIds);
    const repositories = repositoryIds.filter((id) => sourceIds.includes(id));
    const blockBase = { title: text(90), sourceIds: array(source, 6, 1) };
    const blocks = [
        object({
            type: { type: "string", enum: ["facts"] },
            ...blockBase,
            items: array(object({ label: text(60), value: text(200) }), 6, 2),
        }),
        object({
            type: { type: "string", enum: ["steps"] },
            ...blockBase,
            items: array(object({ title: text(70), description: text(220) }), 6, 2),
        }),
        ...[2, 3].map((columns) => object({
            type: { type: "string", enum: ["comparison"] },
            ...blockBase,
            columns: array(text(60), columns, columns),
            rows: array(object({ label: text(60), values: array(text(140), columns, columns) }), 5, 2),
        })),
        object({
            type: { type: "string", enum: ["timeline"] },
            ...blockBase,
            items: array(object({ date: text(60), title: text(70), description: text(200) }), 5, 2),
        }),
    ];

    const properties = {
        grounding: { type: "string", enum: ["supported", "unsupported"] },
        answer: text(maximumAnswerCharacters),
        sourceIds: array(source, sourceIds.length ? 6 : 0),
        cardIds: array(identifier(cardIds), cardIds.length ? 4 : 0),
        blocks: array({ anyOf: blocks }, sourceIds.length ? 2 : 0),
        followUps: array(object({
            label: text(70),
            question: text(180),
            sourceIds: array(identifier(suggestionIds), 6, 1),
        }), suggestionIds.length ? 4 : 0),
        repositories: array(object({
            sourceId: identifier(repositories),
            reason: text(160),
        }), Math.min(repositories.length, 3)),
    };
    const selected = presentation ? blocks.filter((block) => {
        const properties = block.properties as { type: { enum: string[] } };
        return properties.type.enum.includes(presentation);
    }) : [];
    const { answer, ...visualProperties } = properties;
    const schema = selected.length && sourceIds.length ? object({ result: { anyOf: [
        object({
            ...visualProperties,
            grounding: { type: "string", enum: ["supported"] },
            sourceIds: array(source, 6, 1),
            cardIds: array(identifier([]), 0),
            blocks: array({ anyOf: selected }, 1, 1),
            answer,
        }),
        object({
            ...properties,
            grounding: { type: "string", enum: ["unsupported"] },
            sourceIds: array(source, 0),
            cardIds: array(identifier([]), 0),
            blocks: array({ anyOf: selected }, 0),
            followUps: array(properties.followUps.items as JsonSchema, 0),
            repositories: array(properties.repositories.items as JsonSchema, 0),
        }),
    ] } }) : object(properties);

    return {
        type: "json_schema",
        name: "profile_answer",
        strict: true,
        schema,
    };
}
