import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EditHelmRepositoryDialog, {
  EditHelmRepoCredsValues,
  getDecodedSecretData,
  getDefaultConfigMapName,
  getDefaultSecretName,
  getHelmRepoConnectionConfigPatch,
  getInitialValues,
} from './EditHelmRepositoryDialog';
import { ConfigMap, HelmChartRepository, Secret } from '../../types';
import {
  useK8sModels,
  useK8sWatchResources,
  k8sDelete,
  k8sPatch,
  k8sCreate,
} from '@openshift-console/dynamic-plugin-sdk';
import { ConfigMapModelMock, HCRModelMock, SecretModelMock } from '../../mocks/models';
import { typeByLabel, waitForTestId } from '../../testUtils/testUtils';
import userEvent from '@testing-library/user-event';

const helmChartRepositoryWithCredentialsMock: HelmChartRepository = {
  kind: 'HelmChartRepository',
  apiVersion: 'helm.openshift.io/v1beta1',
  metadata: {
    creationTimestamp: '2022-10-11T14:03:30Z',
    labels: {
      'clustertemplates.openshift.io/helm-repo': 'true',
    },
    name: 'with-creds-cluster-templates-repo',
    resourceVersion: '467507095',
    uid: 'aac4af2a-3895-400e-8042-078aa29881e2',
  },
  spec: {
    connectionConfig: {
      ca: {
        name: 'with-creds-cluster-templates-repo-ca-certificate',
      },
      tlsClientConfig: {
        name: 'with-creds-cluster-templates-repo-tls-configs',
      },
      url: 'https://rawagner.github.io/helm-demo/index.yaml',
    },
  },
};
const helmChartRepositoryNoCredentialsMock: HelmChartRepository = {
  kind: 'HelmChartRepository',
  apiVersion: 'helm.openshift.io/v1beta1',
  metadata: {
    creationTimestamp: '2022-10-11T14:03:30Z',
    labels: {
      'clustertemplates.openshift.io/helm-repo': 'true',
    },
    name: 'no-creds-cluster-templates-repo',
    resourceVersion: '467507095',
    uid: 'aac4af2a-3895-400e-8042-078aa29881e2',
  },
  spec: {
    connectionConfig: {
      url: 'https://rawagner.github.io/helm-demo/index.yaml',
    },
  },
};

const secretMock: Secret = {
  kind: 'Secret',
  apiVersion: 'v1',
  metadata: {
    name: 'with-creds-cluster-templates-repo-tls-configs',
    namespace: 'openshift-config',
    uid: 'f66b5fe7-707e-4176-bc3d-decba17ae587',
    resourceVersion: '473574655',
    creationTimestamp: '2022-10-18T10:12:39Z',
  },
  data: {
    'tls.crt': 'dHdv',
    'tls.key': 'dGhyZWU=',
  },
  type: 'kubernetes.io/tls',
};

const configMapMock: ConfigMap = {
  kind: 'ConfigMap',
  apiVersion: 'v1',
  metadata: {
    name: 'with-creds-cluster-templates-repo-ca-certificate',
    namespace: 'openshift-config',
    uid: 'dc31f6c9-6791-4f99-a978-dafb30771161',
    resourceVersion: '473574664',
    creationTimestamp: '2022-10-18T10:12:39Z',
  },
  data: {
    'ca-bundle.crt': 'one',
  },
};

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  useK8sModels: jest.fn(),
  useK8sWatchResources: jest.fn(),
  k8sCreate: jest.fn(),
  k8sDelete: jest.fn(),
  k8sPatch: jest.fn(),
}));

describe('getDefaultSecretName', () => {
  test('creates a resource name based on helm repository name', () => {
    const expected = 'hcr-name-tls-configs';
    expect(getDefaultSecretName('hcr-name')).toEqual(expected);
  });
  test('creates a resource name with no repository name provided', () => {
    const expected = 'unknown-tls-configs';
    expect(getDefaultSecretName()).toEqual(expected);
  });
});

describe('getDefaultConfigMapName', () => {
  test('creates a resource name based on helm repository name', () => {
    const expected = 'hcr-name-ca-certificate';
    expect(getDefaultConfigMapName('hcr-name')).toEqual(expected);
  });
  test('creates a resource name with no repository name provided', () => {
    const expected = 'unknown-ca-certificate';
    expect(getDefaultConfigMapName()).toEqual(expected);
  });
});

describe('getHelmRepoConnectionConfigPatch', () => {
  const commonValues = {
    url: 'http://example.com',
    secretName: 'hello',
    configMapName: 'world',
  };
  test('patches only url when useCredentials is false', () => {
    const values = {
      ...commonValues,
      useCredentials: false,
    };
    expect(getHelmRepoConnectionConfigPatch(values)).toEqual({
      url: values.url,
    });
  });
  test('creates a patch with url, ca and tlsClientConfig', () => {
    const values = {
      ...commonValues,
      useCredentials: true,
    };
    expect(getHelmRepoConnectionConfigPatch(values)).toEqual({
      url: values.url,
      tlsClientConfig: { name: values.secretName },
      ca: { name: values.configMapName },
    });
  });
});

describe('getDecodedSecretData', () => {
  test('decodes secret data into a readable string', () => {
    const encodedSecretData = { 'tls.crt': 'aGVsbG8=', 'tls.key': 'd29ybGQ=' };
    expect(getDecodedSecretData(encodedSecretData)).toEqual({
      tlsClientCert: 'hello',
      tlsClientKey: 'world',
    });
  });
});

describe('getInitialValues', () => {
  test('returns initial form values for helm chart repository with credentials', () => {
    const expected: EditHelmRepoCredsValues = {
      url: 'https://rawagner.github.io/helm-demo/index.yaml',
      useCredentials: true,
      existingSecretName: 'with-creds-cluster-templates-repo-tls-configs',
      existingConfigMapName: 'with-creds-cluster-templates-repo-ca-certificate',
      caCertificate: 'one',
      tlsClientCert: 'two',
      tlsClientKey: 'three',
    };
    expect(
      getInitialValues(helmChartRepositoryWithCredentialsMock, secretMock, configMapMock),
    ).toEqual(expected);
  });
  test('returns initial form values for helm chart repository with no credentials', () => {
    const expected: EditHelmRepoCredsValues = {
      url: 'https://rawagner.github.io/helm-demo/index.yaml',
      useCredentials: false,
      existingSecretName: '',
      existingConfigMapName: '',
      caCertificate: '',
      tlsClientCert: '',
      tlsClientKey: '',
    };
    expect(getInitialValues(helmChartRepositoryNoCredentialsMock)).toEqual(expected);
  });
});

describe('EditHelmRepositoryDialog', () => {
  (useK8sWatchResources as jest.Mock).mockReturnValue({
    secrets: { data: [secretMock], loaded: true },
    configMaps: { data: [configMapMock], loaded: true },
  });

  test('renders the modal with a form', async () => {
    render(
      <EditHelmRepositoryDialog
        helmChartRepository={helmChartRepositoryWithCredentialsMock}
        closeDialog={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('dialog', {
        name: 'Edit repository dialog Edit repository',
      }),
    );
    await waitForTestId('edit-helm-repo-form');
  });
  test('displays credentials fields if useCredentials is checked', () => {
    render(
      <EditHelmRepositoryDialog
        helmChartRepository={helmChartRepositoryWithCredentialsMock}
        closeDialog={jest.fn()}
      />,
    );
    expect(screen.getByLabelText('Requires authentication')).toBeChecked();
    expect(screen.getByLabelText('CA certificate config map')).toHaveValue(
      'with-creds-cluster-templates-repo-ca-certificate',
    );
    expect(screen.getByLabelText('CA certificate *')).toHaveValue('one');
    expect(screen.getByLabelText('TLS config secret')).toHaveValue(
      'with-creds-cluster-templates-repo-tls-configs',
    );
    expect(screen.getByLabelText('TLS client certificate *')).toHaveValue('two');
    expect(screen.getByLabelText('TLS client key *')).toHaveValue('three');
  });
  test('hides credentials fields if useCredentials is unchecked', async () => {
    render(
      <EditHelmRepositoryDialog
        helmChartRepository={helmChartRepositoryWithCredentialsMock}
        closeDialog={jest.fn()}
      />,
    );
    const useCredentialsCheckbox = screen.getByLabelText('Requires authentication');
    expect(useCredentialsCheckbox).toBeChecked();
    await userEvent.click(useCredentialsCheckbox);
    expect(useCredentialsCheckbox).not.toBeChecked();
    expect(screen.queryByLabelText('existingConfigMapName')).toBeNull();
  });
});

describe('Submitting EditHelmRepositoryDialog', () => {
  (useK8sModels as jest.Mock).mockReturnValue([
    {
      ConfigMap: ConfigMapModelMock,
      Secret: SecretModelMock,
      'helm.openshift.io~v1beta1~HelmChartRepository': HCRModelMock,
    },
    false,
  ]);

  afterEach(() => jest.clearAllMocks());

  test('when disabling credentials, remove secret and config map if their name matches default credentials name', async () => {
    (useK8sWatchResources as jest.Mock).mockReturnValue({
      secrets: { data: [secretMock], loaded: true },
      configMaps: { data: [configMapMock], loaded: true },
    });
    render(
      <EditHelmRepositoryDialog
        helmChartRepository={helmChartRepositoryWithCredentialsMock}
        closeDialog={jest.fn()}
      />,
    );
    const useCredentialsCheckbox = screen.getByLabelText('Requires authentication');
    expect(useCredentialsCheckbox).toBeChecked();
    await userEvent.click(useCredentialsCheckbox);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(k8sPatch).toHaveBeenCalled());
    await waitFor(() => expect(k8sDelete).toHaveBeenCalledTimes(2));
  });
  xtest('when adding credentials without selecting existing, new secret and config map are created', async () => {
    (useK8sWatchResources as jest.Mock).mockReturnValue({
      secrets: { data: [], loaded: true },
      configMaps: { data: [], loaded: true },
    });
    const user = userEvent.setup();
    render(
      <EditHelmRepositoryDialog
        helmChartRepository={helmChartRepositoryNoCredentialsMock}
        closeDialog={jest.fn()}
      />,
    );
    const useCredentialsCheckbox = screen.getByLabelText('Requires authentication');
    expect(useCredentialsCheckbox).not.toBeChecked();
    await user.click(useCredentialsCheckbox);
    await typeByLabel('CA certificate *', 'one');
    await typeByLabel('TLS client certificate *', 'two');
    await typeByLabel('TLS client key *', 'three');
    expect(screen.findByLabelText('CA certificate config map')).toHaveValue('');
    expect(screen.findByLabelText('TLS config secret')).toHaveValue('');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);
    await waitFor(() => expect(k8sPatch).toHaveBeenCalled());
    await waitFor(() => expect(k8sCreate).toHaveBeenCalledTimes(2));
  });
  test('when updating credentials, the secret and config map are updated', async () => {
    (useK8sWatchResources as jest.Mock).mockReturnValue({
      secrets: { data: [secretMock], loaded: true },
      configMaps: { data: [configMapMock], loaded: true },
    });
    render(
      <EditHelmRepositoryDialog
        helmChartRepository={helmChartRepositoryWithCredentialsMock}
        closeDialog={jest.fn()}
      />,
    );
    const useCredentialsCheckbox = screen.getByLabelText('Requires authentication');
    expect(useCredentialsCheckbox).toBeChecked();
    await typeByLabel('CA certificate *', 'one-updated');
    await typeByLabel('TLS client certificate *', 'two-updated');
    await typeByLabel('TLS client key *', 'three-updated');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await userEvent.click(submitButton);
    await waitFor(() => expect(k8sPatch).toHaveBeenCalledTimes(3));
  });
});
