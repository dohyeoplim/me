import "server-only";
import katex from "katex";

export default function Caption({ text }: { text: string }) {
    return text.split(/(\$[^$]+\$)/g).map((part, index) => {
        if (!part.startsWith("$") || !part.endsWith("$") || part.length <= 2) {
            return <span key={index}>{part}</span>;
        }
        const html = katex.renderToString(part.slice(1, -1), {
            throwOnError: false,
            displayMode: false,
            trust: false,
            strict: "warn",
        });
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
    });
}
