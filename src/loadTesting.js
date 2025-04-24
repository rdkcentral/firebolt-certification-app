import websocketCalls from './config/websocketCalls.json';

export function startLoadTest(webSocketUrl) {
  console.log('Starting Load Test with WebSocket URL:', webSocketUrl);
  const ws = new WebSocket(webSocketUrl);
  const apiCalls = websocketCalls.apiCalls;
  let callIndex = 0;
  let sentMessages = 0;
  let receivedResponses = 0;

  // Map to track sent messages and their IDs
  const requestMap = new Map();

  ws.onopen = () => {
    console.log('WebSocket connection established for Load Testing.');

    // Send alternating JSON-RPC API calls every 10ms
    const intervalId = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        // Clone the API call and assign a unique ID
        const apiCall = { ...apiCalls[callIndex] };
        apiCall.id = Date.now() + Math.random(); // Generate a unique ID
        const message = JSON.stringify(apiCall);

        // Send the API call and track it in the request map
        ws.send(message);
        console.log(`Sent: ${message}`);
        requestMap.set(apiCall.id, apiCall);
        callIndex = (callIndex + 1) % apiCalls.length;
        sentMessages++;
      }
    }, 10);

    // Stop the test after 10 minutes
    setTimeout(
      () => {
        clearInterval(intervalId);
        ws.close();
        console.log(`Load Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`);
        if (sentMessages !== receivedResponses) {
          console.error('Mismatch between sent messages and received responses!');
        }
      },
      10 * 60 * 1000
    ); // 10 minutes
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log(`Received: ${event.data}`);

    // Validate the response by matching the ID
    if (requestMap.has(response.id)) {
      console.log(`Response matched for ID: ${response.id}`);
      requestMap.delete(response.id); // Remove the matched request
      receivedResponses++;
    } else {
      console.error(`Unexpected response ID: ${response.id}`);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed.');
  };
}

export function startStressTest(webSocketUrl) {
  console.log('Starting Stress Test with WebSocket URL:', webSocketUrl);
  const ws = new WebSocket(webSocketUrl);
  const apiCalls = websocketCalls.apiCalls;
  let sentMessages = 0;
  let receivedResponses = 0;
  let interval = 1000; // Start with 1 second (1000ms) interval

  // Map to track sent messages and their IDs
  const requestMap = new Map();

  ws.onopen = () => {
    console.log('WebSocket connection established for Stress Testing.');

    // Function to send a random API call
    const sendRandomApiCall = () => {
      if (ws.readyState === WebSocket.OPEN) {
        // Select a random API call
        const randomIndex = Math.floor(Math.random() * apiCalls.length);
        const apiCall = { ...apiCalls[randomIndex] };
        apiCall.id = Date.now() + Math.random(); // Generate a unique ID
        const message = JSON.stringify(apiCall);

        // Send the API call and track it in the request map
        ws.send(message);
        console.log(`Sent: ${message}`);
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
        console.log(`Adjusting interval to ${interval}ms`);
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
        console.log(`Stress Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`);
        if (sentMessages !== receivedResponses) {
          console.error('Mismatch between sent messages and received responses!');
        }
      },
      30 * 60 * 1000
    ); // 30 minutes
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log(`Received: ${event.data}`);

    // Validate the response by matching the ID
    if (requestMap.has(response.id)) {
      console.log(`Response matched for ID: ${response.id}`);
      requestMap.delete(response.id); // Remove the matched request
      receivedResponses++;
    } else {
      console.error(`Unexpected response ID: ${response.id}`);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed.');
  };
}

export function startSoakTest(webSocketUrl) {
  console.log('Starting Soak Test with WebSocket URL:', webSocketUrl);
  const ws = new WebSocket(webSocketUrl);
  const apiCalls = websocketCalls.apiCalls;
  let sentMessages = 0;
  let receivedResponses = 0;

  // Map to track sent messages and their IDs
  const requestMap = new Map();

  ws.onopen = () => {
    console.log('WebSocket connection established for Soak Testing.');

    // Function to send a random API call
    const sendRandomApiCall = () => {
      if (ws.readyState === WebSocket.OPEN) {
        // Select a random API call
        const randomIndex = Math.floor(Math.random() * apiCalls.length);
        const apiCall = { ...apiCalls[randomIndex] };
        apiCall.id = Date.now() + Math.random(); // Generate a unique ID
        const message = JSON.stringify(apiCall);

        // Send the API call and track it in the request map
        ws.send(message);
        console.log(`Sent: ${message}`);
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
        console.log(`Soak Testing completed. Sent: ${sentMessages}, Received: ${receivedResponses}`);
        if (sentMessages !== receivedResponses) {
          console.error('Mismatch between sent messages and received responses!');
        }
      },
      30 * 60 * 1000
    ); // 30 minutes
  };

  ws.onmessage = (event) => {
    const response = JSON.parse(event.data);
    console.log(`Received: ${event.data}`);

    // Validate the response by matching the ID
    if (requestMap.has(response.id)) {
      console.log(`Response matched for ID: ${response.id}`);
      requestMap.delete(response.id); // Remove the matched request
      receivedResponses++;
    } else {
      console.error(`Unexpected response ID: ${response.id}`);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed.');
  };
}
