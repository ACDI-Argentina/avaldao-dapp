import React from 'react';
import config from '../configuration';
import swal from '@sweetalert/with-react'
// /* global window */

export default (shortDescription, error) => {
  if (!config.sendErrors) {
    console.error(shortDescription, error); // eslint-disable-line no-console
    return;
  }

  const errorHandler = value => {
    let body;
    if (error instanceof Error) {
      body = `
      Description of the Error:
      ${shortDescription}

      Error name:
      ${error.message}
      
      Error lineNumber:
      ${error.lineNumber}
      
      Error fileName:
      ${error.fileName}
      
      Error stack:
      ${error.stack}
    `;
    } else {
      body = `
      Description of the Error:
      ${shortDescription}

      Transaction link:
      ${error}
    `;
    }

    if (value === 'email') {
      /*window.open(
        `mailto:${config.bugsEmail}?subject=Error in DApp&body=${encodeURIComponent(body)}`,
      );*/
    } else if (value === 'gmail') {
      window.open(
        `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${
        config.bugsEmail
        }&su=Error in DApp&body=${encodeURIComponent(body)}`,
      );
    }
  };

  if (error) {
    swal({
      title: 'Algo no ha salido bien',
      content: (
        <div>
          <p>{shortDescription}</p>
          <p>¿Es un problema recurrente? Repórtelo por favor</p>
        </div>
      ),
      icon: 'error',
      buttons: {
        ok: {
          text: 'Close',
          value: null,
          visible: true,
          className: 'bg-success',
          closeModal: true,
        },
        /*email: {
          text: 'Report',
          value: 'email',
          visible: true,
          closeModal: true,
        },*/
        gmail: {
          text: 'Report in Gmail',
          value: 'gmail',
          visible: true,
          closeModal: true,
        },
      },
    }).then(value => {
      if (value) {
        errorHandler(value);
      }
    });
  } else {
    React.swal({
      title: "Algo no ha salido bien",
      text: shortDescription,
      icon: "error"
    });
  }
};
