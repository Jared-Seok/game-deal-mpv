// game-deal-api-service/models/EAPlayMetadata.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const EAPlayMetadata = sequelize.define(
  "EAPlayMetadata",
  {
    deal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "deals",
        key: "id",
      },
    },
    is_ea_play: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ea_play_tier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    platform_availability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    removal_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "ea_play_metadata",
    timestamps: false,
  }
);

module.exports = EAPlayMetadata;
