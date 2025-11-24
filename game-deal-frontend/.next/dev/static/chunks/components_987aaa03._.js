(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/DealCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/DealCard.tsx
__turbopack_context__.s([
    "default",
    ()=>DealCard
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
function DealCard(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(114);
    if ($[0] !== "ca4b1d110666eb844ba785693b50bd1367640b3db651157bd2ab41261ba6f46d") {
        for(let $i = 0; $i < 114; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "ca4b1d110666eb844ba785693b50bd1367640b3db651157bd2ab41261ba6f46d";
    }
    const { deal, className: t1 } = t0;
    const className = t1 === undefined ? "" : t1;
    let t2;
    if ($[1] !== deal.deal_type || $[2] !== deal.platform || $[3] !== deal.xboxMeta) {
        t2 = deal.deal_type === "GamePass" || deal.platform.includes("Xbox") || deal.xboxMeta !== undefined;
        $[1] = deal.deal_type;
        $[2] = deal.platform;
        $[3] = deal.xboxMeta;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const isGamePass = t2;
    const isFree = !isGamePass && (deal.deal_type === "Free" || deal.sale_price === 0 || deal.epicMeta?.is_free_to_keep === true);
    const [imgSrc, setImgSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(deal.image_url || "/images/default_thumbnail.png");
    let t3;
    let t4;
    if ($[5] !== deal.image_url) {
        t3 = ({
            "DealCard[useEffect()]": ()=>{
                setImgSrc(deal.image_url || "/images/default_thumbnail.png");
            }
        })["DealCard[useEffect()]"];
        t4 = [
            deal.image_url
        ];
        $[5] = deal.image_url;
        $[6] = t3;
        $[7] = t4;
    } else {
        t3 = $[6];
        t4 = $[7];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    if ($[8] !== deal.platform || $[9] !== isGamePass) {
        t5 = ({
            "DealCard[handleImageError]": ()=>{
                if (deal.platform.toLowerCase().includes("epic")) {
                    setImgSrc("/images/epic_logo.jpg");
                } else {
                    if (isGamePass || deal.platform.toLowerCase().includes("xbox")) {
                        setImgSrc("/images/gamepass_logo.jpg");
                    } else {
                        setImgSrc("/images/default_thumbnail.png");
                    }
                }
            }
        })["DealCard[handleImageError]"];
        $[8] = deal.platform;
        $[9] = isGamePass;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    const handleImageError = t5;
    let t6;
    if ($[11] !== deal.end_date || $[12] !== deal.platform) {
        t6 = ({
            "DealCard[getFormattedEndDate]": ()=>{
                if (!deal.end_date) {
                    return null;
                }
                let endDate = new Date(deal.end_date);
                if (deal.platform.toLowerCase().includes("ubisoft")) {
                    endDate = new Date(endDate.getTime() + 32400000);
                }
                return endDate.toLocaleString("ko-KR", {
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                });
            }
        })["DealCard[getFormattedEndDate]"];
        $[11] = deal.end_date;
        $[12] = deal.platform;
        $[13] = t6;
    } else {
        t6 = $[13];
    }
    const getFormattedEndDate = t6;
    if (isFree) {
        const t7 = `block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`;
        let t8;
        if ($[14] !== deal.title || $[15] !== handleImageError || $[16] !== imgSrc) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: imgSrc,
                alt: deal.title,
                fill: true,
                className: "object-cover group-hover:scale-105 transition-transform duration-300",
                onError: handleImageError,
                unoptimized: true
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 108,
                columnNumber: 12
            }, this);
            $[14] = deal.title;
            $[15] = handleImageError;
            $[16] = imgSrc;
            $[17] = t8;
        } else {
            t8 = $[17];
        }
        let t9;
        if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10",
                children: "Free Keep"
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 118,
                columnNumber: 12
            }, this);
            $[18] = t9;
        } else {
            t9 = $[18];
        }
        let t10;
        if ($[19] !== t8) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full aspect-video bg-gray-200 overflow-hidden",
                children: [
                    t8,
                    t9
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 125,
                columnNumber: 13
            }, this);
            $[19] = t8;
            $[20] = t10;
        } else {
            t10 = $[20];
        }
        let t11;
        if ($[21] !== deal.title) {
            t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors",
                children: deal.title
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 133,
                columnNumber: 13
            }, this);
            $[21] = deal.title;
            $[22] = t11;
        } else {
            t11 = $[22];
        }
        let t12;
        if ($[23] !== deal.end_date || $[24] !== getFormattedEndDate) {
            t12 = deal.end_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end mb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[11px] text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded",
                    children: [
                        "~ ",
                        getFormattedEndDate(),
                        " 종료"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DealCard.tsx",
                    lineNumber: 141,
                    columnNumber: 69
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 141,
                columnNumber: 30
            }, this);
            $[23] = deal.end_date;
            $[24] = getFormattedEndDate;
            $[25] = t12;
        } else {
            t12 = $[25];
        }
        let t13;
        if ($[26] !== deal.regular_price) {
            t13 = deal.regular_price > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-gray-400 line-through",
                children: [
                    "₩",
                    deal.regular_price.toLocaleString()
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 150,
                columnNumber: 39
            }, this);
            $[26] = deal.regular_price;
            $[27] = t13;
        } else {
            t13 = $[27];
        }
        let t14;
        if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-blue-600 font-bold text-xl",
                children: "무료"
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 158,
                columnNumber: 13
            }, this);
            $[28] = t14;
        } else {
            t14 = $[28];
        }
        let t15;
        if ($[29] !== t13) {
            t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-start mb-3",
                children: [
                    t13,
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 165,
                columnNumber: 13
            }, this);
            $[29] = t13;
            $[30] = t15;
        } else {
            t15 = $[30];
        }
        let t16;
        if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full text-center bg-gray-100 group-hover:bg-gray-200 text-gray-800 text-xs font-bold py-2 rounded transition-colors",
                children: "스토어 이동"
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 173,
                columnNumber: 13
            }, this);
            $[31] = t16;
        } else {
            t16 = $[31];
        }
        let t17;
        if ($[32] !== t15) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto",
                children: [
                    t15,
                    t16
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 180,
                columnNumber: 13
            }, this);
            $[32] = t15;
            $[33] = t17;
        } else {
            t17 = $[33];
        }
        let t18;
        if ($[34] !== t11 || $[35] !== t12 || $[36] !== t17) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 flex flex-col flex-grow",
                children: [
                    t11,
                    t12,
                    t17
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 188,
                columnNumber: 13
            }, this);
            $[34] = t11;
            $[35] = t12;
            $[36] = t17;
            $[37] = t18;
        } else {
            t18 = $[37];
        }
        let t19;
        if ($[38] !== deal.url || $[39] !== t10 || $[40] !== t18) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: deal.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex flex-col h-full",
                children: [
                    t10,
                    t18
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 198,
                columnNumber: 13
            }, this);
            $[38] = deal.url;
            $[39] = t10;
            $[40] = t18;
            $[41] = t19;
        } else {
            t19 = $[41];
        }
        let t20;
        if ($[42] !== t19 || $[43] !== t7) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: t7,
                children: t19
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 208,
                columnNumber: 13
            }, this);
            $[42] = t19;
            $[43] = t7;
            $[44] = t20;
        } else {
            t20 = $[44];
        }
        return t20;
    }
    if (isGamePass) {
        const t7 = `block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`;
        let t8;
        if ($[45] !== deal.title || $[46] !== handleImageError || $[47] !== imgSrc) {
            t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: imgSrc,
                alt: deal.title,
                fill: true,
                className: "object-cover group-hover:scale-105 transition-transform duration-300",
                onError: handleImageError,
                unoptimized: true
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 221,
                columnNumber: 12
            }, this);
            $[45] = deal.title;
            $[46] = handleImageError;
            $[47] = imgSrc;
            $[48] = t8;
        } else {
            t8 = $[48];
        }
        let t9;
        if ($[49] !== deal.xboxMeta?.is_day_one) {
            t9 = deal.xboxMeta?.is_day_one && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm",
                children: "Day 1"
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 231,
                columnNumber: 41
            }, this);
            $[49] = deal.xboxMeta?.is_day_one;
            $[50] = t9;
        } else {
            t9 = $[50];
        }
        let t10;
        if ($[51] !== t8 || $[52] !== t9) {
            t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full aspect-video bg-gray-200 overflow-hidden",
                children: [
                    t8,
                    t9
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 239,
                columnNumber: 13
            }, this);
            $[51] = t8;
            $[52] = t9;
            $[53] = t10;
        } else {
            t10 = $[53];
        }
        let t11;
        if ($[54] !== deal.title) {
            t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-green-600 transition-colors",
                children: deal.title
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 248,
                columnNumber: 13
            }, this);
            $[54] = deal.title;
            $[55] = t11;
        } else {
            t11 = $[55];
        }
        let t12;
        if ($[56] === Symbol.for("react.memo_cache_sentinel")) {
            t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "px-2 py-0.5 text-[10px] font-bold text-green-800 bg-green-100 rounded-full",
                children: "GAME PASS"
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 256,
                columnNumber: 13
            }, this);
            $[56] = t12;
        } else {
            t12 = $[56];
        }
        const t13 = deal.platform.includes("Xbox") ? "Xbox" : deal.platform;
        let t14;
        if ($[57] !== t13) {
            t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1 mb-2",
                children: [
                    t12,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-2 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-full uppercase",
                        children: t13
                    }, void 0, false, {
                        fileName: "[project]/components/DealCard.tsx",
                        lineNumber: 264,
                        columnNumber: 61
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 264,
                columnNumber: 13
            }, this);
            $[57] = t13;
            $[58] = t14;
        } else {
            t14 = $[58];
        }
        let t15;
        if ($[59] !== deal.xboxMeta?.game_pass_tier) {
            t15 = deal.xboxMeta?.game_pass_tier.replace(/,/g, " \xB7 ") || "SUBSCRIPTION";
            $[59] = deal.xboxMeta?.game_pass_tier;
            $[60] = t15;
        } else {
            t15 = $[60];
        }
        let t16;
        if ($[61] !== t15) {
            t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs font-extrabold text-green-700 uppercase block",
                    children: t15
                }, void 0, false, {
                    fileName: "[project]/components/DealCard.tsx",
                    lineNumber: 280,
                    columnNumber: 35
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 280,
                columnNumber: 13
            }, this);
            $[61] = t15;
            $[62] = t16;
        } else {
            t16 = $[62];
        }
        let t17;
        if ($[63] === Symbol.for("react.memo_cache_sentinel")) {
            t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full text-center bg-green-50 group-hover:bg-green-100 text-green-800 text-xs font-bold py-1.5 rounded transition-colors",
                children: "플레이 하기"
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 288,
                columnNumber: 13
            }, this);
            $[63] = t17;
        } else {
            t17 = $[63];
        }
        let t18;
        if ($[64] !== t14 || $[65] !== t16) {
            t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto",
                children: [
                    t14,
                    t16,
                    t17
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 295,
                columnNumber: 13
            }, this);
            $[64] = t14;
            $[65] = t16;
            $[66] = t18;
        } else {
            t18 = $[66];
        }
        let t19;
        if ($[67] !== t11 || $[68] !== t18) {
            t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 flex flex-col flex-grow",
                children: [
                    t11,
                    t18
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 304,
                columnNumber: 13
            }, this);
            $[67] = t11;
            $[68] = t18;
            $[69] = t19;
        } else {
            t19 = $[69];
        }
        let t20;
        if ($[70] !== deal.url || $[71] !== t10 || $[72] !== t19) {
            t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: deal.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex flex-col h-full",
                children: [
                    t10,
                    t19
                ]
            }, void 0, true, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 313,
                columnNumber: 13
            }, this);
            $[70] = deal.url;
            $[71] = t10;
            $[72] = t19;
            $[73] = t20;
        } else {
            t20 = $[73];
        }
        let t21;
        if ($[74] !== t20 || $[75] !== t7) {
            t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: t7,
                children: t20
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 323,
                columnNumber: 13
            }, this);
            $[74] = t20;
            $[75] = t7;
            $[76] = t21;
        } else {
            t21 = $[76];
        }
        return t21;
    }
    const t7 = `block group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`;
    const t8 = deal.url;
    let t9;
    if ($[77] !== deal.title || $[78] !== handleImageError || $[79] !== imgSrc) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            src: imgSrc,
            alt: deal.title,
            fill: true,
            className: "object-cover group-hover:scale-105 transition-transform duration-300",
            onError: handleImageError,
            unoptimized: true
        }, void 0, false, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 336,
            columnNumber: 10
        }, this);
        $[77] = deal.title;
        $[78] = handleImageError;
        $[79] = imgSrc;
        $[80] = t9;
    } else {
        t9 = $[80];
    }
    let t10;
    if ($[81] !== deal.discount_rate) {
        t10 = deal.discount_rate > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm",
            children: [
                "-",
                deal.discount_rate,
                "%"
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 346,
            columnNumber: 37
        }, this);
        $[81] = deal.discount_rate;
        $[82] = t10;
    } else {
        t10 = $[82];
    }
    let t11;
    if ($[83] !== t10 || $[84] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full aspect-video bg-gray-200 overflow-hidden",
            children: [
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 354,
            columnNumber: 11
        }, this);
        $[83] = t10;
        $[84] = t9;
        $[85] = t11;
    } else {
        t11 = $[85];
    }
    let t12;
    if ($[86] !== deal.platform) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between items-start mb-1",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "px-2 py-0.5 text-[9px] font-bold rounded bg-gray-100 text-gray-600",
                children: deal.platform
            }, void 0, false, {
                fileName: "[project]/components/DealCard.tsx",
                lineNumber: 363,
                columnNumber: 66
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 363,
            columnNumber: 11
        }, this);
        $[86] = deal.platform;
        $[87] = t12;
    } else {
        t12 = $[87];
    }
    let t13;
    if ($[88] !== deal.title) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1 h-10 group-hover:text-blue-600 transition-colors",
            children: deal.title
        }, void 0, false, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 371,
            columnNumber: 11
        }, this);
        $[88] = deal.title;
        $[89] = t13;
    } else {
        t13 = $[89];
    }
    let t14;
    if ($[90] !== deal.regular_price || $[91] !== deal.sale_price) {
        t14 = deal.regular_price > deal.sale_price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-[10px] text-gray-400 line-through",
            children: [
                "₩",
                deal.regular_price.toLocaleString()
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 379,
            columnNumber: 51
        }, this);
        $[90] = deal.regular_price;
        $[91] = deal.sale_price;
        $[92] = t14;
    } else {
        t14 = $[92];
    }
    let t15;
    if ($[93] !== deal.sale_price) {
        t15 = deal.sale_price.toLocaleString();
        $[93] = deal.sale_price;
        $[94] = t15;
    } else {
        t15 = $[94];
    }
    let t16;
    if ($[95] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-blue-600 font-bold text-sm",
            children: [
                "₩",
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 396,
            columnNumber: 11
        }, this);
        $[95] = t15;
        $[96] = t16;
    } else {
        t16 = $[96];
    }
    let t17;
    if ($[97] !== t14 || $[98] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-start mb-2",
            children: [
                t14,
                t16
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 404,
            columnNumber: 11
        }, this);
        $[97] = t14;
        $[98] = t16;
        $[99] = t17;
    } else {
        t17 = $[99];
    }
    let t18;
    if ($[100] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full text-center bg-gray-100 group-hover:bg-gray-200 text-gray-800 text-xs font-bold py-1.5 rounded transition-colors",
            children: "스토어 이동"
        }, void 0, false, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 413,
            columnNumber: 11
        }, this);
        $[100] = t18;
    } else {
        t18 = $[100];
    }
    let t19;
    if ($[101] !== t17) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-auto",
            children: [
                t17,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 420,
            columnNumber: 11
        }, this);
        $[101] = t17;
        $[102] = t19;
    } else {
        t19 = $[102];
    }
    let t20;
    if ($[103] !== t12 || $[104] !== t13 || $[105] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3 flex flex-col flex-grow",
            children: [
                t12,
                t13,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 428,
            columnNumber: 11
        }, this);
        $[103] = t12;
        $[104] = t13;
        $[105] = t19;
        $[106] = t20;
    } else {
        t20 = $[106];
    }
    let t21;
    if ($[107] !== deal.url || $[108] !== t11 || $[109] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: t8,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex flex-col h-full",
            children: [
                t11,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 438,
            columnNumber: 11
        }, this);
        $[107] = deal.url;
        $[108] = t11;
        $[109] = t20;
        $[110] = t21;
    } else {
        t21 = $[110];
    }
    let t22;
    if ($[111] !== t21 || $[112] !== t7) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t7,
            children: t21
        }, void 0, false, {
            fileName: "[project]/components/DealCard.tsx",
            lineNumber: 448,
            columnNumber: 11
        }, this);
        $[111] = t21;
        $[112] = t7;
        $[113] = t22;
    } else {
        t22 = $[113];
    }
    return t22;
}
_s(DealCard, "1NZ8fm5hD+6Yq4psWA/xWD6461c=");
_c = DealCard;
var _c;
__turbopack_context__.k.register(_c, "DealCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/DealsPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DealsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DealCard.tsx [app-client] (ecmascript)"); // Import unified component
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
                        let targetDeals = [];
                        if (category === "free") {
                            targetDeals = allDeals.filter({
                                "DealsPage.useEffect.fetchData": (d)=>d.deal_type !== "GamePass" && (d.sale_price === 0 || d.epicMeta?.is_free_to_keep)
                            }["DealsPage.useEffect.fetchData"]);
                        } else if (category === "sale") {
                            targetDeals = allDeals.filter({
                                "DealsPage.useEffect.fetchData": (d_0)=>d_0.deal_type !== "GamePass" && d_0.regular_price > d_0.sale_price && d_0.sale_price > 0
                            }["DealsPage.useEffect.fetchData"]);
                        } else if (category === "sub") {
                            targetDeals = allDeals.filter({
                                "DealsPage.useEffect.fetchData": (d_1)=>d_1.deal_type === "GamePass" || d_1.platform.includes("Xbox")
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
    // --- 3. 검색 및 정렬 ---
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "max-w-7xl mx-auto px-4 md:px-8 py-8",
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
                                    lineNumber: 103,
                                    columnNumber: 13
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
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this),
                                        "개의 게임을 찾았습니다."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DealsPage.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DealsPage.tsx",
                            lineNumber: 102,
                            columnNumber: 11
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
                                    lineNumber: 116,
                                    columnNumber: 13
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
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/DealsPage.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DealsPage.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DealsPage.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center py-32",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
                    }, void 0, false, {
                        fileName: "[project]/components/DealsPage.tsx",
                        lineNumber: 125,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/DealsPage.tsx",
                    lineNumber: 124,
                    columnNumber: 20
                }, this) : filteredDeals.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500",
                        children: "조건에 맞는 게임이 없습니다."
                    }, void 0, false, {
                        fileName: "[project]/components/DealsPage.tsx",
                        lineNumber: 127,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/DealsPage.tsx",
                    lineNumber: 126,
                    columnNumber: 49
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8",
                    children: filteredDeals.map((deal_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DealCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                deal: deal_0
                            }, void 0, false, {
                                fileName: "[project]/components/DealsPage.tsx",
                                lineNumber: 131,
                                columnNumber: 17
                            }, this)
                        }, deal_0.id, false, {
                            fileName: "[project]/components/DealsPage.tsx",
                            lineNumber: 129,
                            columnNumber: 42
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/DealsPage.tsx",
                    lineNumber: 128,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/DealsPage.tsx",
            lineNumber: 99,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/DealsPage.tsx",
        lineNumber: 98,
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

//# sourceMappingURL=components_987aaa03._.js.map