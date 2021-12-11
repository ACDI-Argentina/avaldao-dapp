import React from 'react'
import styled from 'styled-components';
import { IconButton, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ReportIcon from '@material-ui/icons/Report';
import ReportOffIcon from '@material-ui/icons/ReportOff';
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { firmarAval, desbloquearAval, reclamarAval, reintegrarAval } from 'redux/reducers/avalesSlice';

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
  return (
    <ActionsSection>
      <CompleteButton aval={aval} />
      {/*<SignatureButton aval={aval} />*/}
      <UnlockButton aval={aval} />
      <ReclamarButton aval={aval} />
      <ReintegrarButton aval={aval} />
    </ActionsSection>
  )
}
export default AvalActions;