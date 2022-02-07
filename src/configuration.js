import Web3Utils from "lib/blockchain/Web3Utils";

const {
  REACT_APP_ENVIRONMENT = 'localhost', // optional
  REACT_APP_DECIMALS = 8, // optional
  REACT_APP_FEATHERJS_CONNECTION_URL,
  REACT_APP_FEATHERJS_USERS_CONNECTION_URL,
  REACT_APP_NODE_CONNECTION_URL,
  REACT_APP_AVALDAO_ADDRESS,
  REACT_APP_ADMIN_CONTRACT_ADDRESS,
  REACT_APP_AVALDAO_CONTRACT_ADDRESS,
  REACT_APP_FONDO_GARANTIA_VAULT_CONTRACT_ADDRESS,
  REACT_APP_EXCHANGE_RATE_PROVIDER_CONTRACT_ADDRESS,
  REACT_APP_TOKEN_RIF_ADDRESS,
  REACT_APP_TOKEN_DOC_ADDRESS,
  REACT_APP_TOKEN_ADDRESSES,
  REACT_APP_BLOCKEXPLORER,
  REACT_APP_BUGS_EMAIL = 'give4forests@acdi.org.ar',
  REACT_APP_NETWORK_NAME,
  REACT_APP_NATIVE_TOKEN_NAME,
  REACT_APP_NODE_ID,
  REACT_APP_IPFS_GATEWAY,
  REACT_APP_IPFS_PINNING_ENABLED,
  REACT_APP_ANONYMOUS_DONATION_THRESHOLD, //In fiat amount
} = process.env;

const configurations = {
  localhost: {
    version: '1',
    network: {
      requiredId: 33,
      name: 'RSK Regtest',
      nodeUrl: 'http://localhost:4444',
      timeout: 20000,
      explorer: 'https://explorer.testnet.rsk.co/',
      transactionEstimatedTime: 1, // Minutos
      transactionEstimatedTimeMilliseconds: 30000
    },
    language: {
      default: 'es',
      options: [
        { key: "es", name: "Español", flag: "ES" },
        { key: "en", name: "English", flag: "US" }
      ]
    },
    title: 'localhost',
    networkName: 'ganache',
    nodeId: 88,
    etherscan: 'https://explorer.testnet.rsk.co/', // this won't work, only here so we can see links during development
    feathersConnection: 'http://localhost:3030',
    feathersUsersConnection: 'https://feathers.beta.give4forest.org', //http://localhost:3031
    ipfsGateway: 'http://localhost:8080/ipfs/',
    ipfsPinningEnabled: true,
    sendErrors: true,
    analytics: {
      ga_UA: 'UA-136337883-3',
      useGoogleAnalytics: true,
      useHotjar: false,
    },
    nativeTokenName: 'RBTC',
    nativeToken: {
      name: 'RBTC',
      symbol: 'RBTC',
      address: '0x0000000000000000000000000000000000000000'
    },
    fiat: {
      symbol: 'USD',
      showDecimals: 2
    },
    tokens: {
      // Token Nativo
      rbtc: {
        address: '0x0000000000000000000000000000000000000000',
        isNative: true,
        symbol: 'RBTC',
        logoCid: '/ipfs/QmRqPw4gVDv4uNaMzpJ1tjwm85CZysQAKTR8KfqzQzrr8B',
        showDecimals: 5,
        donateStep: 0.00001
      },
      rif: { // ERC677 Token
        address: '0x1111111111111111111111111111111111111111',
        isNative: false,
        symbol: 'dRIF',
        logoCid: '/ipfs/QmcvQL7Yj4tryAmZPEB8qgeU1JwJNZAVN4zCcdWBNBkbQ9',
        showDecimals: 2,
        donateStep: 0.01
      },
      doc: {
        address: '0x2222222222222222222222222222222222222222',
        isNative: false,
        symbol: 'DOC',
        logoCid: '/ipfs/QmS3XYpbPycRUmtqogrnr4REEF3St2Yu4MqUwjSoxBDjUE',
        showDecimals: 2,
        donateStep: 0.01
      }
    },
    tokenExchangeRate: {
      updateInterval: 60000
    },
    anonymousDonationThreshold: 5000
  },
  rsk_testnet: {
    version: '1',
    network: {
      requiredId: 31,
      name: 'RSK Testnet',
      nodeUrl: 'https://public-node.testnet.rsk.co',
      timeout: 20000,
      explorer: 'https://explorer.testnet.rsk.co/',
      transactionEstimatedTime: 1, // Minutos
      transactionEstimatedTimeMilliseconds: 32000
    },
    language: {
      default: 'es',
      options: [
        { key: "es", name: "Español", flag: "ES" },
        { key: "en", name: "English", flag: "US" }
      ]
    },
    title: 'RSK Testnet',
    networkName: 'rsk_testnet',
    nodeId: 31,
    etherscan: 'https://explorer.testnet.rsk.co/',
    feathersConnection: 'https://feathers.beta.avaldao.com/',
    feathersUsersConnection: 'https://feathers.beta.give4forest.org',
    ipfsGateway: 'https://ipfs.give4forest.org/ipfs/',
    ipfsPinningEnabled: true,
    sendErrors: true,
    analytics: {
      ga_UA: 'UA-136337883-2',
      useGoogleAnalytics: true,
      useHotjar: false,
    },
    nativeTokenName: 'RBTC',
    nativeToken: {
      name: 'RBTC',
      symbol: 'RBTC',
      address: '0x0000000000000000000000000000000000000000'
    },
    fiat: {
      symbol: 'USD',
      showDecimals: 2
    },
    tokens: {
      // Token Nativo
      rbtc: {
        address: '0x0000000000000000000000000000000000000000',
        isNative: true,
        symbol: 'RBTC',
        logoCid: '/ipfs/QmRqPw4gVDv4uNaMzpJ1tjwm85CZysQAKTR8KfqzQzrr8B',
        showDecimals: 5,
        donateStep: 0.00001
      },
      rif: { // ERC677 Token
        address: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
        isNative: false,
        symbol: 'tRIF',
        logoCid: '/ipfs/QmcvQL7Yj4tryAmZPEB8qgeU1JwJNZAVN4zCcdWBNBkbQ9',
        showDecimals: 2,
        donateStep: 0.01
      },
      doc: {
        address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
        isNative: false,
        symbol: 'DOC',
        logoCid: '/ipfs/QmS3XYpbPycRUmtqogrnr4REEF3St2Yu4MqUwjSoxBDjUE',
        showDecimals: 2,
        donateStep: 0.01
      }
    },
    tokenExchangeRate: {
      updateInterval: 60000
    },
    anonymousDonationThreshold: 10000
  },
  rsk_mainnet: {
    version: '1',
    network: {
      requiredId: 30,
      name: 'RSK Mainnet',
      nodeUrl: 'https://node.b4h.world',
      timeout: 20000,
      explorer: 'https://explorer.rsk.co/',
      transactionEstimatedTime: 1, // Minutos
      transactionEstimatedTimeMilliseconds: 60000
    },
    language: {
      default: 'es',
      options: [
        { key: "es", name: "Español", flag: "ES" },
        { key: "en", name: "English", flag: "US" }
      ]
    },
    title: 'RSK MainNet',
    networkName: 'rsk_mainnet',
    nodeId: 30,
    etherscan: 'https://explorer.rsk.co/',
    feathersConnection: 'https://feathers.avaldao.com/',
    feathersUsersConnection: 'https://feathers.give4forest.org/',
    ipfsGateway: 'https://ipfs.give4forest.org/ipfs/',
    ipfsPinningEnabled: true,
    sendErrors: true,
    analytics: {
      ga_UA: 'UA-136337883-1',
      useGoogleAnalytics: true,
      useHotjar: false,
    },
    nativeTokenName: 'RBTC',
    nativeToken: {
      name: 'RBTC',
      symbol: 'RBTC',
      address: '0x0000000000000000000000000000000000000000'
    },
    fiat: {
      symbol: 'USD',
      showDecimals: 2
    },
    tokens: {
      // Token Nativo
      rbtc: {
        address: '0x0000000000000000000000000000000000000000',
        isNative: true,
        symbol: 'RBTC',
        logoCid: '/ipfs/QmRqPw4gVDv4uNaMzpJ1tjwm85CZysQAKTR8KfqzQzrr8B',
        showDecimals: 5,
        donateStep: 0.00001
      },
      rif: { // ERC677 Token
        address: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
        isNative: false,
        symbol: 'RIF',
        logoCid: '/ipfs/QmcvQL7Yj4tryAmZPEB8qgeU1JwJNZAVN4zCcdWBNBkbQ9',
        showDecimals: 2,
        donateStep: 0.01
      },
      doc: {
        address: '0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db',
        isNative: false,
        symbol: 'DOC',
        logoCid: '/ipfs/QmS3XYpbPycRUmtqogrnr4REEF3St2Yu4MqUwjSoxBDjUE',
        showDecimals: 2,
        donateStep: 0.01
      }
    },
    tokenExchangeRate: {
      updateInterval: 60000
    },
    anonymousDonationThreshold: 10000
  }  
};

// Unknown environment
if (configurations[REACT_APP_ENVIRONMENT] === undefined)
  throw new Error(
    `There is no configuration object for environment: ${REACT_APP_ENVIRONMENT}. Expected REACT_APP_ENVIRONMENT to be empty or one of: ${Object.keys(
      configurations,
    )}`,
  );

// Create config object based on environment setup
const config = Object.assign({}, configurations[REACT_APP_ENVIRONMENT]);

// Overwrite the environment values with parameters
config.avaldaoAddress = REACT_APP_AVALDAO_ADDRESS || config.avaldaoAddress;
config.adminContractAddress = REACT_APP_ADMIN_CONTRACT_ADDRESS || config.adminContractAddress;
config.avaldaoContractAddress = REACT_APP_AVALDAO_CONTRACT_ADDRESS || config.avaldaoContractAddress;
config.fondoGarantiaVaultContractAddress = REACT_APP_FONDO_GARANTIA_VAULT_CONTRACT_ADDRESS || config.fondoGarantiaVaultContractAddress;
config.exchangeRateProviderContractAddress = REACT_APP_EXCHANGE_RATE_PROVIDER_CONTRACT_ADDRESS || config.exchangeRateProviderContractAddress;
config.tokens.doc.address = REACT_APP_TOKEN_DOC_ADDRESS || config.tokens.doc.address;
config.tokens.rif.address = REACT_APP_TOKEN_RIF_ADDRESS || config.tokens.rif.address;
config.tokenAddresses = REACT_APP_TOKEN_ADDRESSES
  ? JSON.parse(REACT_APP_TOKEN_ADDRESSES)
  : config.tokenAddresses;
config.etherscan = REACT_APP_BLOCKEXPLORER || config.etherscan;
config.feathersConnection = REACT_APP_FEATHERJS_CONNECTION_URL || config.feathersConnection;
config.feathersUsersConnection = REACT_APP_FEATHERJS_USERS_CONNECTION_URL || config.feathersUsersConnection;
config.network.nodeUrl = REACT_APP_NODE_CONNECTION_URL || config.network.nodeUrl;
config.network.requiredId = (REACT_APP_NODE_ID && Number.parseInt(REACT_APP_NODE_ID, 10)) || config.nodeId;
config.decimals = REACT_APP_DECIMALS;
config.bugsEmail = REACT_APP_BUGS_EMAIL;
config.networkName = REACT_APP_NETWORK_NAME || config.networkName;
config.nodeId = (REACT_APP_NODE_ID && Number.parseInt(REACT_APP_NODE_ID, 10)) || config.nodeId;
config.nativeTokenName = REACT_APP_NATIVE_TOKEN_NAME || config.nativeTokenName;

config.ipfsGateway = REACT_APP_IPFS_GATEWAY || config.ipfsGateway;
config.ipfsPinningEnabled = (REACT_APP_IPFS_PINNING_ENABLED !== undefined) ? (REACT_APP_IPFS_PINNING_ENABLED === "true") : config.ipfsPinningEnabled;

config.anonymousDonationThreshold = REACT_APP_ANONYMOUS_DONATION_THRESHOLD ||  config.anonymousDonationThreshold;

// Definición de Roles

config.ADMIN_ROLE = "ADMIN_ROLE";
config.AVALDAO_ROLE = "AVALDAO_ROLE";
config.SOLICITANTE_ROLE = "SOLICITANTE_ROLE";
config.COMERCIANTE_ROLE = "COMERCIANTE_ROLE";
config.AVALADO_ROLE = "AVALADO_ROLE";

config.roles = [
  {
      value: config.ADMIN_ROLE,
      hash: Web3Utils.toKeccak256(config.ADMIN_ROLE),
      label: 'Admin',
      app: config.adminContractAddress
  },
  {
      value: config.AVALDAO_ROLE,
      hash: Web3Utils.toKeccak256(config.AVALDAO_ROLE),
      label: 'Avaldao',
      app: config.avaldaoContractAddress
  },
  {
      value: config.SOLICITANTE_ROLE,
      hash: Web3Utils.toKeccak256(config.SOLICITANTE_ROLE),
      label: 'Solicitante',
      app: config.avaldaoContractAddress
  },
  {
      value: config.COMERCIANTE_ROLE,
      hash: Web3Utils.toKeccak256(config.COMERCIANTE_ROLE),
      label: 'Comerciante',
      app: config.avaldaoContractAddress
  },
  {
      value: config.AVALADO_ROLE,
      hash: Web3Utils.toKeccak256(config.AVALADO_ROLE),
      label: 'Avalado',
      app: config.avaldaoContractAddress
  }
];

//config.sendErrors = ['develop', 'release', 'beta', 'rsk_testnet'].includes(REACT_APP_ENVIRONMENT);

console.log('Configuración', config);

export default config;