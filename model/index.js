
'use strict'

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(__filename)
// var env = process.env.NODE_ENV || 'development'
var getConfig = require('../config/getConfig')
var db = {}
var debug = require('debug')

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
    console.log(file.slice(0, file.lastIndexOf('.js')))
    var temp = require(path.join(__dirname, file))
    console.log(temp)
    console.log(temp[file.substr(0, file.lastIndexOf('.js'))])

    db[file.slice(0, file.lastIndexOf('.js'))] = sequelize.import('project', temp[file.substr(0, file.lastIndexOf('.js'))])
    console.log(db)
    // var model = sequelize['import'](path.join(__dirname, file))
    // db[model.name] = model
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
