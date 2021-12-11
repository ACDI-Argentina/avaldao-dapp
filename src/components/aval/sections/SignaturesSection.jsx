import React from 'react'
import ProfileSignature from 'components/views/ProfileSignature';
import { useSelector } from 'react-redux';
import { selectUserByAddress } from 'redux/reducers/usersSlice';
import Section from './Section';
import { useTranslation } from 'react-i18next';
import { makeStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

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

  const classes = useStyles();
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
      <Typography variant="subtitle1">{t('avalFirmasSection')}</Typography>
      <Grid container className={classes.root} spacing={1}>
        {signatures.map((signature, idx) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={idx}>
            <Signature signature={signature} />
          </Grid>
        ))}
      </Grid>
    </Section>
  )
}
export default SignaturesSection;