// Import the API calls configuration from a JSON file
import websocketCalls from './config/websocketCalls.json';

/**
 * Starts the Load Test by sending WebSocket messages at a fixed interval.
 * @param {string} webSocketUrl - The WebSocket server URL.
 * @param {function} logCallback - Callback function to log messages.
 */
export function startLoadTest(webSocketUrl, logCallback) {
  logCallback('Starting Load Test with WebSocket URL: ' + webSocketUrl);
  const ws = new WebSocket(webSocketUrl);
  const apiCalls = websocketCalls.apiCalls;
  let callIndex = 0;
  let sentMessages = 0;
  const receivedResponses = 0;

  // Handle WebSocket connection open event
  ws.onopen = () => {
    logCallback('WebSocket connection established for Load Testing.');

    // Send API calls at a fixed interval (10ms)
    const intervalId = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const apiCall = { ...apiCalls[callIndex] };
        apiCall.id = Date.now() + Math.random(); // Generate a unique ID
        const message = JSON.stringify(apiCall);

        ws.send(message);
        logCallback(`Sent: ${message}`);
        callIndex = (callIndex + 1) % apiCalls.length; // Cycle through API calls
        sentMessages++;
      }
    }, 10);

    // Stop the test after 10 minutes
    setTimeout(
      () => {
        clearInterval(intervalId);
        ws.close();
        logCallback(`Load Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`);
      },
      10 * 60 * 1000
    ); // 10 minutes
  };

  // Handle WebSocket message event
  ws.onmessage = (event) => {
    logCallback(`Received: ${event.data}`);
  };

  // Handle WebSocket error event
  ws.onerror = (error) => {
    logCallback('WebSocket error: ' + error.message);
  };

  // Handle WebSocket close event
  ws.onclose = () => {
    logCallback('WebSocket connection closed.');
  };
}

/**
 * Starts the Stress Test by sending WebSocket messages at a dynamically decreasing interval.
 * @param {string} webSocketUrl - The WebSocket server URL.
 * @param {function} logCallback - Callback function to log messages.
 */
export function startStressTest(webSocketUrl, logCallback = console.log) {
  logCallback('Starting Stress Test with WebSocket URL: ' + webSocketUrl);
  const ws = new WebSocket(webSocketUrl);
  const apiCalls = websocketCalls.apiCalls;
  let sentMessages = 0;
  let receivedResponses = 0;
  let interval = 1000; // Start with 1 second (1000ms) interval

  // Map to track sent messages and their IDs
  const requestMap = new Map();

  // Handle WebSocket connection open event
  ws.onopen = () => {
    logCallback('WebSocket connection established for Stress Testing.');

    // Function to send a random API call
    const sendRandomApiCall = () => {
      if (ws.readyState === WebSocket.OPEN) {
        const randomIndex = Math.floor(Math.random() * apiCalls.length);
        const apiCall = { ...apiCalls[randomIndex] };
        apiCall.id = Date.now() + Math.random(); // Generate a unique ID
        const message = JSON.stringify(apiCall);

        ws.send(message);
        logCallback(`Sent: ${message}`);
        requestMap.set(apiCall.id, apiCall);
        sentMessages++;
      }
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
    setTimeout(
      () => {
        clearInterval(intervalId);
        ws.close();
        logCallback(`Stress Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`);
        if (sentMessages !== receivedResponses) {
          logCallback('Mismatch between sent messages and received responses!');
        }
      },
      30 * 60 * 1000
    ); // 30 minutes
  };

  // Handle WebSocket message event
  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    logCallback(`Received: ${event.data}`);

    if (requestMap.has(response.id)) {
      logCallback(`Response matched for ID: ${response.id}`);
      requestMap.delete(response.id);
      receivedResponses++;
    } else {
      logCallback(`Unexpected response ID: ${response.id}`);
    }
  };

  // Handle WebSocket error event
  ws.onerror = (error) => {
    logCallback('WebSocket error: ' + error.message);
  };

  // Handle WebSocket close event
  ws.onclose = () => {
    logCallback('WebSocket connection closed.');
  };
}

/**
 * Starts the Soak Test by sending two WebSocket messages at random intervals within a 5-second window.
 * @param {string} webSocketUrl - The WebSocket server URL.
 * @param {function} logCallback - Callback function to log messages.
 */
export function startSoakTest(webSocketUrl, logCallback = console.log) {
  logCallback('Starting Soak Test with WebSocket URL: ' + webSocketUrl);
  const ws = new WebSocket(webSocketUrl);
  const apiCalls = websocketCalls.apiCalls;
  let sentMessages = 0;
  let receivedResponses = 0;

  // Map to track sent messages and their IDs
  const requestMap = new Map();

  // Handle WebSocket connection open event
  ws.onopen = () => {
    logCallback('WebSocket connection established for Soak Testing.');

    // Function to send a random API call
    const sendRandomApiCall = () => {
      if (ws.readyState === WebSocket.OPEN) {
        const randomIndex = Math.floor(Math.random() * apiCalls.length);
        const apiCall = { ...apiCalls[randomIndex] };
        apiCall.id = Date.now() + Math.random(); // Generate a unique ID
        const message = JSON.stringify(apiCall);

        ws.send(message);
        logCallback(`Sent: ${message}`);
        requestMap.set(apiCall.id, apiCall);
        sentMessages++;
      }
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
    setTimeout(
      () => {
        clearInterval(intervalId);
        ws.close();
        logCallback(`Soak Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`);
        if (sentMessages !== receivedResponses) {
          logCallback('Mismatch between sent messages and received responses!');
        }
      },
      30 * 60 * 1000
    ); // 30 minutes
  };

  // Handle WebSocket message event
  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    logCallback(`Received: ${event.data}`);

    if (requestMap.has(response.id)) {
      logCallback(`Response matched for ID: ${response.id}`);
      requestMap.delete(response.id);
      receivedResponses++;
    } else {
      logCallback(`Unexpected response ID: ${response.id}`);
    }
  };

  // Handle WebSocket error event
  ws.onerror = (error) => {
    logCallback('WebSocket error: ' + error.message);
  };

  // Handle WebSocket close event
  ws.onclose = () => {
    logCallback('WebSocket connection closed.');
  };
}
