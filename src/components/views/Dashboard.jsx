import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { selectFondoGarantiaBalanceFiat, selectTokenBalances } from '../../redux/reducers/fondoGarantiaSlice'
import styles from "assets/jss/material-kit-react/views/componentsSections/dashboardStyle.js";
import TokenBalanceCard from 'components/TokenBalanceCard'
import StatisticsCard from 'components/StatisticsCard'
import FondoGarantiaCard from 'components/FondoGarantiaCard'
import FiatUtils from 'utils/FiatUtils'

/**
 * Dashboard con datos estadísticos.
 * 
 */
class Dashboard extends Component {

  render() {
    const { classes, tokenBalances, fondoGarantiaBalanceFiat, t } = this.props;
    return (
      <div className={classes.section}>
        <h2 className={classes.title}>
          {t('dashboardTitle')}
        </h2>
        <div>
          <h4 className={classes.description}>
            {t('dashboardExplain')}
          </h4>
          <h3 className={classes.subtitle}>
            {t('dashboardFondoGarantia') + ': ' + FiatUtils.format(fondoGarantiaBalanceFiat)}
          </h3>
          <Grid container justifyContent="space-between">
            <Grid item sm={12} md={8}>
              <Grid container spacing={3}>
                <Grid item sm={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item sm={12} xs={12}>
                      <FondoGarantiaCard />
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <StatisticsCard />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={12} md={6}>
                  <Grid container spacing={3}>
                    {tokenBalances.map(tb => (
                      <Grid item sm={12} xs={12} key={tb.address}>
                        <TokenBalanceCard tokenBalance={tb} />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} md={4} align="center" margin={5}>
              <img src={require("assets/img/fondoGarantiaImg.png")} className={classes.rightImage} />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Dashboard.contextType = Web3AppContext;

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
  withTranslation()(Dashboard)))
);
