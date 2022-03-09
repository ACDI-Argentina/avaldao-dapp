import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import CryptoAmount from './CryptoAmount';
import TokenUtils from 'utils/TokenUtils';
import TokenAvatar from './TokenAvatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FiatAmount from 'components/FiatAmount'

class TokenBalanceCard extends Component {

  render() {
    const { tokenBalance, classes } = this.props;
    let tokenConfig = TokenUtils.getTokenConfig(tokenBalance.address);
    let symbol = tokenConfig.symbol;
    return (
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <TokenAvatar tokenAddress={tokenBalance.address} />
          }
          title={symbol}
          subheader={
            <CryptoAmount
              tokenAddress={tokenBalance.address}
              amount={tokenBalance.amount}
              color={"#FFF"}>
            </CryptoAmount>
          }
        />
        <CardContent>          
            <FiatAmount amount={tokenBalance.amountFiat}></FiatAmount>
        </CardContent>
      </Card>
    );
  }
}

const styles = theme => ({
  root: {
    border: '1px solid #DDD',
    borderRadius: '10px',
    padding: ".5em",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(5px)",
    boxShadow: "0px 4px 25px 2px rgba(0, 0, 0, 0.15), inset -5px -5px 0px -10px rgba(255, 255, 255, 0.1), inset 5px 5px 10px rgba(255, 255, 255, 0.1)",
    color: "#FFF"
  },
  inline: {
    display: 'inline',
    fontWeight: "bold"
  }
});

export default withStyles(styles)(
  withTranslation()(TokenBalanceCard)
);
