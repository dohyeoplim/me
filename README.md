### dohyeoplim/me

Live: [dohyeoplim.me](https://www.dohyeoplim.me/)

Design: [figma.com](https://www.figma.com/design/wBkuB9rOotINNANdL4cWp4/dohyeoplim.me?node-id=0-1&t=fGWskwz1crK40ZNh-1)

### Portfolio

Run `pnpm dev` and visit `/portfolio` or `/design-system`.

Portfolio copy lives in `src/app/portfolio/_data`, grouped by research, projects, and background.
To use a project screenshot, add an `image` with `src` and `alt` to its entry in `_data/projects.ts`.
Files in `public` use paths such as `/projects/mochicall.png`. Entries without an image use their concept diagram.

### DDS

DohyeopLim Design System lives in `src/app/components/DDS`.
Shared colors, surfaces, spacing, and motion are defined in `src/app/styles/dds.css`.
Typography utilities live in `src/app/styles/typography.css`.
The `/design-system` page renders these components with size and state comparisons.
Use DDS typography utilities, semantic colors such as `text-muted`, and spacing such as `gap-dds-lg`.
ESLint enforces these tokens on the portfolio, DDS, and shared navigation components.
Text carries status information. Section headings have no decorative numbering or indicator dots.
Color in project diagrams communicates a changed object, extracted field, or document relationship.

Project animations are local Lottie JSON files in `public/animations`.
Their source is `scripts/project-animations.mjs`. Each plays once when visible and pauses off screen.
Reduced motion shows the final frame. Static diagrams remain available while the player loads.
Motion timing follows the [LottieFiles motion-design skill](https://github.com/LottieFiles/motion-design-skill).

Run `pnpm storybook` to explore components at `http://localhost:6006`.
Run `pnpm build-storybook` to generate `storybook-static`.
Stories include controls, accessibility checks, keyboard activation, and interactive button examples.
Storybook uses the [Next.js Vite framework](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite).

Run `pnpm lint` and `pnpm build` before committing.
The existing CMS needs `DATABASE_URL` for the full application build and data-backed routes.
The portfolio and DDS pages use local content and require no database calls.
