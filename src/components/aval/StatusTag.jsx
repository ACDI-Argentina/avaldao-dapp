import React from 'react'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faCheck, faCheckCircle, faInfoCircle, faSignature, faTimes } from '@fortawesome/free-solid-svg-icons';

const Status = styled.div`

  padding:4px 10px;
  border-radius: 16px;
  background-color: white;
  cursor:default;
  height:32px;
  line-height:20px;
  font-size:0.9rem;

  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 8px;
  padding-right: 8px;
  white-space: nowrap;

  font-weight: 600;
  box-shadow: 0 1px .5px rgba(var(--shadow-rgb),.13);


  color: #1AA251;
  border: 2px solid #1AA251;

  ${props => props.status === "SOLICITADO" && `
    color:#01579B;
    border: 2px solid #0288d1;
  `}
  ${props => props.status === "RECHAZADO" && `
    color: #f44336;
    border: 2px solid #EB0014;
  `}
  ${props => props.status === "ACEPTADO" && `
    color: #1AA251;
    border: 2px solid #1AA251;
  `}
  ${props => props.status === "COMPLETADO" && `
    color:#01579B;
    border: 2px solid #0288d1;
  `}
  ${props => props.status === "VIGENTE" && `
    color: #1AA251;
    border: 2px solid #1AA251;
  `}
  ${props => props.status === "FINALIZADO" && `
    color: #303755;
    border: 2px solid #303755;
  `}

  
`;

const StatusIcon = ({ status }) => {
  let icon, color;
  switch (status) {
    case "SOLICITADO": {
      icon = faInfoCircle;
      color = "#01579B";
      break;
    }
    case "RECHAZADO": {
      icon = faTimes;
      color = "#f44336";
      break;
    }
    case "ACEPTADO": {
      icon = faCheck;
      color = "#1AA251";
      break;
    }
    case "COMPLETADO": {
      icon = faCertificate;
      color = "#01579B";
      break;
    }
    case "VIGENTE": {
      icon = faSignature;
      color = "#1AA251";
      break;
    }
    case "FINALIZADO": {
      icon = faCheckCircle;
      color = "#303755";
      break;
    }
  }
  return (
    <FontAwesomeIcon
      icon={icon}
      style={{
        fontSize: "0.75rem",
        margin: "0px 5px",
        color
      }}
    />
  )


}

const StatusTag = ({ aval }) => {
  const status = aval?.status?.name?.toUpperCase();

  return (
    <Status status={status}>
      <StatusIcon status={status} />
      {status}
    </Status>
  )
}
export default StatusTag;