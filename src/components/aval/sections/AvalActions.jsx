import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment';
import { Button, ButtonGroup, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { firmarAval, desbloquearAval, reclamarAval, reintegrarAval, aceptarAval, rechazarAval, } from 'redux/reducers/avalesSlice';
import useWeb3Account from 'hooks/useWeb3Account';
import { selectUserByAddress } from 'redux/reducers/usersSlice';
import { fetchUserByAddress } from 'redux/reducers/usersSlice';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';


const AvalActions = ({ aval }) => {

  const history = useHistory();
  const dispatch = useDispatch();

  const { currentUser } = useWeb3Account();
  const { t } = useTranslation();


  useEffect(() => {
    if (aval?.solicitanteAddress) {
      dispatch(fetchUserByAddress(aval.solicitanteAddress))
    }
  }, [aval.solicitanteAddress])


  useEffect(() => {
    if (aval?.avaldaoAddress) {
      dispatch(fetchUserByAddress(aval.avaldaoAddress))
    }
  }, [aval.avaldaoAddress])

  const solicitanteUser = useSelector(state => selectUserByAddress(state, aval.solicitanteAddress));
  const avaldaoUser = useSelector(state => selectUserByAddress(state, aval.avaldaoAddress));

  let solicitanteElement = null;
  let avaldaoElement = null;
  let dateElement = null;

  solicitanteElement = (
    <span>
      {t("avalSolicitadoBy")}&nbsp;
      <Link to="#" title={aval.solicitanteAddress}><b>{solicitanteUser?.name || aval.solicitanteAddress}</b></Link>
    </span>
  );

  avaldaoElement = (
    <span>
      {t("avalSolicitadoTo")}&nbsp;
      <Link to="#" title={aval.avaldaoAddress}><b>{avaldaoUser?.name || aval.avaldaoAddress}</b></Link>
    </span>
  );

  if (aval?.createdAt) {
    const day = moment(aval?.createdAt).format("DD/MM/YYYY");
    const hour = moment(aval?.createdAt).format("HH:mm");

    dateElement = (<span>{t("atDay")} <b>{`${day}`}</b> {t("atHour")} <b>{`${hour}`}</b></span>);
  }

  //const isAvaladao = aval?.isAvaldao(currentUser);
  const allowEditar = aval.allowEditar(currentUser);
  const allowAceptar = aval.allowAceptar(currentUser);
  const allowRechazar = aval.allowRechazar(currentUser);
  const allowFirmar = aval.allowFirmar(currentUser);
  const allowDesbloquear = aval.allowDesbloquear(currentUser);
  const allowReclamar = aval.allowReclamar(currentUser);
  const allowReintegrar = aval.allowReintegrar(currentUser);

  const hasAction = allowEditar || allowAceptar || allowRechazar || allowFirmar || allowDesbloquear || allowReclamar || allowReintegrar;

  return (
    <React.Fragment>

      {hasAction && <Divider />}

      <ButtonGroup variant="text" color="primary">


        { allowEditar && (
          <Button onClick={() => history.push(`/aval/${aval.id}/edit`)}>
            {t("avalEditar")}
          </Button>
        )}

        {allowAceptar &&
          <Button
            onClick={async () => {
              dispatch(aceptarAval(aval));
            }}
          >
            {t("avalAceptar")}
          </Button>
        }

        {allowRechazar &&
          <Button
            onClick={async () => {
              dispatch(rechazarAval(aval));
            }}
          >
            {t("avalRechazar")}
          </Button>
        }

        {allowFirmar &&
          <Button onClick={() => dispatch(firmarAval({
            aval: aval
          }))}
          >
            {t('avalFirmarTitle')}
          </Button>
        }

        {allowDesbloquear &&
          <Button
            onClick={() => dispatch(desbloquearAval({
              aval: aval
            }))}>
            {t('avalDesbloquearTitle')}
          </Button>
        }

        {allowReclamar &&
          <Button
            onClick={() => dispatch(reclamarAval({
              aval: aval
            }))}>
            {t('avalReclamarTitle')}
          </Button>
        }

        {allowReintegrar &&
          <Button
            onClick={() => dispatch(reintegrarAval({
              aval: aval
            }))}>
            {t('avalReintegrarTitle')}
          </Button>
        }


      </ButtonGroup>

      {/*
        (aval.isSolicitado() || aval.isUpdating()) && (
          <Alert severity="warning" className={classes.alert}>
            {solicitanteElement}&nbsp; {dateElement}.<br />
            {avaldaoElement}.

            {isAvaladao && (
              <div className={classes.actionContainer}>
                {loading ?
                  <div className={classes.centered}>
                    <b>{t("processing")}... </b>
                    <div className={classes.progressContainer}>
                      <CircularProgress size={18} className={classes.progress} />
                    </div>
                  </div>
                  : (
                    <>
                      <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          const authenticated = await requestAuthentication();
                          if (authenticated) {
                            dispatch(aceptarAval({ id: aval.id }));
                          } else {
                            console.log(`Not authenticated`);
                          }
                        }}
                      >
                        {t("avalAceptar")}
                      </Button>


                      <Button
                        className={classes.button}
                        variant="outlined"
                        color="secondary"
                        onClick={async () => {
                          const authenticated = await requestAuthentication();
                          if (authenticated) {
                            //TODO: ask cause
                            dispatch(rechazarAval({ id: aval.id }));
                          } else {
                            console.log(`Not authenticated`);
                          }
                        }}
                      >
                        {t("avalRechazar")}
                      </Button>
                    </>
                  )

                }

              </div>
            )}
          </Alert>
        )
      }
      {
        aval.isRechazado() && (
          <Alert severity="error">
            {t("avalRechazado")}
          </Alert>
        )
        */}
    </React.Fragment>
  )
}
export default AvalActions;