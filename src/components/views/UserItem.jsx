import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Tooltip from '@material-ui/core/Tooltip'
import { history } from 'lib/helpers'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'

/**
 * Item de un Usuario
 * 
 */
class UserItem extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.goEdit = this.goEdit.bind(this);
  }

  componentDidMount() {

  }

  goEdit() {
    const { user } = this.props;
    history.push(`/user/${user.address}/edit`);
  }

  render() {

    const { currentUser, user, classes, t } = this.props;

    const editEnabled = currentUser.isAvaldao();

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
            <Tooltip title={t('edit')}>
              <IconButton
                edge="end"
                aria-label="edit"
                color="primary"
                onClick={this.goEdit}
                disabled={!editEnabled}>
                <EditIcon />
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