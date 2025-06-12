import { startLoadTest, startStressTest, startSoakTest } from '../../src/loadTesting.js';

jest.useFakeTimers();

describe('Load Testing Functions', () => {
  let logCallback;

  beforeEach(() => {
    logCallback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('startLoadTest should send API calls at a fixed interval and stop after 10 minutes', async () => {
    await startLoadTest('', logCallback);

    jest.runOnlyPendingTimers();
    await Promise.resolve(); // flush microtasks

    expect(logCallback).toHaveBeenCalledWith('Starting Load Test using invokeProvider.send');

    jest.advanceTimersByTime(10 * 60 * 1000); // 10 minutes
    jest.runOnlyPendingTimers();
    await Promise.resolve(); // flush microtasks

    expect(logCallback).toHaveBeenCalledWith(expect.stringContaining('Load Testing completed.'));
  });

  test('startStressTest should adjust interval and stop after 30 minutes', async () => {
    await startStressTest('', logCallback);

    expect(logCallback).toHaveBeenCalledWith('Starting Stress Test using invokeProvider.send');

    jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes

    expect(logCallback).toHaveBeenCalledWith(expect.stringContaining('Stress Testing completed.'));
  });

  test('startSoakTest should schedule calls every 5 seconds and stop after 30 minutes', async () => {
    await startSoakTest('', logCallback);

    expect(logCallback).toHaveBeenCalledWith('Starting Soak Test using invokeProvider.send');

    jest.advanceTimersByTime(30 * 60 * 1000); // 30 minutes

    expect(logCallback).toHaveBeenCalledWith(expect.stringContaining('Soak Testing completed.'));
  });
});
