
'use strict'
let user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    account: {
      type: DataTypes.STRING,
      unique: true
    },
    name: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'user',
    timestamps: true,
    paranoid: true// 不删除数据库条目，但将新添加的属性deletedAt设置为当前日期
  }
  )
  return User
}
module.exports = {
  user: user,
  usermodel: user
}
