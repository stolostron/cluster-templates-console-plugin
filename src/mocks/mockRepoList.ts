import { GitRepository, HelmRepository } from '../types/resourceTypes';

export const mockGitRepoList: GitRepository[] = [
  {
    branches: ['main'],
    url: 'https://github.com/stolostron/cluster-templates-manifests',
  },
  {
    branches: ['master', 'wanghong230-patch-1'],
    tags: [
      'bg-deploy-v0.1',
      'bg-guestbook-v0.2',
      'bg-guestbook-v0.1',
      'guestbook-v0.2',
      'pre-post-sync-v0.1',
      'guestbook-v0.1',
      'bg-deploy-v0.2',
      'pre-post-sync-v0.2',
    ],
    url: 'https://github.com/argoproj/argocd-example-apps',
  },
];

export const mockHelmRepoList: HelmRepository[] = [
  {
    index: {
      apiVersion: 'v1',
      entries: {
        'hypershift-agent-template': [
          {
            apiVersion: 'v2',
            appVersion: '0.0.1',
            created: '2023-06-29T13:26:21.0321571+03:00',
            description: 'Hypershift cluster template with agent workers',
            digest: '155c71eb3def8c73228b0e748206705e2d3c21f08043b69be998885bd1dd0a4a',
            name: 'hypershift-agent-template',
            type: 'application',
            urls: [
              'https://batzionb.github.io/cluster-templates-manifests/hypershift-agent-template-0.0.1.tgz',
            ],
            version: '0.0.1',
          },
        ],
        'hypershift-kubevirt-template': [
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            created: '2023-06-29T13:26:21.032588573+03:00',
            description: 'A Helm chart which installs Hypershift cluster using KubeVirt platform',
            digest: '2b5d44df585930cc6b4c4129937b0434e8ebc957d08f6d084ae8d501f1dcabcb',
            name: 'hypershift-kubevirt-template',
            type: 'application',
            urls: [
              'https://batzionb.github.io/cluster-templates-manifests/hypershift-kubevirt-template-0.0.3.tgz',
            ],
            version: '0.0.3',
          },
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            created: '2023-06-29T13:26:21.032377886+03:00',
            description: 'A Helm chart which installs Hypershift cluster using KubeVirt platform',
            digest: 'f9dba9ee49c541c0610561b53dedb4330eec2b9f1f8b286df61fd1d004725321',
            name: 'hypershift-kubevirt-template',
            type: 'application',
            urls: [
              'https://batzionb.github.io/cluster-templates-manifests/hypershift-kubevirt-template-0.0.1.tgz',
            ],
            version: '0.0.1',
          },
        ],
        'hypershift-template': [
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            appVersion: '1.16.0',
            created: '2023-06-29T13:26:21.033139732+03:00',
            description: 'A Helm chart for Kubernetes',
            digest: '66d07aead4650686b8fb8dd710abfaecbc357b4ca87478aa340d3b42e607ca6d',
            name: 'hypershift-template',
            type: 'application',
            urls: [
              'https://batzionb.github.io/cluster-templates-manifests/hypershift-template-0.0.4.tgz',
            ],
            version: '0.0.4',
          },
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            appVersion: '1.16.0',
            created: '2023-06-29T13:26:21.032941407+03:00',
            description: 'A Helm chart for Kubernetes',
            digest: '7a79c04f7e6608acc32994d09f940bb82837b9abed17230459321eb06ce9cab6',
            name: 'hypershift-template',
            type: 'application',
            urls: [
              'https://batzionb.github.io/cluster-templates-manifests/hypershift-template-0.0.2.tgz',
            ],
            version: '0.0.2',
          },
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            appVersion: '1.16.0',
            created: '2023-06-29T13:26:21.032768661+03:00',
            description: 'A Helm chart for Kubernetes',
            digest: '5ec6d9847042c66663daad6e2f26d8abcf4d81e44260caf48571d1608c50b193',
            name: 'hypershift-template',
            type: 'application',
            urls: [
              'https://batzionb.github.io/cluster-templates-manifests/hypershift-template-0.0.1.tgz',
            ],
            version: '0.0.1',
          },
        ],
      },
      generated: '2023-06-29T13:26:21.031853434+03:00',
    },
    name: 'batz-manifests',
    url: 'https://batzionb.github.io/cluster-templates-manifests',
  },
  {
    index: {
      apiVersion: 'v1',
      entries: {
        'hypershift-agent-template': [
          {
            apiVersion: 'v2',
            appVersion: '0.0.1',
            created: '2023-06-15T12:57:53.103446028+02:00',
            description: 'Hypershift cluster template with agent workers',
            digest: '155c71eb3def8c73228b0e748206705e2d3c21f08043b69be998885bd1dd0a4a',
            name: 'hypershift-agent-template',
            type: 'application',
            urls: [
              'https://stolostron.github.io/cluster-templates-manifests/hypershift-agent-template-0.0.1.tgz',
            ],
            version: '0.0.1',
          },
        ],
        'hypershift-kubevirt-template': [
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            created: '2023-06-15T12:57:53.103862936+02:00',
            description: 'A Helm chart which installs Hypershift cluster using KubeVirt platform',
            digest: '2b5d44df585930cc6b4c4129937b0434e8ebc957d08f6d084ae8d501f1dcabcb',
            name: 'hypershift-kubevirt-template',
            type: 'application',
            urls: [
              'https://stolostron.github.io/cluster-templates-manifests/hypershift-kubevirt-template-0.0.3.tgz',
            ],
            version: '0.0.3',
          },
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            created: '2023-06-15T12:57:53.10364994+02:00',
            description: 'A Helm chart which installs Hypershift cluster using KubeVirt platform',
            digest: 'f9dba9ee49c541c0610561b53dedb4330eec2b9f1f8b286df61fd1d004725321',
            name: 'hypershift-kubevirt-template',
            type: 'application',
            urls: [
              'https://stolostron.github.io/cluster-templates-manifests/hypershift-kubevirt-template-0.0.1.tgz',
            ],
            version: '0.0.1',
          },
        ],
        'hypershift-template': [
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            appVersion: '1.16.0',
            created: '2023-06-15T12:57:53.10423923+02:00',
            description: 'A Helm chart for Kubernetes',
            digest: '0ed6be0fd8c1586060aa2bee1d7c6381f155f014bfced1d4599d1de08081d592',
            name: 'hypershift-template',
            type: 'application',
            urls: [
              'https://stolostron.github.io/cluster-templates-manifests/hypershift-template-0.0.2.tgz',
            ],
            version: '0.0.2',
          },
          {
            annotations: {
              'cluster-template': 'true',
            },
            apiVersion: 'v2',
            appVersion: '1.16.0',
            created: '2023-06-15T12:57:53.104056555+02:00',
            description: 'A Helm chart for Kubernetes',
            digest: '5ec6d9847042c66663daad6e2f26d8abcf4d81e44260caf48571d1608c50b193',
            name: 'hypershift-template',
            type: 'application',
            urls: [
              'https://stolostron.github.io/cluster-templates-manifests/hypershift-template-0.0.1.tgz',
            ],
            version: '0.0.1',
          },
        ],
      },
      generated: '2023-06-15T12:57:53.103133157+02:00',
    },
    name: 'cluster-templates-manifests',
    url: 'https://stolostron.github.io/cluster-templates-manifests',
  },
  {
    error:
      'Get "https://dddd.com/index.yaml": x509: certificate has expired or is not yet valid: current time 2023-07-10T13:14:01Z is after 2023-01-14T23:59:59Z',
    name: 'ttt',
    url: 'https://dddd.com',
  },
];
