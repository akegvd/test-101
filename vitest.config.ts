import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      pool: 'forks',
      isolate: true, // each test file gets a clean environment
      setupFiles: ['./src/test/setup.ts'],
      dir: 'lessons', // Stryker overrides this to run only one lesson folder
      include: ['**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: [['text', { skipFull: false }], 'html'],
        reportsDirectory: 'coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/main.tsx', 'src/mocks/**', 'src/test/**', 'src/**/*.d.ts'],
      },
    },
  }),
);
