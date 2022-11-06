/* Copyright Contributors to the Open Cluster Management project */
import * as React from 'react';
import ErrorState, { ErrorStateProps } from './ErrorState';
import { LoadingState } from './LoadingState';

type PageLoaderProps = {
  children: React.ReactNode;
  loaded?: boolean;
  error?: unknown;
} & Omit<ErrorStateProps, 'error'>;

const DefaultLoader = ({
  loaded = false,
  children,
  error,
  ...restErrorStateProps
}: PageLoaderProps) => {
  if (error) {
    return <ErrorState error={error} {...restErrorStateProps} />;
  }
  if (!loaded) {
    return <LoadingState />;
  }
  return <>{children}</>;
};

export default DefaultLoader;
