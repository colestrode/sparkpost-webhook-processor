var config = require('config')
  , logger = require('winston')
  , amqp = require('./lib/amqp');

logger.level = config.logging.level;

amqp.createChannel()
  .then(function() {
    logger.info('webhook processor ready to accept messages.');
  });
