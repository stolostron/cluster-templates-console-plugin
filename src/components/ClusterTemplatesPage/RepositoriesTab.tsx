import {
  Button,
  Card,
  Popover,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { SyncAltIcon } from '@patternfly/react-icons';
import React from 'react';
import EmptyPageState from '../../helpers/EmptyPageState';
import TableLoader from '../../helpers/TableLoader';
import { useArgoCDSecrets } from '../../hooks/useArgoCDSecrets';
import { useHelmChartRepositories } from '../../hooks/useHelmChartRepositories';
import { useTranslation } from '../../hooks/useTranslation';
import NewRepositoryDialog from '../Repositories/NewRepositoryDialog';
import RepositoriesTable from '../Repositories/RepositoriesTable';

const CreateRepositoryButton = () => {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Button variant="primary" onClick={() => setAddDialogOpen(true)}>
        {t('Add a repository')}
      </Button>
      {addDialogOpen && <NewRepositoryDialog closeDialog={() => setAddDialogOpen(false)} />}
    </>
  );
};

const RefreshRepositoriesButton = () => {
  const { t } = useTranslation();
  const { refetch } = useHelmChartRepositories();
  return (
    <Popover bodyContent={t('Refresh repositories information')}>
      <Button variant="link" onClick={() => void refetch()} icon={<SyncAltIcon />}>
        {t('Refresh')}
      </Button>
    </Popover>
  );
};

const RepositoriesToolbar = () => {
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <CreateRepositoryButton />
        </ToolbarItem>
        <ToolbarItem alignment={{ default: 'alignRight' }}>
          <RefreshRepositoriesButton />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

const RepositoriesTab = () => {
  const { t } = useTranslation();
  const [secrets, loaded, error] = useArgoCDSecrets();

  return (
    <TableLoader
      loaded={loaded}
      error={error}
      errorTitle={t('The Repositories could not be loaded.')}
    >
      {secrets.length > 0 ? (
        <>
          <RepositoriesToolbar />
          <RepositoriesTable secrets={secrets} />
        </>
      ) : (
        <Card>
          <EmptyPageState
            title={t('You have no repositories')}
            message={t('Click Add a repository to add the first one')}
            action={<CreateRepositoryButton />}
          />
        </Card>
      )}
    </TableLoader>
  );
};
export default RepositoriesTab;
