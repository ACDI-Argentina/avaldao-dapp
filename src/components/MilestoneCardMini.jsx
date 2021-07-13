import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getTruncatedText, history } from '../lib/helpers'
import Campaign from '../models/Campaign'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import StatusCard from './StatusCard'
import { selectCascadeDonationsByCampaign, selectCascadeFiatAmountTargetByCampaign } from '../redux/reducers/campaignsSlice'
import DonationsBalanceMini from './DonationsBalanceMini'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Milestone } from 'models'

class MilestoneCardMini extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { t, classes, milestone } = this.props;

    return (
      <Card className={classes.root}>
        <CardMedia
          component="img"
          height="150"
          image={milestone.imageCidUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {getTruncatedText(milestone.title, 40)}
          </Typography>
          <DonationsBalanceMini
            donationIds={milestone.budgetDonationIds}
            fiatTarget={milestone.fiatAmountTarget}>
          </DonationsBalanceMini>
          <StatusCard status={milestone.status} />
        </CardContent>
      </Card>
    );
  }
}

MilestoneCardMini.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired
};

MilestoneCardMini.defaultProps = {};

const styles = theme => ({
  root: {

  }
});

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation()(MilestoneCardMini)))
)