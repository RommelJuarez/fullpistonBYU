// eslint.config.js
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-unused-vars": [1, { argsIgnorePattern: "res|next|^err" }],
      "arrow-body-style": [2, "as-needed"],
      "no-param-reassign": [2, { props: false }],
      "no-console": 1,
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      "func-names": 0,
      "space-unary-ops": 2,
      "space-in-parens": "error",
      "space-infix-ops": "error",
      "comma-dangle": 0,
      "max-len": 0,
      "import/extensions": 0,
      "no-underscore-dangle": 0,
      "consistent-return": 0,
      radix: 0,
      "no-shadow": [
        2,
        {
          hoist: "all",
          allow: ["resolve", "reject", "done", "next", "err", "error"],
        },
      ],
      "no-unused-expressions": "off",
    },
  },
  prettierConfig,
];
