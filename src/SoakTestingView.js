import { Lightning } from '@lightningjs/sdk';
import { startSoakTest } from './loadTesting';
import LogView from './LogView';

export default class SoakTestingView extends Lightning.Component {
  static _template() {
    return {
      LogView: {
        type: LogView,
      },
    };
  }

  _init() {
    const websocketUrl = process.env.WEBSOCKET_URL || 'ws://localhost:9998';
    console.log('Initializing Soak Testing...');
    this.tag('LogView').addLog('Initializing Soak Testing...');
    startSoakTest(websocketUrl, (logMessage) => {
      this.tag('LogView').addLog(logMessage);
    });
  }
}