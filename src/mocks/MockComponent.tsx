import React from 'react';

const MockComponent = jest
  .fn()
  .mockImplementation(({ testId, children }: { children: React.ReactChildren; testId: string }) => (
    <div data-testid={testId}>{children}</div>
  ));

export default MockComponent;
