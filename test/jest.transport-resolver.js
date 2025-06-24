const fs = require('fs');
const path = require('path');

module.exports = (request, options) => {
  const defaultResolve = options.defaultResolver;
  // Check if the module to resolve is 'Transport'
  if (request === 'Transport') {
    try {
      // Get the list of files in the specified directory
      const files = fs.readdirSync('node_modules/@firebolt-js/sdk/dist/lib/');
      // If the 'Gateway' file exists, then the sdk version is 2.0.0 or later, so resolve to 'Gateway' path
      if (files.includes('Gateway')) {
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
