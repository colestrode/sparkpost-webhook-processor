var events = require('require-all')(__dirname + '/events')
  , q = require('q')
  , _ = require('lodash');

/**
 * Processes a batch payload
 * @param payload
 * @returns {*}
 */
module.exports.process = function process(payload) {
  var batchId = payload.batchId
    , batch = payload.batch;

  return q.all(_.map(batch, function(message) {
    var body = message.msys
      , keys = _.keys(body);

    // strip message envelop
    body = body[keys[0]];

    return events[body.type](body);
  })).then(function() {
    return batchId;
  });
};
