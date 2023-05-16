import { getStorybookIframeBody } from '../support/utils';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:6006/?path=/story/namefield--valid-name');
  });

  it('Input field should contain text "valid-name"', () => {
    getStorybookIframeBody().find('input[type="text"]').should('have.value', 'valid-name');
  });
});
