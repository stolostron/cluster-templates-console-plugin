import { SelectOptionObject } from '@patternfly/react-core';
import isString from 'lodash/isString';

export const isOptionObject = (value: SelectOptionObject | string): value is SelectOptionObject =>
  !!value.toString;

export const getOptionValueStr = (value: SelectOptionObject | string) =>
  isOptionObject(value) ? value.toString() : value;

export const selectValuesEqual = (
  value1: SelectOptionObject | string,
  value2: SelectOptionObject | string,
): boolean => {
  if (isOptionObject(value1) && isOptionObject(value2)) {
    return value1.toString() == value2.toString();
  }
  if (isString(value1) && isString(value2)) {
    return value1 === value2;
  }
  return false;
};
