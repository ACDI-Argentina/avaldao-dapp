import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { selectUserByAddress, fetchUserByAddress } from '../redux/reducers/usersSlice'
import Avatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'
import AddressLink from './AddressLink'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Chip from '@material-ui/core/Chip'
import GestureIcon from '@material-ui/icons/Gesture';
import { Grid } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

class SignerCard extends Component {

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
        const { title, address, signature, user, classes, t } = this.props;

        let userAvatar = (<Avatar src={require("assets/img/default-user-icon.png")} />);
        let userName = t('userNotRegistered');
        if (user && user.registered) {
            userAvatar = (<Avatar src={user.avatarCidUrl} />);
            userName = user.name;
        }

        let signatureTooltip = t('notSigned');
        let signatureText = t('notSigned');
        let signatureColor = 'secondary';
        if (signature) {
            signatureTooltip = signature;
            signatureText = t('signed');
            signatureColor = 'primary';
        }

        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={userAvatar}
                    title={title}
                    subheader={userName}>
                </CardHeader>
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <AddressLink address={address} />
                        </Grid>
                        <Grid item xs={6}>
                            <Tooltip title={signatureTooltip} >
                                <Chip
                                    size="small"
                                    icon={<GestureIcon />}
                                    label={signatureText}
                                    color={signatureColor} />
                            </Tooltip>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

SignerCard.propTypes = {
    address: PropTypes.string
};

const styles = theme => ({
    root: {
        minWidth: 250,
        marginRight: 15
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
        withTranslation()(SignerCard)
    )
);