var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed policy_rejection event');
  return q();
};
