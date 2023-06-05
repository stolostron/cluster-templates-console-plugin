import '@testing-library/cypress/add-commands';

//component should be in lowercase, story should be in kabab case
Cypress.Commands.add('goToStory', (component: string, story: string) => {
  cy.visit(`/iframe.html?args=&id=${component}--${story}&viewMode=story`);
});
