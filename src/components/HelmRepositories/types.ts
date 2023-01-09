export type FormError = {
  title: string;
  message: string;
};

export type HelmRepositoryFormValues = {
  name: string;
  url: string;
  description: string;
  useCredentials: boolean;
  existingSecretName: string;
  existingConfigMapName: string;
  caCertificate: string;
  tlsClientCert: string;
  tlsClientKey: string;
};
