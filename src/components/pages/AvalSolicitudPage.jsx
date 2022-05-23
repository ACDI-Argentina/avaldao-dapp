import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Page from './Page';
import AvalForm from "../views/AvalForm";
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { solicitarAval } from 'redux/reducers/avalesSlice';
import Aval from 'models/Aval';
import useWeb3Account from 'hooks/useWeb3Account';
import { useHistory } from 'react-router';
import config from 'configuration';
import useSavingAval from 'hooks/useSavingAval';
import messageUtils from 'redux/utils/messageUtils';
import Background from 'components/views/Background'
import Paper from '@material-ui/core/Paper';
import SecondaryButton from 'components/CustomButtons/SecondaryButton';
import PrimaryButton from 'components/CustomButtons/PrimaryButton';

const useStyles = makeStyles(theme => ({
  title: {
    padding: '1em',
  },
}));


const AvalSolicitudPage = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const [avalClientId, setAvalClientId] = useState();

  const { loading } = useSavingAval(avalClientId, onSuccess, onError);
  const { currentUser, requestConnection } = useWeb3Account();
  const dispatch = useDispatch();

  useEffect(() => {
    requestConnection();
  }, [])

  async function handleSubmit(values) {

    let solicitanteAddress;

    if (!currentUser?.address) {
      const connected = await requestConnection();
      if (connected) {
        solicitanteAddress = connected;
      } else {
        //history.push('/');
        return;
      }
    } else {
      solicitanteAddress = currentUser?.address;
    }

    const aval = new Aval({
      ...values,
      solicitanteAddress: solicitanteAddress
    })

    setAvalClientId(aval.clientId);
    dispatch(solicitarAval(aval));
  }

  async function onSuccess() {
    messageUtils.addMessageSuccess({
      text: t('avalSolicitadoSuccess')
    });
    history.push("/");
  }

  async function onError(error) {
    messageUtils.addMessageError({
      text: t('avalSolicitadoError')
    });
  }

  async function onCancel() {
    history.push("/");
  }

  return (
    <Page>
      <Background>
        <Paper>
          <Grid direction="column" container spacing={3} style={{ padding: "2em" }}>

            <Grid item xs={12} className={classes.title}>
              <Typography variant="h5" component="h5">
                {t('avalSolicitudTitle')}
              </Typography>
            </Grid>

            <AvalForm
              onSubmit={handleSubmit}
              onCancel={onCancel}
              submitText={t("avalSolicitar")}
              loading={loading}
              solicitanteAddress={currentUser.address}
              defaultAvaldaoAddress={config.avaldaoAddress}
            />
          </Grid>
        </Paper>
      </Background>
    </Page>
  )
}

export default AvalSolicitudPage;