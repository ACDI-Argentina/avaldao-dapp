import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { selectLoading, selectUsers } from '../../redux/reducers/usersSlice'
import UserRow from './UserRow'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress, Typography } from '@material-ui/core'

/**
 * Tabla de Usuarios.
 */
const UserTable = ({ }) => {
  const users = useSelector(selectUsers);
  const loading = useSelector(selectLoading);

  const { t } = useTranslation();

  // useStyles hook for styling
  const useStyles = makeStyles((theme) => ({
    table: {
      minWidth: 650,
    }
  }))

  const classes = useStyles()

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t('userName')}</TableCell>
                <TableCell>{t('userEmail')}</TableCell>
                <TableCell>{t('userAddress')}</TableCell>
                <TableCell>{t('userRoles')}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                    <Grid container justifyContent="center" alignItems="center" style={{ height: '100px' }}>
                      <Grid item>
                        <CircularProgress size={"3rem"} />
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <UserRow key={user.address} user={user} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}



export default UserTable;

