// game-deal-api-service/routes/deals.js

const express = require("express");
const router = express.Router();
const {
  Deal,
  XboxMetadata,
  EpicMetadata,
  SteamMetadata,
  UbisoftMetadata,
  EAPlayMetadata,
} = require("../models");
const { Op } = require("sequelize");

// GET /api/v1/deals
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // 1. 쿼리 파라미터 가져오기
    const rawType = req.query.type || "";
    const type = rawType.toLowerCase().trim();
    const { platform, search, sort, min_reviews } = req.query; // 'min_reviews' 파라미터 추가

    // 기본 조건: 활성화된 딜만 조회
    const whereCondition = {
      is_active: true,
    };

    // SteamMetadata에 대한 옵션을 동적으로 구성
    const steamMetaInclude = {
      model: SteamMetadata,
      as: "steamMeta",
      required: false, // 기본값은 false
    };

    if (type === "sale" && min_reviews) {
      steamMetaInclude.where = {
        total_reviews: { [Op.gte]: parseInt(min_reviews) },
      };
      steamMetaInclude.required = true; // [FIX] INNER JOIN으로 변경하여 조건에 맞는 deal만 가져옴
    }

    // 2. [핵심 수정] 딜 유형 필터링 로직 강화
    if (type) {
      if (type === "sub" || type === "gamepass" || type === "subscription") {
        whereCondition.deal_type = { [Op.in]: ["GamePass", "Subscription"] };
      } else if (type === "free") {
        whereCondition.deal_type = "Free";
      } else if (type === "sale") {
        whereCondition.deal_type = "Sale";
      } else {
        return res.json({
          meta: { totalItems: 0, totalPages: 0, currentPage: page },
          data: [],
        });
      }
    }

    // 3. 플랫폼 추가 필터링
    if (platform) {
      whereCondition.platform = { [Op.iLike]: `%${platform}%` };
    }

    // 4. 검색 기능
    if (search) {
      whereCondition.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // 5. 정렬(Sorting) 로직 추가
    let order = [
      ["updatedAt", "DESC"],
      ["id", "DESC"],
    ];

    if (sort) {
      if (sort === "discount") {
        order = [["discount_rate", "DESC"]];
      } else if (sort === "reviews") {
        order = [["steamMeta", "total_reviews", "DESC"]];
      } else if (sort === "positive") {
        order = [["steamMeta", "positive_review_percent", "DESC"]];
      } else if (sort === "az") {
        order = [["title", "ASC"]];
      }
    }

    // 데이터 조회
    const { count, rows } = await Deal.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: order, // 동적으로 생성된 정렬 조건 적용
      include: [
        { model: XboxMetadata, as: "xboxMeta", required: false },
        { model: EpicMetadata, as: "epicMeta", required: false },
        steamMetaInclude, // 동적으로 구성된 SteamMetadata include 적용
        { model: UbisoftMetadata, as: "ubiMeta", required: false },
        { model: EAPlayMetadata, as: "eaPlayMeta", required: false },
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
