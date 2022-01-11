import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { Typography } from '@material-ui/core'
import { selectUsers } from '../../redux/reducers/usersSlice'
import List from '@material-ui/core/List';
import UserItem from './UserItem';

/**
 * Listado de Usuarios.
 * 
 */
class UserList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { users, classes, t } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h5">
            {t('usersTitle')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List className={classes.list}>
            {users.map(user => (
              <UserItem key={user.id} user={user}></UserItem>
            ))}
          </List>
        </Grid>
      </Grid>
    );
  }
}

UserList.contextType = Web3AppContext;

const styles = theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    users: selectUsers(state)
  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(UserList)))
);