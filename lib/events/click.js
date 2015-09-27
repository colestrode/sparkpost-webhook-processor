var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed click event');
  return q();
};
