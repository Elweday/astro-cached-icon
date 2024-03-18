
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import {cashed_icons} from "./src/integration";

export default defineConfig({
    output: "server",
    adapter: vercel(),
    integrations: [cashed_icons()]
})