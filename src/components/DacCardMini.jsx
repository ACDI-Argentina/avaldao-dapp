import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getTruncatedText } from '../lib/helpers'
import DAC from '../models/DAC'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import StatusCard from './StatusCard'
import { selectCascadeDonationsByDac, selectCascadeFiatAmountTargetByDac } from '../redux/reducers/dacsSlice'
import DonationsBalanceMini from './DonationsBalanceMini'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

class DacCardMini extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { cascadeDonationIds, cascadeFiatAmountTarget, t, classes, dac } = this.props;

    return (
      <Card className={classes.root}>

        <CardMedia
          component="img"
          height="150"
          image={dac.imageCidUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {getTruncatedText(dac.title, 40)}
          </Typography>
          <DonationsBalanceMini
            donationIds={cascadeDonationIds}
            fiatTarget={cascadeFiatAmountTarget}>
          </DonationsBalanceMini>
          <StatusCard status={dac.status} />
        </CardContent>
      </Card>
    );
  }
}

DacCardMini.propTypes = {
  dac: PropTypes.instanceOf(DAC).isRequired
};

DacCardMini.defaultProps = {};

const styles = theme => ({
  root: {

  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    cascadeDonationIds: selectCascadeDonationsByDac(state, ownProps.dac.id),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByDac(state, ownProps.dac.id)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation()(DacCardMini)))
)