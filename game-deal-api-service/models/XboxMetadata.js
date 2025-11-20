const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const XboxMetadata = sequelize.define(
  "XboxMetadata",
  {
    deal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "deals", // 참조할 테이블 이름
        key: "id",
      },
    },
    is_game_pass: DataTypes.BOOLEAN,
    is_day_one: DataTypes.BOOLEAN,
    game_pass_tier: DataTypes.STRING, // 요금제 정보 (Premium, Ultimate 등)
    removal_date: DataTypes.DATE,
  },
  {
    tableName: "xbox_metadata",
    timestamps: false,
  }
);

module.exports = XboxMetadata;
