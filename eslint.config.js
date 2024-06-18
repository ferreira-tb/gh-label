import config from '@tb-dev/eslint-config';

export default config({
  vue: true,
  project: ['tsconfig.json'],
  ignores: ['src/components/ui/*'],
  overrides: {
    perfectionist: {
      'perfectionist/sort-interfaces': 'off'
    },
    typescript: {
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-function-type': 'off'
    },
    vue: {
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: false }
      ]
    }
  }
});
