import { defineConfig } from 'taze';

export default defineConfig({
  force: true,
  write: true,
  includeLocked: true,
  packageMode: {
    vue: 'ignore',
    '/@tb-dev/': 'major',
    '/manatsu/': 'major'
  }
});
