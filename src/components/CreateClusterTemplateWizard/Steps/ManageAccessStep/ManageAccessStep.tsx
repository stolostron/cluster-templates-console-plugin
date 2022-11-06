/* Copyright Contributors to the Open Cluster Management project */
import { Stack, StackItem, Text, TextContent } from '@patternfly/react-core';
import React from 'react';

import AccessCardsArray from './AccessCardsArray';
export const ManageAccessStep = () => {
  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Stack hasGutter>
            <StackItem>
              <Text component="h2">Manage access</Text>
            </StackItem>
            <StackItem>
              Choose users or group of users who can create a cluster using the templates which are
              associated with this repository. Limit the number of clusters that can be created from
              this template.
            </StackItem>
          </Stack>
        </TextContent>
      </StackItem>
      <StackItem>
        <AccessCardsArray />
      </StackItem>
    </Stack>
  );
};

export default ManageAccessStep;
