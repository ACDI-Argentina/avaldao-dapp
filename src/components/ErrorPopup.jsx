import config from '../configuration';
import Swal from 'sweetalert2';

const showErrorPopup = async (shortDescription, error) => {
  if (!config.sendErrors) {
    console.error(shortDescription, error); // eslint-disable-line no-console
    return;
  }

  const result = await Swal.fire({
    title: 'Algo no ha salido bien',
    html:
      `
     <div>
        <p>${shortDescription}</p>
        <p>¿Es un problema recurrente? Repórtelo por favor</p>
      </div>
    `
    ,
    icon: 'error',
    showDenyButton: true,
    confirmButtonText: "Close",
    denyButtonText: `Report in Gmail`,
    denyButtonColor: "#7cd1f9"
  }
  )

  if (result.isDenied) {
    createErrorReportEmail(shortDescription, error);
  }

};



const createErrorReportEmail = (shortDescription, error) => {
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

    ${error}

    Transaction link:
  `;
  }

  window.open(
    `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${config.bugsEmail
    }&su=Error in DApp&body=${encodeURIComponent(body)}`,
  );

};


export default showErrorPopup;