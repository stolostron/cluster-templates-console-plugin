/* Copyright Contributors to the Open Cluster Management project */
import * as React from 'react';
import ErrorState, { ErrorStateProps } from './ErrorState';
import { LoadingState } from './LoadingState';

type PageLoaderProps = {
  children: React.ReactNode;
  loaded?: boolean;
  error?: unknown;
  loadingState?: React.ReactNode;
} & Omit<ErrorStateProps, 'error'>;

const Loader = ({
  loaded = false,
  children,
  error,
  loadingState = <LoadingState />,
  ...restErrorStateProps
}: PageLoaderProps) => {
  if (error) {
    return <ErrorState error={error} {...restErrorStateProps} />;
  }
  if (!loaded) {
    return <>{loadingState}</>;
  }
  return <>{children}</>;
};

export default Loader;
