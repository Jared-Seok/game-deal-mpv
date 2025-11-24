// game-deal-api-service/routes/deals.js

const express = require("express");
const router = express.Router();
const {
  Deal,
  XboxMetadata,
  EpicMetadata,
  SteamMetadata,
  UbisoftMetadata,
} = require("../models");
const { Op } = require("sequelize");

// GET /api/v1/deals
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { type, platform, search } = req.query;

    // 기본 조건: 활성화된 딜만 조회
    const whereCondition = {
      is_active: true,
    };

    // 1. [핵심] 딜 유형(Category)으로 필터링
    // 프론트엔드 요청: type = 'free' | 'sub' | 'sale'
    if (type) {
      if (type === "sub") {
        // 구독 서비스 (Xbox Game Pass 등)
        whereCondition.deal_type = "GamePass";
      } else if (type === "free") {
        // 무료 배포 (Epic, Steam, Ubisoft 등)
        whereCondition.deal_type = "Free";
      } else if (type === "sale") {
        // 일반 할인
        whereCondition.deal_type = "Sale";
      }
    }

    // 2. 플랫폼 추가 필터링 (옵션)
    // 예: 무료 게임 중에서 'Steam'만 보고 싶을 때
    if (platform) {
      whereCondition.platform = { [Op.iLike]: `%${platform}%` };
    }

    // 3. 검색 기능 (타이틀)
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
      // 정렬: 최신 업데이트순, 그 다음 ID순
      order: [
        ["updatedAt", "DESC"],
        ["id", "DESC"],
      ],
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
        {
          model: SteamMetadata,
          as: "steamMeta",
          required: false,
        },
        {
          model: UbisoftMetadata,
          as: "ubiMeta",
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
