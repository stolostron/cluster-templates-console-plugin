import { QuickStartContext } from '@patternfly/quickstarts';
import { Button, Divider, Stack, StackItem } from '@patternfly/react-core';
import React from 'react';
import { Trans } from 'react-i18next';
import { useAddAlertOnError } from '../../../alerts/useAddAlertOnError';
import CellLoader from '../../../helpers/CellLoader';
import { FormSection } from '../../../helpers/PatternflyOverrides';
import { useAllQuotas } from '../../../hooks/useQuotas';
import { useTranslation } from '../../../hooks/useTranslation';
import { Quota } from '../../../types/resourceTypes';
import { quickStartsData } from '../../ClusterTemplatesGettingStarted/quickStartConstants';
import NameField from '../../sharedFields/NameField';
import NamespaceField from '../../sharedFields/NamespaceField';
import BudgetField from './BudgetField';
import QuotaAllowedTemplatesArray from './QuotaAllowedTemplatesArray';

const QuotaNamespaceHelpText = () => {
  const qsCtx = React.useContext(QuickStartContext);
  const { t } = useTranslation();
  return (
    <Stack>
      <StackItem>
        <Trans ns="plugin__clustertemplates-plugin">
          The limits specified in this quota will be applied only within the scope of the selected
          namespace.
          <br />
          Ensure that the namespace has the necessary permissions for creating
          ClusterTemplateInstances.
          <br />
          Note that each namespace can only have one quota.
        </Trans>
      </StackItem>
      <StackItem>
        <Button
          variant="link"
          onClick={() =>
            qsCtx?.setActiveQuickStart &&
            qsCtx.setActiveQuickStart(quickStartsData.shareTemplate.name)
          }
          style={{ paddingLeft: 'unset', paddingTop: 'unset' }}
        >
          {t('Learn more about sharing a template')}
        </Button>
      </StackItem>
    </Stack>
  );
};

const QuotaFormFields = ({ originalQuota }: { originalQuota: Quota | undefined }) => {
  const { t } = useTranslation();
  const [quotas, loaded, error] = useAllQuotas();
  // t('Failed to load namespace options');
  useAddAlertOnError(error, 'Failed to load namespace options');
  return (
    <>
      <NameField label={t('Name')} name="name" isDisabled={!!originalQuota} />
      <CellLoader loaded={loaded}>
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
      </CellLoader>
      <BudgetField />
      <Divider />
      <FormSection title={t('Allowed templates')}>
        <QuotaAllowedTemplatesArray />
      </FormSection>
    </>
  );
};

export default QuotaFormFields;
