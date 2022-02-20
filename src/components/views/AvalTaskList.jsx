import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import AvalTaskItem from './AvalTaskItem'
import List from '@material-ui/core/List';
import { selectAvalesWithTask } from '../../redux/reducers/avalesSlice'

/**
 * Lista de tareas de avales.
 * 
 */
class AvalTaskList extends Component {

  render() {
    const { avales, user, classes, t } = this.props;
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
});

const mapStateToProps = (state, ownProps) => {
  return {
    avales: selectAvalesWithTask(state, ownProps.user)
  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalTaskList)))
);