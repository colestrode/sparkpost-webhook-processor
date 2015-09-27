var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed generation_rejection event');
  return q();
};
