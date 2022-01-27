import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { selectUserByAddress, fetchUserByAddress } from '../redux/reducers/usersSlice'
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import UserCardAnonymous from './UserCardAnonymous';
import AddressLink from './AddressLink';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

class UserCard extends Component {

    preventDefault = (event) => event.preventDefault();

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
        const { address, user, classes } = this.props;
        if (!user || !user.registered) {
            return (
                <UserCardAnonymous address={address} />
            )
        }
        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar src={user.avatarCidUrl} />
                    }
                    title={user.name}
                    subheader={
                        <AddressLink address={address} />
                    }>
                </CardHeader>
            </Card>
        );
    }
}

UserCard.propTypes = {
    address: PropTypes.string
};

const styles = theme => ({
    root: {
        minWidth: 250,
        marginRight: 15
    },
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
        withTranslation()(UserCard)
    )
);