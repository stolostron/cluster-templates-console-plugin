import React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import { helmRepoGVK } from '../../constants';
import CellLoader from '../../helpers/CellLoader';
import InlineResourceLink from '../../helpers/InlineResourceLink';
import { useHelmRepoCR } from '../../hooks/useHelmRepositories';
import { ArgoCDSpec } from '../../types';
import { Text } from '@patternfly/react-core';
import { useTranslation } from '../../hooks/useTranslation';
const ArgoCDSpecDetails = ({ argocdSpec }: { argocdSpec: ArgoCDSpec }) => {
  const { t } = useTranslation();
  const [repoCR, loaded, error] = useHelmRepoCR(argocdSpec.source.repoURL);
  useAddAlertOnError(
    error,
    t(`Failed to get HelmChartRepository CR for url {{url}}`, { url: argocdSpec.source.repoURL }),
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
      {repoCR && repoCR.metadata?.name ? (
        <Text>
          <InlineResourceLink groupVersionKind={helmRepoGVK} name={repoCR.metadata?.name} />
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
