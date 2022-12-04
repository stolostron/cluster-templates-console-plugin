import { render } from '@testing-library/react';
import React from 'react';
import { waitForSelector, waitForText } from '../testUtils/testUtils';
import { getNavLabelWithCount, CellLoader } from './utils';

describe('CellLoader component', () => {
  test('renders children when loaded and no error', async () => {
    render(<CellLoader isLoaded>The content</CellLoader>);
    await waitForText('The content');
  });
  test('renders skeleton when loading', async () => {
    const { container } = render(<CellLoader isLoaded={false}>The content</CellLoader>);
    await waitForSelector(container, 'div.pf-c-skeleton');
  });
  test('renders `-` when there is an error', async () => {
    render(
      <CellLoader isLoaded error={'something went wrong'}>
        The content
      </CellLoader>,
    );
    await waitForText('-');
  });
});

describe('getNavLabelWithCount', () => {
  test('returns just a label when no count is provided', () => {
    expect(getNavLabelWithCount('Items')).toEqual('Items');
  });
  test('returns label with count when the count is provided', () => {
    expect(getNavLabelWithCount('Items', 3)).toEqual('Items (3)');
  });
});
