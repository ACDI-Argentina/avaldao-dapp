import React from 'react'
import { faEdit, faExclamationTriangle, faFileSignature, faUnlock, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';


const Button = styled.button`
  border:1px solid transparent;
  margin:5px;
  padding:5px 10px;
  border-radius:4px;
  cursor: pointer;
  font-size:16px;
  font-weight:500;

  ${props => props.primary && `
    color: #F2F2F2;
    background-color:#01579B;
  `}

  ${props => props.warningAlt && `
    color: #555555;
    background-color:#FFC04F;
  `}
  ${props => props.successAlt && `
    color: #F2F2F2;
    background-color:#1AA251;
  `}  

  ${props => props.disabled && `
    color: #999999;
    background-color:#F2F2F2;
    cursor: default;
  `}

`

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

const CompleteButton = () => {
  return (
    <Button primary>
      <FontAwesomeIcon
        icon={faEdit}
        style={{
          color: "#F2F2F2",
          margin: "0px 5px",
          fontSize: "1em"
        }}
      />
      Completar
    </Button>
  )
}

const SignatureButton = () => {
  return (
    <Button primary>
      <FontAwesomeIcon
        icon={faFileSignature}
        style={{
          color: "#F2F2F2",
          margin: "0px 5px",
          fontSize: "1em"
        }}
      />
      Firmar
    </Button>
  )
}

const ClaimButton = () => {
  return (
    <Button warningAlt disabled>
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        style={{
          color: "#555555",
          margin: "0px 5px",
          fontSize: "1em"
        }}
      />
      Reclamar
    </Button>
  )
}

const UnlockButton = () => {
  return (
    <Button successAlt disabled>
      <FontAwesomeIcon
        icon={faUnlockAlt}
        style={{
          color: "#555555",
          margin: "0px 5px",
          fontSize: "1em"
        }}
      />
      Desbloquear cuota
    </Button>
  )
}

const AvalActions = ({ aval }) => {
  /*
    Firmar : COMPLETADO && (solicitante|| comerciante || avalado) ||(All firmed & avaldao)  
    Este podria aparecer en el card tmb del perfil asociado tmb
    */
  /*Desbloquear cuota : vigente + comerciante  */
  const status = aval?.status?.name?.toUpperCase();
  const showComplete = status === "ACEPTADO"; // && currentUser isSolicitante
  const showSignature = status === "COMPLETADO"; //  && currentUser relacionado al aval en cuestion
  const showClaimButton = status === "VIGENTE";/*Reclamar : vigente + comerciante (deshabilitado x el momento) */
  const showUnlockButton = status === "VIGENTE";

  return (
    <ActionsSection>
      {showComplete && <CompleteButton />}
      {showSignature && <SignatureButton />}
      {showClaimButton && <ClaimButton />}
      {showUnlockButton && <UnlockButton />}

    </ActionsSection>
  )
}
export default AvalActions;