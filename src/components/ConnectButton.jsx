import React, { useContext, useState } from 'react';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import { useSelector } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { useTranslation } from 'react-i18next'; // useTranslation hook
import { web3Utils } from 'commons';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { history } from '@acdi/efem-dapp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PeopleIcon from '@material-ui/icons/People';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import About from './Dialogs/About';
import PrimaryButton from './buttons/PrimaryButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import config from 'configuration';
import "./ConnectButton.scss";

const useStyles = makeStyles({
  walletIcon: {
    height: '100%',
    marginTop: '-0.4em',
  },
});

const networkNames = {
  31: "Rsk Testnet",
  30: "Rsk Mainnet"
}

const ConnectButton = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation(); // Use useTranslation hook here
  const { loginAccount, logoutAccount, network, web3 } = useContext(Web3AppContext);
  const currentUser = useSelector(selectCurrentUser);

  const isUserConnected = currentUser?.address || false;
  const isUserRegistered = currentUser?.registered || false;
  const isUserAdmin = currentUser?.hasRole(config.ADMIN_ROLE) || false;
  const isCorrectNetwork = network?.isCorrect || false;

  return (
    <React.Fragment>
      {!isUserConnected && (
        <PrimaryButton
          style={{ width: '15em' }}
          onClick={() => loginAccount()}
          title={networkNames[web3.networkId] || ""}
        >
          {t('connectWallet')}
        </PrimaryButton>
      )}

      {isUserConnected && (
        <div className="connected-wrapper">
          <PrimaryButton
            title={networkNames[web3.networkId] || ""}
            color={isCorrectNetwork ? 'teal' : 'warning'}
            style={{ width: '15em' }}
            onClick={(event) => setMenuAnchorEl(event.currentTarget)}
            endIcon={menuAnchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            <div className="connected-content">
              {web3.wallet ? (
                <Icon className={classes.walletIcon}>
                  <img src={web3.wallet.logo} style={{ width: '100%' }} alt="connect" />
                </Icon>
              ) : (
                <AccountBalanceWalletIcon />
              )}

              <div className="connected-account">
                {web3Utils.abbreviateAddress(currentUser?.address)}
                {isUserRegistered &&
                  <div className="user-details">
                    <div className="user-details-avatar"> 
                      <img src={`https://give4forest.org${currentUser.avatarCid}`} alt="" className="small-avatar" />
                      { currentUser.avatar }
                      </div>
                    <div className="user-details-name"> {currentUser.name}</div>
                  </div>
                }
              </div>
            </div>
          </PrimaryButton>
        </div>
      )}

      <Menu
        id="menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={() => history.push('/profile')}>
          <ListItemIcon>
            <AccountCircleIcon style={{ color: '#7868e5' }}/>
          </ListItemIcon>
          <ListItemText primary={isUserRegistered ? t('menuProfile') : t('menuSignup')} />
        </MenuItem>

        {isUserRegistered && (
          <MenuItem onClick={() => history.push('/mis-avales')}>
            <ListItemIcon>
              <ListAltIcon style={{ color: '#7868e5' }}/>
            </ListItemIcon>
            <ListItemText primary={t('misAvalesTitle')} />
          </MenuItem>
        )}

        {isUserAdmin && (
          <MenuItem onClick={() => history.push('/users')}>
            <ListItemIcon>
              <PeopleIcon style={{ color: '#7868e5' }}/>
            </ListItemIcon>
            <ListItemText primary={t('usersTitle')} />
          </MenuItem>
        )}

        <MenuItem onClick={() => { setShowAbout(true); setMenuAnchorEl(null); }}>
          <ListItemIcon>
            <InfoIcon style={{ color: '#7868e5' }}/>
          </ListItemIcon>
          <ListItemText primary={t('aboutTitle')} />
        </MenuItem>

        <MenuItem onClick={() => { logoutAccount(); setMenuAnchorEl(null); }}>
          <ListItemIcon>
            <ExitToAppIcon style={{ color: '#7868e5' }}/>
          </ListItemIcon>
          <ListItemText primary={t('logoutTitle')} />
        </MenuItem>
      </Menu>

      <About
        fullWidth={true}
        maxWidth="sm"
        open={showAbout}
        onClose={() => setShowAbout(false)}
      />
    </React.Fragment>
  );
};

export default ConnectButton;
