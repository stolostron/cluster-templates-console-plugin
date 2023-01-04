import React from 'react';

const MockComponent = jest
  .fn()
  .mockImplementation(({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ));

export default MockComponent;
