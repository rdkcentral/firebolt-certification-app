import { startStressTest } from '../../src/loadTesting';

export function startStressTest(url, logCallback) {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    logCallback('WebSocket connection established for Stress Testing.');
    ws.send('Start stress test message'); // Send a message when the connection is established
  };

  ws.onclose = () => {
    logCallback('Stress Testing completed.');
  };
}

describe('startStressTest', () => {
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
    startStressTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    expect(logCallback).toHaveBeenCalledWith('WebSocket connection established for Stress Testing.');
    expect(mockWebSocket.send).toHaveBeenCalled();
  });

  test('should adjust interval dynamically', () => {
    jest.useFakeTimers();
    startStressTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    jest.advanceTimersByTime(30 * 1000); // 30 seconds
    expect(logCallback).toHaveBeenCalledWith(expect.stringContaining('Adjusting interval to'));
    jest.useRealTimers();
  });

  test('should close WebSocket after 30 minutes', () => {
    jest.useFakeTimers();
    startStressTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes

    expect(mockWebSocket.close).toHaveBeenCalled();
    expect(logCallback).toHaveBeenCalledWith(expect.stringContaining('Stress Testing completed.'));
    jest.useRealTimers();
  });
});
