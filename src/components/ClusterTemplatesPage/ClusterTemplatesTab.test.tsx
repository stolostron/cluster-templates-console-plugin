/* eslint-disable @typescript-eslint/no-var-requires */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { waitForTestId, waitForText } from '../../testUtils/testUtils';
import { useClusterTemplates } from '../../hooks/useClusterTemplates';
import { ClusterTemplate } from '../../types';
import { useClusterTemplateInstances } from '../../hooks/useClusterTemplateInstances';
import ClusterTemplatesTab, { ClusterTemplateRow } from './ClusterTemplatesTab';
import clusterTemplateMock1 from '../../mocks/clusterTemplateExample.json';
import React from 'react';

const clusterTemplatesListMock: ClusterTemplate[] = [clusterTemplateMock1];

jest.mock('@openshift-console/dynamic-plugin-sdk', () => {
  const MockComponent = require('../../mocks/MockComponent').default;
  const clusterTemplateModelMock =
    require('../../mocks/models').clusterTemplateModelMock;
  return {
    ResourceLink: MockComponent,
    useK8sModel: jest.fn().mockReturnValue([clusterTemplateModelMock]),
    k8sDelete: jest.fn(),
  };
});

jest.mock('../../hooks/useClusterTemplates');
jest.mock('../../hooks/useClusterTemplateInstances');
(useClusterTemplates as jest.Mock).mockReturnValue([
  clusterTemplatesListMock,
  true,
  undefined,
]);
(useClusterTemplateInstances as jest.Mock).mockReturnValue([
  [],
  true,
  undefined,
]);

describe('ClusterTemplatesTab', () => {
  test('renders the cluster templates table', async () => {
    render(
      <RecoilRoot>
        <MemoryRouter>
          <ClusterTemplatesTab />
        </MemoryRouter>
      </RecoilRoot>,
    );
    await waitForTestId('cluster-templates-table');
  });
});

describe('ClusterTemplateRow', () => {
  beforeEach(() => {
    // NOTE: avoiding DOM nesting warnings:
    // https://github.com/testing-library/react-testing-library/issues/515#issuecomment-547940273
    const tableBody = document.createElement('tbody');
    render(
      <MemoryRouter>
        <ClusterTemplateRow obj={clusterTemplateMock1} />
      </MemoryRouter>,
      {
        container: document.body.appendChild(tableBody),
      },
    );
  });

  describe('Deletion modal', () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
      await userEvent.click(
        screen.getByRole('menuitem', { name: 'Delete template' }),
      );
      await waitForText('Are you sure you want to delete?');
    });
    test('Cluster template deletion action and modal button', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      expect(screen.queryByText('Delete cluster template')).toBeNull();
    });
    test('Deletion modal close button closes the dialog', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByText('Delete cluster template')).toBeNull();
    });
    test('Deletion modal x button closes the dialog', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByText('Delete cluster template')).toBeNull();
    });
  });
});
