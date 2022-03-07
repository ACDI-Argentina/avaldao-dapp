import React, { useEffect } from 'react'
import Page from './Page';
import { Flex } from './styled';
import Alert from '@material-ui/lab/Alert';
import { Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import StatusIndicator from 'components/StatusIndicator';
import AvalForm from './AvalForm';
import Aval from 'models/Aval';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { selectAvalById, actualizarAval } from 'redux/reducers/avalesSlice';

import useUpdatingAval from 'hooks/useUpdatingAval';
import messageUtils from 'redux/utils/messageUtils';


const useStyles = makeStyles((theme) => ({
  alert: {
    width: '100%',
    marginTop: theme.spacing(2)
  }
}));

const AvalEditPage = (props) => {
  const history = useHistory();

  const classes = useStyles();
  const dispatch = useDispatch();
  const avalId = props.match.params.avalId;
  const aval = useSelector(state => selectAvalById(state, avalId));
  const currentUser = useSelector(state => selectCurrentUser(state));
  const { t } = useTranslation();


  function goToAvalView() {
    history.replace(`/aval/${avalId}/view`);
  }


  async function onSuccess() {
    await React.swal({
      text: t('avalActualizadoSuccess'),
      icon: "success",
    });

    goToAvalView();
  }

  async function onError(error) {
    messageUtils.addMessageError({
      text: t('avalActualizadoError')
    });
  }

  const { loading } = useUpdatingAval(avalId, onSuccess, onError);



  /* Si el usuario no tiene permisos para la edicion lo redirigimos a la visualizacion del aval */
  useEffect(() => {
    if (!aval || aval.isUpdating()) {
      return;
    }

    if (!currentUser?.address || !aval.allowEditar(currentUser)) {
      goToAvalView();
    }
  }, [currentUser, aval])


  if (!aval) { //TODO: add skeleton
    return <Page />;
  }

  const taskCode = aval.getTaskCode(currentUser);

  async function handleSubmit(values) {

    if (!currentUser?.address) {
      console.log(`Usuario no conectado`);
      return;
    } else {
      console.log(`Submit values with solicitante: ${currentUser?.address}`);
    }

    dispatch(actualizarAval(new Aval({
      ...values,
      id: aval.id,
      solicitanteAddress: currentUser?.address
    })
    ));
  }


  return (
    <Page>
      <Grid direction="column" container spacing={3} style={{ padding: "2em" }}>
        <Flex row justify="flex-end" style={{ marginRight: "10px" }}>
          <StatusIndicator status={aval.status} />
        </Flex>
        {taskCode && (
          <div className={classes.alert}>
            <Alert severity="info">{t(taskCode)}</Alert>
          </div>
        )}

        <AvalForm
          aval={aval}
          loading={loading}
          submitText={t("avalActualizar")}
          onSubmit={handleSubmit}
          onCancel={goToAvalView}
        />
      </Grid>
    </Page >
  )
}

export default AvalEditPage;