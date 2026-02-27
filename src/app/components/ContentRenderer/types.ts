export type ContentDoc = {
    sectionTitle?: {
        title: string;
        subtitle?: string;
    };
    widthClassName?: string;
    gapClassName?: string;
    blocks: Block[];
};

export type Block =
    | { type: "text"; text: string }
    | { type: "divider" }
    | { type: "section"; label?: string; content: SectionNode[] }
    | {
          type: "item";
          title: string;
          subtitle?: string;
          meta?: string;
      }
    | {
          type: "enumerate";
          items: string[];
      }
    | {
          type: "project";
          name: string;
          year?: string;
          month?: string;
          tagline?: string;
          description?: string;
          meta?: string;
      };

export type SectionNode =
    | { type: "item"; title: string; subtitle?: string; meta?: string }
    | { type: "enumerate"; items: string[] };
