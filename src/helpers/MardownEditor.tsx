import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/CodeEditor/code-editor';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { MarkdownView } from '@openshift-console/plugin-shared';
import { CodeIcon, EyeIcon } from '@patternfly/react-icons';
import { useTranslation } from '../hooks/useTranslation';

type MarkdownEditorProps = {
  code: string;
  onChange: (code: string) => void;
  height?: number;
};

function MarkdownEditor({ code, onChange, height = 400 }: MarkdownEditorProps) {
  const { t } = useTranslation();
  const [markdownPreviewActive, setMarkdownPreviewActive] = React.useState(false);
  const style = {
    //force active color on bottons so they won't look disabled
    color: 'var(--pf-c-button--m-control--active--Color)',
  };
  const markdownButton = (
    <Button
      onClick={() => setMarkdownPreviewActive(false)}
      isActive={!markdownPreviewActive}
      variant="control"
      aria-label="Edit description in markdown"
      style={style}
    >
      <CodeIcon /> {t('markdown').toUpperCase()}
    </Button>
  );
  const previewButton = (
    <Button
      onClick={() => setMarkdownPreviewActive(true)}
      isActive={markdownPreviewActive}
      variant="control"
      aria-label="Edit description in markdown"
      style={style}
    >
      <EyeIcon /> {t('preview').toUpperCase()}
    </Button>
  );
  const markdownPreviewClassName = '';
  return (
    <>
      <CodeEditor
        code={markdownPreviewActive ? undefined : code}
        height={`${height}px`}
        language={Language.markdown}
        onChange={onChange}
        isLanguageLabelVisible={false}
        isLineNumbersVisible={false}
        customControls={[markdownButton, previewButton]}
        showEditor={!markdownPreviewActive}
      />
      {markdownPreviewActive && (
        <div className={css(styles.codeEditor, markdownPreviewClassName)}>
          <div className={css(styles.codeEditorMain)} style={{ borderTop: 0 }}>
            <div className={css(styles.codeEditorCode)}>
              <div style={{ height, overflow: 'scroll' }}>
                <MarkdownView content={code} emptyMsg="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MarkdownEditor;
