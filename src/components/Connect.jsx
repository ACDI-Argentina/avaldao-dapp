import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import { useSelector } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import AccountDetailsModal from 'components/Dialogs/AccountDetailsModal';

import { withTranslation } from 'react-i18next';
import Button from "components/CustomButtons/Button.js";

const Wrapper = styled.div``;

const AddressWrapper = styled.div`
  display: flex;
  align-items:center;
`;

const WalletIndicator = styled.div`
  padding: 0px 5px;
`;

const AddressLabel = styled.div`

  @media (max-width: 500px) {
    font-size: 12px;
    margin: 0px;
    padding: 3px 10px;
    margin: 5px;
    border-radius: 14px;
  }

  :hover{
    box-shadow: 0 4px 2px 0 rgba(0,0,0,0.2);
  }

  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 30px;
  border-radius: 40px;

  ${(props) =>
    props.success &&
    `
    color: #53a653;
    border: 1px solid #53a653;
    background-color: #48d24838;
  `}

  ${(props) =>
    props.warning &&
    `
    color: #ffc107;
    border: 1px solid #ffc107;
    background-color: #ffc10738;
  `}
`;

const Connect = (props) => {
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  //const addr = toChecksumAddress(currentUser?.address);
  const addr = currentUser?.address;
  const { t } = props;
  const {
    loginAccount,
    network,
    web3,
  } = useContext(Web3AppContext);

  const isCorrectNetwork = network?.isCorrect || false;
  const success = isCorrectNetwork;
  const warning = !isCorrectNetwork;

  let walletIndicator = null;

  if (web3.wallet && web3.wallet.logo) {
    walletIndicator = (
      <WalletIndicator>
        <img src={web3.wallet.logo}
          style={{ width: '25px' }}
          alt="connect" />
      </WalletIndicator>
    );
  }

  return (
    <>
      <Wrapper>
        {currentUser?.address && (
          <AddressWrapper>
            {walletIndicator}

            <AddressLabel
              success={success}
              warning={warning}
              onClick={() => setShowAccountDetailsModal(true)}
              title={isCorrectNetwork ? `${addr}` : `INCORRECT NETWORK - ${addr}`}
            >
              {`${addr.slice(0, 6)}...${addr.slice(-4)}`}
            </AddressLabel>
          </AddressWrapper>
        )}
        {!currentUser.address && (
          <Button color="primary" round
                className="btn btn-info" onClick={() => loginAccount()}>
                {t('connectWallet')}
          </Button>
        )}
      </Wrapper>

      <AccountDetailsModal
        address={addr}
        fullWidth={true}
        maxWidth="md"
        open={showAccountDetailsModal}
        onClose={() => setShowAccountDetailsModal(false)}
      ></AccountDetailsModal>
    </>
  );
};

export default withTranslation()(Connect);