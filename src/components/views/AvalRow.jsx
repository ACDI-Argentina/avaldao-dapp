import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import StatusIndicator from 'components/StatusIndicator'
import PageviewIcon from '@material-ui/icons/Pageview'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { history } from 'lib/helpers'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { selectFondoGarantiaBalanceFiat } from '../../redux/reducers/fondoGarantiaSlice'
import FiatAmount from 'components/FiatAmount'
import FiatUtils from 'utils/FiatUtils'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

/**
 * Row de un Aval
 */
class AvalItem extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
    this.goVisualizar = this.goVisualizar.bind(this);
  }

  componentDidMount() {

  }

  goVisualizar() {
    const { aval } = this.props;
    history.push(`/aval/${aval.id}`);
  }

  render() {

    const { currentUser, aval, classes, t, fondoGarantiaBalanceFiat } = this.props;

    let allowFirmar = aval.allowFirmar(currentUser);
    let alertMessage = null;
    if (fondoGarantiaBalanceFiat.isLessThan(aval.montoFiat)) {
      const diff = aval.montoFiat.minus(fondoGarantiaBalanceFiat);
      alertMessage = t('avalFondosInsuficientes', {
        diff: FiatUtils.format(diff)
      });
      if (aval.isAvaldao(currentUser)) {
        // Cuando el usuario es Avaldao, no puede firmar si no hay fondos suficientes.
        allowFirmar = false;
      }
    }

    return (
      <TableRow key={aval.id}>
        <TableCell>
          {aval.proyecto}
        </TableCell>
        <TableCell>
          <FiatAmount amount={aval.montoFiat} />
        </TableCell>
        <TableCell>
          {aval.cuotasCantidad}
        </TableCell>
        <TableCell>
          <StatusIndicator status={aval.status}></StatusIndicator>
        </TableCell>
        <TableCell>
          <Tooltip title={t('avalVisualizarTitle')}>
            <IconButton
              edge="end"
              aria-label="visualizar"
              color="primary"
              onClick={this.goVisualizar}>
              <PageviewIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  }
}

AvalItem.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    fondoGarantiaBalanceFiat: selectFondoGarantiaBalanceFiat(state)
  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(AvalItem)))
);