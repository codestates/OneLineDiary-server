"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class emoji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.emoji.hasMany(models.post_info, {
        foreignKey: "emoji_id",
        sourceKey: "id",
      });
    }
  }
  emoji.init(
    {
      emoji: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "emoji",
    }
  );
  return emoji;
};
