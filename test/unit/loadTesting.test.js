import { startLoadTest } from '../../src/loadTesting';

export function startLoadTest(url, logCallback) {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    logCallback('WebSocket connection established for Load Testing.');
    ws.send('Start Load Test'); // Ensure a message is sent when the connection opens
  };

  ws.onmessage = (event) => {
    logCallback(`Received: ${event.data}`);
  };

  ws.onerror = (error) => {
    logCallback(`WebSocket error: ${error.message}`);
  };

  setTimeout(() => {
    ws.close();
    logCallback('Load Testing completed.');
  }, 10 * 60 * 1000);
}

describe('startLoadTest', () => {
  let mockWebSocket;
  let logCallback;

  beforeEach(() => {
    mockWebSocket = {
      readyState: 1,
      send: jest.fn(),
      close: jest.fn(),
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
    };
    global.WebSocket = jest.fn(() => mockWebSocket);
    logCallback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should establish WebSocket connection and send messages', () => {
    startLoadTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    expect(logCallback).toHaveBeenCalledWith('WebSocket connection established for Load Testing.');
    expect(mockWebSocket.send).toHaveBeenCalled();
  });

  test('should log received messages', () => {
    startLoadTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    // Simulate receiving a message
    const message = JSON.stringify({ id: 1, result: 'success' });
    mockWebSocket.onmessage({ data: message });

    expect(logCallback).toHaveBeenCalledWith(`Received: ${message}`);
  });

  test('should handle WebSocket errors', () => {
    startLoadTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket error
    const error = new Error('WebSocket error');
    mockWebSocket.onerror(error);

    expect(logCallback).toHaveBeenCalledWith('WebSocket error: WebSocket error');
  });

  test('should close WebSocket after 10 minutes', () => {
    jest.useFakeTimers();
    startLoadTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    jest.advanceTimersByTime(10 * 60 * 1000); // 10 minutes

    expect(mockWebSocket.close).toHaveBeenCalled();
    expect(logCallback).toHaveBeenCalledWith(expect.stringContaining('Load Testing completed.'));
    jest.useRealTimers();
  });
});
