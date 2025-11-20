const express = require("express");
const router = express.Router();
const { Deal, XboxMetadata, EpicMetadata } = require("../models");
const { Op } = require("sequelize"); // 🔍 [추가] 검색 연산자(Op) 임포트

// GET /api/v1/deals
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const platform = req.query.platform;
    const search = req.query.search; // 🔍 [추가] 검색어 파라미터 받기

    // 기본 검색 조건 (활성 딜만)
    const whereCondition = {
      is_active: true,
    };

    // 1. 탭 분류용: 플랫폼 필터링
    if (platform) {
      // 'Epic'이 포함된 모든 플랫폼 검색 (Epic Games, Epic Games Store 등)
      if (platform.includes("Epic")) {
        whereCondition.platform = { [Op.iLike]: "%Epic%" };
      } else {
        // Xbox Game Pass는 정확히 매칭하거나 부분 매칭
        whereCondition.platform = { [Op.iLike]: `%${platform}%` };
      }
    }

    // 2. 검색 기능용: 타이틀 검색 (대소문자 무시)
    if (search) {
      whereCondition.title = {
        [Op.iLike]: `%${search}%`, // Postgres의 ILIKE (대소문자 무시 검색)
      };
    }

    const { count, rows } = await Deal.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]],
      include: [
        { model: XboxMetadata, as: "xboxMeta", required: false },
        { model: EpicMetadata, as: "epicMeta", required: false },
      ],
    });

    res.json({
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Server error while fetching data." });
  }
});

module.exports = router;
