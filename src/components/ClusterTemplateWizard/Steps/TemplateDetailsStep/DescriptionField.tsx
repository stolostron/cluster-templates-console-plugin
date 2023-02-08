import * as React from 'react';
import { useField } from 'formik';
import { FormGroup } from '@patternfly/react-core';
import { CodeEditor, CodeEditorControl, Language } from '@patternfly/react-code-editor';
import { Trans } from 'react-i18next';
import { MarkdownView } from '@openshift-console/plugin-shared';
import { PlayIcon } from '@patternfly/react-icons';
import { useTranslation } from '../../../../hooks/useTranslation';

const HelperText = () => (
  <Trans ns="plugin__clustertemplates-plugin">
    Describe when and how to use this template, what are the preconditions of using it, and add
    links to relevant documentation if needed.{' '}
    <a href="https://www.google.com">See formatting instructions</a>
  </Trans>
);

const DescriptionField = () => {
  const name = 'details.description';
  const { t } = useTranslation();
  const [field, { error, touched }, { setValue }] = useField<string>(name);
  const isValid = !error && !touched;
  const [markdownPreviewActive, setMarkdownPreviewActive] = React.useState(false);

  const markdownPreviewControls = React.useMemo(
    () => [
      <CodeEditorControl
        key="markdown"
        icon={<PlayIcon />}
        aria-label="Markdown"
        tooltipProps={{ content: 'Edit description with markdown' }}
        onClick={() => setMarkdownPreviewActive(false)}
        isVisible
      />,
      <CodeEditorControl
        key="preview"
        icon={<PlayIcon />}
        aria-label="Preview"
        tooltipProps={{ content: 'Preview the description' }}
        onClick={() => setMarkdownPreviewActive(true)}
        isVisible
      />,
    ],
    [],
  );

  return (
    <>
      <FormGroup
        fieldId={name}
        label={t('Description')}
        helperText={<HelperText />}
        helperTextInvalid={error}
        validated={isValid ? 'default' : 'error'}
      >
        <CodeEditor
          code={markdownPreviewActive ? undefined : field.value}
          height="300px"
          language={Language.markdown}
          onChange={(code) => setValue(code)}
          isLanguageLabelVisible={false}
          isLineNumbersVisible={false}
          customControls={markdownPreviewControls}
          showEditor={!markdownPreviewActive}
          emptyState={
            markdownPreviewActive && <MarkdownView content={field.value} emptyMsg="This is empty" />
          }
        />
      </FormGroup>
    </>
  );
};

export default DescriptionField;
