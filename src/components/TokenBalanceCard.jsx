import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import config from '../configuration';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import CryptoAmount from './CryptoAmount';
import TokenUtils from 'utils/TokenUtils';
import TokenAvatar from './TokenAvatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FiatAmount from 'components/FiatAmount'

class TokenBalanceCard extends Component {

  render() {
    const { tokenBalance, classes, t } = this.props;
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
              amount={tokenBalance.amount}>
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

  },
  inline: {
    display: 'inline',
  }
});

export default withStyles(styles)(
  withTranslation()(TokenBalanceCard)
);
