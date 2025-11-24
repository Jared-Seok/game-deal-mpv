// game-deal-api-service/models/SteamMetadata.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SteamMetadata = sequelize.define(
  "SteamMetadata",
  {
    deal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "deals",
        key: "id",
      },
    },
    steam_app_id: {
      type: DataTypes.INTEGER,
    },
    review_summary: {
      type: DataTypes.STRING,
    },
    positive_review_percent: {
      type: DataTypes.INTEGER,
    },
    total_reviews: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "steam_metadata",
    timestamps: false,
  }
);

module.exports = SteamMetadata;
