import React, { useContext, useState } from 'react';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import { useSelector } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import Button from "components/CustomButtons/Button.js";
import Web3Utils from 'lib/blockchain/Web3Utils';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { history } from '../lib/helpers';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PeopleIcon from '@material-ui/icons/People';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import About from './Dialogs/About';

const useStyles = makeStyles({
  walletIcon: {
    height: '100%',
    marginTop: '-0.4em'
  }
});

const ConnectButton = (props) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const classes = useStyles();
  const { t } = props;
  const {
    loginAccount,
    logoutAccount,
    network,
    web3,
  } = useContext(Web3AppContext);
  const currentUser = useSelector(selectCurrentUser);

  const isUserConnected = currentUser?.address || false;
  const isUserRegistered = currentUser?.registered || false;
  const isUserAdmin = currentUser?.isAdmin() || false;
  const isCorrectNetwork = network?.isCorrect || false;

  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleClickProfile = () => {
    history.push(`/profile`);
  };

  const handleClickWorkspace = () => {
    history.push(`/workspace`);
  };

  const handleClickUsers = () => {
    history.push(`/users`);
  };

  const handleClickAbout = () => {
    setShowAbout(true);
    setMenuAnchorEl(null);
  };

  const handleClickLogout = () => {
    history.push(``);
    logoutAccount();
    setMenuAnchorEl(null);
  };

  return (
    <React.Fragment>

      {!isUserConnected && (
        <Button color="primary"
          round
          className="btn btn-info"
          style={{ width: '15em' }}
          onClick={() => loginAccount()}>
          {t('connectWallet')}
        </Button>
      )}

      {isUserConnected && (
        <Button color={isCorrectNetwork ? "success" : "warning"}
          round
          className="btn btn-info"
          style={{ width: '15em' }}
          onClick={handleOpenMenu}
          startIcon={
            web3.wallet ?
              <Icon className={classes.walletIcon}>
                <img src={web3.wallet.logo}
                  style={{ width: '100%' }}
                  alt="connect" />
              </Icon> :
              <AccountBalanceWalletIcon />
          }>
          {Web3Utils.abbreviateAddress(currentUser?.address)}
        </Button>
      )}

      <Menu
        id="menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={
          handleClickProfile
        }>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary={isUserRegistered ? t('menuProfile') : t('menuSignup')} />
        </MenuItem>
        {isUserRegistered &&
          <MenuItem onClick={
            handleClickWorkspace
          }>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary={t('workspaceTitle')} />
          </MenuItem>}
        {isUserAdmin &&
          <MenuItem onClick={
            handleClickUsers
          }>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={t('usersTitle')} />
          </MenuItem>}
        <MenuItem onClick={
          handleClickAbout
        }>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary={t('aboutTitle')} />
        </MenuItem>
        <MenuItem onClick={
          handleClickLogout
        }>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={t('logoutTitle')} />
        </MenuItem>
      </Menu>
      <About
        fullWidth={true}
        maxWidth="sm"
        open={showAbout}
        onClose={() => {
          setShowAbout(false);
        }}
      >
      </About>

    </React.Fragment>
  );
};

export default withTranslation()(ConnectButton);