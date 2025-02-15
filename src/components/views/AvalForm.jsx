import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { Grid, InputAdornment, makeStyles, IconButton } from "@material-ui/core";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import { useTranslation } from "react-i18next";
import config from 'configuration';
import avalSchema from 'schemas/AvalSchema';
import { InputField } from '@acdi/efem-dapp';
import SecondaryButton from 'components/buttons/SecondaryButton';
import PrimaryButton from 'components/buttons/PrimaryButton';
import DateUtils from 'utils/DateUtils';
import DatePicker from 'react-datepicker';
import { CalendarToday } from '@material-ui/icons';

import "react-datepicker/dist/react-datepicker.css";
import { userService } from 'commons';

const loadUserByAddress = (address) => {
  return new Promise((resolve, reject) => {
    userService.loadUserByAddress(address).subscribe({
      next: (user) => resolve(user),
      error: () => resolve(null), // Resolve with null on error
    });
  });
}

const isValidHexAddress = (address) => {
  const hexAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return hexAddressRegex.test(address);
};

const useStyles = makeStyles(theme => ({
  form: {
    padding: '1em',
  },
  button: {
    margin: theme.spacing(1),
  },
  iconButton: {
    padding: 4,
  },
  calendarIcon: {
    fontSize: '1rem',
    color: 'black',
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
  let helperText;

  if(typeof props.helperText == "string"){  
    helperText = props.helperText
  } else if(touched && errorMessage){
    helperText = errorMessage
  } else {
    helperText=" ";
  }


  return (
    <Input
      id={id}
      onBlur={() => formik.setFieldTouched(`${id}`)}
      value={formik.values[`${id}`]}
      error={touched && error?.length > 0}
      {...props}
      helperText={helperText} //https://github.com/mui-org/material-ui/issues/13646
      onChange={(e) => {
        formik.handleChange(e);
        if (typeof props.onChange == "function") {
          try{
            props.onChange(e);
          } catch(e){

          }
        }
  }}
    />)
}


const AvalForm = (props) => {
  const { aval, submitText, onSubmit: onSubmitHandler, onCancel, loading = false, solicitanteAddress, defaultAvaldaoAddress } = props;
  const [startDate, setStartDate] = useState(new Date());

  const [comerciante,setComerciante] = useState();
  const [avalado, setAvalado] = useState();

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
      duracionCuotaDias: aval?.duracionCuotaSeconds / (24 * 60 * 60) || 30,
      solicitanteAddress: aval?.solicitanteAddress || solicitanteAddress,
      avaldaoAddress: aval?.avaldaoAddress || defaultAvaldaoAddress,
      comercianteAddress: aval?.comercianteAddress || '',
      avaladoAddress: aval?.avaladoAddress || '',
    },
    validationSchema: avalSchema,

    onSubmit: values => {
      const montoFiatInCents = values.montoFiat * 100;
      const duracionCuotaSeconds = values.duracionCuotaDias * 24 * 60 * 60;
      typeof onSubmitHandler === "function" && onSubmitHandler({
        ...values,
        duracionCuotaSeconds,
        montoFiat: montoFiatInCents,
        fechaInicio: `${values.fechaInicio}T00:00:00`
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
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              const year = date.getFullYear();
              const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-indexed, so +1
              const day = ('0' + date.getDate()).slice(-2);

              setStartDate(date);
              formik.setFieldValue('fechaInicio', `${year}-${month}-${day}`);
            }}

            dateFormat="dd/MM/yyyy"
            wrapperClassName="datepicker-full-width"

            customInput={
              <FormikInput
                id="fechaInicio"
                type="text"
                label={t('fechaInicio')}
                formik={formik}
                readOnly={readonly}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarToday className={classes.calendarIcon} />
                    </InputAdornment>
                  ),
                }}
              />}


          />
          {/* Tendriamos que ver aca que implica que le pase formik de esa forma, para mi va a obtener el values, quizas el error y el onchange */}
        </Grid>

        <Grid item xs={12} md={3}>
          <FormikInput
            id="duracionCuotaDias"
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

        <Grid item xs={12} md={6} className={comerciante?.name != undefined ?'address-user-found':''}>
          <FormikInput
            id="comercianteAddress"
            label={t('avalComercianteAddress')}
            onChange={ async e => {
              const value = e.target.value;
              if (isValidHexAddress(value)) {  
                try{
                  const userData = await loadUserByAddress(value);
                  setComerciante(userData); 

                } catch(err){
                  console.log(err);
                }
              } else {
                setComerciante(null);
              } //check valid address
            }}
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
            helperText={comerciante != null ? comerciante.name ?? "No registrado" : null}
          />
        </Grid>
         <Grid item xs={12} md={6} className={avalado?.name != undefined ?'address-user-found':''}>
          <FormikInput
            id="avaladoAddress"
            label={t('avalAvaladoAddress')}
            onChange={ async e => {
              const value = e.target.value;
              if (isValidHexAddress(value)) {  
                try{
                  const userData = await loadUserByAddress(value);
                  setAvalado(userData); 

                } catch(err){
                  console.log(err);
                }
              } else {
                setAvalado(null);
              } //check valid address
            }}
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
            helperText={avalado != null ? avalado.name ?? "No registrado" : null}
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