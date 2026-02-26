import React from "react";

export function textWithBreaks(text: string) {
    return text.split("\n").map((line, idx) => (
        <React.Fragment key={idx}>
            {line}
            {idx < text.split("\n").length - 1 ? <br /> : null}
        </React.Fragment>
    ));
}
