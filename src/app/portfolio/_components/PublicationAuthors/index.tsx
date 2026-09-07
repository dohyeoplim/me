import { Fragment } from "react";
import { hero } from "../../_data/hero";

type Props = {
    authors: string;
    status: string;
};

export default function PublicationAuthors({ authors, status }: Props) {
    return (
        <p className="font-support text-muted">
            {authors.split(", ").map((author, index) => (
                <Fragment key={author}>
                    {index > 0 && ", "}
                    {author === hero.name ? <strong>{author}</strong> : author}
                </Fragment>
            ))}
            {` (${status})`}
        </p>
    );
}
