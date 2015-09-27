var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed relay_injection event');
  return q();
};
