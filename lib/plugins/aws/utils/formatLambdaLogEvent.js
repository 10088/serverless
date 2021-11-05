'use strict';

const dayjs = require('dayjs');
const chalk = require('chalk');
const os = require('os');
const { style } = require('@serverless/utils/log');

module.exports = (msgParam, options = {}) => {
  const { isModern } = options;
  let msg = msgParam;
  const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSS';

  if (isModern) {
    if (!msg.startsWith('REPORT')) msg = msg.trimRight();
  } else if (msg.startsWith('REPORT')) {
    msg += os.EOL;
  }

  if (msg.startsWith('START')) {
    msg = 'START';
    return isModern ? style.aside(msg) : chalk.gray(msg);
  }

  if (msg.startsWith('REPORT')) {
    const splitted = msg.split('\t');
    // Replace REPORT with END and filter out RequestId
    msg = `END ${splitted.slice(1).join('\t')}`;
    return isModern ? style.aside(msg) : chalk.gray(msg);
  }

  if (msg.trim() === 'Process exited before completing request') {
    return isModern ? style.error(msg) : chalk.red(msg);
  }

  const splitted = msg.split('\t');

  if (splitted.length < 3) {
    return msg;
  }

  let date = '';
  let reqId = '';
  let level = '';
  if (!isNaN(new Date(splitted[0]).getTime())) {
    date = splitted[0];
    reqId = splitted[1];
  } else if (!isNaN(new Date(splitted[1]).getTime())) {
    date = splitted[1];
    reqId = splitted[2];
    level = `${splitted[0]}\t`;
  } else {
    return msg;
  }
  const text = msg.split(`${reqId}\t`)[1];
  const time = dayjs(date).format(dateFormat);

  if (isModern) return `${style.aside(`${time}\t`)}${level}${text}`;
  return `${chalk.green(time)}\t${level}${text}`;
};
