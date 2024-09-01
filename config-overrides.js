const { override, addExternalBabelPlugin } = require('customize-cra');

module.exports = override(
    addExternalBabelPlugin('@babel/plugin-transform-optional-chaining'),
    addExternalBabelPlugin('@babel/plugin-transform-nullish-coalescing-operator')
);