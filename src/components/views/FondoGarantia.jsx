import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import FiatAmount from 'components/FiatAmount'
import { selectTokenBalances, selectFondoGarantiaBalanceFiat } from '../../redux/reducers/fondoGarantiaSlice'
import styles from "assets/jss/material-kit-react/views/landingPageSections/fondoGarantiaStyle.js";
import { Typography } from '@material-ui/core'
import TokenBalanceCard from 'components/TokenBalanceCard'

/**
 * Fondo de Garantía.
 * 
 */
class FondoGarantia extends Component {

  render() {
    const { classes, tokenBalances, fondoGarantiaBalanceFiat, t } = this.props;
    return (
      <div>
        <h3 className={classes.subtitle}>
          {t('fondoGarantia')}
        </h3>
        <h4 className={classes.description}>
          {t('fondoGarantiaExplain')}
        </h4>
        <h3 className={classes.subtitle}>
          <FiatAmount amount={fondoGarantiaBalanceFiat}></FiatAmount>
        </h3>
        <Grid container justifyContent="space-between">
          <Grid item sm={12} md={8}>
            <Grid container spacing={3}>
              {tokenBalances.map(tb => (
                <Grid item sm={12} md={6} key={tb.address}>
                  <TokenBalanceCard tokenBalance={tb} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item sm={12} md={4} align="center" margin={5}>
            <img src={require("assets/img/fondoGarantiaImg.png")} className={classes.rightImage} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

FondoGarantia.contextType = Web3AppContext;

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
  withTranslation()(FondoGarantia)))
);
