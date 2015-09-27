var amqplib = require('amqplib')
  , config = require('config')
  , onExit = require('on-exit')
  , logger = require('winston')
  , batchHandler = require('./batch')
  , amqp = module.exports
  , channel;


/**
 * Connects to RabbitMQ, sets up a channel, and creates (if necessary) and gets reference to an exchange
 * The config.amqp stanza will be used as options when connecting to RabbitMQ
 * @returns {Promise} A promised fulfilled with the new channel
 */
amqp.createChannel = function createChannel() {
  return amqplib.connect(getAmqpConnectionString(), config.amqp)
    .then(function(conn) {
      return conn.createChannel();
    })
    .then(function(ch) {
      channel = ch;
      // create queue if not exists
      return channel.assertQueue(config.amqp.queue, {durable: true});
    })
    .then(function() {
      // bind to messages in the configured exchange with the "sparkpost" routing key
      return channel.bindQueue(config.amqp.queue, config.amqp.exchange, 'sparkpost');
    })
    .then(function() {
      // establish consumer logic
      return channel.consume(config.amqp.queue, consume, {noAck: false});
    })
    .then(function() {
      return channel;
    });
};


/**
 * Callback for receiving a message from Rabbit
 * @param message
 */
function consume(message) {
  var start = new Date().getTime()
    , payload = JSON.parse(message.content.toString('UTF8'));

  logger.info('received batch');
  batchHandler.process(payload)
    .then(function(batchId) {
      channel.ack(message);
      logger.info('batch ' + batchId + ' processed in ' + (new Date().getTime() - start) / 1000 + ' seconds.');
    });
}


// clean up RabbitMQ connection on exit
onExit(function() {
  if (channel) {
    logger.info('Closing RabbitMQ connection');
    return channel.close();
  }
});


/**
 * Constructs an AMQP connection string
 * @returns {string}
 */
function getAmqpConnectionString() {
  var cfg = config.amqp
    , user = process.env.AMQP_WEBHOOK_USER || cfg.user
    , password = process.env.AMQP_WEBHOOK_PASSWORD || cfg.password;

  return 'amqp://' + user + ':' + password + '@' + cfg.url + ':' + cfg.port;
}
