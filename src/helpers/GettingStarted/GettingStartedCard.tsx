import * as React from 'react';
import {
  Flex,
  FlexItem,
  Text,
  TextVariants,
  Title,
  TitleSizes,
  SimpleList,
  Skeleton,
  SimpleListItem,
} from '@patternfly/react-core';

import './GettingStartedCard.scss';

export interface GettingStartedLink {
  id: string;
  loading?: boolean;
  title?: string | React.ReactElement;
  /** OnClick callback for the SimpleList item */
  onClick: (event: React.MouseEvent | React.ChangeEvent) => void;
}

export interface GettingStartedCardProps {
  id: string;
  icon?: React.ReactElement;
  title: string;
  titleColor?: string;
  description?: string;
  links: GettingStartedLink[];
  moreLink?: { title: string; href: string };
}

const GettingStartedCard: React.FC<GettingStartedCardProps> = ({
  id,
  icon,
  title,
  titleColor,
  description,
  links,
  moreLink,
}) => {
  return (
    <Flex
      direction={{ default: 'column' }}
      grow={{ default: 'grow' }}
      className="cluster-templates-getting-started-card"
      data-test={`card ${id}`}
    >
      <Title headingLevel="h3" size={TitleSizes.md} style={{ color: titleColor }} data-test="title">
        {icon ? (
          <div className="cluster-templates-getting-started-card__title-icon">
            <span>{icon}</span>
            <div className="cluster-templates-getting-started-card__title-text">{title}</div>
          </div>
        ) : (
          <>{title}</>
        )}
      </Title>

      {description ? (
        <Text component={TextVariants.small} data-test="description">
          {description}
        </Text>
      ) : null}

      <Flex direction={{ default: 'column' }} grow={{ default: 'grow' }}>
        {links?.length > 0 ? (
          <SimpleList isControlled={false} className="cluster-templates-getting-started-card__list">
            {links.map((link) =>
              link.loading ? (
                <li key={link.id}>
                  <Skeleton fontSize="sm" />
                </li>
              ) : (
                <SimpleListItem
                  key={link.id}
                  component={'button'}
                  onClick={(e) => {
                    link.onClick?.(e);
                  }}
                >
                  {link.title}
                </SimpleListItem>
              ),
            )}
          </SimpleList>
        ) : null}
      </Flex>

      {moreLink ? (
        <FlexItem>
          <a href={moreLink.href}>{moreLink.title}</a>
        </FlexItem>
      ) : null}
    </Flex>
  );
};

export default GettingStartedCard;
