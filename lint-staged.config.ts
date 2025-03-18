import { type Configuration } from "lint-staged";

const config: Configuration = {
  "*/**/*.{js,jsx,ts,tsx}": ["eslint --fix"],
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",
  "*/**/*.{json,css,md}": ["prettier --write"],
};

export default config;
