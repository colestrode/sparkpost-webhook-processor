var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed spam_complaint event');
  return q();
};
