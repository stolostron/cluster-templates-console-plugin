import {
  ClipboardCopy,
  clipboardCopyFunc,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Text,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const Credentials = ({
  username,
  password,
  serverUrl,
}: {
  username: string;
  password: string;
  serverUrl: string;
}) => {
  const { t } = useTranslation();
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>{t('Api URL')}</DescriptionListTerm>
        <DescriptionListDescription>
          <Text component="a" href={serverUrl} target="_blank" rel="noopener noreferrer">
            {serverUrl} <ExternalLinkAltIcon />
          </Text>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t('Username')}</DescriptionListTerm>
        <DescriptionListDescription>{username}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t('Password')}</DescriptionListTerm>
        <DescriptionListDescription>
          <ClipboardCopy isReadOnly onCopy={(event) => clipboardCopyFunc(event, password)}>
            &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
          </ClipboardCopy>
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};

export default Credentials;
