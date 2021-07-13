import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import makeSelectDonationsBalance from '../redux/selectors/donationsBalanceSelector'
import { connect } from 'react-redux'
import { green } from '@material-ui/core/colors'
import FiatTargetProgress from './FiatTargetProgress'
import { fetchDonationsByIds } from '../redux/reducers/donationsSlice'

class DonationsBalanceMini extends Component {

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
    const { balances, fiatTarget, classes, t } = this.props;

    return (
      <FiatTargetProgress
        fiatBalance={balances.fiatTotalBalance}
        fiatTarget={fiatTarget}>
      </FiatTargetProgress>
    );
  }
}

DonationsBalanceMini.propTypes = {

};

DonationsBalanceMini.defaultProps = {

};

const styles = theme => ({
  root: {
    /*marginTop: '2em'*/
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
    withTranslation()(DonationsBalanceMini)
  )
);