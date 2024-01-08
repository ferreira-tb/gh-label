/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-css-order', 'prettier-plugin-tailwindcss'],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  vueIndentScriptAndStyle: false,
  tailwindAttributes: ['sidebar-item-class']
};
