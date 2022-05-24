import React from 'react'
import Section from './Section'
import FiatUtils from 'utils/FiatUtils'
import { Grid } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import InputField from 'components/InputField';

const AvalGeneralSection = ({ aval }) => {
  const { t } = useTranslation();

  return (
    <Section>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InputField
            id="proyectoTextField"
            value={aval.proyecto}
            label={t('avalProyecto')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            id="objetivoTextField"
            value={aval.objetivo}
            label={t('avalObjetivo')}
            fullWidth
            margin="normal"
            multiline
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <InputField
            id="adquisicionTextField"
            value={aval.adquisicion}
            label={t('avalAdquisicion')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <InputField
            id="beneficiariosTextField"
            value={aval.beneficiarios}
            label={t('avalBeneficiarios')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <InputField
            id="montoTextField"
            value={FiatUtils.format(aval.montoFiat)}
            label={t('avalMonto')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <InputField
            id="cuotasCantidadTextField"
            value={aval.cuotasCantidad}
            label={t('avalCuotasCantidad')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>

      </Grid>
    </Section>
  )
}
export default AvalGeneralSection;