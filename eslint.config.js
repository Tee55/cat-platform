import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  {
    ignores: [
      ".next",
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "prisma/**",
      "test/**",
      "*.js",
      "jest.config.js",
      ".eslintrc.js",
      ".idea",
      ".vscode",
      ".DS_Store",
      "package-lock.json",
      "**/*.spec.ts",
    ],
  },

  ...compat.extends("next/core-web-vitals"),

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
        sourceType: "module",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // TypeScript ESLint rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: true,
          },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],

      // Prettier
      ...prettierPlugin.configs.recommended.rules,

      // Base rules
      "max-len": ["error", { code: 120, ignoreStrings: true }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "curly": "error",
      "eqeqeq": ["error", "always"],
      "prefer-const": "error",
      "eol-last": ["error", "always"],

      // Path alias restriction
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["src/**"],
              message:
                'Use path mapping (@application, @domain, @infrastructure, @presentation) instead of relative imports starting with "src/"',
            },
            {
              group: ["../src/**", "../../src/**", "../../../src/**"],
              message:
                'Use path mapping (@application, @domain, @infrastructure, @presentation) instead of relative imports to src/',
            },
          ],
        },
      ],
    },
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },

  prettierConfig
);
