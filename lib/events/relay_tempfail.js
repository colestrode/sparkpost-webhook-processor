var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed relay_tempfail event');
  return q();
};
