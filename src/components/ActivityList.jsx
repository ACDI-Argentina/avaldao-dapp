import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Activity from '../models/Activity';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ActivityItem from './ActivityItem';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';

class ActivityList extends Component {

  render() {
    const { activities, classes, t } = this.props;
    return (
      <Container fixed>
        <Typography variant="overline">
          {t('activities')}
        </Typography>
        <List className={classes.root}>
          {activities.map(activity => (
            <ActivityItem key={activity.clientId} activity={activity}></ActivityItem>
          ))}
        </List>
        {activities.length == 0 && (
          <Typography variant="body2">
            {t('activitiesEmpty')}
          </Typography>
        )}
      </Container>
    );
  }
}

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.instanceOf(Activity)).isRequired
};

const styles = {
  root: {
    width: '100%',
    //maxWidth: '36ch',
    //backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  }
};

export default withStyles(styles)(
  withTranslation()(ActivityList)
);
