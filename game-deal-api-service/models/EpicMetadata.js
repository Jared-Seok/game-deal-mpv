const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const EpicMetadata = sequelize.define(
  "EpicMetadata",
  {
    deal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "deals",
        key: "id",
      },
    },
    is_free_to_keep: DataTypes.BOOLEAN,
  },
  {
    tableName: "epic_metadata",
    timestamps: false,
  }
);

module.exports = EpicMetadata;
