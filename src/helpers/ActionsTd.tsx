import { Td } from '@patternfly/react-table';
import React from 'react';

const ActionsTd = ({ children }: { children: React.ReactNode }) => (
  <Td style={{ textAlign: 'end' }}>{children}</Td>
);

export default ActionsTd;
