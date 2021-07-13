
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import FiatUtils from '../utils/FiatUtils';

/**
 * Presenta una cantidad de dinero Fiat.
 */
class FiatAmount extends Component {

    render() {
        let fiatAmountFormatted = FiatUtils.format(this.props.amount);
        return (
            <span>{fiatAmountFormatted}</span>
        );
    }
}

FiatAmount.propTypes = {
    /**
     * Cantidad de dinero Fiat en unidades de centavos.
     */
    amount: PropTypes.instanceOf(BigNumber).isRequired,
};

FiatAmount.defaultProps = {

};

export default FiatAmount;