import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { useTranslation } from 'react-i18next';
import Dashboard from 'components/views/Dashboard';
import AvalTable from 'components/views/AvalTable';
import Page from './Page';
import { makeStyles } from '@material-ui/core/styles';
import AvalTaskList from 'components/views/AvalTaskList';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { fetchAvalesOffChain, fetchAvalesOnChain, selectUserAvales } from '../../redux/reducers/avalesSlice';
import { Typography, Paper } from '@material-ui/core';
import Background from 'components/views/Background';
import CreateAvalButton from 'components/aval/CreateAvalButton';
import config from 'configuration';

const useStyles = makeStyles((theme) => ({
  // Define any custom styles here if needed
}));

/**
 * Pantalla de Avales del usuario.
 */
const MisAvalesPage = () => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const avales = useSelector((state) => selectUserAvales(state, currentUser));


  let showAvalTaskList = false;
  let avalTableWidthMd = 12;

  const allowSolicitar = currentUser?.hasRole(config.SOLICITANTE_ROLE);

  if (currentUser && currentUser.authenticated) {
    showAvalTaskList = true;
    avalTableWidthMd = 9;
  }

  return (
    <Page>
      <Background>
        <Paper>
          <Grid container spacing={1} style={{ padding: '2em' }}>
            <Grid item xs={12}>
              <Typography variant="h5" component="h5">
                {t('misAvalesTitle')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3} style={{ marginTop: '1em', marginBottom: '1em' }}>
                <Grid item sm={12} md={avalTableWidthMd}>
                  {allowSolicitar && (
                    <Grid item sm={12}>
                      <CreateAvalButton />
                    </Grid>
                  )}
                  <AvalTable avales={avales} />
                </Grid>
                {showAvalTaskList && (
                  <Grid item sm={12} md={3}>
                    <AvalTaskList user={currentUser} />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Background>
      <Dashboard />
    </Page>
  );
};

export default MisAvalesPage;
