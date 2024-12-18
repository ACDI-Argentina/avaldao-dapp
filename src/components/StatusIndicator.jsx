
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Status } from '@acdi/efem-dapp';
import Chip from '@material-ui/core/Chip';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

/**
 * Presenta un estado
 */
class StatusIndicator extends Component {

    render() {
        const { status, classes } = this.props;
        let iconSize = 10;
        let icon = (<CheckCircleOutlineIcon size={iconSize} />);
        if (status.isLocal) {
            icon = (<CircularProgress size={iconSize} />);
        }
        if(status.id == 1){
            icon = (<ErrorOutlineIcon size={iconSize} />);
        }

        const statusClassMap = {
            0: classes.solicitado,
            1: classes.rechazado,
            2: classes.aceptado,
            3: classes.vigente,
            4: classes.finalizado,
        };

        const dynamicClass = statusClassMap[status.id] || classes.root;

        return (
            <Chip className={`${classes.root} ${dynamicClass}`}
                size="small"
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
        marginTop: '0.5em',
    },
    solicitado: {
        color: '#6C757D',
        backgroundColor: '#F8F9FA',
    },
    rechazado: {
        color: '#FF0000',
        backgroundColor: '#FFEBEB',
    },
    aceptado: {
        color: '#52D681',
        backgroundColor: '#E0FFEB'
    },
    vigente: {
        color: '#007BFF',
        backgroundColor: '#D9EFFF',
    },
    finalizado: {
        color: '#6C757D',
        backgroundColor: '#E9ECEF',
    },
    default: {
        color: '#AAAAAA',
        backgroundColor: '#F5F5F5',
    },
});

export default withStyles(styles)(
    (StatusIndicator)
);