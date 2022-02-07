import BigNumber from 'bignumber.js'
import web3Manager from './Web3Manager'

/**
 * Utilidades de APIs de Smart Contract.
 */
class UtilsContractApi {

    constructor() {
        web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
        });
    }

    async estimateGas(method, from) {
        const estimateGas = await method.estimateGas({ from: from });
        return new BigNumber(estimateGas);
    }

    async getGasPrice() {
        const gasPrice = await this.web3.eth.getGasPrice();
        return new BigNumber(gasPrice);
    }
}

export default new UtilsContractApi();