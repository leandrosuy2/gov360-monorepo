import type { Config } from "tailwindcss";
import sharedConfig from "@gov360/tailwind-config/base";

const config: Config = {
  ...sharedConfig,
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
