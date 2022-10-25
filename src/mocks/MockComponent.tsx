// /* Copyright Contributors to the Open Cluster Management project */

import React from 'react';

const MockComponent = jest
  .fn()
  .mockImplementation((props: any) => (
    <div data-testid={props['data-testid']}>{props.children}</div>
  ));

export default MockComponent;
