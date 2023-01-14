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

export type RepositoryFormValues = {
  useCredentials: boolean;
  name: string;
  url: string;
  type: 'helm' | 'git';
  username: string;
  password: string;
  tlsClientCertData: string;
  tlsClientCertKey: string;
  insecure: boolean;
  description: string;
};
