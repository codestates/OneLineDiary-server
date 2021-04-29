'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  post_info.init({
    post_id: DataTypes.INTEGER,
    emoji_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'post_info',
  });
  return post_info;
};