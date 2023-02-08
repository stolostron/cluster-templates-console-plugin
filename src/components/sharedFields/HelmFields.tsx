import React from 'react';
import { HelmRepository } from '../../types';
import get from 'lodash/get';
import { useFormikContext } from 'formik';
import { useHelmChartRepositories } from '../../hooks/useHelmChartRepositories';
import HelmRepositoryField from './HelmRepositoryField';
import { useTranslation } from '../../hooks/useTranslation';
import SelectField from '../../helpers/SelectField';
import { Flex, FlexItem, SelectOptionObject } from '@patternfly/react-core';
import { useAlerts } from '../../alerts/AlertsContext';
import { humanizeUrl } from '../../utils/humanizing';
import { getErrorMessage } from '../../utils/utils';

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

const getChartToVersions = (repo?: HelmRepository): Record<string, string[]> | undefined => {
  if (!repo || !repo.index) {
    return undefined;
  }
  const map: Record<string, string[]> = {};
  for (const [key, charts] of Object.entries(repo.index.entries)) {
    map[key] = charts
      .map((chart) => chart.version)
      .sort((v1, v2) => v2.localeCompare(v1, undefined, { numeric: true }));
  }
  return map;
};

const HelmFields = ({ fieldName, horizontal }: { fieldName: string; horizontal: boolean }) => {
  const { t } = useTranslation();
  const { addAlert } = useAlerts();
  const { values, setFieldValue } = useFormikContext();
  const { repos, loaded, error } = useHelmChartRepositories();
  const prevUrl = React.useRef<string>();

  const chartFieldName = `${fieldName}.chart`;
  const versionFieldName = `${fieldName}.version`;
  const repoFieldName = `${fieldName}.url`;
  const url = get(values, repoFieldName) as string;
  const selectedRepo = url ? repos.find((repo) => repo.url === url) : undefined;
  const chartToVersions = getChartToVersions(selectedRepo);
  const chart = get(values, chartFieldName) as string;

  React.useEffect(() => {
    if (error) {
      addAlert({
        title: 'Failed to load Helm chart repositories',
        message: getErrorMessage(error),
      });
    }
  }, [addAlert, error]);

  React.useEffect(() => {
    if (loaded && url && !selectedRepo) {
      // t('Failed to initialize')
      addAlert({
        title: 'Failed to initialize',
        message: `Repositories list doesn't contain repository ${humanizeUrl(url)}`,
      });
    }
  }, [selectedRepo, loaded, url, addAlert]);

  React.useEffect(() => {
    if (prevUrl.current && url !== prevUrl.current) {
      //handle switch repository
      setFieldValue(chartFieldName, '');
      setFieldValue(versionFieldName, '');
    }
    prevUrl.current = url;
  }, [chartFieldName, setFieldValue, url, versionFieldName]);
  const fields = [
    <HelmRepositoryField
      fieldName={`${fieldName}.url`}
      key={`${fieldName}.url`}
      showLabelIcon={!horizontal}
    />,
    <SelectField
      name={chartFieldName}
      options={
        chartToVersions
          ? Object.keys(chartToVersions).sort((key1, key2) => key1.localeCompare(key2))
          : []
      }
      isRequired
      label={t('Helm chart')}
      isDisabled={!chartToVersions}
      key={chartFieldName}
      placeholderText={!chartToVersions ? t('Select a repository first') : t('Select a chart')}
      onSelectValue={(chart: string | SelectOptionObject) => {
        if (
          chartToVersions &&
          chartToVersions[chart.toString()] &&
          chartToVersions[chart.toString()].length
        ) {
          setFieldValue(versionFieldName, chartToVersions[chart.toString()][0]);
        }
      }}
      loaded={loaded}
    />,
    <SelectField
      name={versionFieldName}
      label={t('Helm chart version')}
      key={versionFieldName}
      isDisabled={!chartToVersions || !chart}
      options={chart && chartToVersions && chartToVersions[chart] ? chartToVersions[chart] : []}
      isRequired
      placeholderText={
        !selectedRepo ? t('Select a repository first') : !chart ? t('Select a chart first') : ''
      }
      loaded={loaded}
    />,
  ];
  return horizontal ? <WithFlex flexItems={fields} /> : <>{fields}</>;
};

export default HelmFields;
