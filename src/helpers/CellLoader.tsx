import { Skeleton, SkeletonProps } from '@patternfly/react-core';
import React from 'react';

type CellLoaderProps = {
  loaded: boolean;
  error?: unknown;
  fontSize?: SkeletonProps['fontSize'];
  children: React.ReactNode;
};

const CellLoader = ({ loaded, error, children, fontSize }: CellLoaderProps) => {
  if (!loaded) return <Skeleton fontSize={fontSize} />;
  if (error) return <>-</>;
  return <>{children}</>;
};

export default CellLoader;
