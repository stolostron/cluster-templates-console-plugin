import React from 'react';
import {
  clusterRoleGroupVersionKind,
  clusterTemplatesRoleRef,
  groupGVK,
  userGVK,
} from '../../../constants';
import InlineResourceLink from '../../../helpers/InlineResourceLink';
import MultiSelectField from '../../../helpers/MultiSelectField';
import PopoverHelpIcon from '../../../helpers/PopoverHelpIcon';
import { SelectInputOption } from '../../../helpers/SelectField';
import { useTranslation } from '../../../hooks/useTranslation';

import { sortByResourceName } from '../../../utils/utils';
import CellLoader from '../../../helpers/CellLoader';
import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Group, User } from '../../../types';

export const useUsers = () => {
  return useK8sWatchResource<User[]>({
    groupVersionKind: userGVK,
    isList: true,
  });
};

export const useGroups = () =>
  useK8sWatchResource<Group[]>({
    groupVersionKind: groupGVK,
    isList: true,
  });

const getOptions = (resources: K8sResourceCommon[]): SelectInputOption[] =>
  sortByResourceName(resources).map((resource) => ({
    value: resource.metadata?.name,
    disabled: false,
  }));

const UsersHelpText = () => {
  const { t } = useTranslation();
  return (
    <>
      {t('Create a RoleBinding granting the selected users the ')}
      <InlineResourceLink
        groupVersionKind={clusterRoleGroupVersionKind}
        name={clusterTemplatesRoleRef.name}
      />
      {t(
        ' role in the selected namespace. This role provides the minimum permissions needed for using the cluster templates.',
      )}
    </>
  );
};

export const UsersField = () => {
  const [users, loaded, error] = useUsers();
  const { t } = useTranslation();
  const userOptions = React.useMemo<SelectInputOption[]>(() => getOptions(users), [users]);
  return (
    <CellLoader loaded={loaded} error={error}>
      <MultiSelectField
        name="users"
        label={t('Grant quota to specific user(s)')}
        labelIcon={<PopoverHelpIcon helpText={<UsersHelpText />} />}
        options={userOptions}
        createText={t('Add')}
        isCreatable={true}
      />
    </CellLoader>
  );
};

export const GroupsField = () => {
  const { t } = useTranslation();
  const [groups, loaded, error] = useGroups();
  const groupOptions = React.useMemo<SelectInputOption[]>(() => getOptions(groups), [groups]);
  return (
    <CellLoader loaded={loaded} error={error}>
      <MultiSelectField
        name="groups"
        label={t('Grant quota to specific group(s)')}
        labelIcon={<PopoverHelpIcon helpText={<UsersHelpText />} />}
        options={groupOptions}
        isCreatable={true}
        createText={t('Add')}
      />
    </CellLoader>
  );
};
