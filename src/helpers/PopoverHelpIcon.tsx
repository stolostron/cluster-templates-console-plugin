import { Button, Flex, FlexItem, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import './styles.css';

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
      style={{ display: 'inline' }}
    >
      <OutlinedQuestionCircleIcon noVerticalAlign={noVerticalAlign} />
    </Button>
  </Popover>
);

export const WithHelpIcon = ({
  children,
  helpText,
  noVerticalAlign,
}: {
  children: React.ReactNode;
  helpText?: React.ReactNode;
  noVerticalAlign?: boolean;
}) =>
  helpText ? (
    <Flex>
      <FlexItem spacer={{ default: 'spacerXs' }}>{children}</FlexItem>
      <FlexItem>
        <PopoverHelpIcon helpText={helpText} noVerticalAlign={noVerticalAlign} />
      </FlexItem>
    </Flex>
  ) : (
    <>{children}</>
  );

export default PopoverHelpIcon;
