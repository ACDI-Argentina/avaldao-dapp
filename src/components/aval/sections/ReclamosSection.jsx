import React from 'react'
import styled from 'styled-components';

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NoAvailable from './NoAvailable';
import ReclamoCard from '../cards/ReclamoCard';
import Section from './Section';


const Content = styled.div`
  
`;

const OpenClaimButton = styled.button`
    margin:15px 10px;
    background-color: #f3ba2f;
    border:1px solid transparent;
    padding:7px;
    cursor:pointer;
    text-transform:uppercase;
    font-weight:bold;
    border-radius:8px;
    font-size: 16px;
    color: #333333;

    ${props => props.disabled && `
      background-color: #BFBFBF;
      color:#555555;
      cursor:default;
    `}
`

const Column = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
`

const ClaimsList = ({aval}) => {
  return (
    <Column>
    {
      aval.reclamos.map((reclamo,idx) => (
        <ReclamoCard key={idx} reclamo={reclamo} />
      ))

    }
    </Column>
  )
}

const SNoClaims = styled.div`
  color: #555555;
  background-color: #F2F2F2;
  min-height:250px;
  font-size:18px;
  border-radius:12px;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
`


const NoClaims = () => {
  return (
    <SNoClaims>
      <div>Aún no hay reclamos.</div>
      <div>
        <OpenClaimButton disabled>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            style={{
              margin: "0px 10px",
              fontSize: "15px"
            }}
          />
          Abrir un reclamo
        </OpenClaimButton>
      </div>
    </SNoClaims>)
}

const ReclamosSection = ({ aval }) => {
  const status = aval?.status?.name?.toUpperCase();

  const available = status === "VIGENTE" || status === "FINALIZADO";
  const hasClaims = aval?.reclamos?.length > 0;

  return (
    <Section>
      <h3>Reclamos</h3>
      {available ? (
        <Content>
          {hasClaims ? <ClaimsList aval={aval}/> : <NoClaims />}
        </Content>
      ) : <NoAvailable />}
    </Section>
  )
}
export default ReclamosSection;