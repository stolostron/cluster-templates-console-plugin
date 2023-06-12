import { FormSection as PfFormSection, FormSectionProps } from '@patternfly/react-core';
import {
  TableComposable as PfTableComposable,
  TableComposableProps,
} from '@patternfly/react-table';
import React from 'react';

export const FormSection = (props: FormSectionProps) => (
  <PfFormSection style={{ marginTop: 'unset' }} {...props} />
);

export const TableComposableEqualColumnSize = (
  props: TableComposableProps,
  ref: React.Ref<HTMLTableElement>,
) => <PfTableComposable {...props} ref={ref} style={{ tableLayout: 'fixed' }} />;
