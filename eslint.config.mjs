import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginQuery from "@tanstack/eslint-plugin-query";
import eslintConfigPrettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const ignorePaths = {
  ignores: [".next/*", "node_modules/*", "build/*"],
};

const typescriptLints = {
  rules: {
    "@typescript-eslint/array-type": [
      "warn",
      {
        default: "generic",
        readonly: "generic",
      },
    ],

    "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],

    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "interface",
        format: ["PascalCase"],
      },
    ],

    "@typescript-eslint/no-empty-interface": "warn",

    "no-restricted-syntax": [
      "error",
      {
        selector:
          "TSTypeAliasDeclaration[typeAnnotation.type='TSIntersectionType']",
        message: "Use interfaces instead of type aliases for intersections.",
      },
    ],

    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};

const unicornLints = {
  plugins: {
    unicorn,
  },
  files: ["src/components/**/*.tsx", "src/types/**/*.d.ts"],
  ignores: [
    "**/next-auth.d.ts",
    "**/middleware.d.ts",
    "src/types/api/**/*.d.ts",
    "src/components/ui/shadcn/**/*.tsx",
  ],

  rules: {
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          pascalCase: true,
        },
      },
    ],
  },
};

const typescriptTypeFileLints = {
  files: ["**/*.d.ts"],

  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "TSEnumDeclaration",
        message:
          "Enums are not allowed in declaration files. Use a union type or alternative approach.",
      },
    ],
  },
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...eslintPluginQuery.configs["flat/recommended"],
  ignorePaths,
  eslintConfigPrettier,
  unicornLints,
  typescriptLints,
  typescriptTypeFileLints,
];

export default eslintConfig;
