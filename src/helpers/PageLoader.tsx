import * as React from 'react';
import { Card, CardBody, Page, PageSection } from '@patternfly/react-core';
import ErrorState, { ErrorStateProps } from './ErrorState';
import { LoadingState } from './LoadingState';

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

const LoadingPage = () => {
  return (
    <Page>
      <PageSection isFilled>
        <LoadingState />
      </PageSection>
    </Page>
  );
};

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
