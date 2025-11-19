const { Sequelize } = require("sequelize");
require("dotenv").config(); // .env 파일 로드

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres", // PostgreSQL 사용 명시
    logging: false, // 콘솔에 SQL 쿼리 로깅 비활성화
  }
);

// DB 연결 테스트 함수
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "✅ PostgreSQL DB connection has been established successfully."
    );
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    // 연결 실패 시 서버가 실행되지 않도록 프로세스 종료
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
