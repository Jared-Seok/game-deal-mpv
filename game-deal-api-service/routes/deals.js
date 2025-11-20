const express = require("express");
const router = express.Router();
const { Deal, XboxMetadata, EpicMetadata } = require("../models");
const { Op } = require("sequelize");

// GET /api/v1/deals
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const platform = req.query.platform;
    const search = req.query.search;

    // 기본 조건: 활성화된 딜만 조회
    const whereCondition = {
      is_active: true,
    };

    // 🚨 [수정 핵심] 플랫폼 필터링 로직 개선
    if (platform) {
      if (platform === "Xbox" || platform === "Xbox Game Pass") {
        // 탭이 Xbox면 -> GamePass 타입만 조회
        whereCondition.deal_type = "GamePass";
      } else if (platform === "Epic" || platform.includes("Epic")) {
        // 탭이 Epic이면 -> 크롤러가 저장한 값인 'Free'로 조회
        // (기존 "Epic"에서 "Free"로 변경)
        whereCondition.deal_type = "Free";
      } else {
        // 그 외의 경우 (예: 직접 검색 등) 플랫폼 이름으로 검색
        whereCondition.platform = { [Op.iLike]: `%${platform}%` };
      }
    }

    // 검색 기능 (타이틀 검색)
    if (search) {
      whereCondition.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // 데이터 조회
    const { count, rows } = await Deal.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]],
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
