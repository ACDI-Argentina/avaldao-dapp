import React from 'react'
import DateUtils from 'utils/DateUtils';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, Typography } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import { useTranslation } from 'react-i18next';
import { yellow, green } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import StatusIndicator from 'components/StatusIndicator';
import Grid from '@material-ui/core/Grid';
import ReportOutlinedIcon from '@material-ui/icons/ReportOutlined';
import ReportOffOutlinedIcon from '@material-ui/icons/ReportOffOutlined';

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
  yellow: {
    backgroundColor: yellow[800]
  },
  green: {
    backgroundColor: green[800]
  }
});

const ReclamoCard = ({ reclamo }) => {

  const classes = useStyles();
  const { t } = useTranslation();

  let avatarClass = classes.yellow;
  let avatarIcon = (<ReportOutlinedIcon />);
  if(!reclamo.isVigente()) {
    avatarClass = classes.green;
    avatarIcon = (<ReportOffOutlinedIcon />);
  }
  const numero = '#' + reclamo.numero;
  const creacion = DateUtils.formatTimestampSeconds(reclamo.timestampCreacion);

  const creacionISO = DateUtils.formatLocalDate(new Date(reclamo.timestampCreacion * 1000).toISOString(), true);


  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar className={avatarClass}>
            {avatarIcon}
          </Avatar>
        }
        title={t('avalReclamo')}
        subheader={numero}>
      </CardHeader>
      <CardContent className={classes.contentRoot}>
        <Grid container className={classes.contentGrid} spacing={0}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p">{t('avalReclamoCreacion')}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary" component="p" title={creacionISO}>{creacion}</Typography>
          </Grid>
          <Grid item xs={12}>
            <StatusIndicator status={reclamo.status}></StatusIndicator>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReclamoCard;