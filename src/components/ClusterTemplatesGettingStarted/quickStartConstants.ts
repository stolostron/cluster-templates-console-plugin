export const quickStartsData = {
  shareTemplate: {
    name: 'share-cluster-template-qs',
    //t('Share this template')
    title: 'Give access to a cluster template',
  },
  createTemplate: {
    name: 'create-cluster-template-qs',
    //t('Create a new cluster template')
    title: 'Create a new cluster template',
  },
  createQuota: {
    name: 'create-cluster-template-quota-qs',
    //t('Limit cluster template access using quotas')
    title: 'Limit cluster template access using quotas',
  },
};

export type QuickStartKey = keyof typeof quickStartsData;
