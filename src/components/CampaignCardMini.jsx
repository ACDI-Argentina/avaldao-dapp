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

class CampaignCardMini extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { cascadeDonationIds, cascadeFiatAmountTarget, t, classes, campaign } = this.props;

    return (
      <Card className={classes.root}>

        <CardMedia
          component="img"
          height="150"
          image={campaign.imageCidUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {getTruncatedText(campaign.title, 40)}
          </Typography>
          <DonationsBalanceMini
            donationIds={cascadeDonationIds}
            fiatTarget={cascadeFiatAmountTarget}>
          </DonationsBalanceMini>
          <StatusCard status={campaign.status} />
        </CardContent>
      </Card>
    );
  }
}

CampaignCardMini.propTypes = {
  campaign: PropTypes.instanceOf(Campaign).isRequired
};

CampaignCardMini.defaultProps = {};

const styles = theme => ({
  root: {

  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    cascadeDonationIds: selectCascadeDonationsByCampaign(state, ownProps.campaign.id),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByCampaign(state, ownProps.campaign.id)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation()(CampaignCardMini)))
)