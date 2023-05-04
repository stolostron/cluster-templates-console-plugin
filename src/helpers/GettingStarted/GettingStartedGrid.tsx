import * as React from 'react';
import {
  Card,
  CardHeader,
  CardActions,
  CardTitle,
  CardBody,
  Title,
  TitleSizes,
  Dropdown,
  DropdownItem,
  KebabToggle,
} from '@patternfly/react-core';
import { useTranslation } from '../../hooks/useTranslation';
import './GettingStartedGrid.scss';

interface GettingStartedGridProps {
  onHide?: () => void;
  children?: React.ReactNode[];
}

const GettingStartedGrid = ({ onHide, children }: GettingStartedGridProps) => {
  const { t } = useTranslation();

  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const onToggle = () => setMenuIsOpen((open) => !open);

  const actionDropdownItem: unknown[] = [];

  if (onHide) {
    actionDropdownItem.push(
      <DropdownItem
        key="action"
        component="button"
        description={t(
          'You can always bring these getting started resources back into view by clicking Show getting started resources in the page heading.',
        )}
        onClick={onHide}
        data-test="hide"
      >
        {t('Hide from view')}
      </DropdownItem>,
    );
  }

  return (
    <Card data-test="getting-started">
      <CardHeader>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg} data-test="title">
            {t('Getting started')}
          </Title>
        </CardTitle>
        {actionDropdownItem.length > 0 ? (
          <CardActions>
            <Dropdown
              isOpen={menuIsOpen}
              isPlain
              toggle={<KebabToggle onToggle={onToggle} data-test="actions" />}
              position="right"
              dropdownItems={actionDropdownItem}
              className="cluster-templates-getting-started-grid__action-dropdown"
            />
          </CardActions>
        ) : null}
      </CardHeader>
      <CardBody className="cluster-templates-getting-started-grid__content">{children}</CardBody>
    </Card>
  );
};

export default GettingStartedGrid;
