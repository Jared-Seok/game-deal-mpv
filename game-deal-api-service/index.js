const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
// 🚨 [수정 1] deals 라우트 임포트
const dealsRoutes = require("./routes/deals");

const app = express();
// 🚨 [수정 2] 환경 변수 확인 (4000 포트)
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection sync
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ Database synchronized.");
  })
  .catch((err) => {
    console.error("❌ Database synchronization failed:", err);
  });

// 🚨 [핵심 수정 3] /deals 경로에 dealsRoutes 미들웨어 연결
// 프론트엔드에서 'http://localhost:4000/deals?type=sale' 처럼 요청하면
// 이 라우터가 요청을 받습니다.
app.use("/deals", dealsRoutes);

// Basic root route (테스트용)
app.get("/", (req, res) => {
  res.send("Deal Tracker API is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js API Server running on port ${PORT}`);
});
