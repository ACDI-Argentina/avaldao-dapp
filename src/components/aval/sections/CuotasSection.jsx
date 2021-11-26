import React from 'react'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AvalCuotaCard from '../cards/AvalCuotaCard';

import NoAvailable from './NoAvailable';
import Section from './Section';
import Aval from 'models/Aval';

const CuotasList = styled.div`
  display:flex;
  overflow-x:auto;
  padding-bottom:10px;
  min-height: 250px;
  background-color: white;
  border-radius:12px;
`;

const CuotasSection = ({ aval }) => {
  const { t } = useTranslation();

  const available = aval.showCuotas();

  return (
    <Section>
      <h3>{t('avalCuotaSection')}</h3>
      {available ? (
        <CuotasList>
          {aval?.cuotas.map((cuota, idx) => (
            <AvalCuotaCard key={idx} cuota={cuota} />
          ))}
        </CuotasList>
      ) : (<NoAvailable />)}
    </Section>
  )
}
export default CuotasSection;