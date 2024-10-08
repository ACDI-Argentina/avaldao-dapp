import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { useTranslation, withTranslation } from 'react-i18next'
import IconButton from '@material-ui/core/IconButton'
import { history } from '@acdi/efem-dapp'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import AddressLink from '../AddressLink'
import { RoleChip } from '@acdi/efem-dapp'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import config from 'configuration'
import { ipfsService } from 'commons'
import { makeStyles } from '@material-ui/core/styles'
import './UserTable.scss'

/**
 * Row de un Usuario
 */
const UserRow = ({ user }) => {
  const currentUser = useSelector(selectCurrentUser)
  const {t} = useTranslation();

  const useStyles = makeStyles((theme) => ({
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  }))

  const classes = useStyles()

  const goEdit = () => {
    history.push(`/user/${user.address}/edit`)
  }

  const editEnabled = currentUser.hasRole(config.ADMIN_ROLE) || false

  return (
    <TableRow>
      <TableCell>
        <Avatar src={ipfsService.resolveUrl(user.avatarCid)} />
      </TableCell>
      <TableCell>
        {user.name}
      </TableCell>
      <TableCell>
        {user.email}
      </TableCell>
      <TableCell className="address-container">
        <AddressLink address={user.address} showFullAddress={true} showCopy={true} />
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
          onClick={goEdit}
          disabled={!editEnabled}>
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default UserRow;
