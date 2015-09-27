var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed list_unsubscribe event');
  return q();
};
