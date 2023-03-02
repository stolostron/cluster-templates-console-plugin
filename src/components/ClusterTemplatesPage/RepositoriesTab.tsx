import { Button, Card, Toolbar, ToolbarContent } from '@patternfly/react-core';
import React from 'react';
import EmptyPageState from '../../helpers/EmptyPageState';
import TableLoader from '../../helpers/TableLoader';
import { useArgoCDSecrets } from '../../hooks/useArgoCDSecrets';
import { useTranslation } from '../../hooks/useTranslation';
import NewRepositoryDialog from '../HelmRepositories/NewRepositoryDialog';
import RepositoriesTable from '../HelmRepositories/RepositoriesTable';

const CreateRepositoryButton = () => {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Button variant="primary" onClick={() => setAddDialogOpen(false)}>
        {t('Add a repository')}
      </Button>
      {addDialogOpen && <NewRepositoryDialog closeDialog={() => setAddDialogOpen(false)} />}
    </>
  );
};

const RepositoriesToolbar = () => {
  return (
    <Toolbar>
      <ToolbarContent>
        <CreateRepositoryButton />
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
