import React from 'react'
import NoAvailable from './NoAvailable';
import ReclamoCard from '../cards/ReclamoCard';
import Section from './Section';
import { useTranslation } from 'react-i18next';
import { makeStyles, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

const ReclamosSection = ({ aval }) => {

  const classes = useStyles();
  const { t } = useTranslation();

  const available = aval.showReclamos();
  const hasReclamos = aval.reclamos.length > 0;

  return (
    <Section>
      <Typography variant="subtitle1">{t('avalClaimSection')}</Typography>
      {available ?
        (hasReclamos ? (<Grid container className={classes.root} spacing={1}>
          {aval.reclamos.map((reclamo, idx) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={idx}>
              <ReclamoCard reclamo={reclamo} />
            </Grid>
          ))}
        </Grid>) :
          (<Typography variant="body2" color="textSecondary" component="p">{t('noClaims')}</Typography>)
        ) :
        (<NoAvailable />)
      }
    </Section>
  )
}
export default ReclamosSection;