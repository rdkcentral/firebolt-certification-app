import BaseHandler from './BaseHandler';

require('dotenv').config();

export default class GetSDKVersionHandler extends BaseHandler {
  constructor(handlerName) {
    super(handlerName);
  }

  async handle(message) {
    const file = require('../../../package.json');
    const validationReport = file.version;
    const reportstring = JSON.stringify({ report: validationReport });
    return JSON.stringify({ report: reportstring });
  }
}
