const rawTypography = /\btext-(?:xs|sm|base|lg|xl|[2-9]xl|\[)/;
const rawColor = /\b(?:text|bg|border|divide)-(?:grey|gray|slate|blue|green|red|zinc|neutral)-\d/;
const rawSpacing = /\b(?:p[trblxyse]?|m[trblxyse]?|gap(?:-[xy])?|space-[xy])-(?:[1-9]\d*|\d+\.\d+)/;

export const ddsTokens = {
    meta: {
        type: "suggestion",
        schema: [],
        messages: { useToken: "Use a DDS typography, color, or spacing token instead of '{{value}}'." },
    },
    create(context) {
        const inspect = (node, value) => {
            if (typeof value !== "string") return;
            for (const pattern of [rawTypography, rawColor, rawSpacing]) {
                const match = value.match(pattern);
                if (match) context.report({ node, messageId: "useToken", data: { value: match[0] } });
            }
        };
        return {
            Literal: (node) => inspect(node, node.value),
            TemplateElement: (node) => inspect(node, node.value.raw),
        };
    },
};
