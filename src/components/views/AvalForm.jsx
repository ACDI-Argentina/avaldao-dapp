import React, { useEffect } from 'react'
import { useFormik } from 'formik';
import { Button, Grid, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import { useTranslation } from "react-i18next";

import LoadingOverlay from 'components/Loading/LoadingOverlay';
import config from 'configuration';

const useStyles = makeStyles(theme => ({
  form: {
    padding: '1em',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Input = ({ ...props }) => (
  <TextField
    fullWidth
    margin="normal"
    InputLabelProps={{ shrink: true }}
    style={{ marginBottom: "-.5rem" }}
    {...props}
  />
);

/* Required id and formik */
const FormikInput = ({ formik, id, ...props }) => {
  const { t } = useTranslation();

  const touched = formik.touched[`${id}`];
  const error = formik.errors[`${id}`];
  const errorMessage = t(formik.errors[`${id}`]);

  return (
    <Input
      onChange={formik.handleChange}
      id={id}
      onBlur={() => formik.setFieldTouched(`${id}`)}
      value={formik.values[`${id}`]}
      helperText={(touched && errorMessage) || " "} //https://github.com/mui-org/material-ui/issues/13646
      error={touched && error?.length > 0}
      {...props}
    />)
}


const AvalForm = ({ submitText, onSubmit: onSubmitHandler, loading = false, showAddress, validationSchema, solicitanteAddress, defaultAvaldaoAddress }) => {

  const formik = useFormik({
    initialValues: {
      proyecto: '',
      objetivo: '',
      adquisicion: '',
      beneficiarios: '',
      montoFiat: 1000, //in usd
      cuotasCantidad: 6,
      solicitanteAddress: solicitanteAddress,
      avaldaoAddress: defaultAvaldaoAddress,
      comercianteAddress: '',
      avaladoAddress: ''
    },
    validationSchema: validationSchema,

    onSubmit: values => {
      const montoFiatInCents = values.montoFiat * 100;
      typeof onSubmitHandler === "function" && onSubmitHandler({
        ...values,
        montoFiat: montoFiatInCents,
      });
    },

  });

  const classes = useStyles();

  const readonly = false;/* state or prop */
  const { i18n, t } = useTranslation();

  //Update error messages when lng changed
  useEffect(() => {
    const refresh = ev => formik.validateForm();
    i18n.on("languageChanged", refresh);
    return () => i18n.off("languageChanged", refresh);
  }, [i18n, formik])


  return (
    <form onSubmit={formik.handleSubmit}
      className={classes.form}
      noValidate
      autoComplete="off" >

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Mover esto a un componente que reciba el key y formik tipo FormikInput */}
          <FormikInput
            id="proyecto"
            label={t('avalProyecto')}
            formik={formik}
            readOnly={readonly}
          />
        </Grid>
        <Grid item xs={12}>
          <FormikInput
            id="objetivo"
            label={t('avalObjetivo')}
            formik={formik}
            readOnly={readonly}
            multiline
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormikInput
            id="adquisicion"
            label={t('avalAdquisicion')}
            formik={formik}
            readOnly={readonly}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormikInput
            id="beneficiarios"
            label={t('avalBeneficiarios')}
            formik={formik}
            readOnly={readonly}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormikInput
            id="montoFiat"
            label={t('avalMonto')}
            formik={formik}
            type="number"

            readOnly={readonly}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ marginLeft: "10px" }}>
                  {config?.fiat?.symbol}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormikInput
            id="cuotasCantidad"
            label={t('avalCuotasCantidad')}
            formik={formik}
            type="number"
            readOnly={readonly}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormikInput /* required */
            value={solicitanteAddress}
            id="solicitanteAddress"
            label={t('avalSolicitanteAddress')}
            placeholder="0x..."
            formik={formik}
            disabled
            inputProps={{ maxLength: 42 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWalletIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormikInput /* required */
            id="avaldaoAddress"
            label={t('avalAvaldaoAddress')}
            placeholder="0x..."
            formik={formik}
            inputProps={{ maxLength: 42 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWalletIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormikInput
            id="comercianteAddress"
            label={t('avalComercianteAddress')}
            placeholder="0x..."
            formik={formik}
            variant="filled"
            inputProps={{ maxLength: 42 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWalletIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormikInput
            id="avaladoAddress"
            label={t('avalAvaladoAddress')}
            placeholder="0x..."
            formik={formik}
            variant="filled"
            inputProps={{ maxLength: 42 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWalletIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>

          <LoadingOverlay loading={loading}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || !formik.isValid || !formik.dirty}  //Habilitarlo pero que en el click solamente maneje el submit si el form es valido
              className={classes.button}>
              {submitText}
            </Button>
          </LoadingOverlay>

          <Button
            onClick={formik.resetForm}
            className={classes.button}>
            {t('avalCancelar')}
          </Button>
        </Grid>
      </Grid>

    </form>
  )
}
export default AvalForm;