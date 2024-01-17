/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-css-order'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  svelteAllowShorthand: true,
  svelteIndentScriptAndStyle: false
};
