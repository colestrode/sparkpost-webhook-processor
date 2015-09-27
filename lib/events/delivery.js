var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed delivery event');
  return q();
};
