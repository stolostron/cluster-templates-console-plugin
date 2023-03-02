import { Button, Flex, FlexItem, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';

const PopoverHelpIcon = ({
  helpText,
  noVerticalAlign = false,
}: {
  helpText: React.ReactNode;
  noVerticalAlign?: boolean;
}) => (
  <Popover bodyContent={helpText}>
    <Button
      variant="plain"
      aria-label="More info"
      onClick={(e) => e.preventDefault()}
      className="pf-c-form__group-label-help"
      isInline
    >
      <OutlinedQuestionCircleIcon noVerticalAlign={noVerticalAlign} />
    </Button>
  </Popover>
);

export const WithHelpIcon = ({
  children,
  helpText,
}: {
  children: React.ReactNode;
  helpText: React.ReactNode;
}) =>
  helpText ? (
    <Flex>
      <FlexItem spacer={{ default: 'spacerXs' }}>{children}</FlexItem>
      <FlexItem>
        <PopoverHelpIcon helpText={helpText} />
      </FlexItem>
    </Flex>
  ) : (
    <>{children}</>
  );

export default PopoverHelpIcon;
