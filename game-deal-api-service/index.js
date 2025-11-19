const express = require("express");
const { connectDB } = require("./config/db");
const dealsRouter = require("./routes/deals");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000; // API 서버 포트 설정 (예: 4000번)

// 미들웨어 설정
app.use(express.json());

// CORS 설정 (프론트엔드와 통신 허용)
// Next.js (localhost:3000)에서 접근을 허용합니다.
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000", // Next.js 기본 포트
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 라우터 연결
app.use("/api/v1/deals", dealsRouter);

// 1. DB 연결 테스트
connectDB().then(() => {
  // 2. 연결 성공 시 서버 시작
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Node.js API Server running on port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api/v1/deals`);
  });
});
