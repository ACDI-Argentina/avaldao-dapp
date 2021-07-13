import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import DonationItem from './DonationItem';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { fetchDonationsByIds } from '../redux/reducers/donationsSlice'
import { connect } from 'react-redux'

class DonationList extends Component {

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
    const { donationIds, classes, t } = this.props;
    return (
      <Container fixed>
        <List className={classes.root}>
          {donationIds.map(donationId => (
            <DonationItem key={donationId} donationId={donationId}></DonationItem>
          ))}
        </List>
        {donationIds.length == 0 && (
          <Typography variant="body2">
            {t('donationsEmpty')}
          </Typography>
        )}
      </Container>
    );
  }
}

DonationList.propTypes = {
  
};

const styles = {
  root: {
    width: '100%'
  },
  inline: {
    display: 'inline',
  }
};

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = { fetchDonationsByIds }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DonationList)
  )
)