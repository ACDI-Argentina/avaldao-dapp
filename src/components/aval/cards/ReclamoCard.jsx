import React from 'react'
import styled from 'styled-components';
import { faCertificate, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div`
  width:100%;
  max-width: 768px;
  min-height:190px;
  
  padding:10px;
  margin:10px;
  border-radius:8px;
  display:flex;

  box-shadow: 1.40323px 0px 18.2419px rgba(48, 55, 85, 0.07);

  ${ props => props.status === "ABIERTO" && `
    border:2px solid #FFC04F;
    background-color: #FFC04F;
  `}
  ${ props => props.status === "CERRADO" && `
    border:2px solid #F2F2F2;
    background-color: #F2F2F2;
`}
`

const Column = styled.div`
  display:flex;
  flex-direction:column;
  justify-content: center;
`

const ReclamoData = styled(Column)`
  flex:1;
  justify-content: center;
  line-height:30px;
`

const Index = styled.div`
  font-weight:bold;
  font-size:1.25em;
`

const ReclamoCard = ({ reclamo }) => {
  return (
    <Wrapper status={reclamo.status}>
      <Column>
        <FontAwesomeIcon
          icon={reclamo.status === "ABIERTO"? faExclamationCircle : faCheckCircle}
          style={{ 
            fontSize: "65px", 
            margin:"20px",
            color: reclamo.status === "ABIERTO" ? "#555555" : "#79D2D2"
          }}
        />
      </Column>
      <ReclamoData>
        <Index>Cuota #{reclamo.cuota} </Index>
        <div>Estado: {reclamo?.status}</div>
        <div>Fecha: {reclamo?.date}</div>
      
      </ReclamoData>
    </Wrapper>
  )
}

export default ReclamoCard;