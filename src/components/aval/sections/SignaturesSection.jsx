import React from 'react'
import Box from 'components/Box/box';
import styled from 'styled-components';
import ProfileSignature from 'components/views/ProfileSignature';
import { useSelector } from 'react-redux';
import { selectUserByAddress } from 'redux/reducers/usersSlice';
import Section from './Section';
import { useTranslation } from 'react-i18next';

const Flex = styled.div`
  display: flex;
  flex-wrap:wrap;
`;



const Signature = ({ signature }) => {
  const user = useSelector(state => selectUserByAddress(state, signature.address));
  return (
    <ProfileSignature
      address={signature.address}
      user={user}
      title={signature.title}
      signature={signature.signature}
    />
  )
}

const SignaturesSection = ({ aval }) => {

  const { t } = useTranslation();

  const signatures = [
    {
      address: aval?.avaldaoAddress,
      signature: aval?.avaldaoSignature,
      title: t("avaldao")
    },
    {
      address: aval?.solicitanteAddress,
      signature: aval?.solicitanteSignature,
      title: t("solicitante")
    },
    {
      address: aval?.comercianteAddress,
      signature: aval?.comercianteSignature,
      title: t("comerciante")
    },
    {
      address: aval?.avaladoAddress,
      signature: aval?.avaladoSignature,
      title: t("avalado")
    },
  ];

  return (
    <Section>
      <h3>{t('avalFirmasSection')}</h3>
      <Flex>
        {Object.keys(signatures).map(key => signatures[key]).map(signature => {
          return (
            <Box xs={12} md={6} xxl={3} key={signature.address} style={{ padding: "14px" }}>
              <Signature signature={signature} />
            </Box>
          )
        })}
      </Flex>
    </Section>
  )
}
export default SignaturesSection;