export const quickStartsData = {
  shareTemplate: {
    name: 'share-template-qs',
    //t('Share this template')
    title: 'Share this template',
  },
  createTemplate: {
    name: 'create-cluster-template-qs',
    //t('Create a new cluster template')
    title: 'Create a new cluster template',
  },
  createQuota: {
    name: 'create-quota-qs',
    //t('Limit cluster template access using quotas')
    title: 'Limit cluster template access using quotas',
  },
};

export type QuickStartKey = keyof typeof quickStartsData;
