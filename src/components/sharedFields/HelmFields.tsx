import { Flex, FlexItem, Form } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import { useAddAlertOnError } from '../../alerts/useAddAlertOnError';
import SelectField, { SelectInputOption } from '../../helpers/SelectField';
import { useHelmRepositories } from '../../hooks/useHelmRepositories';

import {
  getRepoChartsMap,
  HelmRepositoryChartsMap,
  useHelmRepositoryIndex,
} from '../../hooks/useHelmRepositoryIndex';
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
  const [repositories, repositoriesLoaded, repositoriesError] = useHelmRepositories();
  const [repoIndex, , indexError] = useHelmRepositoryIndex();
  // t('Failed to load repositories')
  useAddAlertOnError(repositoriesError, 'Failed to load repositories');
  // t('Failed to load charts')
  useAddAlertOnError(indexError, 'Failed to load charts');
  const error = repositoriesError || indexError;

  const repoOptions: SelectInputOption[] = React.useMemo(
    () =>
      repositories.map((r) => ({
        value: getRepoOptionObject(r),
        disabled: false,
      })),
    [repositories],
  );

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
    return Object.keys(chartsMap).map((chart) => ({
      value: chart,
      disabled: false,
    }));
  }, [repoIndex, chartsMap]);

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
      loadingVariant={repositoriesLoaded ? undefined : 'spinner'}
      isDisabled={error}
      validate={() => (repoError as unknown as RepoOptionObject)?.resourceName}
    />,
    <SelectField
      name={chartFieldName}
      options={chartOptions}
      isRequired
      label={t('HELM chart')}
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
