/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import ClusterTemplatesPage from './ClusterTemplatesPage';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';
import { useHelmRepositoriesCount } from '../../hooks/useHelmRepositories';
import { waitForText } from '../../testUtils/testUtils';
import React from 'react';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => {
  const MockComponent = require('../../mocks/MockComponent').default;
  return {
    HorizontalNav: MockComponent,
    ListPageCreateDropdown: MockComponent,
    ListPageHeader: MockComponent,
    NavPage: MockComponent,
  };
});

jest.mock('../../hooks/useClusterTemplates');
jest.mock('../../hooks/useHelmRepositories');
(useClusterTemplates as jest.Mock).mockReturnValue([[], true, undefined]);
(useHelmRepositoriesCount as jest.Mock).mockReturnValue(0);

describe('ClusterTemplatesPage', () => {
  test('redirects to templates tab by default', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <ClusterTemplatesPage />
        </MemoryRouter>
      </RecoilRoot>,
    );
    waitForText('Cluster templates');
    expect(screen.getByRole('tab', { name: 'Cluster templates tab' }));
    expect(screen.getByRole('tab', { name: 'HELM repositories tab' }));
  });
});
