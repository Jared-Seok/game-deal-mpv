const express = require("express");
const router = express.Router();
const Deal = require("../models/Deal");

// GET /api/v1/deals - 모든 활성 딜 정보를 조회하는 API
router.get("/", async (req, res) => {
  try {
    // is_active=true인 딜만 조회 (필터링 예시)
    const deals = await Deal.findAll({
      where: {
        is_active: true,
      },
      // 최신 정보가 위로 오도록 정렬
      order: [["id", "DESC"]],
    });

    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Server error while fetching data." });
  }
});

module.exports = router;
