import React from 'react';

const MockComponent = jest
  .fn()
  .mockImplementation(({ children, ...props }: unknown) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ));

export default MockComponent;
