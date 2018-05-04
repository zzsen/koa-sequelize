
'use strict'

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(__filename)
// var env = process.env.NODE_ENV || 'development'
var getConfig = require('../config/getConfig')
var db = {}
var debug = require('debug')('koa2Demo:model-index')

const config = getConfig('mysql')
var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    var fileContent = require(path.join(__dirname, file))
    debug(fileContent)
    debug(file.slice(0, file.lastIndexOf('.js')))
    debug(fileContent[file.substr(0, file.lastIndexOf('.js'))])

    // 添加和文件名一样的sequelize对象
    db[file.slice(0, file.lastIndexOf('.js'))] = sequelize.import('project', fileContent[file.substr(0, file.lastIndexOf('.js'))])
    // 遍历文件内的属性
    for (var key in fileContent) {
      // 添加和文件名不一样的class对象
      // 注意：这里要判断属性名和文件名不一致，免得把上面添加了的属性覆盖掉
      if (key !== file.slice(0, file.lastIndexOf('.js'))) {
        db[key] = fileContent[key]
      }
    }
    debug(db)
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
