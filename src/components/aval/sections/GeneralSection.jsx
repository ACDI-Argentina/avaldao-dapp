import React from 'react'
import styled from 'styled-components';
import Box from 'components/Box/box';

import Section from './Section';

const Label = styled.label`
  display: block;
  font-weight: 500;
  font-size:20px;
  margin-bottom:0.25em;
  color: #353535;
`
const Info = styled.div`
  margin-bottom:20px;
`
const Flex = styled.div`
  display: flex;
  flex-wrap:wrap;
`;


const GeneralSection = ({ aval }) => {
  console.log(aval);
  const proyecto = aval.proyecto;
  const proposito = aval.proposito;
  const monto = "10.000 USD";/* Nan? */
  const causa = aval.causa;
  const adquisicion = aval.adquisicion;
  const beneficiarios = aval.beneficiarios;


  return (
    <Section>
      <Box sm={12}>
        <Info>
          <Label>Proyecto</Label>
          {proyecto} {/* Nan? wtd */}
        </Info>
      </Box>
      <Flex>
        <Box sm={10}>
          <Info>
            <Label>Propósito</Label>
            {proposito} {/* Nan? wtd */}
          </Info>
        </Box>
        <Box sm={2} lg={12}>
          <Info>
            <Label>Monto</Label>
            {monto}
          </Info>
        </Box>
      </Flex>

      <Flex>
        <Box md={6}>
          <Info>
            <Label>Causa</Label>
            {causa}
          </Info>
        </Box>

        <Box sm={6} md={3} >
          <Info>
            <Label>Adquisición</Label>
            {adquisicion}
          </Info>
        </Box>

        <Box sm={6} md={3} >
          <Info>
            <Label>Beneficiarios</Label>
            {beneficiarios}
          </Info>
        </Box>
      </Flex>

    </Section>
  )
}
export default GeneralSection;