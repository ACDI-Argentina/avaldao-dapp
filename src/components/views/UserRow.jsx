import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import IconButton from '@material-ui/core/IconButton'
import { history } from 'lib/helpers'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import AddressLink from '../AddressLink';
import RoleChip from 'components/RoleChip'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

/**
 * Row de un Usuario
 */
class UserRow extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.goEdit = this.goEdit.bind(this);
  }

  goEdit() {
    const { user } = this.props;
    history.push(`/user/${user.address}/edit`);
  }

  render() {

    const { currentUser, user, classes } = this.props;

    const editEnabled = currentUser.isAvaldao();

    return (
      <TableRow>
        <TableCell>
          <Avatar src={user.avatarCidUrl} />
        </TableCell>
        <TableCell>
          {user.name}
        </TableCell>
        <TableCell>
          {user.email}
        </TableCell>
        <TableCell>
          <AddressLink address={user.address} />
        </TableCell>
        <TableCell>
          <div className={classes.chips}>
            {user.roles.map((role) => (
              <RoleChip key={role.value} role={role} />
            ))}
          </div>
        </TableCell>
        <TableCell>
          <IconButton
            edge="end"
            aria-label="edit"
            color="primary"
            onClick={this.goEdit}
            disabled={!editEnabled}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }
}

UserRow.contextType = Web3AppContext;

const styles = theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(UserRow)))
);