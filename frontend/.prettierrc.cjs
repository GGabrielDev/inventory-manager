/** @type {import('prettier').Options} */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSameLine: false,
  jsxSingleQuote: false,
  plugins: [
    // Add any Prettier plugins you're using here
    // Example: 'prettier-plugin-organize-imports',
  ]
};

export default config;
