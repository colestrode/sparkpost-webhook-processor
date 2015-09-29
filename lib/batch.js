var events = require('require-all')(__dirname + '/events')
  , q = require('q')
  , _ = require('lodash')
  , logger = require('winston');

/**
 * Processes a batch payload
 * @param payload
 * @returns {*}
 */
module.exports.process = function process(payload) {
  var batchId = payload.batchId
    , batch = payload.batch;

  return q.all(_.map(batch, function(message) {
    var envelope = message.msys // remove 'msys' wrapper
      , envelopeKey = _.keys(envelope)[0] // get message envelope key: e.g., message_event, gen_event, etc.
      , body = envelope[envelopeKey];

    // hand off to processor based on event type or send to noop in case of unhandled event
    return (events[body.type] || noop)(body);
  })).then(function() {
    return batchId;
  });
};

/**
 * Handles an event that doesn't have a handler registered in the events map
 * @param body
 * @returns {*}
 */
function noop(body) {
  logger.warn('unknown event type', body.type);
  return q();
}
