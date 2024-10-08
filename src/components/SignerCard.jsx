import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, withTranslation } from 'react-i18next';
import { selectUserByAddress, fetchUserByAddress } from '../redux/reducers/usersSlice';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import AddressLink from './AddressLink';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import GestureIcon from '@material-ui/icons/Gesture';
import { Button, Grid } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { ipfsService } from 'commons';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';

import "./SignerCard.scss";

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 250,
    marginRight: 15
  }
}));

const SignerCard = ({ address, title, signature, requestSign }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let signed = false;

  const user = useSelector(state => selectUserByAddress(state, address));
  const currentUser = useSelector(selectCurrentUser);

  const canSign = currentUser.authenticated && currentUser?.address !==null && currentUser?.address === user?.address;


  useEffect(() => {
    if (address) {
      dispatch(fetchUserByAddress(address));
    }
  }, [address, dispatch]);

  let userAvatar = <Avatar src={require('assets/img/default-user-icon.png')} />;
  let userName = t('userNotRegistered');
  if (user && user.registered) {
    userAvatar = <Avatar src={ipfsService.resolveUrl(user.avatarCid)} />;
    userName = user.name;
  }

  let signatureTooltip = canSign? t('avalFirmarTitle'):t('notSigned');
  let signatureText = t('notSigned');
  let signatureVariant = 'outlined';

  if (signature) {
    signed = true;
    signatureTooltip = signature;
    signatureText = t('signed');
    signatureVariant = 'default';
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={userAvatar}
        title={title}
        subheader={userName}
      />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <AddressLink address={address} />
          </Grid>
          <Grid item xs={6}>
            <Tooltip title={signatureTooltip}>
              {canSign && !signed ? (
                <button
                  onClick={() => {
                    if(typeof requestSign === "function"){
                      requestSign();
                    }
                  }}
                  className="custom-chip-button"
  
                >
                  <GestureIcon className="icon" />
                  {t("avalFirmarTitle")}
                </button>
              ) : (
                <Chip
                  size="small"
                  icon={<GestureIcon />}
                  label={signatureText}
                  color="primary"
                  variant={signatureVariant}

                />
              )}
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

SignerCard.propTypes = {
  address: PropTypes.string
};

export default withTranslation()(SignerCard);
