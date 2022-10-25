/* Copyright Contributors to the Open Cluster Management project */
import * as React from 'react';
import { Skeleton } from '@patternfly/react-core';
import ErrorState, { ErrorStateProps } from './ErrorState';

type TableLoaderProps = {
  children: React.ReactNode;
  loaded?: boolean;
  error?: unknown;
} & Omit<ErrorStateProps, 'error'>;

function TableLoader({
  loaded = false,
  children,
  error,
  ...restErrorStateProps
}: TableLoaderProps) {
  if (!loaded) {
    return (
      <div id="table-skeleton">
        <Skeleton />
        <br />
        <Skeleton />
        <br />
        <Skeleton />
        <br />
        <Skeleton />
        <br />
        <Skeleton />
        <br />
        <Skeleton />
      </div>
    );
  }
  if (error) {
    return <ErrorState error={error} {...restErrorStateProps} />;
  }
  return <>{children}</>;
}

export default TableLoader;
