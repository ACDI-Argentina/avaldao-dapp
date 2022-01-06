import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import moment from 'moment';
import { Button, CircularProgress, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ReportIcon from '@material-ui/icons/Report';
import ReportOffIcon from '@material-ui/icons/ReportOff';
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { firmarAval, desbloquearAval, reclamarAval, reintegrarAval, aceptarAval, rechazarAval, } from 'redux/reducers/avalesSlice';


import Alert from '@material-ui/lab/Alert';
import useWeb3Account from 'hooks/useWeb3Account';
import { selectUserByAddress } from 'redux/reducers/usersSlice';
import { fetchUserByAddress } from 'redux/reducers/usersSlice';
import { Link } from 'react-router-dom';

const ActionsSection = styled.div`  
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap:wrap;
  
  padding-right:8px;
  padding-bottom:3px;
  margin:10px 0px;
  min-height:52px;

  buttons:{
    flex-shrink:0;
  }
`
const useStyles = makeStyles((theme) => ({
  alert: {
    lineHeight: "1.5rem"
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: "10px 10px 0px 0px",
  },
  danger: {

  },
  progress: {
    marginLeft: "10px",
    marginTop: "5px"
  },
  centered: {
    display: "flex",
    alignItems: "center"
  },
  actionContainer: {
    minHeight: "50px",
    display: "flex",
    alignItems: "center"
  }



}));

const CompleteButton = ({ aval }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const allowCOmpletar = aval.allowCompletar(currentUser);
  return (
    <Tooltip title={t('avalCompletarTitle')}>
      <IconButton
        edge="end"
        aria-label="completar"
        color="primary"
        onClick={() => history.push(`/aval-completar/${aval.id}`)}
        style={{ pointerEvents: "auto" }}
        disabled={!allowCOmpletar}
      >
        <AssignmentTurnedInIcon />
      </IconButton>
    </Tooltip>
  )
}

const SignatureButton = ({ aval }) => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const allowFirmar = aval.allowFirmar(currentUser);
  // TODO Falta chequear el fondo de garantía.
  return (
    <Tooltip title={t('avalFirmarTitle')}>
      <IconButton
        edge="end"
        aria-label="firmar"
        color="primary"
        onClick={() => {
          dispatch(firmarAval({
            aval: aval,
            signerAddress: currentUser.address
          }));
        }}
        disabled={!allowFirmar}
        style={{ pointerEvents: "auto" }}
      >
        <VpnKeyIcon />
      </IconButton>
    </Tooltip>
  )
}

const ReclamarButton = ({ aval }) => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const allowReclamar = aval.allowReclamar(currentUser);
  return (
    <Tooltip title={t('avalReclamarTitle')}>
      <IconButton
        edge="end"
        aria-label="reclamar"
        color="primary"
        onClick={() => {
          dispatch(reclamarAval({
            aval: aval
          }));
        }}
        disabled={!allowReclamar}
        style={{ pointerEvents: "auto" }}
      >
        <ReportIcon />
      </IconButton>
    </Tooltip>
  )
}

const ReintegrarButton = ({ aval }) => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const allowReintegrar = aval.allowReintegrar(currentUser);
  return (
    <Tooltip title={t('avalReintegrarTitle')}>
      <IconButton
        edge="end"
        aria-label="reintegrar"
        color="primary"
        onClick={() => {
          dispatch(reintegrarAval({
            aval: aval
          }));
        }}
        disabled={!allowReintegrar}
        style={{ pointerEvents: "auto" }}
      >
        <ReportOffIcon />
      </IconButton>
    </Tooltip>
  )
}

const UnlockButton = ({ aval }) => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  return (
    <Tooltip title={t('avalDesbloquearTitle')}>
      <IconButton
        edge="end"
        aria-label="desbloquear"
        color="primary"
        onClick={() => dispatch(desbloquearAval({ aval }))}
        disabled={!aval.allowDesbloquear(currentUser)}
        style={{ pointerEvents: "auto" }}
      >
        <LockOpenIcon />
      </IconButton>
    </Tooltip>
  )
}

const AvalActions = ({ aval }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentUser, requestAuthentication } = useWeb3Account();
  const { t } = useTranslation();

  //TODO: check for error
  useEffect(() => {
    setLoading(aval?.isUpdating());
  }, [aval?.isUpdating()])

  useEffect(() => {
    if (aval?.solicitanteAddress) {
      dispatch(fetchUserByAddress(aval.solicitanteAddress))
    }
  }, [aval.solicitanteAddress])

  const solicitanteUser = useSelector( state => selectUserByAddress(state, aval.solicitanteAddress));

  let userElement = null;
  let dateElement = null;

  /* TODO: recuperar el usuario para ese address */

  userElement = (
  <span>
    {t("avalSolicitadoBy")}&nbsp; 
    <Link to="#" title={aval.solicitanteAddress}><b>{solicitanteUser?.name || aval.solicitanteAddress}</b></Link> 
  </span>
  );


  if (aval?.createdAt) {
    const day = moment(aval?.createdAt).format("DD/MM/YYYY");
    const hour = moment(aval?.createdAt).format("HH:mm");

    dateElement = (<span>{t("atDay")} <b>{`${day}`}</b> {t("atHour")} <b>{`${hour}`}</b></span>);
  }


  const isAvaladao = aval?.isAvaldao(currentUser);

  return (
    <>
      <ActionsSection>
        <CompleteButton aval={aval} />
        {/*<SignatureButton aval={aval} />*/}
        <UnlockButton aval={aval} />
        <ReclamarButton aval={aval} />
        <ReintegrarButton aval={aval} />
      </ActionsSection>

      {(aval.isSolicitado() || aval.isUpdating()) && (
        <Alert severity="warning" className={classes.alert}>
          {userElement}{dateElement}.<br />
          {t("avalPendingAcceptance")}.<br />
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
                        if(authenticated){
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
                        if(authenticated){
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
      )}
      {aval.isAceptado() && (
        <Alert severity="success">
          {t("avalAceptado")}
          {aval.isSolicitante(currentUser) && (<span>{t("avalCompletarAddress")} </span>)}
        </Alert>
      )}
      {aval.isRechazado() && (
        <Alert severity="error">
          {t("avalRechazado")}
        </Alert>
      )}
    </>
  )
}
export default AvalActions;