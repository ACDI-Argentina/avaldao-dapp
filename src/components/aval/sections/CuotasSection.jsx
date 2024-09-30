import React from 'react'
import { useTranslation } from 'react-i18next';
import CuotaCard from '../cards/CuotaCard';
import NoAvailable from './NoAvailable';
import Section from './Section';
import { makeStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CuotasTable from '../CuotasTable/CuotasTable';
import Aval from 'models/Aval';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

const CuotasSection = ({ aval }) => {

  const classes = useStyles();
  const { t } = useTranslation();

  const available = aval.showCuotas();
  const avalCuotasTs = aval.getCuotasTimestamp().map(ts => new Date(ts * 1000));
  const renderCuotas = aval.status?.id === 0 || aval.status?.id === 2 || aval.status?.name == "Actualizando";

  return (
    <Section>
      <Typography variant="subtitle1">{t('avalCuotaSection')}</Typography>
      {available ?
        (<Grid container className={classes.root} spacing={1}>
          {aval.cuotas.map((cuota, idx) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={idx}>
              <CuotaCard cuota={cuota} />
            </Grid>
          ))}
        </Grid>
        ) : renderCuotas ?
          <CuotasTable aval={aval} timestampCuotas={avalCuotasTs}/>
          :
          (<NoAvailable />)
      }
    </Section>
  )
}
export default CuotasSection;