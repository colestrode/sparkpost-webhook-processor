var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed bounce event');
  return q();
};
