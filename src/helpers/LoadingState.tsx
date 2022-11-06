import { Bullseye, EmptyState, EmptyStateIcon, Spinner, Title } from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function LoadingState() {
  const { t } = useTranslation();
  return (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon variant="container" component={Spinner} />
        <div>
          <Title size="lg" headingLevel="h4">
            {t('Loading')}
          </Title>
        </div>
      </EmptyState>
    </Bullseye>
  );
}
