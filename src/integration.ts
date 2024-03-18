
import type { AstroIntegration } from "astro";
import fs from "fs/promises";
export function cashed_icons(): AstroIntegration {
    return {
        name: "astro-cached-icon",
        hooks: {
            "astro:build:done": async () => {
                await fs.mkdir("dist/assets/icons", { recursive: true });
                const files = await fs.readdir("public/icons");
                await Promise.all(files.map(async file => fs.copyFile(`public/icons/${file}`, `dist/assets/icons/${file}`)));
            }
        }
    };
}