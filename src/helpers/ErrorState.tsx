/* Copyright Contributors to the Open Cluster Management project */
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../utils/utils';

export type ErrorStateProps = {
  error: unknown;
  errorId?: string;
  errorTitle?: string;
  errorMessage?: string;
};

const ErrorState = ({ errorId, errorTitle, errorMessage, error }: ErrorStateProps) => {
  const { t } = useTranslation();
  const msg = errorMessage ? errorMessage : getErrorMessage(error);
  return (
    <EmptyState data-testid={errorId ?? 'error'}>
      <EmptyStateIcon icon={ExclamationCircleIcon} />
      <Title size="lg" headingLevel="h4">
        {errorTitle ?? t('Something went wrong')}
      </Title>
      {msg && <EmptyStateBody>{msg}</EmptyStateBody>}
    </EmptyState>
  );
};

export default ErrorState;
