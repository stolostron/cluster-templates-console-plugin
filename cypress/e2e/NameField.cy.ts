context('NameField', () => {
  beforeEach(() => {
    cy.visit('http://localhost:6006/iframe.html?args=&id=namefield--valid-name&viewMode=story');
  });

  it('Input field should contain text "valid-name"', () => {
    cy.findByRole('textbox', { name: /name/ }).should('exist');
  });
});
