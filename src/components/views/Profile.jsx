/* eslint-disable prefer-destructuring */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import { feathersClient } from '../../lib/feathersClient';
import GoBackButton from '../GoBackButton';
import Loader from '../Loader';
import { getUserName, getUserAvatar } from '../../lib/helpers';
import config from '../../configuration';

/**
 * The user profile view mapped to /profile/{userAddress}
 *
 * @param history      Browser history object
 * @param wallet       Wallet object with the balance and all keystores
 */
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hasError: false,
      etherScanUrl: config.network.explorer,
      userAddress: '',
      visiblePages: 10,
      itemsPerPage: 25
    };
  }

  componentDidMount() {
    const { userAddress } = this.props.match.params;

    feathersClient
      .service('users')
      .find({ query: { address: userAddress } })
      .then(resp => {
        this.setState(
          Object.assign(
            {},
            {
              userAddress,
            },
            resp.data[0],
            {
              isLoading: false,
              hasError: false,
            },
          ),
          () => {
          },
        );
      })
      .catch(() =>
        this.setState({
          userAddress,
          isLoading: false,
          hasError: true,
        }),
      );
  }

  render() {
    const { history } = this.props;
    const {
      isLoading,
      hasError,
      avatar,
      name,
      email,
      url,
      etherScanUrl,
      visiblePages,
      userAddress,
    } = this.state;
    const user = {
      name,
      avatar,
    };

    return (
      <div id="profile-view">
        <div className="container-fluid page-layout dashboard-table-view">
          <div className="row">
            <div className="col-md-8 m-auto">
              {isLoading && <Loader className="fixed" />}

              {!isLoading && !hasError && (
                <div>
                  <GoBackButton history={history} />

                  <center>
                    <Avatar size={100} src={getUserAvatar(user)} round />
                    <h1>{getUserName(user)}</h1>
                    {etherScanUrl && (
                      <p>
                        <a href={`${etherScanUrl}address/${userAddress}`}>{userAddress}</a>
                      </p>
                    )}
                    {!etherScanUrl && <p>{userAddress}</p>}
                    <p>{email}</p>
                    <p><a title="User url" href={url} target="_blank" >{url}</a></p>
                  </center>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userAddress: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Profile;