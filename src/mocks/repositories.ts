import { ArgoCDSecretData, DecodedSecret } from '../types/resourceTypes';

export const sharedHost = 'aaa.com';

export const mockCaMap = {
  [sharedHost]: 'AAA',
  'bbb.com': 'BBB',
  'ccc.com': 'CCC',
};

const mockInsecureSecret = {
  metadata: {
    name: 'insecure',
  },
  data: {
    url: `https://${sharedHost}/app2`,
    insecure: 'true',
  },
};

export const mockSecrets: DecodedSecret<ArgoCDSecretData>[] = [
  {
    metadata: {
      name: 'repo1',
    },
    data: {
      url: `https://${sharedHost}/app1`,
      insecure: 'false',
    },
  },
  mockInsecureSecret,
  {
    metadata: {
      name: 'repo2',
    },
    data: {
      url: `https://${sharedHost}/app2`,
    },
  },
  {
    metadata: {
      name: 'repo3',
    },
    data: {
      url: `https://bbb.com/app1`,
      insecure: 'false',
    },
  },
];
