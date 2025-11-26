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

    // 1. 쿼리 파라미터 가져오기 (type을 소문자로 변환하여 안전하게 처리)
    const rawType = req.query.type || "";
    const type = rawType.toLowerCase().trim(); // "Free " -> "free"
    const { platform, search } = req.query;

    // 기본 조건: 활성화된 딜만 조회
    const whereCondition = {
      is_active: true,
    };

    // 2. [핵심 수정] 딜 유형 필터링 로직 강화
    // 입력값이 매칭되지 않으면 필터가 무시되어 전체가 조회되는 것을 방지
    if (type) {
      if (type === "sub" || type === "gamepass" || type === "subscription") {
        // 구독 서비스 (Xbox Game Pass와 EA Play 포함)
        whereCondition.deal_type = { [Op.in]: ["GamePass", "Subscription"] };
      } else if (type === "free") {
        // 무료 배포
        whereCondition.deal_type = "Free";
      } else if (type === "sale") {
        // 일반 할인
        whereCondition.deal_type = "Sale";
      } else {
        // [중요] 이상한 type이 들어오면 아무것도 조회되지 않게 막거나, 에러 처리가 필요함
        // 현재는 안전하게 빈 결과를 반환하도록 설정 (원치 않는 전체 노출 방지)
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

    // 데이터 조회
    const { count, rows } = await Deal.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [
        ["updatedAt", "DESC"],
        ["id", "DESC"],
      ],
      include: [
        { model: XboxMetadata, as: "xboxMeta", required: false },
        { model: EpicMetadata, as: "epicMeta", required: false },
        { model: SteamMetadata, as: "steamMeta", required: false },
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
