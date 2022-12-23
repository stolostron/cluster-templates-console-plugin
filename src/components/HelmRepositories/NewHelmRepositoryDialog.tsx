import * as React from 'react';
import * as Yup from 'yup';
import {
  Modal,
  ModalVariant,
  Button,
  ModalBoxFooter,
  ModalBoxBody,
  ButtonVariant,
  Form,
  TextInputTypes,
  Alert,
  AlertVariant,
} from '@patternfly/react-core';
import { ConfigMap, HelmChartRepository, Secret } from '../../types';
import {
  k8sCreate,
  k8sDelete,
  k8sPatch,
  useK8sModels,
  useK8sWatchResources,
} from '@openshift-console/dynamic-plugin-sdk';
import { Buffer } from 'buffer';
import { configMapGVK, helmRepoGVK, secretGVK } from '../../constants';
import TableLoader from '../../helpers/TableLoader';
import { InputField, CheckboxField, TextAreaField } from 'formik-pf';
import SelectField from '../../helpers/SelectField';
import { Formik, FormikProps } from 'formik';
import { TFunction } from 'react-i18next';
import { useTranslation } from '../../hooks/useTranslation';
import { getErrorMessage } from '../../utils/utils';

export type NewHelmRepositoryFormValues = {
  name: string;
  description: string;
  url: string;
  useCredentials: boolean;
  existingSecretName: string;
  existingConfigMapName: string;
  caCertificate: string;
  tlsClientCert: string;
  tlsClientKey: string;
};

type NewHelmRepositoryDialogProps = {
  closeDialog: () => void;
};

type FormError = {
  title: string;
  message: string;
};

const SECRET_TYPE = 'kubernetes.io/tls';
const NAMESPACE = 'openshift-config';

export const getDefaultSecretName = (helmChartRepositoryName?: string) =>
  `${helmChartRepositoryName || 'unknown'}-tls-configs`;
export const getDefaultConfigMapName = (helmChartRepositoryName?: string) =>
  `${helmChartRepositoryName || 'unknown'}-ca-certificate`;

export const getHelmRepoConnectionConfigPatch = ({
  url,
  useCredentials,
  secretName,
  configMapName,
}: {
  url: string;
  useCredentials: boolean;
  secretName: string;
  configMapName: string;
}): HelmChartRepository['spec']['connectionConfig'] => {
  if (useCredentials) {
    return {
      url,
      tlsClientConfig: { name: secretName },
      ca: { name: configMapName },
    };
  }
  return { url };
};

export function getDecodedSecretData(secretData: Secret['data'] = {}) {
  const decodedSecretData = Object.entries(secretData).reduce<{
    ['tls.crt']?: string;
    ['tls.key']?: string;
  }>(
    (res, [key, value]) => ({
      ...res,
      [key]: Buffer.from(value, 'base64').toString('ascii'),
    }),
    {},
  );
  const tlsClientCert = decodedSecretData['tls.crt'];
  const tlsClientKey = decodedSecretData['tls.key'];
  return { tlsClientCert, tlsClientKey };
}

export const getValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    name: Yup.string().required(t('Required.')),
    url: Yup.string()
      .url(t('URL must be a valid URL starting with "http://" or "https://"'))
      .required(t('Required.')),
    useCredentials: Yup.boolean(),
    caCertificate: Yup.string().when('useCredentials', {
      is: true,
      then: (schema) => schema.required(t('Required.')),
    }),
    tlsClientCert: Yup.string().when('useCredentials', {
      is: true,
      then: (schema) => schema.required(t('Required.')),
    }),
    tlsClientKey: Yup.string().when('useCredentials', {
      is: true,
      then: (schema) => schema.required(t('Required.')),
    }),
  });

export function getInitialValues(): NewHelmRepositoryFormValues {
  return {
    name: '',
    description: '',
    url: '',
    useCredentials: false,
    existingSecretName: '',
    existingConfigMapName: '',
    caCertificate: '',
    tlsClientCert: '',
    tlsClientKey: '',
  };
}

const NewHelmRepositoryDialog = ({ closeDialog }: NewHelmRepositoryDialogProps) => {
  const { t } = useTranslation();
  const helmChartRepositoryReference = `${helmRepoGVK.group}~${helmRepoGVK.version}~${helmRepoGVK.kind}`;

  const [
    {
      ConfigMap: configMapModel,
      Secret: secretModel,
      [helmChartRepositoryReference]: helmChartRepoModel,
    },
  ] = useK8sModels();
  const [formError, setFormError] = React.useState<FormError | undefined>();
  const {
    secrets: { data: secrets, loaded: secretsLoaded },
    configMaps: { data: configMaps, loaded: configMapsLoaded },
  } = useK8sWatchResources<{
    secrets: Secret[];
    configMaps: ConfigMap[];
  }>({
    secrets: {
      groupVersionKind: secretGVK,
      namespace: NAMESPACE,
      isList: true,
    },
    configMaps: {
      groupVersionKind: configMapGVK,
      namespace: NAMESPACE,
      isList: true,
    },
  });

  const availableTlsSecrets = secrets.filter((s) => s.type === SECRET_TYPE);
  const dataLoaded = secretsLoaded && configMapsLoaded;

  const handleSubmit = async ({
    name,
    description,
    url,
    existingConfigMapName,
    existingSecretName,
    useCredentials,
    tlsClientCert,
    tlsClientKey,
    caCertificate,
  }: NewHelmRepositoryFormValues) => {
    const configMapName = existingConfigMapName || getDefaultConfigMapName(name);
    const secretName = existingSecretName || getDefaultSecretName(name);

    const configMapToUpdate = configMaps.find((cm) => cm.metadata?.name === configMapName);
    const secretToUpdate = secrets.find((s) => s.metadata?.name === secretName);

    setFormError(undefined);

    const promises = [];
    promises.push(
      k8sCreate<HelmChartRepository>({
        model: helmChartRepoModel,
        data: {
          metadata: {
            name,
          },
          spec: {
            description,
            disabled: false,
            name,
            connectionConfig: getHelmRepoConnectionConfigPatch({
              url,
              useCredentials,
              secretName,
              configMapName,
            }),
          },
        },
      }),
    );
    if (!secretToUpdate && useCredentials) {
      promises.push(
        k8sCreate<Secret>({
          model: secretModel,
          data: {
            apiVersion: secretGVK.version,
            kind: secretGVK.kind,
            metadata: {
              name: secretName,
              namespace: NAMESPACE,
              // labels: { },
            },
            data: {
              ['tls.crt']: Buffer.from(tlsClientCert, 'ascii').toString('base64'),
              ['tls.key']: Buffer.from(tlsClientKey, 'ascii').toString('base64'),
            },
            type: SECRET_TYPE,
          },
        }),
      );
    }
    if (!configMapToUpdate && useCredentials) {
      promises.push(
        k8sCreate<ConfigMap>({
          model: configMapModel,
          data: {
            apiVersion: configMapGVK.version,
            kind: configMapGVK.kind,
            metadata: {
              name: configMapName,
              namespace: NAMESPACE,
            },
            data: {
              ['ca-bundle.crt']: caCertificate,
            },
          },
        }),
      );
    }
    if (secretToUpdate && useCredentials) {
      promises.push(
        k8sPatch<Secret>({
          model: secretModel,
          resource: secretToUpdate,
          data: [
            {
              op: 'add',
              path: '/data/tls.crt',
              value: Buffer.from(tlsClientCert, 'ascii').toString('base64'),
            },
            {
              op: 'add',
              path: '/data/tls.key',
              value: Buffer.from(tlsClientKey, 'ascii').toString('base64'),
            },
          ],
        }),
      );
    }
    if (configMapToUpdate && useCredentials) {
      promises.push(
        k8sPatch<ConfigMap>({
          model: configMapModel,
          resource: configMapToUpdate,
          data: [
            {
              op: 'add',
              path: '/data/ca-bundle.crt',
              value: caCertificate,
            },
          ],
        }),
      );
    }
    if (
      secretToUpdate &&
      !useCredentials &&
      secretToUpdate.metadata?.name === getDefaultSecretName(name)
    ) {
      promises.push(k8sDelete<Secret>({ model: secretModel, resource: secretToUpdate }));
    }
    if (
      configMapToUpdate &&
      !useCredentials &&
      configMapToUpdate.metadata?.name === getDefaultConfigMapName(name)
    ) {
      promises.push(
        k8sDelete<ConfigMap>({
          model: configMapModel,
          resource: configMapToUpdate,
        }),
      );
    }
    try {
      await Promise.all(promises);
      closeDialog();
    } catch (e) {
      setFormError({
        title: t('Something went wrong'),
        message: getErrorMessage(e),
      });
    }
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen
      title={t('Add a repository')}
      onClose={closeDialog}
      aria-label="Add repository dialog"
      showClose
      hasNoBodyWrapper
    >
      <TableLoader loaded={dataLoaded}>
        <Formik<NewHelmRepositoryFormValues>
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          validationSchema={getValidationSchema(t)}
          component={(props) => (
            <FormikContent
              {...props}
              availableTlsSecrets={availableTlsSecrets}
              configMaps={configMaps}
              formError={formError}
              closeDialog={closeDialog}
            />
          )}
        />
      </TableLoader>
    </Modal>
  );
};

type FormikContentProps = FormikProps<NewHelmRepositoryFormValues> & {
  availableTlsSecrets: Secret[];
  configMaps: ConfigMap[];
  closeDialog: NewHelmRepositoryDialogProps['closeDialog'];
  formError?: FormError;
};

const FormikContent = ({
  handleSubmit,
  values,
  isSubmitting,
  isValid,
  errors,
  setFieldValue,
  setFieldTouched,
  availableTlsSecrets,
  configMaps,
  formError,
  closeDialog,
}: FormikContentProps) => {
  const { t } = useTranslation();
  const isInitialRenderRef = React.useRef(true);

  React.useEffect(() => {
    if (!isInitialRenderRef.current) setCaCertificateValue(values.existingConfigMapName);
  }, [values.existingConfigMapName]);

  React.useEffect(() => {
    if (!isInitialRenderRef.current) setTlsConfigValues(values.existingSecretName);
  }, [values.existingSecretName]);

  React.useEffect(() => {
    isInitialRenderRef.current = false;
  }, []);

  const setTlsConfigValues = async (value: NewHelmRepositoryFormValues['existingSecretName']) => {
    const { tlsClientCert, tlsClientKey } = getDecodedSecretData(
      availableTlsSecrets.find((secret) => secret.metadata?.name === value)?.data,
    );
    await setFieldValue('tlsClientCert', tlsClientCert || '', true);
    setFieldTouched('tlsClientCert', true, false);
    await setFieldValue('tlsClientKey', tlsClientKey || '', true);
    setFieldTouched('tlsClientKey', true, false);
  };

  const setCaCertificateValue = async (
    value: NewHelmRepositoryFormValues['existingConfigMapName'],
  ) => {
    await setFieldValue(
      'caCertificate',
      configMaps.find((cm) => cm.metadata?.name === value)?.data?.['ca-bundle.crt'] || '',
      true,
    );
    setFieldTouched('caCertificate', true, false);
  };
  return (
    <>
      <ModalBoxBody>
        <Form data-testid="new-helm-repo-form" onSubmit={handleSubmit}>
          <InputField
            fieldId="name"
            name="name"
            label={t('Name')}
            type={TextInputTypes.text}
            helperTextInvalid={errors.name}
            isRequired
          />
          <TextAreaField fieldId="description" name="description" label={t('Description')} />
          <InputField
            fieldId="url"
            name="url"
            label={t('HELM chart repository URL')}
            type={TextInputTypes.text}
            placeholder="Repository URL"
            helperTextInvalid={errors.url}
            isRequired
          />
          <CheckboxField
            fieldId="useCredentials"
            name="useCredentials"
            label={t('Requires authentication')}
            helperText={t(
              'Add credentials and custom certificate authority (CA) certificates to connect to private helm chart repository.',
            )}
          />
          {values.useCredentials && (
            <>
              <SelectField
                name="existingConfigMapName"
                fieldId="existingConfigMapName"
                label={t('CA certificate config map')}
                placeholder={t('Select a ConfigMap')}
                options={configMaps.map((cm) => ({
                  value: cm.metadata?.name || '',
                  disabled: false,
                }))}
              />
              <TextAreaField
                fieldId="caCertificate"
                name="caCertificate"
                label={t('CA certificate')}
                helperTextInvalid={errors.tlsClientKey}
                isRequired
              />
              <SelectField
                name="existingSecretName"
                fieldId="existingSecretName"
                label={t('TLS config secret')}
                placeholder={t('Select a credential')}
                options={availableTlsSecrets.map((secret) => ({
                  value: secret.metadata?.name || '',
                  disabled: false,
                }))}
              />
              <TextAreaField
                fieldId="tlsClientCert"
                name="tlsClientCert"
                label={t('TLS client certificate')}
                helperTextInvalid={errors.tlsClientCert}
                isRequired
              />
              <TextAreaField
                fieldId="tlsClientKey"
                name="tlsClientKey"
                label={t('TLS client key')}
                helperTextInvalid={errors.tlsClientKey}
                isRequired
              />
            </>
          )}
          {formError && (
            <Alert variant={AlertVariant.danger} title={formError?.title} isInline>
              {formError?.message}
            </Alert>
          )}
        </Form>
      </ModalBoxBody>
      <ModalBoxFooter>
        <Button
          onClick={() => handleSubmit()}
          variant={ButtonVariant.primary}
          isDisabled={isSubmitting || !isValid}
        >
          {t('Submit')}
        </Button>
        <Button onClick={closeDialog} variant={ButtonVariant.link}>
          {t('Cancel')}
        </Button>
      </ModalBoxFooter>
    </>
  );
};

export default NewHelmRepositoryDialog;
