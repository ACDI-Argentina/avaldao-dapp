import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import AvalTaskItem from './AvalTaskItem'
import List from '@material-ui/core/List';
import { selectAvalesWithTask } from '../../redux/reducers/avalesSlice'
import Fab from '@material-ui/core/Fab';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { history } from '@acdi/efem-dapp';
import CardMembershipIcon from '@material-ui/icons/CardMembership';

import config from 'configuration'

/**
 * Lista de tareas de avales.
 * 
 */
class AvalTaskList extends Component {

  render() {
    const { currentUser, avales, user, classes, t } = this.props;
    const allowSolicitar = currentUser.hasRole(config.SOLICITANTE_ROLE);

    const goSolicitarAval = function () {
      history.push(`/aval/solicitud`);
    };

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h5">
            {t('avalTaskList')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List className={classes.root}>
            {avales.map(aval => (
              <AvalTaskItem key={aval.id}
                aval={aval}
                user={user}>
              </AvalTaskItem>
            ))}
          </List>
          {allowSolicitar &&
            <Fab color="primary"
              variant="extended"
              size="medium"
              onClick={goSolicitarAval}
              className={classes.solicitarAval}>
              <CardMembershipIcon className={classes.extendedIcon}/>
              {t("avalSolicitarBtn")}
            </Fab>
          }
        </Grid>
      </Grid>
    );
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  solicitarAval: {
    float: 'right'
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    avales: selectAvalesWithTask(state, ownProps.user)
  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalTaskList)))
);