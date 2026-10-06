import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "public/**", "out/**"],
  },
  ...compat.extends("next/core-web-vitals"),

  // Catch identifiers that do not exist.
  //
  // next/core-web-vitals does not enable no-undef, so a component could render
  // JSX referencing a state variable that was never declared: the build passed,
  // the lint passed, and the page only blew up when someone clicked the thing
  // that revealed it. That is exactly how the Customers panel shipped throwing
  // "editing is not defined". This rule turns that into a lint failure.
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
    },
  },
];

export default eslintConfig;
