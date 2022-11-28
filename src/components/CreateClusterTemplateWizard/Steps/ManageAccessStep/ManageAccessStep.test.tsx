import React from 'react';
import ManageAccessStep from './ManageAccessStep';

import { act, render, screen } from '@testing-library/react';
import { K8sGroupVersionKind, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateQuotaGVK, roleBindingGVK } from '../../../../constants';
import importedQuotas from '../../../../mocks/quotas.json';
import { ClusterTemplateQuota } from '../../../../types';
import { Formik } from 'formik';
import { WizardFormikValues } from '../../formikTypes';
import { getFormikInitialValues } from '../../initialValues';
import userEvent from '@testing-library/user-event';
import { NamespacesContextProvider } from './NamespaceContextProvider';
import { AccessContextProvider } from './AccessContextProvider';
//import preview from 'jest-preview';

const quotas = importedQuotas as ClusterTemplateQuota[];
jest.mock('@openshift-console/dynamic-plugin-sdk', () => {
  return {
    useK8sWatchResource: jest.fn(),
    useK8sModel: jest.fn().mockReturnValue([{ name: 'aaa' }, true]),
    k8sCreate: jest.fn().mockResolvedValue({}),
  };
});
const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

const mockQuotas = () => {
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
};

const renderAccessStep = () => {
  act(() => {
    render(
      <NamespacesContextProvider>
        <AccessContextProvider>
          <Formik<WizardFormikValues>
            initialValues={getFormikInitialValues()}
            onSubmit={() => console.log('submit')}
          >
            <ManageAccessStep />
          </Formik>
        </AccessContextProvider>
      </NamespacesContextProvider>,
    );
  });
};

const getQuotaTextbox = (quotaIdx: number) => {
  return screen.getByRole('textbox', { name: `quotas[${quotaIdx}].name` });
};

const assertQuotaName = (quotaIdx: number, quotaName: string) => {
  expect(getQuotaTextbox(quotaIdx)).toHaveValue(quotaName);
};

describe('manage access step', () => {
  beforeEach(() => {
    mockQuotas();
    renderAccessStep();
  });

  test('should show a single quota expandable section', () => {
    expect(screen.getByRole('button', { name: 'Access 1' })).toBeInTheDocument();
  });

  test('should select quota', async () => {
    getQuotaTextbox(0).click();
    expect(screen.getByRole('option', { name: 'quota0' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'quota1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'quota2' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', { name: 'quota0' }));
    assertQuotaName(0, 'quota0');
  });

  test('should set quota with new quota', async () => {
    const newQuotaName = 'new-quota';
    screen.getAllByRole('button', { name: 'Create a new quota' })[0].click();
    await userEvent.type(screen.getByLabelText('Quota name *'), newQuotaName);
    await userEvent.type(screen.getByLabelText('Namespace *'), 'default');
    expect(screen.getByLabelText('Namespace *')).toHaveValue('default');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    assertQuotaName(0, newQuotaName);
  });
});
