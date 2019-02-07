'use strict';

const log4js = require('log4js');

// ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
log4js.configure({
  appenders: {
    'main-app': {
      type: 'stdout',
      layout: {
        type: 'coloured'
      }
    },
    everything: {
      type: 'dateFile',
      filename: __base + '/logs/main/main',
      pattern: '-yyy-MM-dd.log',
      alwaysIncludePattern: true,
      keepFileExt: true,
      compress: true
    },
    health: {
      type: 'dateFile',
      filename: __base + '/logs/health/health',
      pattern: '-yyy-MM-dd.log',
      alwaysIncludePattern: true,
      keepFileExt: true,
      compress: true
    },
    http: {
      type: 'dateFile',
      filename: __base + '/logs/access/access',
      pattern: '-yyy-MM-dd.log',
      alwaysIncludePattern: true,
      keepFileExt: true,
      compress: true
    }
  },
  categories: {
    default: {
      appenders: ['main-app', 'everything'],
      level: 'all'
    },
    health: {
      appenders: ['health'],
      level: 'all'
    },
    http: {
      appenders: ['http'],
      level: 'all'
    }
  }
});

module.exports = {
  logger: log4js.getLogger('main-app'),
  health: log4js.getLogger('health'),
  http: log4js.getLogger('http')
};
