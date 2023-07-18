import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import { Form } from '@patternfly/react-core';
import { AlertsContextProvider } from '../../../alerts/AlertsContext';
import Alerts from '../../../alerts/Alerts';
import _CertificateAuthorityField, {
  CertificateAuthorityFieldProps,
} from './_CertificateAuthorityField';
import { mockCaMap, mockSecrets } from '../../../mocks/repositories';

const CertificateAuthorityFieldWrapper = ({
  name,
  url,
  useArgoCdSecretsResult,
  useCaMapResult,
  insecure,
}: {
  insecure: boolean;
  name: string;
  url: string;
} & CertificateAuthorityFieldProps) => {
  return (
    <AlertsContextProvider>
      <Formik
        initialValues={{ url: url, insecure: insecure, name: name }}
        onSubmit={(values) => console.log(values)}
        validateOnMount
        enableReinitialize
      >
        <Form>
          <_CertificateAuthorityField
            useCaMapResult={useCaMapResult}
            useArgoCdSecretsResult={useArgoCdSecretsResult}
          />
          <Alerts />
        </Form>
      </Formik>
    </AlertsContextProvider>
  );
};

const meta: Meta<typeof CertificateAuthorityFieldWrapper> = {
  title: 'CaField',
  component: CertificateAuthorityFieldWrapper,
};

export default meta;
type Story = StoryObj<typeof CertificateAuthorityFieldWrapper>;

export const WithCa: Story = {
  args: {
    url: 'http://aaa.com/repo1',
    useArgoCdSecretsResult: [[], true, null],
    useCaMapResult: [mockCaMap, true, null],
  },
};

export const WithoutCa: Story = {
  args: {
    url: 'http://ddd.com/repo1',
    useArgoCdSecretsResult: [[], true, null],
    useCaMapResult: [mockCaMap, true, null],
  },
};

export const LoadingCaMap: Story = {
  args: {
    url: '',
    useArgoCdSecretsResult: [[], true, null],
    useCaMapResult: [{}, false, null],
  },
};

export const LoadingSecrets: Story = {
  args: {
    url: '',
    useArgoCdSecretsResult: [[], false, null],
    useCaMapResult: [{}, true, null],
  },
};

export const LoadingReposError: Story = {
  args: {
    url: '',
    useArgoCdSecretsResult: [[], true, new Error('error loading secrets')],
    useCaMapResult: [{}, true, null],
  },
};

export const LoadingCaMapError: Story = {
  args: {
    url: '',
    useArgoCdSecretsResult: [[], true, null],
    useCaMapResult: [{}, true, new Error('error loading config map')],
  },
};

export const OtherReposInfo: Story = {
  args: {
    name: mockSecrets[0].metadata?.name || '',
    url: mockSecrets[0].data.url,
    useArgoCdSecretsResult: [mockSecrets, true, null],
    useCaMapResult: [mockCaMap, true, null],
  },
};

export const NoOtherReposInfo: Story = {
  args: {
    name: mockSecrets[0].metadata?.name || '',
    url: mockSecrets[0].data.url,
    useArgoCdSecretsResult: [mockSecrets.splice(1, 1), true, null],
    useCaMapResult: [mockCaMap, true, null],
  },
};

export const AllowSelfSigned: Story = {
  args: {
    url: 'http://aaa.com/repo1',
    useArgoCdSecretsResult: [[], true, null],
    useCaMapResult: [mockCaMap, true, null],
    insecure: true,
  },
};
