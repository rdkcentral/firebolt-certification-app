import { Lightning } from '@lightningjs/sdk';

export default class LogView extends Lightning.Component {
  static _template() {
    return {
      Logs: {
        rect: true,
        w: 800,
        h: 600,
        x: 50,
        y: 50,
        color: 0xff000000,
        text: {
          text: '',
          fontSize: 20,
          wordWrap: true,
          wordWrapWidth: 780,
          lineHeight: 30,
          textColor: 0xffffffff,
        },
      },
    };
  }

  addLog(message) {
    const logs = this.tag('Logs').text.text;
    this.tag('Logs').text.text = `${logs}\n${message}`;
  }
}