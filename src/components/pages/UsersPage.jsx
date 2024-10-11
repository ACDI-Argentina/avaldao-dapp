import React, { useState, useContext, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import UserTable from '../views/UserTable';
import Page from './Page';
import { Typography } from '@material-ui/core';
import Background from 'components/views/Background';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'redux/reducers/usersSlice';
import { selectLoading } from 'redux/reducers/usersSlice';
import config from 'configuration';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';

/**
 * Pantalla de Usuarios.
 * 
 */
const UsersPage = ({ }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const loading = useSelector(selectLoading);
  const currentUser = useSelector(selectCurrentUser);

  const isUserAdmin = currentUser?.hasRole(config.ADMIN_ROLE) || false;

  useEffect(() => {
    if (!loading && isUserAdmin) {
      dispatch(fetchUsers()); //TODO: check who is the current user
    }
  }, [isUserAdmin])

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
              {isUserAdmin ? (
                <UserTable />
              ) : (<p>You do not have the necessary permissions to view the users or are not authenticated.</p>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Background>
    </Page>
  );
};

export default UsersPage;
