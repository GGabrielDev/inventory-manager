import js from '@eslint/js'
import globals from 'globals'
import prettierPlugin from 'eslint-plugin-prettier'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'

export default [
  // ESLint recommended rules
  js.configs.recommended,

  // Global environment setup
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },
  },

  // TypeScript plugin setup
  {
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
  },

  // Prettier integration (disables conflicting rules + enables prettier rule)
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
]
