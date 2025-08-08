import { Lightning } from '@lightningjs/sdk';

export default class LogView extends Lightning.Component {
  static _template() {
    return {
      Logs: {
        rect: true,
        w: 0.6 * 1920, // 60% of the screen width
        h: 0.7 * 1080, // 70% of the screen height
        x: 0.2 * 1920, // Center horizontally (20% margin on each side)
        y: 0.15 * 1080, // Center vertically (15% margin on top and bottom)
        color: 0xffffffff, // White background
        clipping: true, // Enable clipping for the container
        shader: {
          type: Lightning.shaders.RoundedRectangle, // Add rounded corners
          radius: 20, // Corner radius
        },
        ScrollableContent: {
          y: 0, // Initial scroll position
          text: {
            text: '',
            fontSize: 0.02 * 1920, // Scalable font size (2% of screen width)
            wordWrap: true,
            wordWrapWidth: 0.58 * 1920, // Ensure text wraps within 58% of the screen width
            lineHeight: 0.03 * 1920, // Scalable line height (3% of screen width)
            textColor: 0xff000000, // Black text
          },
        },
      },
    };
  }

  addLog(message) {
    const logs = this.tag('ScrollableContent').text.text;
    this.tag('ScrollableContent').text.text = `${logs}\n${message}`;

    // Automatically scroll down to show the latest log
    const contentHeight = this.tag('ScrollableContent').renderHeight;
    const containerHeight = this.tag('Logs').h;

    if (contentHeight > containerHeight) {
      this.tag('ScrollableContent').y = containerHeight - contentHeight;
    }
  }
}
