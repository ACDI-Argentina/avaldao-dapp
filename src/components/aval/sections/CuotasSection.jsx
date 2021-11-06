import React from 'react'
import styled from 'styled-components';

import CuotaCard from '../cards/CuotaCard';
import NoAvailable from './NoAvailable';
import Section from './Section';

const CuotasList = styled.div`
  display:flex;
  overflow-x:auto;
  padding-bottom:10px;
  min-height: 250px;
  background-color: #F2F2F2;
  border-radius:12px;
`;

const CuotasSection = ({ aval }) => {
  const status = aval?.status?.name?.toUpperCase();
  
  const available = status === "VIGENTE" || status === "FINALIZADO" ;

  return (
    <Section>
      <h3>Cuotas</h3>
      {available ? (
        <CuotasList>
          {aval?.cuotas.map((cuota, idx) => (
            <CuotaCard key={idx} cuota={cuota} />
          ))}
        </CuotasList>
      ) : (<NoAvailable />)}
    </Section>
  )
}
export default CuotasSection;