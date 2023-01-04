import { Skeleton } from '@patternfly/react-core';
import React from 'react';

type CellLoaderProps = {
  loaded: boolean;
  error?: unknown;
  children: React.ReactNode;
};

const CellLoader = ({ loaded, error, children }: CellLoaderProps) => {
  if (!loaded) return <Skeleton />;
  if (error) return <>-</>;
  return <>{children}</>;
};

export default CellLoader;
