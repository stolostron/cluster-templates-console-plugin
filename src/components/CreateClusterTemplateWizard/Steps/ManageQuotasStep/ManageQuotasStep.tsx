/* Copyright Contributors to the Open Cluster Management project */
import { Divider, Stack, StackItem, Text } from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';

import QuotaCardsArray from './QuotaCardsArray';
import { clusterTemplateQuotaGVK } from '../../../../constants';
import InlineResourceLink from '../../../../helpers/InlineResourceLink';
import { WithHelpIcon } from '../../../../helpers/PopoverHelpIcon';
import ErrorBoundary from '../../../../helpers/ErrorBoundary';
import { Trans } from 'react-i18next';

const Description = () => {
  const { t } = useTranslation();
  return (
    <Trans ns="plugin__clustertemplates-plugin">
      Choose a quota you want be assosiated with this cluster template. You can manage the existing
      quotas in the &nbsp;
      <InlineResourceLink
        groupVersionKind={clusterTemplateQuotaGVK}
        displayName={t('Quotas tab.')}
      />
      <br />
      Quotas can also be set and changed after the cluster template has been added.
    </Trans>
  );
};

export const _ManageQuotasStep = () => {
  const { t } = useTranslation();
  return (
    <Stack hasGutter>
      <StackItem>
        <Stack hasGutter>
          <StackItem>
            <WithHelpIcon
              helpText={t(
                'A quota provides constraints that limit aggregate cluster consumption per namespace.',
              )}
            >
              <Text component="h2">{t('Manage quotas')}</Text>
            </WithHelpIcon>
          </StackItem>
          <StackItem>
            <Description />
          </StackItem>
          <StackItem>
            <Divider />
          </StackItem>
        </Stack>
      </StackItem>
      <StackItem>
        <QuotaCardsArray />
      </StackItem>
    </Stack>
  );
};

const ManageQuotasStep = () => (
  <ErrorBoundary>
    <_ManageQuotasStep />
  </ErrorBoundary>
);

export default ManageQuotasStep;
