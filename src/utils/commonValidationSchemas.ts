import { TFunction } from 'i18next';
import { string as stringSchema } from 'yup';

const NAME_REGEX = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

export const nameSchema = (t: TFunction) =>
  stringSchema().matches(
    NAME_REGEX,
    t('Expected value matches regular expression: {{regex}}', {
      regex: NAME_REGEX,
    }),
  );
