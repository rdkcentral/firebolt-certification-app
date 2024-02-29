// Activate Mock Firebolt if "mf" query parameter is specified

const queryParams = new window.URLSearchParams(document.location.search);
console.log('Welcome to MOCK!');
let mf = queryParams.get('mf');
if (mf) {
  mf = decodeURIComponent(mf);
  let endpoint = undefined;
  if (['T', 'TRUE', 'YES', 'Y', '1', 'ON', 'MF', 'MOCK'].includes(mf.toUpperCase())) {
    endpoint = `ws://localhost:9998`;
  } else {
    // Regular expression to check if number is a valid port number
    const regexExp = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi;
    const match = mf.match(regexExp);
    if (match && match.length >= 1) {
      endpoint = `ws://localhost:${match[0]}`;
    } else if (mf.startsWith('ws')) {
      endpoint = mf;
    }
  }
  if (endpoint) {
    if (!window.__firebolt) {
      window.__firebolt = {};
    }
    window.__firebolt.endpoint = endpoint;
    console.info(`Using Mock Firebolt listening at ${endpoint}`);
  }
}
