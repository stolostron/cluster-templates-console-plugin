import pickBy from 'lodash/pickBy';
import groupBy from 'lodash/groupBy';
import set from 'lodash/set';
import get from 'lodash/get';
import { SchemaOf } from 'yup';

type InnerError = { path: string; message: string };
type InnerErrors = { inner: InnerError[] };
type FieldErrors = { [key: string]: string[] };

const fieldErrorReducer = (errors: InnerError[]): FieldErrors => {
  return errors.reduce<FieldErrors>(
    (memo, { path, message }) => ({
      ...memo,
      [path]: (memo[path] || []).concat(message),
    }),
    {},
  );
};

export const getDuplicates = (list: string[]): string[] => {
  const duplicateKeys = pickBy(groupBy(list), (x) => x.length > 1);
  return Object.keys(duplicateKeys);
};

export const getRichTextValidation =
  <T>(schema: SchemaOf<T>) =>
  async (values: T): Promise<FieldErrors | undefined> => {
    try {
      await schema.validate(values, {
        abortEarly: false,
      });
    } catch (e) {
      const { inner } = e as InnerErrors;
      if (!inner || inner.length === 0) {
        return {};
      }

      const baseFields: InnerError[] = [];
      const arraySubfields: InnerError[] = [];

      inner.forEach((item) => {
        const isArraySubfield = /\.|\[/.test(item.path);
        if (isArraySubfield) {
          arraySubfields.push(item);
        } else {
          baseFields.push(item);
        }
      });

      const fieldErrors = fieldErrorReducer(baseFields);
      if (arraySubfields.length === 0) {
        return fieldErrors;
      }

      // Now we need to convert the fieldArray errors to the parent object
      // eg. items[0].thumbprint --> { items: [{ thumbprint: ['subField error'] }]}
      const arrayErrors: { [key: string]: string[] } = {};
      arraySubfields.forEach((field) => {
        const prevMessages = get(arrayErrors, field.path);
        set(
          arrayErrors,
          field.path,

          prevMessages ? [...prevMessages, field.message] : [field.message],
        );
      });
      return { ...fieldErrors, ...arrayErrors };
    }
  };
