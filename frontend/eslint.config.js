// @ts-check
import js from '@eslint/js'
import eslintReact from "@eslint-react/eslint-plugin";
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from "typescript-eslint";
import globals from 'globals'

export default [
  js.configs.recommended,
  tseslint.configs.recommended,

  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },
  },

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // disable core:
      'no-unused-vars': 'off',
      // enable TS plugin:
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'prettier/prettier': 'error',
    },
  }
]

// export default tseslint.config({
//   files: ["**/*.ts", "**/*.tsx"],
//
//   // Extend recommended rule sets from:
//   // 1. ESLint JS's recommended rules
//   // 2. TypeScript ESLint recommended rules
//   // 3. ESLint React's recommended-typescript rules
//   extends: [
//     eslintJs.configs.recommended,
//     tseslint.configs.recommended,
//     eslintReact.configs["recommended-typescript"],
//   ],
//
//   // Configure language/parsing options
//   languageOptions: {
//     // Use TypeScript ESLint parser for TypeScript files
//     parser: tseslint.parser,
//     parserOptions: {
//       ecmaVersion: 2021,
//       sourceType: 'module',
//       // Enable project service for better TypeScript integration
//       projectService: true,
//       tsconfigRootDir: import.meta.dirname,
//     },
//       globals: {
//         ...globals.node,
//         ...globals.es2021,
//         ...globals.jest,
//       },
//   },
//
//   // Custom rule overrides (modify rule levels or disable rules)
//   rules: {
//     "@eslint-react/no-missing-key": "warn",
//   },
// });
