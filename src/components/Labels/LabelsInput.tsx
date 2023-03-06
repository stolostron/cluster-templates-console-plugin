/* Copyright Contributors to the Open Cluster Management project */

import { FormGroup, Label, TextInput } from '@patternfly/react-core';
import React from 'react';

export type LabelsInputProps = {
  name: string;
  label: React.ReactNode;
  value: Record<string, string> | undefined;
  onChange: (labels: Record<string, string> | undefined) => void;
  placeholder?: string;
  isDisabled?: boolean;
  helperText?: React.ReactNode;
};

export const LabelsInput = (props: LabelsInputProps) => {
  const [inputValue, setInputValue] = React.useState<string>();
  const inputRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null);

  const { value, name, helperText } = props;

  function addLabel(input: string) {
    /* istanbul ignore next */
    const newlabels = input
      .split(',')
      .join(' ')
      .split(' ')
      .map((label) => label.trim())
      .filter((label) => label !== '')
      .reduce(
        (value, label) => {
          const parts = label.split('=');
          if (parts.length === 1) {
            value[parts[0]] = '';
          } else {
            value[parts[0]] = parts.slice(1).join('=');
          }
          return value;
        },
        { ...props.value } as Record<string, string>,
      );
    props.onChange(newlabels);
  }

  function removeLabel(key: string) {
    /* istanbul ignore next */
    const newLabels: Record<string, string> = { ...props.value };
    delete newLabels[key];
    props.onChange(newLabels);
  }

  return (
    <>
      <FormGroup id={`${name}-label`} label={props.label} fieldId={name} helperText={helperText}>
        <div
          id={name}
          className="pf-c-form-control"
          style={{
            padding: 0,
            paddingTop: '1px',
            display: 'flex',
            alignItems: 'start',
            flexWrap: 'wrap',
            height: 'unset',
            minHeight: '36px',
            borderBottom: 'none',
          }}
          onClick={() => {
            setInputValue(undefined);
            /* istanbul ignore next */
            inputRef.current?.focus();
          }}
        >
          {value &&
            Object.keys(value).map((key) => (
              <Label
                className="label-pill"
                key={key}
                style={{ margin: 2 }}
                onClose={(e) => {
                  removeLabel(key);
                  /* istanbul ignore next */
                  e.detail === 0 && inputRef.current?.focus(); // only refocus on keyboard event, detail is 0 on key event
                }}
                closeBtnProps={{ id: `remove-${key}` }}
              >
                {key}
                {typeof value[key] === 'string' && value[key].trim() !== '' && `=${value[key]}`}
              </Label>
            ))}
          <TextInput
            ref={inputRef}
            style={{
              marginTop: '1px',
              borderTop: 'none',
              borderLeft: 'none',
              marginLeft: 0,
            }}
            id={name}
            placeholder={'Enter key=value, then press return, space, or comma to input the label.'}
            onChange={(value) => {
              setInputValue(value);
            }}
            onKeyDown={(e) => {
              switch (e.key) {
                case ' ':
                case ',':
                case 'Enter':
                  {
                    e.preventDefault();
                    e.stopPropagation();
                    // istanbul ignore else
                    if (inputValue) {
                      addLabel(inputValue);
                    }
                    const inputElement = e.target as HTMLInputElement;
                    setInputValue('');
                    inputElement.value = '';
                    setTimeout(() => (inputElement.value = ''), 0);
                  }
                  break;
                case 'Backspace':
                  /* istanbul ignore else */
                  if (!inputValue) {
                    const labels = document.querySelectorAll(
                      '.label-pill button',
                    ) as unknown as HTMLButtonElement[];
                    /* istanbul ignore else */
                    if (labels && labels.length > 0) {
                      labels[labels.length - 1].focus();
                    }
                  }
                  break;
              }
            }}
          />
        </div>
      </FormGroup>
    </>
  );
};
