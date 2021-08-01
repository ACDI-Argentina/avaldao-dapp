
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Status from '../models/Status';
import Chip from '@material-ui/core/Chip';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

/**
 * Presenta un estado
 */
class StatusIndicator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { status, classes } = this.props;
        let iconSize = 10;
        let icon = (<CheckCircleOutlineIcon size={iconSize} />);
        if (status.isLocal) {
            icon = (<CircularProgress size={iconSize} />);
        }
        return (
            <Chip className={classes.root}
                size="small"
                variant="outlined"
                label={status.name}
                color="primary"
                icon={icon}
            />
        );
    }
}

StatusIndicator.propTypes = {
    status: PropTypes.instanceOf(Status).isRequired,
};

StatusIndicator.defaultProps = {

};

const styles = theme => ({
    root: {
        marginTop: '0.5em'
    }
  });

export default withStyles(styles)(
    (StatusIndicator)
);