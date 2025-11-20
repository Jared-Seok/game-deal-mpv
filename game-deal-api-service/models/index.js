const Deal = require("./Deal");
const XboxMetadata = require("./XboxMetadata");
const EpicMetadata = require("./EpicMetadata");

// 관계 설정 (1:1 관계)
// Deal은 하나의 XboxMetadata를 가질 수 있음
Deal.hasOne(XboxMetadata, {
  foreignKey: "deal_id",
  as: "xboxMeta", // API 응답 시 사용할 필드명
});

XboxMetadata.belongsTo(Deal, {
  foreignKey: "deal_id",
});

// Epic Metadata 연결
Deal.hasOne(EpicMetadata, {
  foreignKey: "deal_id",
  as: "epicMeta",
});

EpicMetadata.belongsTo(Deal, {
  foreignKey: "deal_id",
});

// 모델들을 객체로 묶어서 내보냄
module.exports = {
  Deal,
  XboxMetadata,
  EpicMetadata,
};
