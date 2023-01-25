import * as React from 'react';
import { Skeleton, SkeletonProps } from '@patternfly/react-core';
import Loader, { LoaderProps } from './Loader';

type SkeletonLoaderProps = Omit<LoaderProps, 'loadingState'> & {
  numRows: number;
  fontSize?: SkeletonProps['fontSize'];
};

export const SkeletonLoader = ({
  numRows,
  fontSize = '2xl',
  children,
  ...props
}: SkeletonLoaderProps) => {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < numRows; ++i) {
    lines.push(
      <React.Fragment key={i}>
        <Skeleton fontSize={fontSize} />
        <br />
      </React.Fragment>,
    );
  }
  return (
    <Loader loadingState={<>{lines}</>} {...props}>
      {children}
    </Loader>
  );
};
