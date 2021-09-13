import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { selectUserByAddress, fetchUserByAddress } from '../../redux/reducers/usersSlice'
import { withStyles } from '@material-ui/core/styles';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import { green, grey } from '@material-ui/core/colors';

class ProfileSignature extends Component {

    componentDidMount() {
        if (this.props.address) {
            this.props.fetchUserByAddress(this.props.address);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.address !== prevProps.address) {
            this.props.fetchUserByAddress(this.props.address);
        }
    }

    render() {
        const { address, user, title, signature, classes, t } = this.props;

        if (!address || !user) {
            return null;
        }

        let name = t('userUnknown');
        if (user.name) {
            name = user.name;
        }

        let signatureText = t('noSignature');;
        let signatureColor = grey[300];
        if (signature) {
            signatureText = signature;
            signatureColor = green[400];
        }

        return (
            <ListItem>
                <ListItemIcon style={{ minWidth: "unset", marginRight: "1em" }}>
                    <Tooltip title={signatureText}>
                        <VpnKeyIcon style={{ color: signatureColor }} />
                    </Tooltip>
                </ListItemIcon>
                <ListItemText
                    primary={title}
                    secondary={name} />
            </ListItem>
        );
    }
}

ProfileSignature.propTypes = {
    address: PropTypes.string
};

ProfileSignature.defaultProps = {

};

const styles = theme => ({
    logo: {
        width: theme.spacing(6),
        height: theme.spacing(6),
    }
});

const mapStateToProps = (state, props) => {
    return {
        user: selectUserByAddress(state, props.address)
    }
}

const mapDispatchToProps = { fetchUserByAddress }

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(
        withTranslation()(ProfileSignature)
    )
);