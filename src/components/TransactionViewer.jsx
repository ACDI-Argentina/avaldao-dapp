import React, { Component } from 'react';
import TransactionCreatedModal from '../lib/blockchain/components/TransactionCreatedModal';
import TransactionConfirmedModal from '../lib/blockchain/components/TransactionConfirmedModal';
import TransactionFailuredModal from '../lib/blockchain/components/TransactionFailuredModal';

/**
 * Componente encargado de la visualización de transacciones.
 */
class TransactionViewer extends Component {

  render() {
    return (
      <React.Fragment>
        <TransactionCreatedModal></TransactionCreatedModal>
        <TransactionConfirmedModal></TransactionConfirmedModal>
        <TransactionFailuredModal></TransactionFailuredModal>
      </React.Fragment>
    );
  }
}

export default TransactionViewer;