(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// game-deal-frontend/lib/api.ts
__turbopack_context__.s([
    "fetchDeals",
    ()=>fetchDeals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
async function fetchDeals(params = {}) {
    const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:4000") || "http://localhost:4000";
    const url = new URL(`${API_BASE_URL}/api/v1/deals`);
    if (params.page) url.searchParams.append("page", params.page.toString());
    if (params.limit) url.searchParams.append("limit", params.limit.toString());
    if (params.type) url.searchParams.append("type", params.type);
    if (params.platform) url.searchParams.append("platform", params.platform);
    if (params.search) url.searchParams.append("search", params.search);
    console.log(`Fetching deals from: ${url.toString()}`);
    try {
        const res = await fetch(url.toString(), {
            cache: "no-store"
        });
        if (!res.ok) {
            console.error("API Fetch Error:", res.statusText);
            return [];
        }
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error("Failed to fetch deals:", error);
        return [];
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/cards/FreeDealCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FreeDealCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function FreeDealCard(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(46);
    if ($[0] !== "b102199694b3d04568cbd9b53ef809a844260053f3227235a4126417fae71b22") {
        for(let $i = 0; $i < 46; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b102199694b3d04568cbd9b53ef809a844260053f3227235a4126417fae71b22";
    }
    const { deal, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const [imgSrc, setImgSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(deal.image_url || "/images/default_thumbnail.png");
    let t2;
    let t3;
    if ($[1] !== deal.image_url) {
        t2 = ({
            "FreeDealCard[useEffect()]": ()=>{
                setImgSrc(deal.image_url || "/images/default_thumbnail.png");
            }
        })["FreeDealCard[useEffect()]"];
        t3 = [
            deal.image_url
        ];
        $[1] = deal.image_url;
        $[2] = t2;
        $[3] = t3;
    } else {
        t2 = $[2];
        t3 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "FreeDealCard[handleImageError]": ()=>{
                setImgSrc("/images/epic_logo.jpg");
            }
        })["FreeDealCard[handleImageError]"];
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    const handleImageError = t4;
    let t5;
    if ($[5] !== deal.end_date || $[6] !== deal.platform) {
        t5 = ({
            "FreeDealCard[getFormattedEndDate]": ()=>{
                if (!deal.end_date) {
                    return null;
                }
                const endDate = new Date(deal.end_date);
                if (deal.platform.toLowerCase().includes("ubisoft")) {
                    endDate.setHours(endDate.getHours() + 9);
                }
                return endDate.toLocaleString("ko-KR", {
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                });
            }
        })["FreeDealCard[getFormattedEndDate]"];
        $[5] = deal.end_date;
        $[6] = deal.platform;
        $[7] = t5;
    } else {
        t5 = $[7];
    }
    const getFormattedEndDate = t5;
    let t6;
    if ($[8] !== deal.platform) {
        t6 = ({
            "FreeDealCard[getPlatformName]": ()=>{
                if (deal.platform.toLowerCase().includes("epic")) {
                    return "EPIC GAMES";
                }
                if (deal.platform.toLowerCase().includes("ubisoft")) {
                    return "UBISOFT";
                }
                if (deal.platform.toLowerCase().includes("steam")) {
                    return "STEAM";
                }
                return deal.platform;
            }
        })["FreeDealCard[getPlatformName]"];
        $[8] = deal.platform;
        $[9] = t6;
    } else {
        t6 = $[9];
    }
    const getPlatformName = t6;
    const t7 = `block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`;
    const t8 = deal.url;
    let t9;
    if ($[10] !== deal.title || $[11] !== imgSrc) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: imgSrc,
            alt: deal.title,
            fill: true,
            className: "object-cover group-hover:scale-105 transition-transform duration-300",
            onError: handleImageError,
            unoptimized: true
        }, void 0, false, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 107,
            columnNumber: 10
        }, this);
        $[10] = deal.title;
        $[11] = imgSrc;
        $[12] = t9;
    } else {
        t9 = $[12];
    }
    let t10;
    if ($[13] !== getPlatformName) {
        t10 = getPlatformName();
        $[13] = getPlatformName;
        $[14] = t10;
    } else {
        t10 = $[14];
    }
    let t11;
    if ($[15] !== t10) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide z-10",
            children: t10
        }, void 0, false, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 124,
            columnNumber: 11
        }, this);
        $[15] = t10;
        $[16] = t11;
    } else {
        t11 = $[16];
    }
    let t12;
    if ($[17] !== t11 || $[18] !== t9) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full aspect-video bg-gray-200 overflow-hidden",
            children: [
                t9,
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 132,
            columnNumber: 11
        }, this);
        $[17] = t11;
        $[18] = t9;
        $[19] = t12;
    } else {
        t12 = $[19];
    }
    let t13;
    if ($[20] !== deal.title) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors",
            children: deal.title
        }, void 0, false, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 141,
            columnNumber: 11
        }, this);
        $[20] = deal.title;
        $[21] = t13;
    } else {
        t13 = $[21];
    }
    let t14;
    if ($[22] !== deal.regular_price) {
        t14 = deal.regular_price > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xs text-gray-400 line-through mb-0.5",
            children: [
                "₩",
                deal.regular_price.toLocaleString()
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 149,
            columnNumber: 37
        }, this);
        $[22] = deal.regular_price;
        $[23] = t14;
    } else {
        t14 = $[23];
    }
    let t15;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-blue-600 font-extrabold text-xl",
            children: "무료"
        }, void 0, false, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 157,
            columnNumber: 11
        }, this);
        $[24] = t15;
    } else {
        t15 = $[24];
    }
    let t16;
    if ($[25] !== t14) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-start",
            children: [
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 164,
            columnNumber: 11
        }, this);
        $[25] = t14;
        $[26] = t16;
    } else {
        t16 = $[26];
    }
    let t17;
    if ($[27] !== deal.end_date || $[28] !== getFormattedEndDate) {
        t17 = deal.end_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-right flex flex-col items-end",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[10px] text-gray-400 mb-0.5",
                    children: "종료 일시"
                }, void 0, false, {
                    fileName: "[project]/components/cards/FreeDealCard.tsx",
                    lineNumber: 172,
                    columnNumber: 80
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-[11px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded",
                    children: [
                        "~ ",
                        getFormattedEndDate()
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/cards/FreeDealCard.tsx",
                    lineNumber: 172,
                    columnNumber: 143
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 172,
            columnNumber: 28
        }, this);
        $[27] = deal.end_date;
        $[28] = getFormattedEndDate;
        $[29] = t17;
    } else {
        t17 = $[29];
    }
    let t18;
    if ($[30] !== t16 || $[31] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between items-end mb-3",
            children: [
                t16,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 181,
            columnNumber: 11
        }, this);
        $[30] = t16;
        $[31] = t17;
        $[32] = t18;
    } else {
        t18 = $[32];
    }
    let t19;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full text-center bg-gray-100 group-hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded transition-colors",
            children: "스토어로 이동"
        }, void 0, false, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 190,
            columnNumber: 11
        }, this);
        $[33] = t19;
    } else {
        t19 = $[33];
    }
    let t20;
    if ($[34] !== t18) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-auto",
            children: [
                t18,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 197,
            columnNumber: 11
        }, this);
        $[34] = t18;
        $[35] = t20;
    } else {
        t20 = $[35];
    }
    let t21;
    if ($[36] !== t13 || $[37] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3 flex flex-col flex-grow",
            children: [
                t13,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 205,
            columnNumber: 11
        }, this);
        $[36] = t13;
        $[37] = t20;
        $[38] = t21;
    } else {
        t21 = $[38];
    }
    let t22;
    if ($[39] !== deal.url || $[40] !== t12 || $[41] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: t8,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex flex-col h-full",
            children: [
                t12,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 214,
            columnNumber: 11
        }, this);
        $[39] = deal.url;
        $[40] = t12;
        $[41] = t21;
        $[42] = t22;
    } else {
        t22 = $[42];
    }
    let t23;
    if ($[43] !== t22 || $[44] !== t7) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t7,
            children: t22
        }, void 0, false, {
            fileName: "[project]/components/cards/FreeDealCard.tsx",
            lineNumber: 224,
            columnNumber: 11
        }, this);
        $[43] = t22;
        $[44] = t7;
        $[45] = t23;
    } else {
        t23 = $[45];
    }
    return t23;
}
_s(FreeDealCard, "1NZ8fm5hD+6Yq4psWA/xWD6461c=");
_c = FreeDealCard;
var _c;
__turbopack_context__.k.register(_c, "FreeDealCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/cards/SubDealCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SubDealCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SubDealCard(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(36);
    if ($[0] !== "c592abad325216ba87df3d9447aebb047532e3cbfec9e6788c982a1771d5ff8f") {
        for(let $i = 0; $i < 36; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c592abad325216ba87df3d9447aebb047532e3cbfec9e6788c982a1771d5ff8f";
    }
    const { deal, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const [imgSrc, setImgSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(deal.image_url || "/images/default_thumbnail.png");
    let t2;
    let t3;
    if ($[1] !== deal.image_url) {
        t2 = ({
            "SubDealCard[useEffect()]": ()=>{
                setImgSrc(deal.image_url || "/images/default_thumbnail.png");
            }
        })["SubDealCard[useEffect()]"];
        t3 = [
            deal.image_url
        ];
        $[1] = deal.image_url;
        $[2] = t2;
        $[3] = t3;
    } else {
        t2 = $[2];
        t3 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "SubDealCard[handleImageError]": ()=>{
                setImgSrc("/images/gamepass_logo.jpg");
            }
        })["SubDealCard[handleImageError]"];
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    const handleImageError = t4;
    const t5 = `block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`;
    let t6;
    if ($[5] !== deal.title || $[6] !== imgSrc) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: imgSrc,
            alt: deal.title,
            fill: true,
            className: "object-cover group-hover:scale-105 transition-transform duration-300",
            onError: handleImageError,
            unoptimized: true
        }, void 0, false, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 57,
            columnNumber: 10
        }, this);
        $[5] = deal.title;
        $[6] = imgSrc;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    let t7;
    if ($[8] !== deal.xboxMeta?.is_day_one) {
        t7 = deal.xboxMeta?.is_day_one && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm",
            children: "Day 1"
        }, void 0, false, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 66,
            columnNumber: 39
        }, this);
        $[8] = deal.xboxMeta?.is_day_one;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== t6 || $[11] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full aspect-video bg-gray-200 overflow-hidden",
            children: [
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 74,
            columnNumber: 10
        }, this);
        $[10] = t6;
        $[11] = t7;
        $[12] = t8;
    } else {
        t8 = $[12];
    }
    let t9;
    if ($[13] !== deal.title) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-green-600 transition-colors",
            children: deal.title
        }, void 0, false, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 83,
            columnNumber: 10
        }, this);
        $[13] = deal.title;
        $[14] = t9;
    } else {
        t9 = $[14];
    }
    let t10;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "px-2 py-0.5 text-[10px] font-bold text-green-800 bg-green-100 rounded-full",
            children: "GAME PASS"
        }, void 0, false, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 91,
            columnNumber: 11
        }, this);
        $[15] = t10;
    } else {
        t10 = $[15];
    }
    const t11 = deal.platform.includes("Xbox") ? "Xbox" : deal.platform;
    let t12;
    if ($[16] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap gap-1 mb-2",
            children: [
                t10,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "px-2 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-full uppercase",
                    children: t11
                }, void 0, false, {
                    fileName: "[project]/components/cards/SubDealCard.tsx",
                    lineNumber: 99,
                    columnNumber: 59
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 99,
            columnNumber: 11
        }, this);
        $[16] = t11;
        $[17] = t12;
    } else {
        t12 = $[17];
    }
    let t13;
    if ($[18] !== deal.xboxMeta?.game_pass_tier) {
        t13 = deal.xboxMeta?.game_pass_tier.replace(/,/g, " \xB7 ") || "SUBSCRIPTION";
        $[18] = deal.xboxMeta?.game_pass_tier;
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-extrabold text-green-700 uppercase block",
                children: t13
            }, void 0, false, {
                fileName: "[project]/components/cards/SubDealCard.tsx",
                lineNumber: 115,
                columnNumber: 33
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 115,
            columnNumber: 11
        }, this);
        $[20] = t13;
        $[21] = t14;
    } else {
        t14 = $[21];
    }
    let t15;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full text-center bg-green-50 group-hover:bg-green-100 text-green-800 text-xs font-bold py-1.5 rounded transition-colors",
            children: "플레이 하기"
        }, void 0, false, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 123,
            columnNumber: 11
        }, this);
        $[22] = t15;
    } else {
        t15 = $[22];
    }
    let t16;
    if ($[23] !== t12 || $[24] !== t14) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-auto",
            children: [
                t12,
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 130,
            columnNumber: 11
        }, this);
        $[23] = t12;
        $[24] = t14;
        $[25] = t16;
    } else {
        t16 = $[25];
    }
    let t17;
    if ($[26] !== t16 || $[27] !== t9) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3 flex flex-col flex-grow",
            children: [
                t9,
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 139,
            columnNumber: 11
        }, this);
        $[26] = t16;
        $[27] = t9;
        $[28] = t17;
    } else {
        t17 = $[28];
    }
    let t18;
    if ($[29] !== deal.url || $[30] !== t17 || $[31] !== t8) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: deal.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex flex-col h-full",
            children: [
                t8,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 148,
            columnNumber: 11
        }, this);
        $[29] = deal.url;
        $[30] = t17;
        $[31] = t8;
        $[32] = t18;
    } else {
        t18 = $[32];
    }
    let t19;
    if ($[33] !== t18 || $[34] !== t5) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t5,
            children: t18
        }, void 0, false, {
            fileName: "[project]/components/cards/SubDealCard.tsx",
            lineNumber: 158,
            columnNumber: 11
        }, this);
        $[33] = t18;
        $[34] = t5;
        $[35] = t19;
    } else {
        t19 = $[35];
    }
    return t19;
}
_s(SubDealCard, "1NZ8fm5hD+6Yq4psWA/xWD6461c=");
_c = SubDealCard;
var _c;
__turbopack_context__.k.register(_c, "SubDealCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/cards/SaleDealCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SaleDealCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SaleDealCard(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(43);
    if ($[0] !== "1d851bf06a6e93eabb646d61bcae82c2d112daeb48d99f1951001a14669aa87a") {
        for(let $i = 0; $i < 43; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1d851bf06a6e93eabb646d61bcae82c2d112daeb48d99f1951001a14669aa87a";
    }
    const { deal, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const [imgSrc, setImgSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(deal.image_url || "/images/default_thumbnail.png");
    let t2;
    let t3;
    if ($[1] !== deal.image_url) {
        t2 = ({
            "SaleDealCard[useEffect()]": ()=>{
                setImgSrc(deal.image_url || "/images/default_thumbnail.png");
            }
        })["SaleDealCard[useEffect()]"];
        t3 = [
            deal.image_url
        ];
        $[1] = deal.image_url;
        $[2] = t2;
        $[3] = t3;
    } else {
        t2 = $[2];
        t3 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    let t4;
    if ($[4] !== deal.platform) {
        t4 = ({
            "SaleDealCard[handleImageError]": ()=>{
                if (deal.platform.toLowerCase().includes("epic")) {
                    setImgSrc("/images/epic_logo.jpg");
                } else {
                    setImgSrc("/images/default_thumbnail.png");
                }
            }
        })["SaleDealCard[handleImageError]"];
        $[4] = deal.platform;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    const handleImageError = t4;
    const t5 = `block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`;
    const t6 = deal.url;
    let t7;
    if ($[6] !== deal.title || $[7] !== handleImageError || $[8] !== imgSrc) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: imgSrc,
            alt: deal.title,
            fill: true,
            className: "object-cover group-hover:scale-105 transition-transform duration-300",
            onError: handleImageError,
            unoptimized: true
        }, void 0, false, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 63,
            columnNumber: 10
        }, this);
        $[6] = deal.title;
        $[7] = handleImageError;
        $[8] = imgSrc;
        $[9] = t7;
    } else {
        t7 = $[9];
    }
    let t8;
    if ($[10] !== deal.discount_rate) {
        t8 = deal.discount_rate > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm",
            children: [
                "-",
                deal.discount_rate,
                "%"
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 73,
            columnNumber: 36
        }, this);
        $[10] = deal.discount_rate;
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] !== t7 || $[13] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full aspect-video bg-gray-200 overflow-hidden",
            children: [
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 81,
            columnNumber: 10
        }, this);
        $[12] = t7;
        $[13] = t8;
        $[14] = t9;
    } else {
        t9 = $[14];
    }
    let t10;
    if ($[15] !== deal.platform) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between items-start mb-1",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "px-2 py-0.5 text-[9px] font-bold rounded bg-gray-100 text-gray-600",
                children: deal.platform
            }, void 0, false, {
                fileName: "[project]/components/cards/SaleDealCard.tsx",
                lineNumber: 90,
                columnNumber: 66
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 90,
            columnNumber: 11
        }, this);
        $[15] = deal.platform;
        $[16] = t10;
    } else {
        t10 = $[16];
    }
    let t11;
    if ($[17] !== deal.title) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1 h-10 group-hover:text-blue-600 transition-colors",
            children: deal.title
        }, void 0, false, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 98,
            columnNumber: 11
        }, this);
        $[17] = deal.title;
        $[18] = t11;
    } else {
        t11 = $[18];
    }
    let t12;
    if ($[19] !== deal.regular_price || $[20] !== deal.sale_price) {
        t12 = deal.regular_price > deal.sale_price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-[10px] text-gray-400 line-through",
            children: [
                "₩",
                deal.regular_price.toLocaleString()
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 106,
            columnNumber: 51
        }, this);
        $[19] = deal.regular_price;
        $[20] = deal.sale_price;
        $[21] = t12;
    } else {
        t12 = $[21];
    }
    let t13;
    if ($[22] !== deal.sale_price) {
        t13 = deal.sale_price.toLocaleString();
        $[22] = deal.sale_price;
        $[23] = t13;
    } else {
        t13 = $[23];
    }
    let t14;
    if ($[24] !== t13) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-blue-600 font-bold text-sm",
            children: [
                "₩",
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 123,
            columnNumber: 11
        }, this);
        $[24] = t13;
        $[25] = t14;
    } else {
        t14 = $[25];
    }
    let t15;
    if ($[26] !== t12 || $[27] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-start mb-2",
            children: [
                t12,
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 131,
            columnNumber: 11
        }, this);
        $[26] = t12;
        $[27] = t14;
        $[28] = t15;
    } else {
        t15 = $[28];
    }
    let t16;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full text-center bg-gray-100 group-hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded transition-colors",
            children: "스토어 이동"
        }, void 0, false, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 140,
            columnNumber: 11
        }, this);
        $[29] = t16;
    } else {
        t16 = $[29];
    }
    let t17;
    if ($[30] !== t15) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-auto",
            children: [
                t15,
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 147,
            columnNumber: 11
        }, this);
        $[30] = t15;
        $[31] = t17;
    } else {
        t17 = $[31];
    }
    let t18;
    if ($[32] !== t10 || $[33] !== t11 || $[34] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3 flex flex-col flex-grow",
            children: [
                t10,
                t11,
                t17
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 155,
            columnNumber: 11
        }, this);
        $[32] = t10;
        $[33] = t11;
        $[34] = t17;
        $[35] = t18;
    } else {
        t18 = $[35];
    }
    let t19;
    if ($[36] !== deal.url || $[37] !== t18 || $[38] !== t9) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: t6,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex flex-col h-full",
            children: [
                t9,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 165,
            columnNumber: 11
        }, this);
        $[36] = deal.url;
        $[37] = t18;
        $[38] = t9;
        $[39] = t19;
    } else {
        t19 = $[39];
    }
    let t20;
    if ($[40] !== t19 || $[41] !== t5) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t5,
            children: t19
        }, void 0, false, {
            fileName: "[project]/components/cards/SaleDealCard.tsx",
            lineNumber: 175,
            columnNumber: 11
        }, this);
        $[40] = t19;
        $[41] = t5;
        $[42] = t20;
    } else {
        t20 = $[42];
    }
    return t20;
}
_s(SaleDealCard, "1NZ8fm5hD+6Yq4psWA/xWD6461c=");
_c = SaleDealCard;
var _c;
__turbopack_context__.k.register(_c, "SaleDealCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/DealCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DealCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$FreeDealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cards/FreeDealCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$SubDealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cards/SubDealCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$SaleDealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cards/SaleDealCard.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function DealCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "b24c461ed8f14f0ab9c8034b0dabd4f2cbb9c96e447568c0f812518ec568f991") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "b24c461ed8f14f0ab9c8034b0dabd4f2cbb9c96e447568c0f812518ec568f991";
    }
    const { deal, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    const isFreeGame = deal.deal_type === "Free" || deal.sale_price === 0 && deal.deal_type !== "GamePass" || deal.epicMeta?.is_free_to_keep === true;
    if (isFreeGame) {
        let t2;
        if ($[1] !== className || $[2] !== deal) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$FreeDealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                deal: deal,
                className: className
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 29,
                columnNumber: 12
            }, this);
            $[1] = className;
            $[2] = deal;
            $[3] = t2;
        } else {
            t2 = $[3];
        }
        return t2;
    }
    const isGamePass = deal.deal_type === "GamePass" || deal.platform.includes("Xbox") || deal.xboxMeta !== undefined;
    if (isGamePass) {
        let t2;
        if ($[4] !== className || $[5] !== deal) {
            t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$SubDealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                deal: deal,
                className: className
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 42,
                columnNumber: 12
            }, this);
            $[4] = className;
            $[5] = deal;
            $[6] = t2;
        } else {
            t2 = $[6];
        }
        return t2;
    }
    let t2;
    if ($[7] !== className || $[8] !== deal) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cards$2f$SaleDealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            deal: deal,
            className: className
        }, void 0, false, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 53,
            columnNumber: 10
        }, this);
        $[7] = className;
        $[8] = deal;
        $[9] = t2;
    } else {
        t2 = $[9];
    }
    return t2;
}
_c = DealCard;
var _c;
__turbopack_context__.k.register(_c, "DealCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DealCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// --- 섹션 컴포넌트 ---
const SectionRow = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "666dfbec439f49e21442fa8508ec7eef94d70983690f6553d5ed49c17e942799") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "666dfbec439f49e21442fa8508ec7eef94d70983690f6553d5ed49c17e942799";
    }
    const { title, desc, deals } = t0;
    const scrollContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = (direction)=>{
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollBy({
                    left: direction === "left" ? -600 : 600,
                    behavior: "smooth"
                });
            }
        };
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const scroll = t1;
    if (deals.length === 0) {
        return null;
    }
    let t2;
    if ($[2] !== title) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-3xl font-extrabold text-gray-900",
            children: title
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 43,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = title;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== desc) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-gray-500 mt-1",
            children: desc
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 51,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[4] = desc;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== t2 || $[7] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 59,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = t2;
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "hidden md:flex gap-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>scroll("left"),
                    className: "p-1.5 rounded-full border hover:bg-gray-100 text-gray-500",
                    children: "←"
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 68,
                    columnNumber: 48
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>scroll("right"),
                    className: "p-1.5 rounded-full border hover:bg-gray-100 text-gray-500",
                    children: "→"
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 68,
                    columnNumber: 167
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 68,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== t4) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-6 border-b border-gray-200 pb-4 flex justify-between items-end",
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 75,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[10] = t4;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = {
            scrollbarWidth: "none",
            msOverflowStyle: "none"
        };
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== deals) {
        t8 = deals.map(_temp);
        $[13] = deals;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: scrollContainerRef,
            className: "flex gap-4 overflow-x-auto pb-4 px-4 md:px-0 snap-x scrollbar-hide",
            style: t7,
            children: t8
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 101,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[15] = t8;
        $[16] = t9;
    } else {
        t9 = $[16];
    }
    let t10;
    if ($[17] !== t6 || $[18] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "mb-16 pt-20 -mt-20",
            children: [
                t6,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 109,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[17] = t6;
        $[18] = t9;
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    return t10;
};
_s(SectionRow, "Gfm/oEKPzfcG/oikjUDPHSjaGoQ=");
_c = SectionRow;
function Home() {
    _s1();
    const [freeDeals, setFreeDeals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [subDeals, setSubDeals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [saleDeals, setSaleDeals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const loadAllData = {
                "Home.useEffect.loadAllData": async ()=>{
                    setLoading(true);
                    try {
                        // API에서 카테고리별로 데이터를 병렬 요청
                        const [freeData, subData, saleData] = await Promise.all([
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchDeals"])({
                                type: "free",
                                limit: 10
                            }),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchDeals"])({
                                type: "sub",
                                limit: 10
                            }),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchDeals"])({
                                type: "sale",
                                limit: 10
                            })
                        ]);
                        setFreeDeals(freeData);
                        setSubDeals(subData);
                        setSaleDeals(saleData);
                    } catch (error) {
                        console.error("데이터 로드 실패:", error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["Home.useEffect.loadAllData"];
            loadAllData();
        }
    }["Home.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "max-w-7xl mx-auto px-4 md:px-8 py-8",
            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center py-32",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 154,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 153,
                columnNumber: 20
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionRow, {
                        title: "🎁 무료 배포 게임",
                        desc: "Epic Games, Steam, Ubisoft 등 지금 바로 라이브러리에 추가하세요.",
                        deals: freeDeals
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 156,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionRow, {
                        title: "🔥 할인 중인 게임",
                        desc: "놓치면 후회할 역대급 할인 정보를 모았습니다.",
                        deals: saleDeals
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 157,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionRow, {
                        title: "🎮 구독 서비스 카탈로그",
                        desc: "Xbox Game Pass 등 구독형 게임 리스트입니다.",
                        deals: subDeals
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 158,
                        columnNumber: 13
                    }, this),
                    freeDeals.length === 0 && subDeals.length === 0 && saleDeals.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-32",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 text-lg",
                            children: "현재 표시할 게임 정보가 없습니다."
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 161,
                            columnNumber: 19
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 160,
                        columnNumber: 91
                    }, this)
                ]
            }, void 0, true)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 152,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 151,
        columnNumber: 10
    }, this);
}
_s1(Home, "NZJEUHs+BcN/hVi82kevs4IMKtM=");
_c1 = Home;
function _temp(deal) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-none w-72 snap-start h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            deal: deal,
            className: "h-full"
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 170,
            columnNumber: 74
        }, this)
    }, deal.id, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 170,
        columnNumber: 10
    }, this);
}
var _c, _c1;
__turbopack_context__.k.register(_c, "SectionRow");
__turbopack_context__.k.register(_c1, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_3efa8476._.js.map