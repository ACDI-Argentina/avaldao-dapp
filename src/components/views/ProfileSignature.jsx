import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { selectUserByAddress, fetchUserByAddress } from '../../redux/reducers/usersSlice'
import { withStyles } from '@material-ui/core/styles';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { yellow, green, grey } from '@material-ui/core/colors';

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

        let avatarClass = classes.yellow;
        let signatureText = t('noSignature');;
        let signatureColor = grey[300];
        if (signature) {
            avatarClass = classes.green;
            signatureText = signature;
            signatureColor = green[400];
        }

        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Tooltip title={signatureText}>
                            <Avatar className={avatarClass}>
                                <VpnKeyIcon />
                            </Avatar>
                        </Tooltip>
                    }
                    title={title}
                    subheader={name}>
                </CardHeader>
            </Card>
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
    },
    root: {
        minWidth: 250,
        marginRight: 15
    },
    yellow: {
        backgroundColor: yellow[800]
    },
    green: {
        backgroundColor: green[800]
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