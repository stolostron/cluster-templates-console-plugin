import { Flex, FlexItem } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import PopoverHelpIcon from '../../helpers/PopoverHelpIcon';
import SelectField, { SelectInputOption } from '../../helpers/SelectField';
import { useHelmRepositories } from '../../hooks/useHelmRepositories';

import {
  getRepoChartsMap,
  HelmRepositoryChartsMap,
  useHelmRepositoryIndex,
} from '../../hooks/useHelmRepositoryIndex';
import { useTranslation } from '../../hooks/useTranslation';
import { getRepoOptionObject } from '../../utils/toWizardFormValues';
import { sortByResourceName } from '../../utils/utils';
import { RepoOptionObject } from '../ClusterTemplateWizard/types';

const WithFlex = ({ flexItems }: { flexItems: React.ReactNode[] }) => {
  return (
    <Flex>
      {flexItems.map((item, index) => (
        <FlexItem key={index} grow={{ default: 'grow' }}>
          {item}
        </FlexItem>
      ))}
    </Flex>
  );
};

const HelmFields = ({
  fieldNamePrefix,
  horizontal = false,
}: {
  fieldNamePrefix: string;
  horizontal?: boolean;
}) => {
  const { t } = useTranslation();
  const repoFieldName = `${fieldNamePrefix}.repo`;
  const chartFieldName = `${fieldNamePrefix}.chart`;
  const versionFieldName = `${fieldNamePrefix}.version`;
  const [{ value: repo }, { error: repoError }] = useField<RepoOptionObject>(repoFieldName);
  const [{ value: chart }, , { setValue: setChart }] = useField<string>(chartFieldName);
  const [{ value: version }, , { setValue: setVersion }] = useField<string>(versionFieldName);
  const [repositories, repositoriesLoaded, repositoriesError] = useHelmRepositories();
  const [repoIndex, repoIndexLoaded, indexError] = useHelmRepositoryIndex();
  // t('Failed to load repositories')
  useAddAlertOnError(repositoriesError, 'Failed to load repositories');
  // t('Failed to load charts')
  useAddAlertOnError(indexError, 'Failed to load charts');
  const error = repositoriesError || indexError;

  const repoOptions: SelectInputOption[] = React.useMemo(() => {
    if (!repoIndexLoaded || !repositoriesLoaded) {
      return [];
    }
    const sortedRepos = sortByResourceName(repositories);
    return sortedRepos.map((r) => {
      const chartsMap = getRepoChartsMap(repoIndex, r.metadata?.name);
      return {
        value: getRepoOptionObject(r),
        disabled: false,
        description: t('{{numCharts}} HELM charts', { numCharts: Object.keys(chartsMap).length }),
      };
    });
  }, [repositories, repoIndex, repoIndexLoaded, repositoriesLoaded]);

  const chartsMap = React.useMemo<HelmRepositoryChartsMap>(() => {
    if (!repoIndex || !repo) {
      return {};
    }
    return getRepoChartsMap(repoIndex, repo.resourceName);
  }, [repoIndex, repo]);

  const chartOptions = React.useMemo<SelectInputOption[]>(() => {
    if (!repoIndex || !repo) {
      return [];
    }
    const charts = Object.keys(chartsMap).sort((chart1, chart2) => chart1.localeCompare(chart2));
    return charts.map((chart) => ({
      value: chart,
      disabled: false,
    }));
  }, [repoIndex, chartsMap]);

  const versionOptions = React.useMemo<SelectInputOption[]>(() => {
    if (!chart || !chartsMap[chart]) {
      return [];
    }
    const versions = chartsMap[chart].sort((v1, v2) =>
      v1.localeCompare(v2, undefined, { numeric: true }),
    );
    return versions.map((version) => ({
      value: version,
      disabled: false,
    }));
  }, [chartsMap, chart]);

  React.useEffect(() => {
    if (!chart && chartOptions.length === 1) {
      setChart(chartOptions[0].value as string);
    }
  }, [chart, chartOptions]);

  React.useEffect(() => {
    if (!version && versionOptions.length > 0) {
      setVersion(versionOptions[0].value as string);
    }
  }, [version, versionOptions]);

  const chartFieldDisabled = !repo || !repo.resourceName || error;
  const versionFieldDisabled = !chart || error;

  const fields = [
    <SelectField
      name={repoFieldName}
      options={repoOptions}
      isRequired
      label={t('HELM chart repository')}
      key={repoFieldName}
      loadingVariant={repositoriesLoaded && repoIndexLoaded ? undefined : 'spinner'}
      isDisabled={error}
      validate={() => (repoError as unknown as RepoOptionObject)?.resourceName}
      placeholderText={t('Select a HELM chart repository')}
      labelIcon={
        horizontal ? undefined : (
          <PopoverHelpIcon
            helpText={t(
              'Choose or add a new URL to your HELM repository to access the HELM chart you would like this cluster template to be based on.',
            )}
          />
        )
      }
    />,
    <SelectField
      name={chartFieldName}
      options={chartOptions}
      isRequired
      label={t('HELM chart')}
      isDisabled={chartFieldDisabled}
      key={chartFieldName}
      placeholderText={chartFieldDisabled ? t('Select a repository first') : t('Choose')}
    />,
    <SelectField
      name={versionFieldName}
      label={t('HELM chart version')}
      key={versionFieldName}
      isDisabled={versionFieldDisabled}
      options={versionOptions}
      isRequired
      placeholderText={
        chartFieldDisabled
          ? t('Select a repository first')
          : versionFieldDisabled
          ? t('Select a chart first')
          : ''
      }
    />,
  ];
  const helmFields = horizontal ? <WithFlex flexItems={fields} /> : <>{fields}</>;
  return <>{helmFields}</>;
};

export default HelmFields;
