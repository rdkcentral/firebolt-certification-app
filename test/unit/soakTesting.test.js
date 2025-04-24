import { startSoakTest } from '../../src/loadTesting';

describe('startSoakTest', () => {
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
    startSoakTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    expect(logCallback).toHaveBeenCalledWith('WebSocket connection established for Soak Testing.');
    expect(mockWebSocket.send).toHaveBeenCalled();
  });

  test('should schedule two random calls within a 5-second window', () => {
    jest.useFakeTimers();
    startSoakTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    jest.advanceTimersByTime(5000); // 5 seconds
    expect(mockWebSocket.send).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  test('should close WebSocket after 30 minutes', () => {
    jest.useFakeTimers();
    startSoakTest('ws://localhost:9998', logCallback);

    // Simulate WebSocket open
    mockWebSocket.onopen();

    jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes

    expect(mockWebSocket.close).toHaveBeenCalled();
    expect(logCallback).toHaveBeenCalledWith(expect.stringContaining('Soak Testing completed.'));
    jest.useRealTimers();
  });
});