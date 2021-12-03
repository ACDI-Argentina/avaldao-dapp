import React from 'react'
import styled from 'styled-components';
import { IconButton, Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ReportIcon from '@material-ui/icons/Report';
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'

import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { firmarAval, desbloquearAval } from 'redux/reducers/avalesSlice';

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

  return (
    <Tooltip title={t('avalCompletarTitle')}>
      <IconButton
        edge="end"
        aria-label="completar"
        color="primary"
        onClick={() => history.push(`/aval-completar/${aval.id}`)}
        style={{ pointerEvents: "auto" }}
        disabled={!aval.allowCompletar(currentUser)}
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

const ClaimButton = ({ aval }) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('avalReclamarTitle')}>
      <IconButton
        edge="end"
        aria-label="reclamar"
        color="primary"
        onClick={() => { console.log(`Implementar abrir nuevo reclamo`) }}
        disabled={true} /* TODO: implementar funcionalidad */
        style={{ pointerEvents: "auto" }}
      >
        <ReportIcon />
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
      <ClaimButton aval={aval} />
      <SignatureButton aval={aval} />
      <UnlockButton aval={aval} />
    </ActionsSection>
  )
}
export default AvalActions;