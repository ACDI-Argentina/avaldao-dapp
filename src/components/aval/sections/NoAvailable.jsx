import React from 'react'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SNoAvailable = styled.div`
  min-height: 250px;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size:18px;
  color: #555555;
  background-color: #F2F2F2;
  border-radius:12px;
  text-align:center;
`;


const NoAvailable = ({ }) => {
  const {t} = useTranslation();
  return (
    <SNoAvailable >
      {t('soloAvalesVigentes')}
    </SNoAvailable >
  )
}
export default NoAvailable;