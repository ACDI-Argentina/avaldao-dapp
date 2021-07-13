import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Activity from '../models/Activity';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

class ActivityChip extends Component {

  constructor() {
    super();
  }

  render() {
    const { activity } = this.props;
    let label = activity.action;
    let color = 'default';
    
    if (activity.isApprove) {
      color = 'primary';
    } else if (activity.isReject) {
      color = 'secondary';
    }

    return (
      <Chip size="small"
        label={label}
        color={color}
      />
    );
  }
}

ActivityChip.propTypes = {
  activity: PropTypes.instanceOf(Activity).isRequired
};

const styles = {
  root: {
    width: '100%',
    maxWidth: '36ch',
    //backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  }
};

export default withStyles(styles)(ActivityChip);
