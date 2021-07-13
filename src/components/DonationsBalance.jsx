import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import makeSelectDonationsBalance from '../redux/selectors/donationsBalanceSelector'
import { connect } from 'react-redux'
import TokenBalance from './TokenBalance';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import FiatAmount from './FiatAmount'
import { green } from '@material-ui/core/colors';
import FiatTargetProgress from './FiatTargetProgress';
import { fetchDonationsByIds } from '../redux/reducers/donationsSlice'

class DonationsBalance extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.fetchDonationsByIds(this.props.donationIds);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (JSON.stringify(this.props.donationIds) !== JSON.stringify(prevProps.donationIds)) {
      this.props.fetchDonationsByIds(this.props.donationIds);
    }
  }

  render() {
    const { balances, fiatTarget, donationIds, classes, t } = this.props;
    const donationsCount = donationIds.length;

    return (
      <Card className={classes.root}>
        <CardHeader
          className={classes.header}
          title={
            <FiatAmount amount={balances.fiatTotalBalance}></FiatAmount>
          }
          subheader={t('donationsBalance')}>
        </CardHeader>
        <CardContent className={classes.content}>

          <ListItem alignItems="flex-start" className={classes.donationsCount}>
            <ListItemAvatar>
              <Avatar className={classes.donationsCountAvatar}>
                <FavoriteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t('donations')}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {donationsCount}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {balances.tokenBalances.map(b => (
            <TokenBalance
              key={b.tokenAddress}
              tokenAddress={b.tokenAddress}
              balance={b.tokenBalance}>
            </TokenBalance>
          ))}
          {fiatTarget && (
            <FiatTargetProgress
              fiatBalance={balances.fiatTotalBalance}
              fiatTarget={fiatTarget}>
            </FiatTargetProgress>
          )}
        </CardContent>
      </Card>
    );
  }
}

DonationsBalance.propTypes = {

};

DonationsBalance.defaultProps = {

};

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  header: {
    paddingBottom: '0px'
  },
  content: {
    paddingTop: '0px'
  },
  donationsCount: {
    padding: '0px'
  },
  donationsCountAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    color: '#fff',
    backgroundColor: green[500],
  },
});

const makeMapStateToProps = () => {
  const selectDonationsBalance = makeSelectDonationsBalance()
  const mapStateToProps = (state, ownProps) => {
    return {
      balances: selectDonationsBalance(state, ownProps.donationIds)
    };
  }
  return mapStateToProps
}

const mapDispatchToProps = { fetchDonationsByIds }

export default connect(makeMapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DonationsBalance)
  )
);