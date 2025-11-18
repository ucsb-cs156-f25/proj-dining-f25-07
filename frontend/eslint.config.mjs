// import js from "@eslint/js";
// import globals from "globals";
// import reactHooks from "eslint-plugin-react-hooks";
// import reactRefresh from "eslint-plugin-react-refresh";
// import { defineConfig, globalIgnores } from "eslint/config";

// // Import the vitest plugin
// import vitest from "@vitest/eslint-plugin";
// import plugin from "eslint-plugin-testing-library";

// export default defineConfig([
//     globalIgnores([
//         "dist",
//         ".stryker-tmp/",
//         ".storybook/",
//         "build",
//         "coverage",
//         "node_modules",
//         "public/mockServiceWorker.js",
//         "storybook-static/",
//     ]),
//     {
//         files: ["src/**/*.{js,jsx}"],
//         extends: [
//             js.configs.recommended,
//             reactHooks.configs["recommended-latest"],
//             reactRefresh.configs.vite,
//         ],
//         languageOptions: {
//             ecmaVersion: 2020,
//             globals: globals.browser,
//             parserOptions: {
//                 ecmaVersion: "latest",
//                 ecmaFeatures: { jsx: true },
//                 sourceType: "module",
//             },
//         },
//         rules: {
//             "no-unused-vars": [
//                 "error",
//                 { varsIgnorePattern: "^[A-Z_].*", argsIgnorePattern: "^_" },
//             ],
//         },
//     },
//     {
//         ...plugin.configs["flat/react"],
//         // Apply this configuration only to test files
//         files: ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}"],
//         plugins: {
//             vitest,
//         },
//         languageOptions: {
//             globals: vitest.environments.env.globals, // Use vitest's globals
//         },
//         rules: {
//             // Vitest recommended rules
//             ...vitest.configs.recommended.rules,
//             "vitest/expect-expect": "off",
//         },
//     },
// ]);
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";            // ⬅️ ADD THIS
import { defineConfig, globalIgnores } from "eslint/config";

import vitest from "@vitest/eslint-plugin";
import testingLibrary from "eslint-plugin-testing-library";

export default defineConfig([
    globalIgnores([
        "dist",
        ".stryker-tmp/",
        ".storybook/",
        "build",
        "coverage",
        "node_modules",
        "public/mockServiceWorker.js",
        "storybook-static/",
    ]),

    // ----------------------------------------------------
    // Main project (src)
    // ----------------------------------------------------
    {
        files: ["src/**/*.{js,jsx}"],
        extends: [
            js.configs.recommended,
            reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
            reactPlugin.configs.flat.recommended,     // ⬅️ REQUIRED ADDITION
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        rules: {
            "no-unused-vars": [
                "error",
                { varsIgnorePattern: "^[A-Z_].*", argsIgnorePattern: "^_" },
            ],

            // React rule: prop-types is deprecated
            "react/prop-types": "off",                // ⬅️ REQUIRED BY THE ISSUE
        },
    },

    // ----------------------------------------------------
    // Test files
    // ----------------------------------------------------
    {
        ...testingLibrary.configs["flat/react"],        // keep testing-library preset
        files: ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}"],

        plugins: {
            vitest,
        },
        languageOptions: {
            globals: vitest.environments.env.globals,
        },
        rules: {
            ...vitest.configs.recommended.rules,
            "vitest/expect-expect": "off",
        },
    },
]);
