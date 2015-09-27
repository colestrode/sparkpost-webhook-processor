var q = require('q')
  , logger = require('winston');

module.exports = function() {
  logger.debug('processed out_of_band event');
  return q();
};
