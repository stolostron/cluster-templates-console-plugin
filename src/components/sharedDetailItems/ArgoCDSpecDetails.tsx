import React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import CellLoader from '../../helpers/CellLoader';
import { InlineLinkButton } from '../../helpers/Links';
import { ArgoCDSpec } from '../../types';
import { Text } from '@patternfly/react-core';
import { useTranslation } from '../../hooks/useTranslation';
import { useArgoCDSecretByRepoUrl } from '../../hooks/useArgoCDSecrets';

const ArgoCDSpecDetails = ({ argocdSpec }: { argocdSpec: ArgoCDSpec }) => {
  const { t } = useTranslation();
  const [secret, loaded, error] = useArgoCDSecretByRepoUrl(argocdSpec.source.repoURL);
  useAddAlertOnError(
    error,
    t(`Failed to get ArgoCDSecret for url {{url}}`, { url: argocdSpec.source.repoURL }),
  );
  const parts = [argocdSpec.source.repoURL];
  if (argocdSpec.source.chart) {
    parts.push(argocdSpec.source.chart);
  }
  if (argocdSpec.source.targetRevision) {
    parts.push(argocdSpec.source.targetRevision);
  }
  return (
    <CellLoader loaded={loaded} error={error}>
      {secret && secret.metadata?.name ? (
        <Text>
          <InlineLinkButton text={secret.metadata?.name} url={argocdSpec.source.repoURL} />
          {argocdSpec.source.chart && <span> / {argocdSpec.source.chart}</span>}
          {argocdSpec.source.targetRevision && <span> / {argocdSpec.source.targetRevision}</span>}
        </Text>
      ) : (
        <>{argocdSpec.source.repoURL}</>
      )}
    </CellLoader>
  );
};

export default ArgoCDSpecDetails;
