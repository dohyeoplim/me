import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = new URL("../src/app/components/DDS/SectionNavigation/position.ts", import.meta.url);
const compiled = ts.transpileModule(readFileSync(source, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const { sectionAtCenter, sectionScrollOffset } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

const viewport = { top: 96, bottom: 916 };

test("selects projects while research remains visible above it", () => {
    const sections = [
        { id: "research", top: -1250, bottom: 180 },
        { id: "projects", top: 180, bottom: 777 },
        { id: "experience", top: 777, bottom: 1451 },
    ];
    assert.equal(sectionAtCenter(sections, viewport, "research"), "projects");
    assert.equal(sectionAtCenter(sections, viewport, "projects"), "projects");
});

test("retains the current section around the midpoint to avoid flickering", () => {
    const sections = [
        { id: "research", top: -800, bottom: 500 },
        { id: "projects", top: 500, bottom: 1100 },
    ];
    assert.equal(sectionAtCenter(sections, viewport, "research"), "research");
    assert.equal(sectionAtCenter(sections, viewport, "projects"), "projects");
    const movedUp = sections.map((section) => ({ ...section, top: section.top + 60, bottom: section.bottom + 60 }));
    assert.equal(sectionAtCenter(movedUp, viewport, "projects"), "research");
    const movedDown = sections.map((section) => ({ ...section, top: section.top - 60, bottom: section.bottom - 60 }));
    assert.equal(sectionAtCenter(movedDown, viewport, "research"), "projects");
});

test("uses the nearest section in a gap and does not retain an offscreen section", () => {
    const sections = [
        { id: "research", top: -500, bottom: 80 },
        { id: "projects", top: 540, bottom: 900 },
    ];
    assert.equal(sectionAtCenter(sections, viewport, "research"), "projects");
    assert.equal(sectionAtCenter([], viewport, "research"), null);
});

test("keeps the final section selectable at the end of a page", () => {
    const sections = [
        { id: "experience", top: 50, bottom: 700 },
        { id: "background", top: 700, bottom: 1000 },
    ];
    assert.equal(sectionAtCenter(sections, viewport, "experience", true), "background");
});

test("normal click destinations retain heading alignment", () => {
    const section = { top: 800, bottom: 2200 };
    assert.equal(sectionScrollOffset(section, 864, viewport), 768);
});

test("short sections stay centered when clicked in a tall viewport", () => {
    const section = { top: 1600, bottom: 1900 };
    const tallViewport = { top: 96, bottom: 1300 };
    const offset = sectionScrollOffset(section, 1664, tallViewport);
    const afterScroll = { id: "projects", top: section.top - offset, bottom: section.bottom - offset };
    assert.equal(sectionAtCenter([afterScroll], tallViewport, "research"), "projects");
    assert.equal((afterScroll.top + afterScroll.bottom) / 2, 698);
});
