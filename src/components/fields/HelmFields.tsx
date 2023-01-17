import { Flex, FlexItem, Form } from '@patternfly/react-core';
import { useField } from 'formik';
import { InputField } from 'formik-pf';
import * as React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import SelectField from '../../helpers/SelectField';
import { useArgoCDSecrets } from '../../hooks/useArgoCDSecrets';
import {
  useHelmChartRepository,
  getRepoCharts,
  HelmChartRepositoryResult,
} from '../../hooks/useHelmChartRepositories';
import { useTranslation } from '../../hooks/useTranslation';

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
  const repoFieldName = `${fieldNamePrefix}.repoURL`;
  const chartFieldName = `${fieldNamePrefix}.chart`;
  const versionFieldName = `${fieldNamePrefix}.version`;
  const [{ value: repo }] = useField<string>(repoFieldName);
  const [{ value: chart }, , { setValue: setChart }] = useField<string>(chartFieldName);
  const [argoCDSecrets, argoCDSecretsLoaded, argoCDSecretsError] = useArgoCDSecrets();
  const [[helmRepository, helmRepositoryLoaded, helmRepositoryError], setRepositoriesResult] =
    React.useState<HelmChartRepositoryResult>();

  // t('Failed to load repositories')
  useAddAlertOnError(argoCDSecretsError, 'Failed to load repositories');
  // t('Failed to load charts')
  useAddAlertOnError(helmRepositoryError, 'Failed to load charts');

  const repoOptions = argoCDSecrets.map((r) => ({
    value: r.metadata?.name || '',
    label: r.metadata?.name || '',
    disabled: false,
  }));

  const chartsFromRepo = helmRepository.index ? getRepoCharts(helmRepository.index) : [];
  const firstChart = chartsFromRepo[0]?.name;

  React.useEffect(() => {
    const helmChartRepositoryResult = useHelmChartRepository(repo);
    console.log(helmChartRepositoryResult[0]);
    setRepositoriesResult(helmChartRepositoryResult);
  }, [repo]);

  React.useEffect(() => {
    if (helmRepositoryLoaded && repo && !chart && firstChart) {
      setChart(firstChart);
    }
  }, [helmRepositoryLoaded, firstChart, repo, chart]);

  const chartOptions = chartsFromRepo.map((c) => ({
    value: c.name,
    label: c.name,
    disabled: false,
  }));

  const fields = [
    <SelectField
      name={repoFieldName}
      options={repoOptions}
      isRequired
      label={t('HELM chart repository')}
      key={repoFieldName}
      loadingVariant={argoCDSecretsLoaded ? undefined : 'spinner'}
      isDisabled={argoCDSecretsError}
    />,
    <SelectField
      name={chartFieldName}
      options={chartOptions}
      isRequired
      label={t('HELM chart')}
      isDisabled={!repo}
      key={chartFieldName}
      loadingVariant={helmRepositoryLoaded ? undefined : 'spinner'}
    />,
    <InputField
      name={versionFieldName}
      fieldId={versionFieldName}
      label={t('HELM chart version')}
      key={versionFieldName}
    />,
  ];
  const helmFields = horizontal ? <WithFlex flexItems={fields} /> : <>{fields}</>;
  return <Form>{helmFields}</Form>;
};

export default HelmFields;
