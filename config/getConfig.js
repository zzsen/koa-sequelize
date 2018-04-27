let _config
var debug = require('debug')('express-demo:getConfig')
try {
  _config = require('./config.json')
  debug('config : ' + _config)
} catch (e) {
  debug('can not get config.json')
}
module.exports = function (_configName) {
  const configs = _config[_configName]
  let config = configs
  if (!configs || !configs.length) { return config }
  switch (process.env.NODE_ENV.trim()) {
    case 'development':
      config = configs.find(c => c.environment === process.env.NODE_ENV.trim())
      break
    case 'production':
      config = configs.find(c => c.environment === process.env.NODE_ENV.trim() || c.environment === 'development')
      break
    default:
  }
  return config
}
