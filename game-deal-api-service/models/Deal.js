const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Deal = sequelize.define(
  "Deal",
  {
    // id는 Sequelize가 자동으로 기본 키로 생성하므로 정의하지 않아도 됩니다.
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    regular_price: {
      type: DataTypes.FLOAT,
    },
    sale_price: {
      type: DataTypes.FLOAT,
    },
    discount_rate: {
      type: DataTypes.INTEGER,
    },
    deal_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE, // PostgreSQL의 DateTime과 매핑
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    // 테이블 이름은 Python에서 정의한 'deals'로 명시
    tableName: "deals",
    // Sequelize가 기본으로 추가하는 'createdAt', 'updatedAt' 컬럼 사용 안 함
    timestamps: false,
  }
);

module.exports = Deal;
