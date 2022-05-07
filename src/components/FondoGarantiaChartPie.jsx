import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TokenUtils from 'utils/TokenUtils'
import { connect } from 'react-redux'
import {
  Chart,
  PieSeries,
  Title,
  Legend
} from '@devexpress/dx-react-chart-material-ui'
import {
  Animation
} from '@devexpress/dx-react-chart'
import { selectTokenBalances } from 'redux/reducers/fondoGarantiaSlice'
import Typography from '@material-ui/core/Typography';

class FondoGarantiaChartPie extends Component {

  render() {
    const { tokenBalances, classes, t } = this.props;
    let data = [];
    for (let i = 0; i < tokenBalances.length; i++) {
      const tb = tokenBalances[i];
      let tokenConfig = TokenUtils.getTokenConfig(tb.address);
      data.push({
        tokenSymbol: tokenConfig.symbol,
        tokenAmountFiat: tb.amountFiat
      });
    }

    const titleComp = (props) => {
      return (<Typography variant="subtitle1">{props.text}</Typography>)
    }

    return (
      <Chart data={data}
        width={380}
        height={380}>
        <PieSeries
          argumentField="tokenSymbol"
          valueField="tokenAmountFiat"
          innerRadius={0.6}>
        </PieSeries>
        <Title text={t('statisticsFondoGarantiaComposicion')} textComponent={titleComp} />
        <Legend />
        <Animation />
      </Chart>
    );
  }
}

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    tokenBalances: selectTokenBalances(state)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(FondoGarantiaChartPie)))
);