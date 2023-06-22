context('NameField', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:6006/iframe.html?args=&id=namefield--name-field-story&viewMode=story',
    );
  });

  it('Type invalid character should show two errors in the popover', () => {
    cy.findByRole('textbox', { name: /name/ }).type('&&&');
    cy.findByRole('dialog', { name: /validation popover/i }).should('exist');
    cy.findByRole('alert', {
      name: 'Must start and end with a lowercase alphanumeric character',
    }).should('exist');
    cy.findByRole('alert', {
      name: 'Use lowercase alphanumeric characters, dot (.) or hyphen (-)',
    }).should('exist');
  });
});
