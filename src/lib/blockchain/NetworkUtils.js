
// Validates user's browser is web3 capable
const funcs = {

  // Current browser is detected as mobile
  isMobileDevice: () => {
    const mobilePlatform = /Mobi|Android/i.test(navigator.userAgent)
      ? true
      : false;

    return mobilePlatform;
  },

  // Checks browser window for available web3 or ethereum objects
  hasWeb3Available: () => {
    const web3 = typeof window.web3 !== 'undefined';
    const ethereum = typeof window.ethereum !== 'undefined';
    const web3Available = web3 || ethereum;

    return web3Available;
  },
};

export default funcs;
