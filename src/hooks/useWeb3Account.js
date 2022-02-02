import { Web3AppContext } from "lib/blockchain/Web3App";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { selectCurrentUser } from "redux/reducers/currentUserSlice";


function useWeb3Account(params) {
  let onFail;
  if (params) {
    onFail = params.onFail;
  }

  const currentUser = useSelector(selectCurrentUser);
  const { t } = useTranslation();
  const { loginAccount } = useContext(Web3AppContext);

  const ctx = useContext(Web3AppContext);
  const { authenticateIfPossible } = ctx.modals.methods;
  
  async function requestConnection() {
    if (!currentUser?.address) {
      const confirmation = await showRequestConnectionModal();
      if (confirmation) {
        const connected = await loginAccount();
        if (!connected) {
          typeof onFail === "function" && onFail();
        }
        return connected;
      }
      typeof onFail === "function" && onFail();
    }
  }

  async function showRequestConnectionModal() { 
    const labels = {
      title: t("requestConnectionTitle"),
      text: t("requestConnectionText"),
      cancel: t("requestConnectionCancel"),
      ok: t("requestConnectionOk"),
    }

    const confirm = await React.swal({
      icon: 'info',
      title: labels.title,
      text: labels.text,

      buttons: [labels.cancel, labels.ok],
      closeOnClickOutside: false,
    });

    return confirm;

  }

  //Request connection and authentication
  async function requestAuthentication(connectedAddress) { 

    if(connectedAddress){
      return await authenticateIfPossible({ address: connectedAddress }, false);
    }

    if (!currentUser?.address) {
      const connectedAddress = await requestConnection();
      
      if (!connectedAddress) return false;

      const result = await authenticateIfPossible({ address: connectedAddress }, false); //{address}
      return result;
    }

    const result = await authenticateIfPossible(currentUser, false);
    if (!result) return false;


    return true;

  }

  return {
    currentUser,
    requestConnection,
    authenticated: currentUser?.authenticated,
    requestAuthentication,
  }

}


export default useWeb3Account;