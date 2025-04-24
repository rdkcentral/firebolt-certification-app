import { Lightning } from '@lightningjs/sdk';
import { startStressTest } from './loadTesting';
import LogView from './LogView';

export default class StressTestingView extends Lightning.Component {
  static _template() {
    return {
      LogView: {
        type: LogView,
      },
    };
  }

  _init() {
    const websocketUrl = process.env.WEBSOCKET_URL || 'ws://localhost:9998';
    console.log('Initializing Stress Testing...');
    this.tag('LogView').addLog('Initializing Stress Testing...');
    startStressTest(websocketUrl, (logMessage) => {
      this.tag('LogView').addLog(logMessage);
    });
  }
}
