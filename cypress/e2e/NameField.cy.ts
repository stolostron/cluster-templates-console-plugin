context('NameField', () => {
  beforeEach(() => {
    cy.goToStory('namefield', 'valid-name');
  });

  it('Input field should contain text "valid-name"', () => {
    cy.findByRole('textbox', { name: /name/ }).should('exist');
  });
});
