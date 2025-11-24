const { sequelize } = require("../config/db");
const Deal = require("./Deal");
const XboxMetadata = require("./XboxMetadata");
const EpicMetadata = require("./EpicMetadata");
// 👇 신규 모델 Import
const SteamMetadata = require("./SteamMetadata");
const UbisoftMetadata = require("./UbisoftMetadata");

// Relationships
Deal.hasOne(XboxMetadata, { foreignKey: "deal_id", as: "xboxMeta" });
XboxMetadata.belongsTo(Deal, { foreignKey: "deal_id" });

Deal.hasOne(EpicMetadata, { foreignKey: "deal_id", as: "epicMeta" });
EpicMetadata.belongsTo(Deal, { foreignKey: "deal_id" });

// 👇 스팀 관계 설정
Deal.hasOne(SteamMetadata, { foreignKey: "deal_id", as: "steamMeta" });
SteamMetadata.belongsTo(Deal, { foreignKey: "deal_id" });

// 👇 유비소프트 관계 설정
Deal.hasOne(UbisoftMetadata, { foreignKey: "deal_id", as: "ubiMeta" });
UbisoftMetadata.belongsTo(Deal, { foreignKey: "deal_id" });

module.exports = {
  sequelize,
  Deal,
  XboxMetadata,
  EpicMetadata,
  SteamMetadata, 
  UbisoftMetadata, 
};
