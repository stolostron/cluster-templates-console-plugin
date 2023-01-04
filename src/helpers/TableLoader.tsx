import * as React from 'react';
import { Skeleton } from '@patternfly/react-core';
import Loader, { LoaderProps } from './Loader';

type TableLoaderProps = {
  children: React.ReactNode;
  loaded?: boolean;
  error?: unknown;
} & Omit<LoaderProps, 'loaderContent'>;

function TableLoader(props: TableLoaderProps) {
  const loadingState = (
    <div data-testid="table-skeleton">
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
  return <Loader {...props} loadingState={loadingState} />;
}

export default TableLoader;
