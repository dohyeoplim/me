import { Fragment } from "react";

export function textWithBreaks(text: string) {
    return text.split("\n").map((line, idx) => (
        <Fragment key={idx}>
            {line}
            {idx < text.split("\n").length - 1 ? <br /> : null}
        </Fragment>
    ));
}
