import { Lightning } from '@lightningjs/sdk';
import { startLoadTest } from './loadTesting';
import LogView from './LogView';

export default class LoadTestingView extends Lightning.Component {
  static _template() {
    return {
      LogView: {
        type: LogView,
      },
    };
  }

  _init() {
    const websocketUrl = process.env.WEBSOCKET_URL || 'ws://localhost:9998';
    console.log('Initializing Load Testing...');
    this.tag('LogView').addLog('Initializing Load Testing...');
    startLoadTest(websocketUrl, (logMessage) => {
      this.tag('LogView').addLog(logMessage);
    });
  }
}