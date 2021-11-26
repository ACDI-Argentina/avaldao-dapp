import React from 'react'

import DateUtils from 'utils/DateUtils';
import FiatUtils from '../../../utils/FiatUtils';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { makeStyles, Typography } from '@material-ui/core';
import CardHeader from 'components/Card/CardHeader';
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles({
  root: {
    minWidth: 340,
    margin: 10,
    padding: 15,
    paddingBottom: 0,
    flexShrink: 0,
  },
  header: {
    marginTop: 0,
    padding: 0
  },
  title: {
    fontSize: 24,
    fontWeight: 500
  },
  label: {
    display: "inline-block",
    fontWeight: 500
  },
  value: {
    display: "inline-block",
  }
});


const AvalCuotaCard = ({ cuota }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const statusStr = cuota?.status?.name?.toUpperCase();
  const montoFiatStr = FiatUtils.format(cuota?.montoFiat);
  const vencimiento = DateUtils.formatTimestampSeconds(cuota.timestampVencimiento);
  const desbloqueo = DateUtils.formatTimestampSeconds(cuota.timestampDesbloqueo);

  return (
    <Card className={classes.root}>
      <CardHeader className={classes.header}>
        <Typography variant={"h6"}>
          {t('avalCuota')} #{cuota.numero}
        </Typography>
      </CardHeader>
      <CardContent>
        <div>
          <Typography className={classes.label}>{t('avalCuotaAmount')}:&nbsp;</Typography>
          <Typography className={classes.value}>{montoFiatStr}</Typography>
        </div>
        <div>
          <Typography className={classes.label}>{t('avalCuotaStatus')}:&nbsp;</Typography>
          <Typography className={classes.value}>{statusStr}</Typography>
        </div>
        <div>
          <Typography className={classes.label}>{t('avalCuotaDueDate')}:&nbsp;</Typography>
          <Typography className={classes.value}>{vencimiento}</Typography>
        </div>
        <div>
          <Typography className={classes.label}>{t('avalCuotaUnlockDate')}:&nbsp;</Typography>
          <Typography className={classes.value}>{desbloqueo}</Typography>
        </div>
      </CardContent>
    </Card >

  )
}
export default AvalCuotaCard;