import React from "react";
import { Heading, Text, Modal, Flex, Box, Icon, Link, Button } from "rimble-ui";
import ModalCard from './ModalCard';
import { withTranslation } from 'react-i18next';
import Web3App from '../Web3App'
import { connect } from 'react-redux'
import { selectCurrentUser } from '../../../redux/reducers/currentUserSlice'
import { selectLastFailured, deleteTransaction } from '../../../redux/reducers/transactionsSlice';

class TransactionFailuredModal extends React.Component {

  constructor() {
    super();
    this.state = {
      isOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidUpdate(prevProps) {

    const { transaction } = this.props;
    const { isOpen } = this.state;

    if (transaction) {

      const prevTransaction = prevProps.transaction;
      const isDifferentTransaction = !prevTransaction || prevTransaction.clientId !== transaction.clientId;

      if (isOpen === false) {

        // El transaction modal está cerrado

        if (transaction.isFailured && isDifferentTransaction) {
          this.setState({
            isOpen: true
          });
        }

      } else {

        // El transaction modal está abierto        

        if (!transaction.isFailured) {
          this.setState({
            isOpen: false
          });
        }
      }
    }
  }

  closeModal = e => {
    const { transaction, deleteTransaction } = this.props;
    if (typeof e !== "undefined") {
      e.preventDefault();
    }
    this.setState({
      isOpen: false
    });
    deleteTransaction(transaction);
  };

  render() {
    const { transaction, t } = this.props;
    const { isOpen } = this.state;
    if (!transaction) {
      return null;
    }
    return (
      <Web3App.Consumer>
        {
          ({
            network
          }) =>
            <Modal isOpen={isOpen}>
              <ModalCard closeFunc={this.closeModal}>
                <ModalCard.Body>
                  <Box height="4px" bg="danger" borderRadius={["1rem 1rem 0 0"]} />
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="near-white"
                    p={[3, 4]}
                    pb={3}
                  >
                    <Icon name="Warning" color="danger" aria-label="Warning" />
                    <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                      {t(transaction.failuredTitle.key, transaction.failuredTitle.args)}
                    </Heading>
                  </Flex>
                  <Text p={[3, 4]}>
                    {t(transaction.failuredDescription.key, transaction.failuredDescription.args)}
                  </Text>
                </ModalCard.Body>
              </ModalCard>
            </Modal>
        }
      </Web3App.Consumer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    transaction: selectLastFailured(state)
  }
}

const mapDispatchToProps = {
  deleteTransaction
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(TransactionFailuredModal)
);
