import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { selectTokenBalances, selectFondoGarantiaBalanceFiat } from '../../redux/reducers/fondoGarantiaSlice'
import styles from "assets/jss/material-kit-react/views/landingPageSections/cifrasStyle.js";
import FondoGarantia from './FondoGarantia'

/**
 * Fondo de Garantía.
 * 
 */
class Cifras extends Component {

  render() {
    const { classes, t } = this.props;
    return (
      <div className={classes.section}>
        <h2 className={classes.title}>
          {t('fondoGarantiaHomeTitle')}
        </h2>
        <FondoGarantia></FondoGarantia>
      </div>
    );
  }
}

Cifras.contextType = Web3AppContext;

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    tokenBalances: selectTokenBalances(state),
    fondoGarantiaBalanceFiat: selectFondoGarantiaBalanceFiat(state)
  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(Cifras)))
);
