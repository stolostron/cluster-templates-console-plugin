import React from 'react';
import { HelmRepository } from '../../types';
import get from 'lodash/get';
import { useFormikContext } from 'formik';
import { HelmChartRepositoryListResult } from '../../hooks/useHelmChartRepositories';
import HelmRepositoryField from './HelmRepositoryField';
import { useTranslation } from '../../hooks/useTranslation';
import SelectField from '../../helpers/SelectField';
import { Flex, FlexItem } from '@patternfly/react-core';
import Loader from '../../helpers/Loader';

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
  reposListResult,
  horizontal,
}: {
  reposListResult: HelmChartRepositoryListResult;
  fieldNamePrefix: string;
  horizontal: boolean;
}) => {
  const chartFieldName = `${fieldNamePrefix}.chart`;
  const versionFieldName = `${fieldNamePrefix}.version`;
  const { values, setFieldValue } = useFormikContext();
  const { t } = useTranslation();
  const [chartToVersions, setChartToVersions] = React.useState<Record<string, string[]>>();
  const chart = get(values, chartFieldName);
  const [, loaded] = reposListResult;
  const clearChartFields = () => {
    setFieldValue(chartFieldName, '');
    setFieldValue(versionFieldName, '');
  };

  const setRepo = (repo: HelmRepository): Record<string, string[]> => {
    let chartToVersions: Record<string, string[]> = undefined;
    if (!repo.index) {
      clearChartFields();
    } else {
      const map: Record<string, string[]> = {};
      for (const [key, charts] of Object.entries(repo.index.entries)) {
        map[key] = charts
          .map((chart) => chart.version)
          .sort((v1, v2) => v2.localeCompare(v1, undefined, { numeric: true }));
      }
      chartToVersions = map;
    }
    setChartToVersions(chartToVersions);
    return chartToVersions;
  };

  const onSelectRepo = (repo: HelmRepository) => {
    setRepo(repo);
    clearChartFields();
  };

  const onInitializeRepo = (repo: HelmRepository | undefined) => {
    if (repo) {
      setRepo(repo);
    } else {
      clearChartFields();
    }
  };

  const fields = [
    <HelmRepositoryField
      fieldName={`${fieldNamePrefix}.url`}
      key={`${fieldNamePrefix}.url`}
      reposListResult={reposListResult}
      showLabelIcon={!horizontal}
      onSelectRepo={onSelectRepo}
      onInitializeRepo={onInitializeRepo}
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
      onSelectValue={(chart: string) => {
        if (chartToVersions[chart] && chartToVersions[chart].length) {
          setFieldValue(versionFieldName, chartToVersions[chart][0]);
        }
      }}
    />,
    <SelectField
      name={versionFieldName}
      label={t('Helm chart version')}
      key={versionFieldName}
      isDisabled={!chartToVersions || !chart}
      options={chart && chartToVersions ? chartToVersions[chart] : []}
      isRequired
      placeholderText={
        !chartToVersions ? t('Select a repository first') : !chart ? t('Select a chart first') : ''
      }
    />,
  ];
  const helmFields = horizontal ? <WithFlex flexItems={fields} /> : <>{fields}</>;
  return <Loader loaded={loaded}>{helmFields}</Loader>;
};

export default HelmFields;
