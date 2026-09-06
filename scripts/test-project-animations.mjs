import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createProjectAnimations } from "./project-animations.mjs";

for (const [name, animation] of Object.entries(createProjectAnimations())) {
    test(`${name} matches its shared scene and DDS canvas`, () => {
        const stored = JSON.parse(readFileSync(new URL(`../public/animations/${name}.json`, import.meta.url), "utf8"));
        assert.deepEqual(animation, stored);
        assert.equal(animation.w, 480);
        assert.equal(animation.h, 320);
        assert.equal(animation.fr, 30);
        assert.equal(animation.op, 120);
        assert.ok(animation.layers.length > 0);
    });

    test(`${name} keyframes stay inside the animation duration`, () => {
        const check = (value) => {
            if (!value || typeof value !== "object") return;
            if (value.a === 1 && Array.isArray(value.k)) {
                let previous = -1;
                for (const frame of value.k) {
                    assert.ok(frame.t >= previous && frame.t <= animation.op);
                    previous = frame.t;
                }
            }
            for (const child of Object.values(value)) check(child);
        };
        check(animation);
    });
}
