import React from 'react'
import Section from './Section'
import FiatUtils from 'utils/FiatUtils'
import { Grid, TextField } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const AvalGeneralSection = ({ aval }) => {
  const { t } = useTranslation();

  return (
    <Section>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="proyectoTextField"
            value={aval.proyecto}
            label={t('avalProyecto')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            id="propositoTextField"
            value={aval.proposito}
            label={t('avalProposito')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            id="causaTextField"
            value={aval.causa}
            label={t('avalCausa')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            readOnly
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <TextField
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
          <TextField
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
          <TextField
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
          <TextField
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