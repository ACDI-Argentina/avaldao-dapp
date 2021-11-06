import React from 'react'
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
  return (
    <SNoAvailable >
      Disponible solo para avales en estado vigente
    </SNoAvailable >
  )
}
export default NoAvailable;