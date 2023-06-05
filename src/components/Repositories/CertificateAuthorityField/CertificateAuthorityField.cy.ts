import CertificateAuthorityFieldView from './CertificateAuthorityField.view';

const story = 'cafield';

describe('Repository form Certificate authority field', () => {
  it('should show certificate when url has hostname existing in the config map', () => {
    cy.goToStory(story, 'with-ca');
    CertificateAuthorityFieldView.getTextAria().should('have.value', 'AAA');
  });

  it('should clear and disable textarea when clicking on allow self signed checkbox', () => {
    cy.goToStory(story, 'with-ca');
    CertificateAuthorityFieldView.getTextAria().should('have.value', 'AAA');
    CertificateAuthorityFieldView.getAllowSelfSignedCheckbox().click();
    CertificateAuthorityFieldView.getTextAria().should('be.disabled');
    CertificateAuthorityFieldView.getTextAria().should('not.have.value');
  });

  it('should enable textarea and show certificate when unchecking allow self signed checkbox', () => {
    cy.goToStory(story, 'allow-self-signed');
    CertificateAuthorityFieldView.getTextAria().should('not.have.value');
    CertificateAuthorityFieldView.getTextAria().should('be.disabled');
    CertificateAuthorityFieldView.getAllowSelfSignedCheckbox().click();
    CertificateAuthorityFieldView.getTextAria().should('be.enabled');
    CertificateAuthorityFieldView.getTextAria().should('have.value', 'AAA');
  });

  it('should not show certificate when url has hostname not existing in the config map', () => {
    cy.goToStory(story, 'without-ca');
    CertificateAuthorityFieldView.getTextAria().should('not.have.value');
  });

  it('should show the certificate after entering it', () => {
    cy.goToStory(story, 'without-ca');
    CertificateAuthorityFieldView.getTextAria().type('a certificate');
    CertificateAuthorityFieldView.getTextAria().should('have.value', 'a certificate');
  });

  it('should show progressbar while loading all repositories', () => {
    cy.goToStory(story, 'loading-secrets');
    CertificateAuthorityFieldView.getProgressBar().should('exist');
  });

  it('should show progressbar while loading certificate authority map', () => {
    cy.goToStory(story, 'loading-ca-map');
    CertificateAuthorityFieldView.getProgressBar().should('exist');
  });

  it('should show error if loading repositories failed', () => {
    cy.goToStory(story, 'loading-repos-error');
    CertificateAuthorityFieldView.getFailedLoadingReposAlert().should('exist');
  });

  it('should show error if loading ca map failed', () => {
    cy.goToStory(story, 'loading-ca-map-error');
    CertificateAuthorityFieldView.getFailedLoadingCaMapAlert().should('exist');
  });

  it('should not show other repos warning when no other repositories have the same hostname', () => {
    cy.goToStory(story, 'no-other-repos-info');
    CertificateAuthorityFieldView.getOtherRepositoriesInfo().should('not.exist');
  });

  it('should show other repos warning when there are other repositories with the same hostname', () => {
    cy.goToStory(story, 'other-repos-info');
    CertificateAuthorityFieldView.getOtherRepositoriesInfo().should('exist');
    cy.findByRole('link', { name: 'repo2' }).should('exist');
    cy.findByRole('link', { name: 'repo3' }).should('not.exist');
  });
});
