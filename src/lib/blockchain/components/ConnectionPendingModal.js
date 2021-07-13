import React from "react";
import {
  Heading,
  Text,
  Modal,
  Flex,
  Box,
  Loader
} from "rimble-ui";
import ModalCard from './ModalCard';
import GeneralUtil from "../GeneralUtil";
import { withTranslation } from 'react-i18next';

class ConnectionPendingModal extends React.Component {
  renderContent = () => {
    const { t } = this.props;
    return (
      <React.Fragment>
        <Heading.h2 my={3}>
          {t('web3ConnectionPendingTitle')}
        </Heading.h2>

        <Text my={4}>
          {GeneralUtil.hasMetaMask() ?
            t('web3ConnectionPendingDescriptionMetaMask') :
            t('web3ConnectionPendingDescriptionNoMetaMask')}
        </Text>

        <Box bg={"#f6f6fc"} p={3} display={["none", "block"]}>
          <Flex alignItems={"center"}>
            <Box position={"relative"} width={"4em"}>
              <Box>
                <Loader size={"3em"} />
              </Box>
            </Box>
            <Box>
              <Text fontWeight={4}>
                {t('web3ConnectionPendingWaitTitle')}
              </Text>
              <Text fontWeight={2}>
                {t('web3ConnectionPendingWaitDescription')}
              </Text>
            </Box>
          </Flex>
        </Box>
      </React.Fragment>
    );
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalCard closeFunc={this.props.closeModal}>
          <ModalCard.Body>
            {this.renderContent()}
          </ModalCard.Body>
        </ModalCard>
      </Modal>
    );
  }
}

export default withTranslation()(ConnectionPendingModal);
