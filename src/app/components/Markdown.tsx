import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import ZoomableImage from "./ZoomableImage";

function escapeMathInImageAlt(markdown: string) {
    return markdown.replace(
        /!\[([^\]]*)\]/g,
        (_match, alt: string) =>
            `![${alt.replace(/\$/g, () => "\\$")}]`,
    );
}

export default function Markdown({ children }: { children: string }) {
    return (
        <div className="prose">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                    img: ({ src, alt }) => (
                        <ZoomableImage
                            src={typeof src === "string" ? src : undefined}
                            alt={alt}
                        />
                    ),
                }}
            >
                {escapeMathInImageAlt(children)}
            </ReactMarkdown>
        </div>
    );
}
