import React from 'react';
import { Button, EmptyState, EmptyStateIcon, Title } from '@patternfly/react-core';
import { RepositoryIcon } from '@patternfly/react-icons';

type RepositoriesEmptyStateProps = {
  addRepository: () => void;
};

const RepositoriesEmptyState = ({ addRepository }: RepositoriesEmptyStateProps) => (
  <EmptyState>
    <EmptyStateIcon icon={RepositoryIcon} />
    <Title headingLevel="h4" size="lg">
      No repositories found
    </Title>
    <Button variant="primary" onClick={addRepository}>
      Add repository
    </Button>
  </EmptyState>
);

export default RepositoriesEmptyState;
