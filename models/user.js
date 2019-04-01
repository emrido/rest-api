'use strict';
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password required'
        }
      }
    },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: function(user, option) {
        user.password = bcrypt.hashSync(user.password, Number(process.env.SALT));
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};