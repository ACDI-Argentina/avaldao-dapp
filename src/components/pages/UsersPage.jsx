import React, { useState, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import UserTable from '../views/UserTable';
import Page from './Page';
import { Typography } from '@material-ui/core';
import Background from 'components/views/Background';
import Paper from '@material-ui/core/Paper';

/**
 * Pantalla de Usuarios.
 * 
 */
const UsersPage = ({ classes }) => {
  const {t} = useTranslation();

  return (
    <Page>
      <Background>
        <Paper>
          <Grid container spacing={3} style={{ padding: "2em" }}>
            <Grid item xs={12}>
              <Typography variant="h5" component="h5">
                {t('usersTitle')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <UserTable />
            </Grid>
          </Grid>
        </Paper>
      </Background>
    </Page>
  );
};

export default UsersPage;
