import { Alert, Stack } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { CheckboxField } from 'formik-pf';
import React from 'react';
import URLParse from 'url-parse';
import { useAddAlertOnError } from '../../../alerts/useAddAlertOnError';
import { secretGVK } from '../../../constants';
import ResourceLink from '../../../helpers/ResourceLink';
import { useTranslation } from '../../../hooks/useTranslation';
import { ArgoCDSecretData, DecodedSecret } from '../../../types/resourceTypes';
import UploadField from '../../sharedFields/UploadField';
import { RepositoryFormValues } from '../types';

const getUrlCertificateAuthority = (url: string, caMap: Record<string, string>): string => {
  try {
    const baseUrl = new URL(url).hostname;
    return caMap[baseUrl] || '';
  } catch (err) {
    return '';
  }
};

const CaInOtherReposAlert = ({
  secrets,
  caMap,
}: {
  secrets: DecodedSecret<ArgoCDSecretData>[];
  caMap: Record<string, string>;
}) => {
  const { values } = useFormikContext<RepositoryFormValues>();
  const { t } = useTranslation();
  const hostname = new URLParse(values.url).hostname;
  if (
    !hostname ||
    values.insecure ||
    //don't show info if certificate is empty but it's not being deleted (isn't currently defined in configmap)
    (!values.certificateAuthority && !caMap[hostname])
  ) {
    return null;
  }
  const otherRepos = secrets.filter(
    (secret) =>
      secret.data.insecure !== 'true' &&
      new URLParse(secret.data?.url || '').hostname === hostname &&
      secret.metadata?.name !== values.name,
  );
  if (!otherRepos.length) {
    return null;
  }
  const title = t(
    `This certificate authority is utilized by all repositories with the host {{hostname}}.`,
    {
      hostname,
      count: otherRepos.length,
    },
  );
  const message = t(
    'Any modifications made to the certificate authority will impact the following repository:',
    {
      count: otherRepos.length,
    },
  );
  //TODO: handle more than 3 other repositories
  return (
    <Alert title={title} variant="info" isInline>
      <>{message}&nbsp;</>
      <>
        {otherRepos.slice(0, 3).map((otherRepo) => (
          <div key={otherRepo.metadata?.uid}>
            <ResourceLink
              name={otherRepo.metadata?.name || ''}
              namespace={otherRepo.metadata?.namespace || ''}
              groupVersionKind={secretGVK}
            />
          </div>
        ))}
      </>
    </Alert>
  );
};

export type CertificateAuthorityFieldProps = {
  useCaMapResult: [Record<string, string>, boolean, unknown];
  useArgoCdSecretsResult: [DecodedSecret<ArgoCDSecretData>[], boolean, unknown];
};

const _CertificateAuthorityField = ({
  useCaMapResult,
  useArgoCdSecretsResult,
}: CertificateAuthorityFieldProps) => {
  const [caMap, caMapLoaded, caMapError] = useCaMapResult;
  const [allSecrets, allSecretsLoaded, allSecretsError] = useArgoCdSecretsResult;
  const { values, setFieldValue } = useFormikContext<RepositoryFormValues>();
  const prevUrl = React.useRef<string>();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (values.url !== prevUrl.current && !values.insecure) {
      const ca = getUrlCertificateAuthority(values.url, caMap);
      if (ca) {
        setFieldValue('certificateAuthority', ca);
      }
      prevUrl.current = values.url;
    }
  }, [caMap, setFieldValue, values.insecure, values.url]);

  React.useEffect(() => {
    if (values.insecure && values.certificateAuthority !== '') {
      setFieldValue('certificateAuthority', '');
    }
  }, [setFieldValue, values.insecure, values.certificateAuthority]);

  // t('Failed to get the available Certificate Authorities');
  useAddAlertOnError(caMapError, 'Failed to get the available Certificate Authorities');
  // t('Failed to load repositories');
  useAddAlertOnError(allSecretsError, 'Failed to load repositories');
  return (
    <Stack hasGutter>
      <CheckboxField
        name="insecure"
        fieldId="insecure"
        label={t('Skip certificate verification')}
      />
      <UploadField
        isLoading={!caMapLoaded || !allSecretsLoaded}
        name="certificateAuthority"
        isDisabled={values.insecure}
        label={t('Custom certificate authority')}
        aria-label={t('Custom certificate authority')}
        spinnerAriaValueText={t('Custom certificate authority field loading')}
      />
      <CaInOtherReposAlert secrets={allSecrets} caMap={caMap} />
    </Stack>
  );
};

export default _CertificateAuthorityField;
