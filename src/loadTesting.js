import Transport from '@firebolt-js/sdk/dist/lib/Transport';
import websocketCalls from './config/websocketCalls.json';
import createLogger from './utils/Logger';

const logger = createLogger('FireboltTransportInvoker.js');

// Fallback mechanism for invokeProvider
let invokeProvider;
try {
  // Dynamic import for compatibility with ES modules
  const ext = await import('../plugins/FireboltExtensionInvoker.js');
  invokeProvider = ext.default.invokeProvider;
  if (!invokeProvider) {
    logger.warn('invokeProvider not found in FireboltExtensionInvoker.js. Falling back to Transport.');
    invokeProvider = {
      send: async (method, params) => {
        const [module, methodName] = method.split('.');
        return Transport.send(module, methodName, params);
      },
    };
  }
} catch (err) {
  logger.error(`Unable to import invokeProvider - ${err.message}. Falling back to Transport.`);
  invokeProvider = {
    send: async (method, params) => {
      const [module, methodName] = method.split('.');
      return Transport.send(module, methodName, params);
    },
  };
}

/**
 * Starts the Load Test by sending API calls using invokeProvider.send at a fixed interval.
 * @param {string} webSocketUrl - The WebSocket server URL (not used anymore).
 * @param {function} logCallback - Callback function to log messages.
 */
export function startLoadTest(webSocketUrl, logCallback) {
  logCallback('Starting Load Test using invokeProvider.send');

  const apiCalls = websocketCalls.apiCalls;
  let callIndex = 0;
  let sentMessages = 0;
  let receivedResponses = 0;

  // Send API calls at a fixed interval (10ms)
  const intervalId = setInterval(async () => {
    const apiCall = { ...apiCalls[callIndex] };
    apiCall.id = Date.now() + Math.random(); // Generate a unique ID

    try {
      console.log('Calling invokeProvider.send with:', apiCall.method, apiCall.params);
      const response = await invokeProvider.send(apiCall.method, apiCall.params);
      logCallback(`Sent: ${JSON.stringify(apiCall)}, Received: ${JSON.stringify(response)}`);
      receivedResponses++;
    } catch (error) {
      logCallback(`Error sending API call: ${error.message}`);
    }

    callIndex = (callIndex + 1) % apiCalls.length; // Cycle through API calls
    sentMessages++;
  }, 10);

  // Stop the test after 10 minutes
  setTimeout(() => {
    clearInterval(intervalId);
    logCallback(
      `Load Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`
    );
  }, 10 * 60 * 1000); // 10 minutes
}

/**
 * Starts the Stress Test by sending API calls using invokeProvider.send at a dynamically decreasing interval.
 * @param {string} webSocketUrl - The WebSocket server URL (not used anymore).
 * @param {function} logCallback - Callback function to log messages.
 */
export function startStressTest(webSocketUrl, logCallback = console.log) {
  logCallback('Starting Stress Test using invokeProvider.send');
  const apiCalls = websocketCalls.apiCalls;
  let sentMessages = 0;
  let receivedResponses = 0;
  let interval = 1000; // Start with 1 second (1000ms) interval

  // Function to send a random API call
  const sendRandomApiCall = async () => {
    const randomIndex = Math.floor(Math.random() * apiCalls.length);
    const apiCall = { ...apiCalls[randomIndex] };
    apiCall.id = Date.now() + Math.random(); // Generate a unique ID

    try {
      console.log('Calling invokeProvider.send with:', apiCall.method, apiCall.params);
      const response = await invokeProvider.send(apiCall.method, apiCall.params);
      logCallback(`Sent: ${JSON.stringify(apiCall)}, Received: ${JSON.stringify(response)}`);
      receivedResponses++;
    } catch (error) {
      logCallback(`Error sending API call: ${error.message}`);
    }

    sentMessages++;
  };

  // Start the stress test with dynamic interval adjustment
  const adjustInterval = () => {
    sendRandomApiCall();

    // Adjust the interval every 30 seconds
    setTimeout(() => {
      interval = Math.max(100, interval - 100); // Decrease interval by 0.1 seconds (100ms), minimum 100ms
      logCallback(`Adjusting interval to ${interval}ms`);
      clearInterval(intervalId);
      intervalId = setInterval(sendRandomApiCall, interval);
    }, 30000); // Every 30 seconds
  };

  let intervalId = setInterval(adjustInterval, interval);

  // Stop the test after 30 minutes
  setTimeout(() => {
    clearInterval(intervalId);
    logCallback(
      `Stress Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`
    );
    if (sentMessages !== receivedResponses) {
      logCallback('Mismatch between sent messages and received responses!');
    }
  }, 30 * 60 * 1000); // 30 minutes
}

/**
 * Starts the Soak Test by sending two API calls using invokeProvider.send at random intervals within a 5-second window.
 * @param {string} webSocketUrl - The WebSocket server URL (not used anymore).
 * @param {function} logCallback - Callback function to log messages.
 */
export function startSoakTest(webSocketUrl, logCallback = console.log) {
  logCallback('Starting Soak Test using invokeProvider.send');
  const apiCalls = websocketCalls.apiCalls;
  let sentMessages = 0;
  let receivedResponses = 0;

  // Function to send a random API call
  const sendRandomApiCall = async () => {
    const randomIndex = Math.floor(Math.random() * apiCalls.length);
    const apiCall = { ...apiCalls[randomIndex] };
    apiCall.id = Date.now() + Math.random(); // Generate a unique ID

    try {
      console.log('Calling invokeProvider.send with:', apiCall.method, apiCall.params);
      const response = await invokeProvider.send(apiCall.method, apiCall.params);
      logCallback(`Sent: ${JSON.stringify(apiCall)}, Received: ${JSON.stringify(response)}`);
      receivedResponses++;
    } catch (error) {
      logCallback(`Error sending API call: ${error.message}`);
    }

    sentMessages++;
  };

  // Function to schedule two random calls within a 5-second window
  const scheduleCalls = () => {
    const firstCallDelay = Math.random() * 5000; // Random delay between 0 and 5 seconds
    const secondCallDelay = Math.random() * 5000; // Random delay between 0 and 5 seconds

    setTimeout(() => {
      sendRandomApiCall();
    }, firstCallDelay);

    setTimeout(() => {
      sendRandomApiCall();
    }, secondCallDelay);
  };

  // Schedule calls every 5 seconds
  const intervalId = setInterval(scheduleCalls, 5000);

  // Stop the test after 30 minutes
  setTimeout(() => {
    clearInterval(intervalId);
    logCallback(
      `Soak Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`
    );
    if (sentMessages !== receivedResponses) {
      logCallback('Mismatch between sent messages and received responses!');
    }
  }, 30 * 60 * 1000); // 30 minutes
}
