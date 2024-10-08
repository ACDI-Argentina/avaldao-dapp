import React from 'react'
import Section from './Section';
import { useTranslation } from 'react-i18next';
import { makeStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import SignerCard from 'components/SignerCard';

import { useDispatch } from 'react-redux';
import { firmarAval } from 'redux/reducers/avalesSlice';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

const SignaturesSection = ({ aval }) => {

  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const signers = [
    {
      title: t("avaldao"),
      address: aval?.avaldaoAddress,
      signature: aval?.avaldaoSignature,

    },
    {
      title: t("solicitante"),
      address: aval?.solicitanteAddress,
      signature: aval?.solicitanteSignature,
    },
    {
      title: t("comerciante"),
      address: aval?.comercianteAddress,
      signature: aval?.comercianteSignature
    },
    {
      title: t("avalado"),
      address: aval?.avaladoAddress,
      signature: aval?.avaladoSignature
    }
  ];

  return (
    <Section>
      <Typography variant="subtitle1">{t('avalFirmantesTitle')}</Typography>
      <Grid container className={classes.root} spacing={1}>
        {signers.map((signer, idx) => (
          <Grid item key={idx} lg={3} md={4} sm={6} xs={12} >
            <SignerCard
              title={signer.title}
              address={signer.address}
              signature={signer.signature}
              requestSign={() => 
                dispatch(firmarAval({
                aval: aval
              }))}
            >

            </SignerCard>
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}
export default SignaturesSection;