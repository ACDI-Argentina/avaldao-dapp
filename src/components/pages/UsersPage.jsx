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
import { selectUsers } from 'redux/reducers/usersSlice';
import { selectLoading } from 'redux/reducers/usersSlice';

/**
 * Pantalla de Usuarios.
 * 
 */
const UsersPage = ({ classes }) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectLoading);


  useEffect(() => {
    if(Array.isArray(users) && users.length === 0 && !loading){
      dispatch(fetchUsers()); //TODO: check who is the current user
    }
  },[])

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
