import React from 'react'
import DateUtils from 'utils/DateUtils';
import FiatUtils from '../../../utils/FiatUtils';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, Typography } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import { useTranslation } from 'react-i18next';
import { red, yellow, green } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import StatusIndicator from 'components/StatusIndicator';
import Grid from '@material-ui/core/Grid';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import Chip from '@material-ui/core/Chip';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

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
  },
  yellow: {
    backgroundColor: yellow[800]
  },
  green: {
    backgroundColor: green[800]
  },
  red: {
    backgroundColor: red[800]
  },
  vencida: {
    marginTop: '0.5em'
  }
});


const CuotaCard = ({ cuota }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  // Cuota Pendiente
  let avatarClass = classes.yellow;
  let avatarIcon = (<CheckOutlinedIcon />);

  // Cuota Pagada
  if (cuota.isPagada()) {
    avatarClass = classes.green;
    avatarIcon = (<DoneAllOutlinedIcon />);
  }

  // Cuota Reintegrada
  if (cuota.isReintegrada()) {
    avatarClass = classes.red;
    avatarIcon = (<DoneAllOutlinedIcon />);
  }

  const numero = '#' + cuota.numero;

  const montoFiatStr = FiatUtils.format(cuota?.montoFiat);
  const vencimiento = DateUtils.formatTimestampSeconds(cuota.timestampVencimiento);
  const desbloqueo = DateUtils.formatTimestampSeconds(cuota.timestampDesbloqueo);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar className={avatarClass}>
            {avatarIcon}
          </Avatar>
        }
        title={t('avalCuota')}
        subheader={numero}>
      </CardHeader>
      <CardContent className={classes.contentRoot}>
        <Grid container className={classes.contentGrid} spacing={0}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">{t('avalMonto')}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">{montoFiatStr}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">{t('avalCuotaVencimientoDate')}</Typography>
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
          <Grid item xs={6}>
            <StatusIndicator status={cuota?.status}></StatusIndicator>
          </Grid>
          <Grid item xs={6}>
            {cuota.isPendiente() && cuota.isVencida() &&
              <Chip size="small"
                label={t('avalCuotaVencida')}
                color="secondary"
                icon={<AccessTimeIcon />}
                className={classes.vencida}
              />}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
export default CuotaCard;