const getTextAria = () => cy.findByRole('textbox', { name: /custom certificate authority/i });

const getProgressBar = () =>
  cy.get(
    "[role=progressbar][role=progressbar][aria-valuetext='Custom certificate authority field loading']",
  );

const getFailedLoadingCaMapAlert = () =>
  cy.findByRole('alert', { name: /failed to get the available certificate authorities/i });

const getFailedLoadingReposAlert = () =>
  cy.findByRole('alert', { name: /failed to load repositories/i });

const getAllowSelfSignedCheckbox = () =>
  cy.findByRole('checkbox', { name: /Skip certificate verification/i });

const getOtherRepositoriesInfo = () =>
  cy.findByRole('heading', {
    name: /info alert: this certificate authority is utilized by all repositories with the host/i,
  });

const CertificateAuthorityFieldView = {
  getTextAria,
  getProgressBar,
  getFailedLoadingCaMapAlert,
  getFailedLoadingReposAlert,
  getAllowSelfSignedCheckbox,
  getOtherRepositoriesInfo,
};

export default CertificateAuthorityFieldView;
