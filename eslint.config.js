import config from '@tb-dev/eslint-config';

export default config({
  vue: true,
  project: ['tsconfig.json'],
  overrides: {
    perfectionist: {
      'perfectionist/sort-interfaces': 'off'
    },
    typescript: {
      '@typescript-eslint/prefer-function-type': 'off'
    }
  }
});
