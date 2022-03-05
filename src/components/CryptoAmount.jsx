
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import config from '../configuration';
import TokenUtils from 'utils/TokenUtils';

/**
 * Presenta una cantidad de dinero crypto.
 * 
 */
class CryptoAmount extends Component {

    render() {
        const { classes } = this.props;
        return <span className={classes.amount}>{TokenUtils.format(this.props.tokenAddress, this.props.amount)}</span>
    }
}

CryptoAmount.propTypes = {
    /**
     * Cantidad de crypto medida en Wei
     */
    amount: PropTypes.instanceOf(BigNumber).isRequired,
    tokenAddress: PropTypes.string.isRequired,
};

CryptoAmount.defaultProps = {
    tokenAddress: config.nativeToken.address
};

export default CryptoAmount;