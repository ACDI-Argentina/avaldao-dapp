import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import PageviewIcon from '@material-ui/icons/Pageview'
import IconButton from '@material-ui/core/IconButton'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Tooltip from '@material-ui/core/Tooltip'
import { history } from 'lib/helpers'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

/**
 * Item de un Usuario
 * 
 */
class UserItem extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.goVisualizar = this.goVisualizar.bind(this);
  }

  componentDidMount() {

  }

  goVisualizar() {
    const { user } = this.props;
    history.push(`/user/${user.address}`);
  }

  render() {

    const { currentUser, user, classes, t, fondoGarantiaBalanceFiat } = this.props;

    return (
      <React.Fragment>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={user.avatarCidUrl} />
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={user.email}
          />
          <ListItemSecondaryAction>
            <Tooltip title={t('view')}>
              <IconButton
                edge="end"
                aria-label="visualizar"
                color="primary"
                onClick={this.goVisualizar}>
                <PageviewIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider component="li" />
      </React.Fragment>
    );
  }
}

UserItem.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(UserItem)))
);