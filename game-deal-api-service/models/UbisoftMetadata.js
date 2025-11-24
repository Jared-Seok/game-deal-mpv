const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UbisoftMetadata = sequelize.define(
  "UbisoftMetadata",
  {
    deal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "deals",
        key: "id",
      },
    },
    is_freeplay: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    has_giveaway_badge: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "ubisoft_metadata",
    timestamps: false,
  }
);

module.exports = UbisoftMetadata;
