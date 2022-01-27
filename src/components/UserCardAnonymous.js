import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import AddressLink from './AddressLink';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

class UserCardAnonymous extends Component {

    render() {
        const { address, classes, t } = this.props;
        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar src={require("assets/img/default-user-icon.png")} className={classes.logo} />
                    }
                    title={<Typography
                        variant="body2"
                        color="textSecondary"
                    >
                        {t('userAnonymous')}
                    </Typography>}
                    subheader={
                        <AddressLink address={address} />
                    }>
                </CardHeader>
            </Card>
        );
    }
}

UserCardAnonymous.propTypes = {
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

    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(
        withTranslation()(UserCardAnonymous)
    )
);