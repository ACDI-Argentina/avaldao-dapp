import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import FiatAmount from 'components/FiatAmount'
import { selectTokenBalances, selectFondoGarantiaBalanceFiat } from '../../redux/reducers/fondoGarantiaSlice'
import { Typography } from '@material-ui/core'
import TokenBalanceCard from 'components/TokenBalanceCard'

/**
 * Fondo de Garantía.
 * 
 */
class FondoGarantia extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { tokenBalances, fondoGarantiaBalanceFiat, t } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h5">
            {t('fondoGarantia')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <FiatAmount amount={fondoGarantiaBalanceFiat}></FiatAmount>
          </Typography>
          {t('fondoGarantiaExplain')}
        </Grid>
        {tokenBalances.map(tb => (
          <Grid item sm={12} md={4}>
            <TokenBalanceCard key={tb.address} tokenBalance={tb} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

FondoGarantia.contextType = Web3AppContext;

const styles = theme => ({


});

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