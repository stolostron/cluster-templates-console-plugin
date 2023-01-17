import { Flex, FlexItem, Form } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import SelectField, { SelectInputOption } from '../../helpers/SelectField';
import { useArgoCDSecrets } from '../../hooks/useArgoCDSecrets';
import {
  useHelmChartRepository,
  getRepoChartsMap,
  HelmRepositoryChartsMap,
} from '../../hooks/useHelmChartRepositories';

import { useTranslation } from '../../hooks/useTranslation';
import { getRepoOptionObject } from '../../utils/toWizardFormValues';
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
  const [argoCDSecrets, argoCDSecretsLoaded, argoCDSecretsError] = useArgoCDSecrets();

  const [helmRepository, helmRepositoryLoaded, helmRepositoryError] = useHelmChartRepository(
    repo.toString(),
  );

  // t('Failed to load repositories')
  useAddAlertOnError(argoCDSecretsError, 'Failed to load repositories');
  // t('Failed to load charts')
  useAddAlertOnError(helmRepositoryError, 'Failed to load charts');

  const error = argoCDSecretsError || helmRepositoryError;

  const repoOptions: SelectInputOption[] = React.useMemo(
    () =>
      argoCDSecrets.map((s) => ({
        value: getRepoOptionObject(s),
        disabled: false,
      })),
    [argoCDSecrets],
  );

  const chartsMap = React.useMemo<HelmRepositoryChartsMap>(() => {
    if (!helmRepository?.index || !repo) {
      return {};
    }
    return getRepoChartsMap(helmRepository.index);
  }, [helmRepository?.index, repo]);

  const chartOptions = React.useMemo<SelectInputOption[]>(() => {
    if (!helmRepository?.index || !repo) {
      return [];
    }
    return Object.keys(chartsMap).map((chart) => ({
      value: chart,
      disabled: false,
    }));
  }, [helmRepository?.index, chartsMap]);

  const versionOptions = React.useMemo<SelectInputOption[]>(() => {
    if (!chart || !chartsMap[chart]) {
      return [];
    }
    return chartsMap[chart].map((version) => ({
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
    if (!version && versionOptions.length === 1) {
      setVersion(versionOptions[0].value as string);
    }
  }, [version, versionOptions]);

  const fields = [
    <SelectField
      name={repoFieldName}
      options={repoOptions}
      isRequired
      label={t('HELM chart repository')}
      key={repoFieldName}
      loadingVariant={argoCDSecretsLoaded ? undefined : 'spinner'}
      isDisabled={argoCDSecretsError}
      validate={() => (repoError as unknown as RepoOptionObject)?.resourceName}
    />,
    <SelectField
      name={chartFieldName}
      options={chartOptions}
      isRequired
      label={t('HELM chart')}
      loadingVariant={helmRepositoryLoaded ? undefined : 'spinner'}
      isDisabled={!repo || !repo.resourceName || error}
      key={chartFieldName}
    />,
    <SelectField
      name={versionFieldName}
      label={t('HELM chart version')}
      key={versionFieldName}
      isDisabled={!chart || error}
      options={versionOptions}
    />,
  ];
  const helmFields = horizontal ? <WithFlex flexItems={fields} /> : <>{fields}</>;
  return <Form>{helmFields}</Form>;
};

export default HelmFields;
