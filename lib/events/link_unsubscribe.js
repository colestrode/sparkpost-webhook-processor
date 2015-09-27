var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed link_unsubscribe event');
  return q();
};
