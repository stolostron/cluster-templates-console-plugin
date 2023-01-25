import React from 'react';
import {
  clusterRoleGroupVersionKind,
  clusterTemplatesRoleRef,
  groupGVK,
  userGVK,
} from '../../../constants';
import InlineResourceLink from '../../../helpers/Links';
import MultiSelectField from '../../../helpers/MultiSelectField';
import { useTranslation } from '../../../hooks/useTranslation';

import { getSortedResourceNames } from '../../../utils/utils';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Group, User } from '../../../types';
import { useAddAlertOnError } from '../../../alerts/useAddAlertOnError';
import { Trans } from 'react-i18next';
import { FormSection, Text } from '@patternfly/react-core';

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

export const UsersField = () => {
  const { t } = useTranslation();
  const [users, loaded, error] = useUsers();
  // t('Failed to load users')
  useAddAlertOnError(error, 'Failed to load users');
  return (
    <MultiSelectField
      name="users"
      label={t('Grant quota to specific user(s)')}
      options={getSortedResourceNames(users)}
      createText={t('Add')}
      isCreatable={true}
      loadingVariant={loaded ? undefined : 'spinner'}
      isDisabled={!!error}
      placeholderText={t('Type or select user names')}
    />
  );
};

export const GroupsField = () => {
  const { t } = useTranslation();
  const [groups, loaded, error] = useGroups();
  // t('Failed to load groups')
  useAddAlertOnError(error, 'Failed to load groups');
  return (
    <MultiSelectField
      name="groups"
      label={t('Grant quota to specific group(s)')}
      options={getSortedResourceNames(groups)}
      isCreatable={true}
      createText={t('Add')}
      loadingVariant={loaded ? undefined : 'spinner'}
      isDisabled={!!error}
      placeholderText={t('Type or select group names')}
    />
  );
};

const AccessFieldsDescription = () => {
  return (
    <Text>
      <Trans ns="plugin__clustertemplates-plugin">
        Create a RoleBinding granting the selected users the{' '}
        <InlineResourceLink
          groupVersionKind={clusterRoleGroupVersionKind}
          name={clusterTemplatesRoleRef.name}
        />{' '}
        role in the selected namespace. This role provides the minimum permissions needed for using
        the cluster templates.
      </Trans>
    </Text>
  );
};

const AccessFields = () => {
  const { t } = useTranslation();
  return (
    <FormSection title={t('Permissions (optional)')}>
      <AccessFieldsDescription />
      <GroupsField />
      <UsersField />
    </FormSection>
  );
};

export default AccessFields;
