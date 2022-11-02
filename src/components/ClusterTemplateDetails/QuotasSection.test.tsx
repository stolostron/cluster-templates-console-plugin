/* eslint-disable @typescript-eslint/no-var-requires */
import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';
import { render } from '@testing-library/react';
import { clusterTemplateQuotaGVK, roleBindingGVK } from '../../constants';
import QuotasSection from './QuotaSection';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import importedQuotas from '../../mocks/quotas.json';
import clusterTemplate from '../../mocks/clusterTemplateExample.json';
import roleBindings from '../../mocks/roleBindings.json';
import { ClusterTemplateQuota } from '../../types';
import React from 'react';
const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

const quotas = importedQuotas as ClusterTemplateQuota[];
const quotasInTemplate = quotas.filter((quota) =>
  (quota.spec?.allowedTemplates?.map((templateData) => templateData.name) || []).includes(
    clusterTemplate.metadata.name,
  ),
);

jest.mock('@openshift-console/dynamic-plugin-sdk', () => {
  const MockComponent = require('../../mocks/MockComponent').default;
  return {
    ResourceLink: MockComponent,
    useK8sWatchResource: jest.fn(),
  };
});

const renderQuotasSection = async () => {
  return render(<QuotasSection clusterTemplate={clusterTemplate}></QuotasSection>);
};

describe('Cluster template details page quotas section', () => {
  it('should show loading state while loading', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], false, null]);
    const { getByTestId } = await renderQuotasSection();
    expect(getByTestId('table-skeleton')).toBeInTheDocument();
  });

  it('should show error when load quotas returns an error', async () => {
    useK8sWatchResourceMock.mockReturnValue([undefined, true, new Error('test error')]);
    const { getByTestId } = await renderQuotasSection();
    expect(getByTestId('error')).toBeInTheDocument();
  });

  it('should show quotas in table and no users and groups when no cluster template role binding was found', async () => {
    useK8sWatchResourceMock.mockImplementation(
      ({ groupVersionKind }: { groupVersionKind: K8sGroupVersionKind }) => {
        if (groupVersionKind.kind === clusterTemplateQuotaGVK.kind) {
          return [quotas, true, null];
        }
        if (groupVersionKind.kind === roleBindingGVK.kind) {
          return [[], true, null];
        }
        throw `unexpected kind ${groupVersionKind.kind}`;
      },
    );
    const { container, getByTestId } = await renderQuotasSection();
    expect(getByTestId('quotas-table')).toBeInTheDocument();

    for (let i = 0; i < quotasInTemplate.length; ++i) {
      const quota = quotas[i];
      const rowSelector = `[data-index='${i}'][data-testid=quotas-table-row]`;
      expect(
        container.querySelector(`${rowSelector} [data-testid=quota-${quota.metadata?.name}]`),
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          `${rowSelector} [data-testid=namespace-${quota.metadata?.namespace}]`,
        ),
      ).toBeInTheDocument();
      expect(
        container.querySelector(`${rowSelector} [data-testid=user-management]`),
      ).toHaveTextContent(`0 users, 0 groups`);
      expect(container.querySelector(`${rowSelector} [data-testid=cost]`)).toHaveTextContent(
        quota.spec?.budget ? `${quota.status?.budgetSpent || 0} / ${quota.spec?.budget}` : '-',
      );
    }
  });
  it('should show data in user management for first quota when has cluster template RoleBinding for that namespace', async () => {
    useK8sWatchResourceMock.mockImplementation(
      ({
        groupVersionKind,
        namespace,
      }: {
        groupVersionKind: K8sGroupVersionKind;
        namespace?: string;
      }) => {
        if (groupVersionKind.kind === clusterTemplateQuotaGVK.kind) {
          return [quotas, true, null];
        }
        if (groupVersionKind.kind === roleBindingGVK.kind) {
          return [roleBindings.filter((rb) => rb.metadata.namespace === namespace), true, null];
        }
        throw `unexpected kind ${groupVersionKind.kind}`;
      },
    );
    const { container } = await renderQuotasSection();
    expect(
      container.querySelector(
        `[data-index='0'][data-testid='quotas-table-row'] [data-testid='user-management']`,
      ),
    ).toHaveTextContent(`3 users, 1 group`);
    expect(
      container.querySelector(
        `[data-index='1'][data-testid='quotas-table-row'] [data-testid='user-management']`,
      ),
    ).toHaveTextContent(`0 users, 0 groups`);
  });
});
