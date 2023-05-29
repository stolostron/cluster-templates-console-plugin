export const getStorybookIframeBody = () =>
  cy
    .get('#storybook-preview-iframe')
    .its('0.contentDocument')
    .its('body')
    .should('not.be.undefined')
    .then((elm) => cy.wrap(elm));
