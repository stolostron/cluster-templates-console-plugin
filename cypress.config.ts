import { defineConfig } from 'cypress';

const config = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:6006',
    specPattern: '**/*.cy.ts',
  },
});

export default config;
