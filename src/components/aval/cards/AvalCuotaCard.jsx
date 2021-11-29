import React from 'react'

import DateUtils from 'utils/DateUtils';
import FiatUtils from '../../../utils/FiatUtils';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { makeStyles, Typography } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import { useTranslation } from 'react-i18next';
import { red } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import StatusIndicator from 'components/StatusIndicator';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    minWidth: 250,
    marginRight: 15
  },
  contentRoot: {
    paddingTop: 0,
    paddingBottom: 0
  },
  contentGrid: {
    flexGrow: 1
  },
  avatar: {
    backgroundColor: red[500],
  }
});


const AvalCuotaCard = ({ cuota }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const montoFiatStr = FiatUtils.format(cuota?.montoFiat);
  const vencimiento = DateUtils.formatTimestampSeconds(cuota.timestampVencimiento);
  const desbloqueo = DateUtils.formatTimestampSeconds(cuota.timestampDesbloqueo);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            #{cuota.numero}
          </Avatar>
        }
        title={t('avalCuota')}
        subheader={montoFiatStr}>
      </CardHeader>
      <CardContent className={classes.contentRoot}>
        <Grid container className={classes.contentGrid} spacing={0}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">{t('avalCuotaDueDate')}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">{vencimiento}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">{t('avalCuotaUnlockDate')}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">{desbloqueo}</Typography>
          </Grid>
          <Grid item xs={12}>
            <StatusIndicator status={cuota?.status}></StatusIndicator>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
export default AvalCuotaCard;