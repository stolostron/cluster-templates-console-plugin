import * as React from 'react';
import { useField } from 'formik';
import classNames from 'classnames';
import {
  FormGroup,
  HelperTextItem,
  TextInput,
  HelperText as PFHelperText,
  HelperTextItemProps,
  Popover,
  PopoverPosition,
  InputGroup,
  Button,
  TextInputTypes,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  CheckIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  TimesIcon,
} from '@patternfly/react-icons';
import { global_palette_green_500 as okColor } from '@patternfly/react-tokens/dist/js/global_palette_green_500';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import { global_palette_blue_300 as blueInfoColor } from '@patternfly/react-tokens/dist/js/global_palette_blue_300';

import './RichInputField.css';
import HelperText from './HelperText';
import { FieldProps } from './types';

const getHelperTextVariant = (
  validationMessage: string,
  value: RichValidationProps['value'],
  errors: RichValidationProps['error'],
): {
  variant: HelperTextItemProps['variant'];
  icon?: HelperTextItemProps['icon'];
} => {
  if (!value) {
    return { variant: 'indeterminate' };
  } else if (errors?.includes(validationMessage)) {
    return { variant: 'error', icon: <TimesIcon /> };
  }
  return { variant: 'success', icon: <CheckIcon /> };
};

type RichValidationProps = {
  // eslint-disable-next-line
  value: any;
  error: string | undefined;
  richValidationMessages: { [key: string]: string };
};

export const RichValidation: React.FC<RichValidationProps> = ({
  value,
  error,
  richValidationMessages,
}) => {
  return (
    <PFHelperText component="ul" className="rich-input__rules">
      {Object.keys(richValidationMessages).map((key) => {
        const variant = getHelperTextVariant(richValidationMessages[key], value, error);
        return (
          <HelperTextItem key={key} isDynamic component="li" {...variant}>
            {richValidationMessages[key]}
          </HelperTextItem>
        );
      })}
    </PFHelperText>
  );
};

type RichInputFieldPropsProps = {
  // eslint-disable-next-line
  type?: TextInputTypes;
  placeholder?: string;
  showErrorMessage?: boolean;
  richValidationMessages: { [key: string]: string };
  isDisabled?: boolean;
} & FieldProps;

// eslint-disable-next-line react/display-name
const RichInputField = React.forwardRef(
  (
    {
      label,
      labelIcon,
      helperText,
      isRequired,
      richValidationMessages,
      isDisabled = false,
      ...props
    }: RichInputFieldPropsProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [{ onChange }, { error, value, touched }, { setTouched }] = useField({
      name: props.name,
    });

    const isValid = !touched || !error?.length;
    return (
      <FormGroup
        fieldId={props.name}
        label={label}
        helperText={
          typeof helperText === 'string' ? (
            helperText
          ) : (
            <HelperText fieldId={props.name}>{helperText}</HelperText>
          )
        }
        validated={isValid ? 'default' : 'error'}
        isRequired={isRequired}
        labelIcon={labelIcon}
      >
        <InputGroup
          className={classNames('rich-input__group', { 'rich_input__group--invalid': !isValid })}
        >
          <TextInput
            value={value}
            ref={ref}
            name={props.name}
            isRequired={isRequired}
            aria-describedby={`${props.name}-helper`}
            onChange={(value, event) => {
              !popoverOpen && setPopoverOpen(true);
              setTouched(true, false);
              onChange(event);
            }}
            className="rich-input__text"
            onBlur={() => setPopoverOpen(false)}
            autoComplete="off"
            isDisabled={isDisabled}
          />
          <Popover
            isVisible={popoverOpen}
            shouldClose={() => setPopoverOpen(false)}
            shouldOpen={() => setPopoverOpen(true)}
            aria-label="validation popover"
            position={PopoverPosition.top}
            bodyContent={
              <RichValidation
                value={value}
                error={error}
                richValidationMessages={richValidationMessages as Record<string, string>}
              />
            }
          >
            {!isDisabled && (
              <Button variant="plain" aria-label="Validation">
                {!isValid ? (
                  <ExclamationCircleIcon color={dangerColor.value} />
                ) : value ? (
                  <CheckCircleIcon color={okColor.value} />
                ) : (
                  <InfoCircleIcon color={blueInfoColor.value} />
                )}
              </Button>
            )}
          </Popover>
        </InputGroup>
      </FormGroup>
    );
  },
);

export default RichInputField;