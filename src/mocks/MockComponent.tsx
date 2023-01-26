import React from 'react';

type MockComponentProps = {
  children: React.ReactNode;
  'data-testid'?: string;
};

const MockComponent = jest
  .fn()
  .mockImplementation(({ children, ...props }: MockComponentProps) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ));

export default MockComponent;
