/* Copyright Contributors to the Open Cluster Management project */
import * as React from 'react';
import {
  Bullseye,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Page,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import ErrorState, { ErrorStateProps } from './ErrorState';

type PageLoaderProps = {
  children: React.ReactNode;
  loaded?: boolean;
  error?: unknown;
} & Omit<ErrorStateProps, 'error'>;

export function ErrorPage(props: ErrorStateProps) {
  return (
    <Page>
      <PageSection>
        <Card>
          <CardBody>
            <ErrorState {...props} />
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
}

export function LoadingPage(props: {
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
}) {
  return (
    <Page>
      <PageSection isFilled>
        <Bullseye>
          <EmptyState>
            <EmptyStateIcon variant="container" component={Spinner} />
            <div>
              <Title size="lg" headingLevel="h4">
                {props.title ?? 'Loading'}
              </Title>
              <EmptyStateBody>{props.message}</EmptyStateBody>
            </div>
            {props.primaryAction}
            <EmptyStateSecondaryActions>{props.secondaryActions}</EmptyStateSecondaryActions>
          </EmptyState>
        </Bullseye>
      </PageSection>
    </Page>
  );
}

const PageLoader = ({
  loaded = false,
  children,
  error,
  ...restErrorStateProps
}: PageLoaderProps) => {
  if (error) {
    return <ErrorPage error={error} {...restErrorStateProps} />;
  }
  if (!loaded) {
    return <LoadingPage />;
  }
  return <>{children}</>;
};

export default PageLoader;
