/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import ManageQuotasStep from './ManageQuotasStep';

import { act, render, screen } from '@testing-library/react';
import { K8sGroupVersionKind, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { clusterTemplateQuotaGVK } from '../../../../constants';
import importedQuotas from '../../../../mocks/quotas.json';

import { Formik } from 'formik';
import { getFormikInitialValues } from '../../initialValues';
import userEvent from '@testing-library/user-event';
import { Quota } from '../../../../types';
import { WizardFormikValues } from '../../types';

const quotas = importedQuotas as Quota[];
jest.mock('@openshift-console/dynamic-plugin-sdk', () => {
  const MockComponent = require('../../../../mocks/MockComponent').default;
  return {
    useK8sWatchResource: jest.fn(),
    useK8sModel: jest.fn().mockReturnValue([{ name: 'aaa' }, true]),
    k8sCreate: jest.fn().mockResolvedValue({}),
    ErrorBoundary: () => <div>Mocked error boundary</div>,
    ResourceLink: MockComponent,
  };
});

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

const mockQuotas = () => {
  useK8sWatchResourceMock.mockImplementation(
    ({ groupVersionKind }: { groupVersionKind: K8sGroupVersionKind }) => {
      if (groupVersionKind.kind === clusterTemplateQuotaGVK.kind) {
        return [quotas, true, null];
      } else {
        return [[], true, null];
      }
    },
  );
};

const renderQuotaStep = () => {
  act(() => {
    render(
      <Formik<WizardFormikValues>
        initialValues={getFormikInitialValues()}
        onSubmit={() => console.log('submit')}
      >
        <ManageQuotasStep />
      </Formik>,
    );
  });
};

const getQuotaTextbox = (quotaIdx: number) => {
  return screen.getByRole('textbox', { name: `quotas[${quotaIdx}].quota` });
};

const assertQuotaName = (quotaIdx: number, quotaName: string) => {
  expect(getQuotaTextbox(quotaIdx)).toHaveValue(quotaName);
};

describe('manage quota step', () => {
  beforeEach(() => {
    mockQuotas();
    renderQuotaStep();
  });
  test('should select quota', async () => {
    screen.debug();
    getQuotaTextbox(0).click();
    expect(
      screen.getByRole('option', { name: 'quota0 (0 users) Namespace: devuserns' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'quota1 (0 users) Namespace: template-quota-ns' }),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('option', { name: 'quota0 (0 users) Namespace: devuserns' }),
    );
    assertQuotaName(0, 'quota0 (0 users)');
  });

  test('should set quota with new quota', async () => {
    const newQuotaName = 'new-quota';
    getQuotaTextbox(0).click();
    screen.getAllByRole('button', { name: 'Create a new quota' })[0].click();
    await userEvent.type(screen.getByLabelText('Quota name *'), newQuotaName);
    await userEvent.type(screen.getByLabelText('Namespace *'), 'default');
    expect(screen.getByLabelText('Namespace *')).toHaveValue('default');
    const addButton = screen.getByRole('button', { name: 'Create' });
    await userEvent.click(addButton);
  });
});
