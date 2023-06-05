const getTextAria = () => cy.findByRole('textbox', { name: /certificate authority/i });

const getProgressBar = () =>
  cy.get(
    "[role=progressbar][role=progressbar][aria-valuetext='Certificate authority field loading']",
  );

const getFailedLoadingCaMapAlert = () =>
  cy.findByRole('alert', { name: /failed to get the available certificate authorities/i });

const getFailedLoadingReposAlert = () =>
  cy.findByRole('alert', { name: /failed to load repositories/i });

const getAllowSelfSignedCheckbox = () =>
  cy.findByRole('checkbox', { name: /allow self-signed certificates/i });

const getOtherRepositoriesInfo = () =>
  cy.findByRole('heading', {
    name: /info alert: this certificate authority is utilized by all repositories with the hostname/i,
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
