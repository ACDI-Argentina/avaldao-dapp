import React, { useEffect } from 'react'
import { useFormik } from 'formik';
import { Grid, InputAdornment, makeStyles } from "@material-ui/core";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import { useTranslation } from "react-i18next";
import config from 'configuration';
import avalSchema from 'schemas/AvalSchema';
import { InputField } from '@acdi/efem-dapp';
import SecondaryButton from 'components/buttons/SecondaryButton';
import PrimaryButton from 'components/buttons/PrimaryButton';
import DateUtils from 'utils/DateUtils';


const useStyles = makeStyles(theme => ({
  form: {
    padding: '1em',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Input = ({ ...props }) => (
  <InputField
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


const AvalForm = (props) => {
  const { aval, submitText, onSubmit: onSubmitHandler, onCancel, loading = false, solicitanteAddress, defaultAvaldaoAddress } = props;

  const initialDate = aval?.fechaInicio ? DateUtils.formatDateYYYYMMDD(aval.fechaInicio) : DateUtils.formatDateYYYYMMDD(new Date());

  const formik = useFormik({
    initialValues: {
      proyecto: aval?.proyecto || '',
      objetivo: aval?.objetivo || '',
      adquisicion: aval?.adquisicion || '',
      beneficiarios: aval?.beneficiarios || '',
      montoFiat: (aval?.montoFiat / 100) || 1000, //in usd
      cuotasCantidad: aval?.cuotasCantidad || 6,
      fechaInicio: initialDate,
      duracionCuotasDias: aval?.duracionCuotasDias || 30,
      solicitanteAddress: aval?.solicitanteAddress || solicitanteAddress,
      avaldaoAddress: aval?.avaldaoAddress || defaultAvaldaoAddress,
      comercianteAddress: aval?.comercianteAddress || '',
      avaladoAddress: aval?.avaladoAddress || '',
    },
    validationSchema: avalSchema,

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
        <Grid item xs={12} md={6}>
          <FormikInput
            id="adquisicion"
            label={t('avalAdquisicion')}
            formik={formik}
            readOnly={readonly}
          />
        </Grid>
        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={3}>
          <FormikInput
            id="fechaInicio"
            type="date"
            label={t('fechaInicio')}
            formik={formik}
            readOnly={readonly}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormikInput
            id="duracionCuotasDias"
            label={t('avalDuracionCuotas')}
            formik={formik}
            type="number"
            readOnly={readonly}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormikInput /* required */
            id="solicitanteAddress"
            label={t('avalSolicitanteAddress')}
            placeholder="0x..."
            formik={formik}
            disabled
            inputProps={{ maxLength: 42 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceWalletIcon color="primary" />
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
                  <AccountBalanceWalletIcon color="primary" />
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
                  <AccountBalanceWalletIcon color="primary" />
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
                  <AccountBalanceWalletIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid container item xs={12} justifyContent="flex-end">
          <SecondaryButton
            onClick={() => {
              formik.resetForm();
              typeof onCancel === "function" && onCancel();
            }}>
            {t('avalCancelar')}
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={loading || !formik.isValid || !formik.dirty}
            isWorking={loading}>
            {submitText || t("avalSolicitar")}
          </PrimaryButton>
        </Grid>
      </Grid>
    </form>
  )
}
export default AvalForm;