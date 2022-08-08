import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { User } from '@acdi/efem-dapp';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';

/**
 * The join Giveth community top-bar
 */
class JoinGivethCommunity extends Component {

  render() {
    return (
      <div
        id="join-giveth-community"
      >
        <div className="vertical-align">
          <center>
            <OnlyCorrectNetwork>

            </OnlyCorrectNetwork>
          </center>
        </div>
      </div>
    );
  }
}

JoinGivethCommunity.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
};

JoinGivethCommunity.defaultProps = {
  currentUser: undefined,
};

const mapStateToProps = (state, props) => ({
  currentUser: selectCurrentUser(state)
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(JoinGivethCommunity);