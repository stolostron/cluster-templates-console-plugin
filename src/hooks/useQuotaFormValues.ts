import { QuotaFormValues, AllowedTemplateFormValues } from '../types/quotaFormTypes';
import { ClusterTemplate, Quota, QuotaAllowedTemplate } from '../types/resourceTypes';
import { useClusterTemplates } from './useClusterTemplates';

export const getNewAllowedTemplate = (
  quotaBudget: number | undefined,
): AllowedTemplateFormValues => ({
  template: '',
  showCost: !!quotaBudget,
  showCount: false,
});

const toAllowedTemplateFormValues = (
  allowedTemplate: QuotaAllowedTemplate,
  allTemplates: ClusterTemplate[],
  quotaBudget: number | undefined,
): AllowedTemplateFormValues | undefined => {
  const template = allTemplates.find(
    (template) => allowedTemplate.name === template.metadata?.name,
  );
  return template
    ? {
        template: allowedTemplate.name,
        count: allowedTemplate.count,
        cost: template.spec?.cost,
        showCost: !!quotaBudget,
        showCount: !!template.spec?.cost,
      }
    : undefined;
};

const toQuotaFormValues = (
  allTemplates: ClusterTemplate[],
  originalQuota?: Quota,
): QuotaFormValues => ({
  name: originalQuota?.metadata?.name || '',
  limitByBudget: !!originalQuota?.spec?.budget,
  budget: originalQuota?.spec?.budget,
  namespace: originalQuota?.metadata?.namespace || '',
  templates: originalQuota?.spec?.allowedTemplates.reduce<AllowedTemplateFormValues[]>(
    (prev, allowedTemplate) => {
      const quotaTemplateFormValues = toAllowedTemplateFormValues(
        allowedTemplate,
        allTemplates,
        originalQuota?.spec?.budget,
      );
      return quotaTemplateFormValues ? [...prev, quotaTemplateFormValues] : prev;
    },
    [],
  ) || [getNewAllowedTemplate(originalQuota?.spec?.budget)],
  isCreateFlow: !originalQuota,
});

export const useQuotaFormValues = (
  quota?: Quota,
): [QuotaFormValues | undefined, boolean, unknown] => {
  const [allTemplates, loaded, error] = useClusterTemplates();
  if (!loaded || error) {
    return [undefined, loaded, error];
  }
  return [toQuotaFormValues(allTemplates, quota), true, null];
};
