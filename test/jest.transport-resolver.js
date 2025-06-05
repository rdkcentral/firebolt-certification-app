const fs = require('fs');
const path = require('path');

module.exports = (request, options) => {
  const defaultResolve = options.defaultResolver;
  if (request === 'Transport') {
    try {
      const files = fs.readdirSync('node_modules/@firebolt-js/sdk/dist/lib/');
      const hasGateway = files.includes('Gateway');
      if (hasGateway) {
        console.log('Using Gateway from @firebolt-js/sdk');
        return path.resolve(__dirname, '../node_modules/@firebolt-js/sdk/dist/lib/Gateway/index.mjs');
      } else {
        console.log('Using Transport from @firebolt-js/sdk');
        return path.resolve(__dirname, '../node_modules/@firebolt-js/sdk/dist/lib/Transport/index.mjs');
      }
    } catch (err) {
      console.error(`Error resolving files: ${err.message}`);
      return defaultResolve(request, options);
    }
  }
  return defaultResolve(request, options);
};
