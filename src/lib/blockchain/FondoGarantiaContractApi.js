import { Observable } from 'rxjs'
import BigNumber from 'bignumber.js'
import config from '../../configuration'
import { web3Manager } from 'commons'
import { FondoGarantiaVaultAbi, ExchangeRateProviderAbi } from '@acdi/avaldao-contract'
import { ExchangeRate, TokenBalance } from '@acdi/efem-dapp'

/**
 * API encargada de la interacción con el Fondo de Garantía Smart Contract.
 */
class FondoGarantiaContractApi {

    constructor() {
        web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
            this.updateContracts();
        });
    }

    /**
     * Obtiene todos los token balances que conforman el fondo de garantía.
     */
    getFondoGarantia() {
        return new Observable(async subscriber => {
            try {
                let tokenBalances = [];
                //let tokens = await this.fondoGarantiaVault.methods.getTokens().call();
                let tokenKeys = Object.keys(config.tokens);
                for (let i = 0; i < tokenKeys.length; i++) {
                    let tokenKey = tokenKeys[i];
                    const tokenAddress = config.tokens[tokenKey].address;
                    let { token,
                        amount,
                        rate,
                        amountFiat } = await this.fondoGarantiaVault.methods.getTokenBalance(tokenAddress).call();
                    tokenBalances.push(new TokenBalance({
                        address: token,
                        amount: amount,
                        rate: rate,
                        amountFiat: amountFiat
                    }));
                }
                subscriber.next(tokenBalances);
            } catch (error) {
                console.log('[Avaldao Contract API] Error obteniendo Fondo de Garantía.', error);
                //subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene todas los tipos de cambios de token.
     */
    getExchangeRates() {
        return new Observable(async subscriber => {
            try {
                const rate = await this.exchangeRateProvider.methods.getExchangeRate(config.nativeToken.address).call();
                // TODO Obtener otros Exchage Rates desde el smart contract.
                let exchangeRates = [];
                // RBTC
                let exchangeRate = new ExchangeRate({
                    tokenAddress: config.nativeToken.address,
                    rate: new BigNumber(rate),
                    date: Date.now()
                });
                exchangeRates.push(exchangeRate);
                subscriber.next(exchangeRates);
            } catch (error) {
                console.error(error);
                subscriber.error(error);
            }
        });
    }

    async getExchangeRateByToken(tokenAddress) {
        return await this.exchangeRateProvider.methods.getExchangeRate(tokenAddress).call();
    }

    updateContracts() {
        const { fondoGarantiaVaultContractAddress, exchangeRateProviderContractAddress } = config;
        this.fondoGarantiaVault = new this.web3.eth.Contract(FondoGarantiaVaultAbi, fondoGarantiaVaultContractAddress);
        this.exchangeRateProvider = new this.web3.eth.Contract(ExchangeRateProviderAbi, exchangeRateProviderContractAddress);
    }
}

export default new FondoGarantiaContractApi();