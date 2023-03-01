/* Copyright Contributors to the Open Cluster Management project */

import { Label, LabelGroup } from '@patternfly/react-core';
import React from 'react';
import { Fragment, useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { css } from '@patternfly/react-styles';
import { MetadataLabels } from '../../types/resourceTypes';

export function Labels(props: {
  labels?: MetadataLabels;
  collapse?: string[];
  collapsedText?: string;
  expandedText?: string;
  allCollapsedText?: string;
}) {
  const { t } = useTranslation();
  const labelsRecord: MetadataLabels = useMemo(() => {
    return props.labels ? props.labels : {};
  }, [props.labels]);

  const labels: string[] = useMemo(() => {
    return Object.keys(labelsRecord)
      .filter((key) => !props.collapse?.includes(key))
      .map((key: string) => (labelsRecord[key] ? `${key}=${labelsRecord[key]}` : `${key}`));
  }, [labelsRecord, props.collapse]);

  const hidden: string[] = useMemo(() => {
    if (props.labels === undefined) return [];
    return Object.keys(labelsRecord)
      .filter((key) => props.collapse?.includes(key))
      .map((key: string) => (labelsRecord[key] ? `${key}=${labelsRecord[key]}` : `${key}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelsRecord, props.collapse]);

  /* istanbul ignore next */
  let collapsedText = props.collapsedText ?? t('{{count}} more', { count: hidden.length });

  if (hidden.length > 0 && labels.length === 0 && props.allCollapsedText) {
    collapsedText = props.allCollapsedText;
  }

  /* istanbul ignore next */
  const expandedText = props.expandedText ?? t('Show less');

  if (props.labels === undefined) return <Fragment />;

  return (
    <LabelGroup numLabels={labels.length} expandedText={expandedText} collapsedText={collapsedText}>
      {[...hidden, ...labels].map((label) => (
        <Label
          key={label}
          className={css({
            inlineLongLabel: { display: 'inline-grid', '--pf-c-label__text--MaxWidth': 'unset' },
          })}
          isTruncated
        >
          {label}
        </Label>
      ))}
    </LabelGroup>
  );
}
