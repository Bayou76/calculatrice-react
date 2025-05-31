import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,  // <-- active les globals comme describe/test/expect
    environment: 'jsdom', // simulateur de navigateur pour React Testing Library
  },
});
