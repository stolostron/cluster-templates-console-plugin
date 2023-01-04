import * as React from 'react';
import { Skeleton } from '@patternfly/react-core';

const TableLoadingState = () => (
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

export default TableLoadingState;
