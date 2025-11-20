const express = require("express");
const router = express.Router();
// models/index.js가 있어야 합니다. (이전 단계에서 생성함)
const { Deal, XboxMetadata, EpicMetadata } = require("../models");
const { Op } = require("sequelize");

// GET /api/v1/deals
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const platform = req.query.platform; // 프론트에서 'Xbox' 또는 'Epic'을 보냄
    const search = req.query.search;

    // 기본 조건: 활성화된 딜만 조회
    const whereCondition = {
      is_active: true,
    };

    // 🚨 [수정 핵심] 플랫폼 필터링 로직 개선
    // 문자열 매칭 대신 deal_type으로 정확하게 분류합니다.
    if (platform) {
      if (platform === "Xbox" || platform === "Xbox Game Pass") {
        // 탭이 Xbox면 -> GamePass 타입만 조회
        whereCondition.deal_type = "GamePass";
      } else if (platform === "Epic" || platform.includes("Epic")) {
        // 탭이 Epic이면 -> Epic 타입만 조회
        whereCondition.deal_type = "Epic";
      } else {
        // 그 외의 경우 (예: 직접 검색 등) 플랫폼 이름으로 검색
        whereCondition.platform = { [Op.iLike]: `%${platform}%` };
      }
    }

    // 검색 기능 (타이틀 검색)
    if (search) {
      whereCondition.title = {
        [Op.iLike]: `%${search}%`, // 대소문자 무시 검색
      };
    }

    // 데이터 조회
    const { count, rows } = await Deal.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]], // 최신순 정렬
      include: [
        {
          model: XboxMetadata,
          as: "xboxMeta",
          required: false,
        },
        {
          model: EpicMetadata,
          as: "epicMeta",
          required: false,
        },
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
