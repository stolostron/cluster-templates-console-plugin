import React from 'react';
import { useCertificatesAutorityMap, useArgoCDSecrets } from '../../../hooks/useArgoCDSecrets';
import _CertificateAuthorityField from './_CertificateAuthorityField';

const CertificateAuthorityField = () => {
  const useCaMapResult = useCertificatesAutorityMap();
  const useArgoCDSecretsResult = useArgoCDSecrets();

  return (
    <_CertificateAuthorityField
      useCaMapResult={useCaMapResult}
      useArgoCdSecretsResult={useArgoCDSecretsResult}
    />
  );
};

export default CertificateAuthorityField;
