const getIframeDocument = () =>
  cy.get('#storybook-preview-iframe').its('0.contentDocument').should('exist');

const getIframeBody = () =>
  getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap);

context('Actions', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:6006/?path=/story/example-namefield--valid-name&args=initialName:sdfsadf',
    );
  });

  // https://on.cypress.io/interacting-with-elements

  it('name field label should exist', () => {
    // https://on.cypress.io/type
    getIframeBody().find('.pf-c-form__label-text').should('contain.text', 'name');
  });
});
