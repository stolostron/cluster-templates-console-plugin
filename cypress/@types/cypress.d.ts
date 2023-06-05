declare namespace Cypress {
  interface Chainable {
    goToStory(component: string, story: string): Chainable<Cypress.Exec>;
  }
}
