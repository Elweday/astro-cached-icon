
import type { AstroIntegration } from "astro";
import fs from "fs/promises";
export function cashed_icons(): AstroIntegration {
    return {
        name: "astro-cached-icon",
        hooks: {
            "astro:build:done": async () => {
            }
        }
    };
}