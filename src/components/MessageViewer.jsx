import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import showErrorPopup from '../components/ErrorPopup';
import Swal from 'sweetalert2';
import { Message, Severity } from '@acdi/efem-dapp';
import { useDispatch, useSelector } from 'react-redux';
import { selectNext, deleteMessage } from '../redux/reducers/messagesSlice';
import { toast } from 'react-toastify';


const MessageViewer = () => {
  const dispatch = useDispatch();
  const message = useSelector(selectNext);

  useEffect(() => {
    if (message) {
      // Display message based on severity
      if (message.severity === Severity.INFO) {
        showMessageInfo(message);
      } else if (message.severity === Severity.SUCCESS) {
        showMessageSuccess(message);
      } else if (message.severity === Severity.WARN) {
        showMessageWarn(message);
      } else if (message.severity === Severity.ERROR) {
        showMessageError(message);
      }

      // Once viewed, the message is deleted
      dispatch(deleteMessage(message));
    }
  }, [message, dispatch]);

  const showMessageInfo = (message) => {
    toast.success(message.text);
  };

  const showMessageSuccess = (message) => {
    Swal.fire({
      title: message.title,
      text: message.text,
      icon: 'success',
    });
  };

  const showMessageWarn = (message) => {
    Swal.fire({
      title: message.title,
      text: message.text,
      icon: 'warning',
    });
  };

  const showMessageError = (message) => {
    if(message.error == null){
      Swal.fire({
        title: "Algo no ha salido bien",
        text: message.text,
        icon: "error"
      });
    } else {
      showErrorPopup(message.text, message.error);
    }
  };

  return null;
};

MessageViewer.propTypes = {
  message: PropTypes.instanceOf(Message),
};

export default MessageViewer;
