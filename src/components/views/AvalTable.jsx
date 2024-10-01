import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import AvalRow from './AvalRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

/**
 * Tabla de Avales.
 * 
 */
class AvalTable extends Component {

  render() {
    const { avales, classes, t } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>

                  <TableCell>{t('avalApplicationDate')}</TableCell>
                  <TableCell>{t('avalProyecto')}</TableCell>
                  <TableCell>{t('avalMonto')}</TableCell>
                  <TableCell>{t('avalCuotasCantidad')}</TableCell>
                  <TableCell>{t('avalEstado')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {avales.sort((a,b)=> b.createdAt - a.createdAt).map(aval => (
                  <AvalRow key={aval.id} aval={aval}></AvalRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  }
}

AvalTable.contextType = Web3AppContext;

const styles = theme => ({
  table: {
    minWidth: 650,
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
  withTranslation()(AvalTable)))
);