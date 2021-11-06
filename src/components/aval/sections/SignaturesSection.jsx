import React from 'react'
import Box from 'components/Box/box';
import styled from 'styled-components';
import SignatureCard from '../cards/SignatureCard';

const Flex = styled.div`
  display: flex;
  flex-wrap:wrap;
`;

const SignaturesSection = ({ aval }) => {
  
  const users = [
    { address: aval?.solicitanteAddress,
      signature: aval?.solicitanteSignature,
      rol:"Solicitante"
    },
    { address: aval?.avaladoAddress,
      signature: aval?.avaladoSignature,
      rol:"Avalado"
    },
    { address: aval?.comercianteAddress,
      signature: aval?.comercianteSignature,
      rol:"Comerciante"
    },
    { address: aval?.avaldaoAddress,
      signature: aval?.avaldaoSignature,
      rol:"Avaldao"
    },
  ]; 
  
  return (
    <Flex>
      {Object.keys(users).map(key => users[key]).map(user => {
        return (
          <Box xs={12} md={6} xxl={3} key={user.address} style={{ padding: "14px" }}>
            <SignatureCard user={user} />
          </Box>
        )
      })}
    </Flex>
  )
}
export default SignaturesSection;