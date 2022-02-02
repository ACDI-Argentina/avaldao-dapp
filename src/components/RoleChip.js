import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

class RoleChip extends Component {

    render() {
        const { role, classes } = this.props;
        return (
            <Chip label={role.label}
                className={classes.chip}
                size="small"
                color="secondary"
                icon={<AccountCircleIcon/>} />
        );
    }
}

const styles = theme => ({
    chip: {
        margin: 2,
    }
});

export default withStyles(styles)(RoleChip);