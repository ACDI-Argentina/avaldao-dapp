import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import AddressLink from './AddressLink';

class ProfileCardAnonymous extends Component {

    render() {
        const { address, classes, t } = this.props;
        return (
            <ListItem alignItems="flex-start" className={classes.root}>
                <ListItemAvatar>
                    <Avatar src={require("assets/img/default-user-icon.png")} className={classes.logo} />
                </ListItemAvatar>
                <ListItemText
                    primary={<AddressLink address={address} />}
                    secondary={
                        <Typography
                            variant="body2"
                            color="textSecondary"
                        >
                            {t('userAnonymous')}
                        </Typography>
                    } />
            </ListItem>
        );
    }
}

ProfileCardAnonymous.propTypes = {
    address: PropTypes.string
};

const styles = theme => ({
    root: {
        padding: '0px'
    },
    inline: {
        display: 'inline',
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
        withTranslation()(ProfileCardAnonymous)
    )
);