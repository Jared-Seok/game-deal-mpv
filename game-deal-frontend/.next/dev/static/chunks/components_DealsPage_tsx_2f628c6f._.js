(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/DealsPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DealsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function DealsPage({ title, category }) {
    _s();
    const [deals, setDeals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("az");
    // --- 2. 데이터 로드 ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DealsPage.useEffect": ()=>{
            const fetchData = {
                "DealsPage.useEffect.fetchData": async ()=>{
                    setLoading(true);
                    try {
                        // 모든 카탈로그(450개+)를 한 번에 불러오기 위해 limit 3000 설정
                        const [xboxRes, epicRes] = await Promise.allSettled([
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:4000/api/v1/deals", {
                                params: {
                                    platform: "Xbox",
                                    limit: 3000
                                }
                            }),
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("http://localhost:4000/api/v1/deals", {
                                params: {
                                    platform: "Epic",
                                    limit: 3000
                                }
                            })
                        ]);
                        const xboxData = xboxRes.status === "fulfilled" ? xboxRes.value.data.data : [];
                        const epicData = epicRes.status === "fulfilled" ? epicRes.value.data.data : [];
                        const allDeals = [
                            ...xboxData,
                            ...epicData
                        ];
                        // 카테고리별 필터링 로직
                        let targetDeals = [];
                        if (category === "free") {
                            // 무료 배포: 가격 0원 or Epic Free Keep (Xbox 구독 제외)
                            targetDeals = allDeals.filter({
                                "DealsPage.useEffect.fetchData": (d)=>(d.sale_price === 0 || d.epicMeta?.is_free_to_keep) && !d.platform.includes("Xbox")
                            }["DealsPage.useEffect.fetchData"]);
                        } else if (category === "sale") {
                            // 할인: 정가 > 판매가
                            targetDeals = allDeals.filter({
                                "DealsPage.useEffect.fetchData": (d_0)=>d_0.regular_price > d_0.sale_price && d_0.sale_price > 0
                            }["DealsPage.useEffect.fetchData"]);
                        } else if (category === "sub") {
                            // 구독: Xbox (또는 추후 PS Plus 등)
                            targetDeals = allDeals.filter({
                                "DealsPage.useEffect.fetchData": (d_1)=>d_1.platform.includes("Xbox") || d_1.deal_type === "GamePass"
                            }["DealsPage.useEffect.fetchData"]);
                        }
                        setDeals(targetDeals);
                    } catch (error) {
                        console.error("데이터 로드 실패", error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["DealsPage.useEffect.fetchData"];
            fetchData();
        }
    }["DealsPage.useEffect"], [
        category
    ]);
    // --- 3. 검색 및 정렬 (한글 우선) ---
    const filteredDeals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DealsPage.useMemo[filteredDeals]": ()=>{
            let result = deals.filter({
                "DealsPage.useMemo[filteredDeals].result": (deal)=>deal.title.toLowerCase().includes(searchTerm.toLowerCase())
            }["DealsPage.useMemo[filteredDeals].result"]);
            if (sortOrder === "az") {
                result.sort({
                    "DealsPage.useMemo[filteredDeals]": (a, b)=>{
                        const titleA = a.title;
                        const titleB = b.title;
                        const isKoA = /[가-힣]/.test(titleA.charAt(0));
                        const isKoB = /[가-힣]/.test(titleB.charAt(0));
                        if (isKoA === isKoB) {
                            return titleA.localeCompare(titleB, "ko-KR", {
                                numeric: true
                            });
                        }
                        return isKoA ? -1 : 1;
                    }
                }["DealsPage.useMemo[filteredDeals]"]);
            }
            return result;
        }
    }["DealsPage.useMemo[filteredDeals]"], [
        deals,
        searchTerm,
        sortOrder
    ]);
    const getImageSrc = (deal_0)=>deal_0.image_url || "/default_thumb.png";
    // --- 4. 렌더링 헬퍼 (메인 대시보드와 동일한 로직) ---
    // 가격/구독 정보 표시
    const renderPriceOrInfo = (deal_1)=>{
        if (deal_1.xboxMeta) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-start gap-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-extrabold text-green-700 uppercase",
                        children: deal_1.xboxMeta.game_pass_tier.replace(/,/g, " · ")
                    }, void 0, false, {
                        fileName: "[project]/components/DealsPage.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-gray-500 truncate max-w-full",
                        children: "Xbox Console · PC"
                    }, void 0, false, {
                        fileName: "[project]/components/DealsPage.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealsPage.tsx",
                lineNumber: 108,
                columnNumber: 14
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-start",
            children: [
                deal_1.regular_price > deal_1.sale_price && deal_1.regular_price > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[10px] text-gray-400 line-through",
                    children: [
                        "₩",
                        deal_1.regular_price.toLocaleString()
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DealsPage.tsx",
                    lineNumber: 118,
                    columnNumber: 82
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-blue-600 font-bold text-sm",
                    children: deal_1.sale_price === 0 ? "무료" : `₩${deal_1.sale_price.toLocaleString()}`
                }, void 0, false, {
                    fileName: "[project]/components/DealsPage.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealsPage.tsx",
            lineNumber: 117,
            columnNumber: 12
        }, this);
    };
    // 배지 표시
    const renderBadges = (deal_2)=>{
        if (deal_2.xboxMeta?.is_day_one) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "px-1.5 py-0.5 text-[9px] font-bold text-black bg-yellow-400 rounded",
                children: "Day 1"
            }, void 0, false, {
                fileName: "[project]/components/DealsPage.tsx",
                lineNumber: 130,
                columnNumber: 14
            }, this);
        }
        if (deal_2.epicMeta?.is_free_to_keep) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "px-1.5 py-0.5 text-[9px] font-bold text-white bg-blue-600 rounded",
                children: "Free Keep"
            }, void 0, false, {
                fileName: "[project]/components/DealsPage.tsx",
                lineNumber: 135,
                columnNumber: 14
            }, this);
        }
        if (deal_2.discount_rate > 0) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "px-1.5 py-0.5 text-[9px] font-bold text-white bg-red-600 rounded",
                children: [
                    "-",
                    deal_2.discount_rate,
                    "%"
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealsPage.tsx",
                lineNumber: 140,
                columnNumber: 14
            }, this);
        }
        return null;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row justify-between items-end mb-8 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-extrabold text-gray-900 mb-2",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/components/DealsPage.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 text-sm",
                                children: [
                                    "총",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-gray-900",
                                        children: filteredDeals.length
                                    }, void 0, false, {
                                        fileName: "[project]/components/DealsPage.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    "개의 게임을 찾았습니다."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DealsPage.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DealsPage.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-3 w-full md:w-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "게임 제목 검색...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: "flex-1 md:w-64 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none transition-shadow"
                            }, void 0, false, {
                                fileName: "[project]/components/DealsPage.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: sortOrder,
                                onChange: (e_0)=>setSortOrder(e_0.target.value),
                                className: "px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none bg-white cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "az",
                                    children: "가나다순 (A-Z)"
                                }, void 0, false, {
                                    fileName: "[project]/components/DealsPage.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/DealsPage.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DealsPage.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealsPage.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center py-32",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
                }, void 0, false, {
                    fileName: "[project]/components/DealsPage.tsx",
                    lineNumber: 172,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DealsPage.tsx",
                lineNumber: 171,
                columnNumber: 18
            }, this) : filteredDeals.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500",
                    children: "조건에 맞는 게임이 없습니다."
                }, void 0, false, {
                    fileName: "[project]/components/DealsPage.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DealsPage.tsx",
                lineNumber: 173,
                columnNumber: 47
            }, this) : // [수정됨] 반응형 그리드 설정 (모바일 2열 ~ 데스크탑 5열)
            // gap-y-8로 행 간격을 넓혀 가독성을 높였습니다.
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8",
                children: filteredDeals.map((deal_3)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-full aspect-[16/9] bg-gray-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: getImageSrc(deal_3),
                                        alt: deal_3.title,
                                        fill: true,
                                        className: "object-cover group-hover:scale-105 transition-transform duration-300",
                                        unoptimized: true
                                    }, void 0, false, {
                                        fileName: "[project]/components/DealsPage.tsx",
                                        lineNumber: 182,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
                                        children: deal_3.platform.includes("Xbox") ? "Xbox" : deal_3.platform
                                    }, void 0, false, {
                                        fileName: "[project]/components/DealsPage.tsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DealsPage.tsx",
                                lineNumber: 181,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 flex flex-col h-[140px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1 h-10 group-hover:text-blue-600 transition-colors",
                                        children: deal_3.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/DealsPage.tsx",
                                        lineNumber: 191,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-2 min-h-[40px] flex flex-col justify-end",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-end w-full",
                                                    children: [
                                                        renderPriceOrInfo(deal_3),
                                                        renderBadges(deal_3)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/DealsPage.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/DealsPage.tsx",
                                                lineNumber: 196,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: deal_3.url,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded transition-colors",
                                                children: deal_3.xboxMeta ? "플레이 하기" : "스토어 이동"
                                            }, void 0, false, {
                                                fileName: "[project]/components/DealsPage.tsx",
                                                lineNumber: 203,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/DealsPage.tsx",
                                        lineNumber: 195,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DealsPage.tsx",
                                lineNumber: 190,
                                columnNumber: 15
                            }, this)
                        ]
                    }, deal_3.id, true, {
                        fileName: "[project]/components/DealsPage.tsx",
                        lineNumber: 179,
                        columnNumber: 40
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/DealsPage.tsx",
                lineNumber: 178,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DealsPage.tsx",
        lineNumber: 146,
        columnNumber: 10
    }, this);
}
_s(DealsPage, "xJXKZUWail1ZACrWD3IKzTJpmls=");
_c = DealsPage;
var _c;
__turbopack_context__.k.register(_c, "DealsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_DealsPage_tsx_2f628c6f._.js.map