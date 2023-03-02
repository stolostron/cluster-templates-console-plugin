import {
  EmptyState,
  EmptyStateBody,
  EmptyStatePrimary,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import emptyTablePng from '../icons/EmptyPageIcon.png';

const EmptyPageState = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) => {
  const { t } = useTranslation();
  return (
    <EmptyState variant={EmptyStateVariant.large}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <img src={emptyTablePng} style={{ width: '50%' }} alt={t('Empty state')} />
      <Title headingLevel="h4" size="lg">
        {title}
      </Title>
      <EmptyStateBody>{message}</EmptyStateBody>
      {action && <EmptyStatePrimary>{action}</EmptyStatePrimary>}
    </EmptyState>
  );
};

export default EmptyPageState;
