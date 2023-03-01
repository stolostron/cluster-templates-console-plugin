import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { Divider } from '@patternfly/react-core';
import React from 'react';
import { Trans } from 'react-i18next';
import { useAddAlertOnError } from '../../../alerts/useAddAlertOnError';
import { CLUSTER_TEMPLATES_ROLE, clusterRoleGVK } from '../../../constants';
import FormSection from '../../../helpers/FormSection';
import { SkeletonLoader } from '../../../helpers/SkeletonLoader';
import { useAllQuotas } from '../../../hooks/useQuotas';
import { useTranslation } from '../../../hooks/useTranslation';
import { Quota } from '../../../types/resourceTypes';
import NameField from '../../sharedFields/NameField';
import NamespaceField from '../../sharedFields/NamespaceField';
import BudgetField from './BudgetField';
import QuotaAllowedTemplatesArray from './QuotaAllowedTemplatesArray';

const ClusterTemplatesUserRoleLink = () => (
  <ResourceLink
    hideIcon={true}
    inline
    groupVersionKind={clusterRoleGVK}
    name={CLUSTER_TEMPLATES_ROLE}
  />
);

const QuotaNamespaceHelpText = () => (
  <Trans ns="plugin__clustertemplates-plugin">
    Select a namespace that has the permissions for creating ClusterTemplateIntances. See &nbsp;
    <ClusterTemplatesUserRoleLink /> &nbsp;for reference. Each namespace can only have one quota.
  </Trans>
);

const QuotaFormFields = ({ originalQuota }: { originalQuota: Quota | undefined }) => {
  const { t } = useTranslation();
  const [quotas, loaded, error] = useAllQuotas();
  // t('Failed to load namespace options');
  useAddAlertOnError(error, 'Failed to load namespace options');
  return (
    <SkeletonLoader loaded={loaded}>
      <NameField label={t('Name')} name="name" isDisabled={!!originalQuota} />
      <NamespaceField
        name="namespace"
        label={t('Namespace')}
        isRequired
        helpText={<QuotaNamespaceHelpText />}
        isDisabled={!!originalQuota}
        namespaceFilter={(namespace) =>
          !quotas.find((quota) => quota.metadata?.namespace === namespace)
        }
      />
      <BudgetField />
      <Divider />
      <FormSection title={t('Allowed templates')}>
        <QuotaAllowedTemplatesArray />
      </FormSection>
    </SkeletonLoader>
  );
};

export default QuotaFormFields;
