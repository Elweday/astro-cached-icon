import { AstroIntegration } from "astro";
import fs from "fs/promises";

export default function cpyIconsToDist(): AstroIntegration {
    return {
        name: astro-cached-icon,
        hooks: {
            "astro:build:done": async () => {
                await fs.mkdir("dist/assets/cached-icons", { recursive: true });
                const files = await fs.readdir("public/cached-icons");
                await Promise.all(files.map(async file => fs.copyFile(`public/assets/preloaded/${file}`, `dist/assets/preloaded/${file}`)));
            }
        }
    };
}