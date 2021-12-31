import { Web3AppContext } from "lib/blockchain/Web3App";
import React, { useContext, useEffect } from "react";
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


  useEffect(() => {
    requestConnection();
  }, [])


  async function showRequestConnectionModal() { //Solamente muestra el modal

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

  return {
    currentUser,
    requestConnection
  }

}


export default useWeb3Account;