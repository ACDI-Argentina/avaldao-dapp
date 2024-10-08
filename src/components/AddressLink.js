import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { web3Utils } from 'commons';
import Link from '@material-ui/core/Link';
import config from '../configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';

const AddressLink = ({ address, showFullAddress, showCopy }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide tooltip after 2 seconds
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Link
        href={`${config.network.explorer}address/${address}`}
        target="_blank"
      >
        {showFullAddress ? address : web3Utils.abbreviateAddress(address)}
      </Link>
      {showCopy && (
        <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} arrow>
          <div style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={handleCopy}>
            <FontAwesomeIcon icon={faClipboard} />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

AddressLink.propTypes = {
  address: PropTypes.string.isRequired,
  showFullAddress: PropTypes.bool,
  showCopy: PropTypes.bool,
};

AddressLink.defaultProps = {
  showFullAddress: false,
  showCopy: false,
};

export default AddressLink;
