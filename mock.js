// ============================================
// Mock Data - 所有模拟数据集中管理
// ============================================

// --- TOTAL_CULTIVATION_USERS + focusSubTagsData ---
const TOTAL_CULTIVATION_USERS = 15248;

const focusSubTagsData = {
    '价格与优惠': [
        { name: '店内活动', rate: 42 },
        { name: '补贴价格', rate: 38 },
        { name: '贷款内容', rate: 35 },
        { name: '车辆价格', rate: 32 },
        { name: '店内优惠', rate: 30 },
        { name: '全款优惠', rate: 28 },
        { name: '贷款服务', rate: 25 },
        { name: '活动期限', rate: 22 },
        { name: '活动参与方式', rate: 20 },
        { name: '金融因子', rate: 18 }
    ],
    '产品与配置': [
        { name: '智能化配置', rate: 58 },
        { name: '辅助驾驶', rate: 52 },
        { name: '舒适性', rate: 48 },
        { name: '动力系统', rate: 45 },
        { name: '新能源车型', rate: 42 },
        { name: '安全性', rate: 38 },
        { name: '品牌认知', rate: 35 },
        { name: '能耗表现', rate: 30 },
        { name: '环保表现', rate: 25 },
        { name: '车辆养护', rate: 20 }
    ],
    '服务与售后': [
        { name: '售后服务', rate: 45 },
        { name: '保养服务', rate: 40 },
        { name: '保险业务', rate: 35 },
        { name: '上牌政策', rate: 32 },
        { name: '置换服务', rate: 28 },
        { name: '评估内容', rate: 25 }
    ],
    '竞品对比': [
        { name: '对比竞品详情', rate: 48 },
        { name: '配置差异化', rate: 42 },
        { name: '价格力对比', rate: 38 },
        { name: '性能横测', rate: 30 }
    ]
};

// --- qualityFullData ---
const qualityFullData = [
    { rank: 1, type: '无法建联', reason: '无人接听', count: 1245, percent: '10.1%', trend: 'up', trendVal: '1.2%' },
    { rank: 2, type: '无法建联', reason: '无法接通', count: 952, percent: '7.7%', trend: 'down', trendVal: '0.5%' },
    { rank: 3, type: '无法建联', reason: '接通后挂断', count: 880, percent: '7.1%', trend: 'up', trendVal: '2.4%' },
    { rank: 4, type: '有效号码', reason: '确认有购车意向', count: 720, percent: '5.8%', trend: 'none', trendVal: '0%' },
    { rank: 5, type: '无效号码', reason: '空号', count: 680, percent: '5.5%', trend: 'down', trendVal: '1.8%' },
    { rank: 6, type: '无法建联', reason: '忙线（占线）', count: 550, percent: '4.5%', trend: 'up', trendVal: '0.3%' },
    { rank: 7, type: '无法建联', reason: '休眠失联', count: 520, percent: '4.2%', trend: 'down', trendVal: '0.9%' },
    { rank: 8, type: '无法建联', reason: '处于考虑/纠结期', count: 480, percent: '3.9%', trend: 'up', trendVal: '0.1%' },
    { rank: 9, type: '有效号码', reason: '已购车', count: 420, percent: '3.4%', trend: 'none', trendVal: '0%' },
    { rank: 10, type: '无效号码', reason: '黑名单过滤', count: 320, percent: '2.6%', trend: 'up', trendVal: '0.4%' },
    { rank: 11, type: '无效号码', reason: '停机', count: 280, percent: '2.3%', trend: 'down', trendVal: '0.2%' },
    { rank: 12, type: '无效号码', reason: '线路拦截', count: 260, percent: '2.1%', trend: 'none', trendVal: '0%' },
    { rank: 13, type: '无效号码', reason: '秘书台号码', count: 240, percent: '1.9%', trend: 'up', trendVal: '0.1%' },
    { rank: 14, type: '无效号码', reason: '语音信箱号', count: 220, percent: '1.8%', trend: 'down', trendVal: '0.4%' },
    { rank: 15, type: '无效号码', reason: '手机助理号码', count: 210, percent: '1.7%', trend: 'none', trendVal: '0%' },
    { rank: 16, type: '无法建联', reason: '休眠未购', count: 198, percent: '1.6%', trend: 'up', trendVal: '0.2%' },
    { rank: 17, type: '无法建联', reason: '信号差/无有效交互', count: 186, percent: '1.5%', trend: 'down', trendVal: '0.3%' },
    { rank: 18, type: '无法建联', reason: '正在开车/忙碌', count: 174, percent: '1.4%', trend: 'none', trendVal: '0%' },
    { rank: 19, type: '无法建联', reason: '其他琐碎沟通/未触达核心', count: 162, percent: '1.3%', trend: 'up', trendVal: '0.1%' },
    { rank: 20, type: '无法建联', reason: '转秘书台', count: 150, percent: '1.2%', trend: 'down', trendVal: '0.2%' },
    { rank: 21, type: '无法建联', reason: '语音信箱', count: 138, percent: '1.1%', trend: 'none', trendVal: '0%' },
    { rank: 22, type: '无法建联', reason: '手机助理', count: 126, percent: '1.0%', trend: 'up', trendVal: '0.1%' },
    { rank: 23, type: '有效号码', reason: '强烈抗议', count: 114, percent: '0.9%', trend: 'down', trendVal: '0.1%' },
    { rank: 24, type: '有效号码', reason: '购车意愿明确', count: 102, percent: '0.8%', trend: 'none', trendVal: '0%' },
    { rank: 25, type: '有效号码', reason: '购车意愿不明确', count: 96, percent: '0.8%', trend: 'up', trendVal: '0.1%' },
    { rank: 26, type: '有效号码', reason: '意向不明', count: 88, percent: '0.7%', trend: 'down', trendVal: '0.1%' },
    { rank: 27, type: '无法建联', reason: '关机', count: 76, percent: '0.6%', trend: 'none', trendVal: '0%' },
    { rank: 28, type: '无法建联', reason: '不在服务区', count: 64, percent: '0.5%', trend: 'up', trendVal: '0.1%' },
    { rank: 29, type: '无法建联', reason: '拒接', count: 52, percent: '0.4%', trend: 'down', trendVal: '0.1%' },
    { rank: 30, type: '无法建联', reason: '欠费', count: 40, percent: '0.3%', trend: 'none', trendVal: '0%' }
];

// --- resistanceFullData ---
const resistanceFullData = [
    { rank: 1, result: '战败', reason: '价格因素', count: 840, percent: '19.2%', trend: 'up', trendVal: '2.1%' },
    { rank: 2, result: '休眠未购', reason: '资金不足', count: 750, percent: '17.2%', trend: 'down', trendVal: '1.5%' },
    { rank: 3, result: '休眠未购', reason: '半年内不购车', count: 620, percent: '14.2%', trend: 'up', trendVal: '0.8%' },
    { rank: 4, result: '战败', reason: '产品设计和配置', count: 480, percent: '11.0%', trend: 'none', trendVal: '0%' },
    { rank: 5, result: '战败', reason: '品牌偏好', count: 420, percent: '9.6%', trend: 'down', trendVal: '0.2%' },
    { rank: 6, result: '休眠未购', reason: '家人不同意', count: 320, percent: '7.3%', trend: 'up', trendVal: '0.4%' },
    { rank: 7, result: '休眠未购', reason: '关注竞品车型', count: 280, percent: '6.4%', trend: 'down', trendVal: '0.7%' },
    { rank: 8, result: '休眠未购', reason: '征信不通过', count: 210, percent: '4.8%', trend: 'none', trendVal: '0%' },
    { rank: 9, result: '战败', reason: '等待期长', count: 180, percent: '4.1%', trend: 'up', trendVal: '0.2%' },
    { rank: 10, result: '其他', reason: '其他原因', count: 120, percent: '2.7%', trend: 'down', trendVal: '0.1%' },
    { rank: 11, result: '休眠未购', reason: '驾照没考到', count: 80, percent: '1.8%', trend: 'none', trendVal: '0%' },
    { rank: 12, result: '战败', reason: '金融方案不满意', count: 50, percent: '1.1%', trend: 'up', trendVal: '0.1%' }
];

// --- areaDeliveryFullData ---
const areaDeliveryFullData = [
    { rank: 1, area: '上海一区', count: 2180, h: 20, a: 23, b: 24, other: 33 },
    { rank: 2, area: '广州一区', count: 1870, h: 16, a: 21, b: 23, other: 40 },
    { rank: 3, area: '北京一区', count: 1610, h: 14, a: 18, b: 21, other: 47 },
    { rank: 4, area: '成都一区', count: 1260, h: 10, a: 15, b: 20, other: 55 },
    { rank: 5, area: '上海二区', count: 1180, h: 9, a: 14, b: 19, other: 58 },
    { rank: 6, area: '深圳一区', count: 1060, h: 8, a: 13, b: 18, other: 61 },
    { rank: 7, area: '广州二区', count: 960, h: 8, a: 12, b: 17, other: 63 },
    { rank: 8, area: '武汉一区', count: 850, h: 7, a: 11, b: 16, other: 66 },
    { rank: 9, area: '西安一区', count: 740, h: 6, a: 10, b: 15, other: 69 },
    { rank: 10, area: '深圳二区', count: 680, h: 6, a: 9, b: 14, other: 71 },
    { rank: 11, area: '重庆一区', count: 620, h: 5, a: 9, b: 13, other: 73 },
    { rank: 12, area: '南京一区', count: 580, h: 5, a: 8, b: 12, other: 75 },
    { rank: 13, area: '杭州一区', count: 540, h: 4, a: 8, b: 12, other: 76 },
    { rank: 14, area: '苏州一区', count: 500, h: 4, a: 7, b: 11, other: 78 },
    { rank: 15, area: '郑州一区', count: 460, h: 4, a: 7, b: 10, other: 79 }
];

// --- channelOverlapFullData ---
const channelOverlapFullData = {
    channelOverlap5plus: {
        title: '渠道留资重合度分析：5 个以上',
        rows: [
            { rank: 1, media: 'R1 + R2 + R4 + R6 + R8 + R10', unionCount: 2860, overlapCount: 42, overlapRate: '1.5%' },
            { rank: 2, media: 'R1 + R3 + R4 + R7 + R9 + R11', unionCount: 2540, overlapCount: 34, overlapRate: '1.3%' },
            { rank: 3, media: 'R2 + R3 + R5 + R6 + R8', unionCount: 2380, overlapCount: 31, overlapRate: '1.3%' },
            { rank: 4, media: 'R1 + R4 + R5 + R8 + R10', unionCount: 2200, overlapCount: 25, overlapRate: '1.1%' },
            { rank: 5, media: 'R3 + R4 + R6 + R9 + R11', unionCount: 2050, overlapCount: 19, overlapRate: '0.9%' },
            { rank: 6, media: 'R2 + R5 + R7 + R8 + R10 + R11', unionCount: 1960, overlapCount: 16, overlapRate: '0.8%' },
            { rank: 7, media: 'R1 + R3 + R6 + R7 + R10', unionCount: 1820, overlapCount: 14, overlapRate: '0.8%' },
            { rank: 8, media: 'R4 + R5 + R8 + R9 + R10 + R11', unionCount: 1680, overlapCount: 12, overlapRate: '0.7%' },
            { rank: 9, media: 'R1 + R2 + R6 + R7 + R9', unionCount: 1520, overlapCount: 10, overlapRate: '0.7%' },
            { rank: 10, media: 'R3 + R5 + R7 + R8 + R11', unionCount: 1360, overlapCount: 8, overlapRate: '0.6%' }
        ]
    },
    channelOverlap5: {
        title: '渠道留资重合度分析：5个',
        rows: [
            { rank: 1, media: 'R1 + R2 + R4 + R6 + R8', unionCount: 2420, overlapCount: 68, overlapRate: '2.8%' },
            { rank: 2, media: 'R2 + R3 + R5 + R7 + R9', unionCount: 2260, overlapCount: 56, overlapRate: '2.5%' },
            { rank: 3, media: 'R1 + R4 + R6 + R8 + R10', unionCount: 2100, overlapCount: 48, overlapRate: '2.3%' },
            { rank: 4, media: 'R3 + R5 + R6 + R9 + R11', unionCount: 1980, overlapCount: 39, overlapRate: '2.0%' },
            { rank: 5, media: 'R1 + R2 + R7 + R8 + R11', unionCount: 1840, overlapCount: 32, overlapRate: '1.7%' },
            { rank: 6, media: 'R2 + R4 + R5 + R9 + R10', unionCount: 1720, overlapCount: 26, overlapRate: '1.5%' },
            { rank: 7, media: 'R1 + R3 + R6 + R7 + R10', unionCount: 1580, overlapCount: 22, overlapRate: '1.4%' },
            { rank: 8, media: 'R4 + R6 + R8 + R9 + R11', unionCount: 1460, overlapCount: 18, overlapRate: '1.2%' },
            { rank: 9, media: 'R1 + R5 + R7 + R10 + R11', unionCount: 1320, overlapCount: 14, overlapRate: '1.1%' },
            { rank: 10, media: 'R2 + R3 + R8 + R9 + R10', unionCount: 1200, overlapCount: 10, overlapRate: '0.8%' }
        ]
    },
    channelOverlap4: {
        title: '渠道留资重合度分析：4 个',
        rows: [
            { rank: 1, media: 'R1 + R2 + R4 + R6', unionCount: 2180, overlapCount: 126, overlapRate: '5.8%' },
            { rank: 2, media: 'R2 + R3 + R5 + R8', unionCount: 2020, overlapCount: 104, overlapRate: '5.1%' },
            { rank: 3, media: 'R1 + R4 + R7 + R9', unionCount: 1860, overlapCount: 82, overlapRate: '4.4%' },
            { rank: 4, media: 'R3 + R6 + R8 + R10', unionCount: 1720, overlapCount: 66, overlapRate: '3.8%' },
            { rank: 5, media: 'R5 + R7 + R9 + R11', unionCount: 1600, overlapCount: 54, overlapRate: '3.4%' },
            { rank: 6, media: 'R1 + R2 + R3 + R5', unionCount: 1480, overlapCount: 44, overlapRate: '3.0%' },
            { rank: 7, media: 'R4 + R6 + R9 + R10', unionCount: 1360, overlapCount: 36, overlapRate: '2.6%' },
            { rank: 8, media: 'R2 + R7 + R8 + R11', unionCount: 1240, overlapCount: 28, overlapRate: '2.3%' },
            { rank: 9, media: 'R1 + R5 + R6 + R10', unionCount: 1120, overlapCount: 20, overlapRate: '1.8%' },
            { rank: 10, media: 'R3 + R4 + R8 + R9', unionCount: 980, overlapCount: 14, overlapRate: '1.4%' }
        ]
    },
    channelOverlap3: {
        title: '渠道留资重合度分析：3 个',
        rows: [
            { rank: 1, media: 'R1 + R2 + R4', unionCount: 1960, overlapCount: 196, overlapRate: '10.0%' },
            { rank: 2, media: 'R2 + R3 + R6', unionCount: 1780, overlapCount: 154, overlapRate: '8.7%' },
            { rank: 3, media: 'R1 + R5 + R8', unionCount: 1620, overlapCount: 128, overlapRate: '7.9%' },
            { rank: 4, media: 'R4 + R7 + R9', unionCount: 1460, overlapCount: 92, overlapRate: '6.3%' },
            { rank: 5, media: 'R6 + R10 + R11', unionCount: 1320, overlapCount: 70, overlapRate: '5.3%' },
            { rank: 6, media: 'R1 + R3 + R8', unionCount: 1200, overlapCount: 56, overlapRate: '4.7%' },
            { rank: 7, media: 'R2 + R5 + R9', unionCount: 1080, overlapCount: 44, overlapRate: '4.1%' },
            { rank: 8, media: 'R3 + R7 + R10', unionCount: 960, overlapCount: 34, overlapRate: '3.5%' },
            { rank: 9, media: 'R4 + R6 + R11', unionCount: 840, overlapCount: 24, overlapRate: '2.9%' },
            { rank: 10, media: 'R5 + R8 + R9', unionCount: 720, overlapCount: 16, overlapRate: '2.2%' }
        ]
    },
    channelOverlap2: {
        title: '渠道留资重合度分析：2 个',
        rows: [
            { rank: 1, media: 'R4 + R1', unionCount: 1680, overlapCount: 180, overlapRate: '10.7%' },
            { rank: 2, media: 'R2 + R1', unionCount: 1500, overlapCount: 128, overlapRate: '8.5%' },
            { rank: 3, media: 'R1 + R3', unionCount: 1320, overlapCount: 92, overlapRate: '7.0%' },
            { rank: 4, media: 'R6 + R2', unionCount: 1160, overlapCount: 68, overlapRate: '5.9%' },
            { rank: 5, media: 'R3 + R4', unionCount: 1020, overlapCount: 56, overlapRate: '5.5%' },
            { rank: 6, media: 'R1 + R5', unionCount: 920, overlapCount: 42, overlapRate: '4.6%' },
            { rank: 7, media: 'R2 + R3', unionCount: 860, overlapCount: 38, overlapRate: '4.4%' },
            { rank: 8, media: 'R7 + R1', unionCount: 780, overlapCount: 28, overlapRate: '3.6%' },
            { rank: 9, media: 'R8 + R2', unionCount: 640, overlapCount: 18, overlapRate: '2.8%' },
            { rank: 10, media: 'R4 + R9', unionCount: 520, overlapCount: 12, overlapRate: '2.3%' }
        ]
    },
    channelOverlap1: {
        title: '渠道留资重合度分析：仅 1 个',
        rows: [
            { rank: 1, media: 'R1', unionCount: 2460, overlapCount: 2460, overlapRate: '100%' },
            { rank: 2, media: 'R2', unionCount: 2180, overlapCount: 2180, overlapRate: '100%' },
            { rank: 3, media: 'R4', unionCount: 1920, overlapCount: 1920, overlapRate: '100%' },
            { rank: 4, media: 'R3', unionCount: 1680, overlapCount: 1680, overlapRate: '100%' },
            { rank: 5, media: 'R5', unionCount: 1420, overlapCount: 1420, overlapRate: '100%' },
            { rank: 6, media: 'R6', unionCount: 1180, overlapCount: 1180, overlapRate: '100%' },
            { rank: 7, media: 'R7', unionCount: 920, overlapCount: 920, overlapRate: '100%' },
            { rank: 8, media: 'R8', unionCount: 680, overlapCount: 680, overlapRate: '100%' },
            { rank: 9, media: 'R9', unionCount: 460, overlapCount: 460, overlapRate: '100%' },
            { rank: 10, media: 'R10', unionCount: 320, overlapCount: 320, overlapRate: '100%' }
        ]
    }
};

// --- mediaOverlapFullData ---
const mediaOverlapFullData = {
    mediaOverlap5plus: {
        title: '媒体留资重合度分析：5 个以上',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝 + 百度 + 快手 + 小红书 + 头条', unionCount: 3200, overlapCount: 38, overlapRate: '1.2%' },
            { rank: 2, media: '抖音 + 懂车帝 + 快手 + 朋友圈 + B站', unionCount: 2860, overlapCount: 28, overlapRate: '1.0%' },
            { rank: 3, media: '百度 + 快手 + 小红书 + 头条 + 优酷', unionCount: 2540, overlapCount: 22, overlapRate: '0.9%' },
            { rank: 4, media: '抖音 + 小红书 + 朋友圈 + 头条 + 知乎', unionCount: 2380, overlapCount: 16, overlapRate: '0.7%' },
            { rank: 5, media: '懂车帝 + 百度 + 快手 + 优酷 + B站', unionCount: 2200, overlapCount: 12, overlapRate: '0.5%' },
            { rank: 6, media: '抖音 + 懂车帝 + 百度 + 朋友圈 + 头条 + B站', unionCount: 2080, overlapCount: 10, overlapRate: '0.5%' },
            { rank: 7, media: '快手 + 小红书 + 朋友圈 + 优酷 + 知乎', unionCount: 1920, overlapCount: 8, overlapRate: '0.4%' },
            { rank: 8, media: '抖音 + 百度 + 头条 + 优酷 + B站 + 知乎', unionCount: 1780, overlapCount: 6, overlapRate: '0.3%' },
            { rank: 9, media: '懂车帝 + 快手 + 小红书 + 头条 + 朋友圈', unionCount: 1640, overlapCount: 5, overlapRate: '0.3%' },
            { rank: 10, media: '百度 + 朋友圈 + 头条 + 优酷 + 知乎 + B站', unionCount: 1500, overlapCount: 4, overlapRate: '0.3%' }
        ]
    },
    mediaOverlap5: {
        title: '媒体留资重合度分析：5个',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝 + 百度 + 快手 + 小红书', unionCount: 2860, overlapCount: 56, overlapRate: '2.0%' },
            { rank: 2, media: '懂车帝 + 百度 + 快手 + 朋友圈 + 头条', unionCount: 2600, overlapCount: 46, overlapRate: '1.8%' },
            { rank: 3, media: '抖音 + 百度 + 小红书 + 头条 + 优酷', unionCount: 2400, overlapCount: 38, overlapRate: '1.6%' },
            { rank: 4, media: '懂车帝 + 快手 + 小红书 + 朋友圈 + B站', unionCount: 2200, overlapCount: 30, overlapRate: '1.4%' },
            { rank: 5, media: '抖音 + 百度 + 快手 + 优酷 + 知乎', unionCount: 2000, overlapCount: 22, overlapRate: '1.1%' },
            { rank: 6, media: '小红书 + 朋友圈 + 头条 + 优酷 + B站', unionCount: 1860, overlapCount: 18, overlapRate: '1.0%' },
            { rank: 7, media: '抖音 + 懂车帝 + 朋友圈 + 优酷 + 知乎', unionCount: 1720, overlapCount: 14, overlapRate: '0.8%' },
            { rank: 8, media: '百度 + 快手 + 头条 + 优酷 + B站', unionCount: 1580, overlapCount: 10, overlapRate: '0.6%' },
            { rank: 9, media: '懂车帝 + 小红书 + 朋友圈 + 头条 + 知乎', unionCount: 1440, overlapCount: 8, overlapRate: '0.6%' },
            { rank: 10, media: '抖音 + 快手 + 朋友圈 + B站 + 知乎', unionCount: 1300, overlapCount: 6, overlapRate: '0.5%' }
        ]
    },
    mediaOverlap4: {
        title: '媒体留资重合度分析：4 个',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝 + 百度 + 快手', unionCount: 2460, overlapCount: 108, overlapRate: '4.4%' },
            { rank: 2, media: '懂车帝 + 百度 + 快手 + 小红书', unionCount: 2280, overlapCount: 88, overlapRate: '3.9%' },
            { rank: 3, media: '抖音 + 百度 + 小红书 + 头条', unionCount: 2100, overlapCount: 72, overlapRate: '3.4%' },
            { rank: 4, media: '懂车帝 + 快手 + 朋友圈 + 头条', unionCount: 1920, overlapCount: 58, overlapRate: '3.0%' },
            { rank: 5, media: '抖音 + 快手 + 小红书 + 优酷', unionCount: 1780, overlapCount: 44, overlapRate: '2.5%' },
            { rank: 6, media: '百度 + 朋友圈 + 头条 + 优酷', unionCount: 1620, overlapCount: 34, overlapRate: '2.1%' },
            { rank: 7, media: '懂车帝 + 小红书 + B站 + 知乎', unionCount: 1480, overlapCount: 26, overlapRate: '1.8%' },
            { rank: 8, media: '抖音 + 朋友圈 + 优酷 + 知乎', unionCount: 1340, overlapCount: 18, overlapRate: '1.3%' },
            { rank: 9, media: '快手 + 小红书 + 头条 + B站', unionCount: 1200, overlapCount: 12, overlapRate: '1.0%' },
            { rank: 10, media: '百度 + 快手 + 朋友圈 + 知乎', unionCount: 1060, overlapCount: 8, overlapRate: '0.8%' }
        ]
    },
    mediaOverlap3: {
        title: '媒体留资重合度分析：3 个',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝 + 百度', unionCount: 2200, overlapCount: 176, overlapRate: '8.0%' },
            { rank: 2, media: '懂车帝 + 百度 + 快手', unionCount: 1960, overlapCount: 142, overlapRate: '7.2%' },
            { rank: 3, media: '抖音 + 小红书 + 头条', unionCount: 1780, overlapCount: 116, overlapRate: '6.5%' },
            { rank: 4, media: '百度 + 快手 + 朋友圈', unionCount: 1600, overlapCount: 86, overlapRate: '5.4%' },
            { rank: 5, media: '懂车帝 + 优酷 + B站', unionCount: 1420, overlapCount: 64, overlapRate: '4.5%' },
            { rank: 6, media: '抖音 + 快手 + 小红书', unionCount: 1280, overlapCount: 48, overlapRate: '3.8%' },
            { rank: 7, media: '百度 + 朋友圈 + 头条', unionCount: 1140, overlapCount: 38, overlapRate: '3.3%' },
            { rank: 8, media: '小红书 + 优酷 + 知乎', unionCount: 1000, overlapCount: 28, overlapRate: '2.8%' },
            { rank: 9, media: '抖音 + 朋友圈 + B站', unionCount: 880, overlapCount: 18, overlapRate: '2.0%' },
            { rank: 10, media: '快手 + 头条 + 知乎', unionCount: 760, overlapCount: 12, overlapRate: '1.6%' }
        ]
    },
    mediaOverlap2: {
        title: '媒体留资重合度分析：2 个',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝', unionCount: 1880, overlapCount: 168, overlapRate: '8.9%' },
            { rank: 2, media: '懂车帝 + 百度', unionCount: 1640, overlapCount: 120, overlapRate: '7.3%' },
            { rank: 3, media: '抖音 + 百度', unionCount: 1500, overlapCount: 90, overlapRate: '6.0%' },
            { rank: 4, media: '快手 + 抖音', unionCount: 1280, overlapCount: 62, overlapRate: '4.8%' },
            { rank: 5, media: '小红书 + 懂车帝', unionCount: 1100, overlapCount: 46, overlapRate: '4.2%' },
            { rank: 6, media: '百度 + 快手', unionCount: 960, overlapCount: 34, overlapRate: '3.5%' },
            { rank: 7, media: '抖音 + 小红书', unionCount: 840, overlapCount: 26, overlapRate: '3.1%' },
            { rank: 8, media: '朋友圈 + 懂车帝', unionCount: 720, overlapCount: 18, overlapRate: '2.5%' },
            { rank: 9, media: '头条 + 百度', unionCount: 600, overlapCount: 12, overlapRate: '2.0%' },
            { rank: 10, media: '优酷 + 抖音', unionCount: 480, overlapCount: 8, overlapRate: '1.7%' }
        ]
    },
    mediaOverlap1: {
        title: '媒体留资重合度分析：仅 1 个',
        rows: [
            { rank: 1, media: '抖音', unionCount: 3120, overlapCount: 3120, overlapRate: '100%' },
            { rank: 2, media: '懂车帝', unionCount: 2540, overlapCount: 2540, overlapRate: '100%' },
            { rank: 3, media: '百度', unionCount: 1960, overlapCount: 1960, overlapRate: '100%' },
            { rank: 4, media: '快手', unionCount: 1480, overlapCount: 1480, overlapRate: '100%' },
            { rank: 5, media: '小红书', unionCount: 1120, overlapCount: 1120, overlapRate: '100%' },
            { rank: 6, media: '朋友圈', unionCount: 820, overlapCount: 820, overlapRate: '100%' },
            { rank: 7, media: '头条', unionCount: 580, overlapCount: 580, overlapRate: '100%' },
            { rank: 8, media: '优酷', unionCount: 380, overlapCount: 380, overlapRate: '100%' },
            { rank: 9, media: '知乎', unionCount: 240, overlapCount: 240, overlapRate: '100%' },
            { rank: 10, media: 'B站', unionCount: 160, overlapCount: 160, overlapRate: '100%' }
        ]
    }
};

// --- cityStoreData ---
const cityStoreData = {
    '上海': [
        { name: '上海东风南方专营店', region: '华东大区', area: '上海一区', h: 85, a: 142, b: 198, other: 145, total: 570 },
        { name: '上海日产特约店', region: '华东大区', area: '上海一区', h: 72, a: 125, b: 180, other: 128, total: 505 },
        { name: '上海华新专营店', region: '华东大区', area: '上海二区', h: 68, a: 118, b: 165, other: 112, total: 463 },
        { name: '上海松江专营店', region: '华东大区', area: '上海三区', h: 58, a: 102, b: 142, other: 98, total: 400 },
        { name: '上海嘉定专营店', region: '华东大区', area: '上海三区', h: 45, a: 78, b: 105, other: 72, total: 300 },
        { name: '上海宝山专营店', region: '华东大区', area: '上海四区', h: 22, a: 35, b: 42, other: 25, total: 124 }
    ],
    '广州': [
        { name: '广州天河专营店', region: '华南大区', area: '广州一区', h: 78, a: 135, b: 195, other: 132, total: 540 },
        { name: '广州白云专营店', region: '华南大区', area: '广州一区', h: 65, a: 112, b: 158, other: 105, total: 440 },
        { name: '广州番禺专营店', region: '华南大区', area: '广州二区', h: 55, a: 98, b: 135, other: 92, total: 380 },
        { name: '广州东风南方店', region: '华南大区', area: '广州二区', h: 48, a: 85, b: 120, other: 82, total: 335 },
        { name: '广州黄埔专营店', region: '华南大区', area: '广州三区', h: 32, a: 58, b: 82, other: 55, total: 227 },
        { name: '广州花都专营店', region: '华南大区', area: '广州三区', h: 20, a: 35, b: 55, other: 38, total: 148 }
    ],
    '深圳': [
        { name: '深圳南山专营店', region: '华南大区', area: '深圳一区', h: 68, a: 128, b: 175, other: 109, total: 480 },
        { name: '深圳福田专营店', region: '华南大区', area: '深圳一区', h: 58, a: 105, b: 148, other: 94, total: 405 },
        { name: '深圳宝安专营店', region: '华南大区', area: '深圳二区', h: 48, a: 88, b: 125, other: 78, total: 339 },
        { name: '深圳龙岗专营店', region: '华南大区', area: '深圳二区', h: 38, a: 72, b: 102, other: 65, total: 277 },
        { name: '深圳罗湖专营店', region: '华南大区', area: '深圳三区', h: 28, a: 52, b: 72, other: 48, total: 200 },
        { name: '深圳东风南方店', region: '华南大区', area: '深圳三区', h: 15, a: 28, b: 42, other: 32, total: 117 }
    ],
    '北京': [
        { name: '北京朝阳专营店', region: '华北大区', area: '北京一区', h: 62, a: 118, b: 165, other: 105, total: 450 },
        { name: '北京海淀专营店', region: '华北大区', area: '北京一区', h: 52, a: 98, b: 142, other: 88, total: 380 },
        { name: '北京丰台专营店', region: '华北大区', area: '北京二区', h: 42, a: 82, b: 118, other: 72, total: 314 },
        { name: '北京亦庄专营店', region: '华北大区', area: '北京二区', h: 28, a: 58, b: 88, other: 52, total: 226 },
        { name: '北京通州专营店', region: '华北大区', area: '北京三区', h: 14, a: 28, b: 42, other: 32, total: 116 }
    ],
    '杭州': [
        { name: '杭州城西专营店', region: '华东大区', area: '杭州一区', h: 52, a: 95, b: 138, other: 85, total: 370 },
        { name: '杭州城东专营店', region: '华东大区', area: '杭州一区', h: 45, a: 82, b: 120, other: 72, total: 319 },
        { name: '杭州滨江专营店', region: '华东大区', area: '杭州二区', h: 38, a: 68, b: 98, other: 62, total: 266 },
        { name: '杭州萧山专营店', region: '华东大区', area: '杭州二区', h: 28, a: 52, b: 78, other: 48, total: 206 },
        { name: '杭州下沙专营店', region: '华东大区', area: '杭州三区', h: 12, a: 25, b: 42, other: 32, total: 111 }
    ],
    '天津': [
        { name: '天津河西专营店', region: '华北大区', area: '天津一区', h: 45, a: 88, b: 128, other: 82, total: 343 },
        { name: '天津南开专营店', region: '华北大区', area: '天津一区', h: 38, a: 72, b: 105, other: 68, total: 283 },
        { name: '天津河东专营店', region: '华北大区', area: '天津二区', h: 32, a: 62, b: 92, other: 58, total: 244 },
        { name: '天津西青专营店', region: '华北大区', area: '天津二区', h: 22, a: 42, b: 65, other: 42, total: 171 },
        { name: '天津武清专营店', region: '华北大区', area: '天津三区', h: 15, a: 28, b: 45, other: 32, total: 120 }
    ],
    '南京': [
        { name: '南京鼓楼专营店', region: '华东大区', area: '南京一区', h: 42, a: 82, b: 118, other: 78, total: 320 },
        { name: '南京玄武专营店', region: '华东大区', area: '南京一区', h: 35, a: 68, b: 98, other: 62, total: 263 },
        { name: '南京江宁专营店', region: '华东大区', area: '南京二区', h: 28, a: 55, b: 82, other: 52, total: 217 },
        { name: '南京浦口专营店', region: '华东大区', area: '南京二区', h: 20, a: 38, b: 58, other: 38, total: 154 },
        { name: '南京栖霞专营店', region: '华东大区', area: '南京三区', h: 13, a: 25, b: 38, other: 28, total: 104 }
    ],
    '成都': [
        { name: '成都武侯专营店', region: '西部大区', area: '成都一区', h: 38, a: 72, b: 108, other: 72, total: 290 },
        { name: '成都锦江专营店', region: '西部大区', area: '成都一区', h: 32, a: 62, b: 92, other: 58, total: 244 },
        { name: '成都成华专营店', region: '西部大区', area: '成都二区', h: 25, a: 48, b: 72, other: 48, total: 193 },
        { name: '成都金牛专营店', region: '西部大区', area: '成都二区', h: 18, a: 35, b: 52, other: 35, total: 140 },
        { name: '成都高新专营店', region: '西部大区', area: '成都三区', h: 12, a: 22, b: 35, other: 25, total: 94 }
    ],
    '武汉': [
        { name: '武汉武昌专营店', region: '华中大区', area: '武汉一区', h: 35, a: 58, b: 115, other: 65, total: 273 },
        { name: '武汉汉口专营店', region: '华中大区', area: '武汉一区', h: 28, a: 48, b: 88, other: 52, total: 216 },
        { name: '武汉汉阳专营店', region: '华中大区', area: '武汉二区', h: 22, a: 38, b: 68, other: 42, total: 170 },
        { name: '武汉洪山专营店', region: '华中大区', area: '武汉二区', h: 18, a: 32, b: 52, other: 35, total: 137 },
        { name: '武汉青山专营店', region: '华中大区', area: '武汉三区', h: 12, a: 22, b: 38, other: 25, total: 97 }
    ],
    '苏州': [
        { name: '苏州园区专营店', region: '华东大区', area: '苏州一区', h: 32, a: 55, b: 88, other: 52, total: 227 },
        { name: '苏州姑苏专营店', region: '华东大区', area: '苏州一区', h: 28, a: 48, b: 75, other: 45, total: 196 },
        { name: '苏州吴中专营店', region: '华东大区', area: '苏州二区', h: 22, a: 38, b: 58, other: 38, total: 156 },
        { name: '苏州相城专营店', region: '华东大区', area: '苏州二区', h: 18, a: 32, b: 48, other: 32, total: 130 },
        { name: '苏州新区专营店', region: '华东大区', area: '苏州三区', h: 10, a: 18, b: 28, other: 20, total: 76 }
    ],
    '重庆': [
        { name: '重庆渝北专营店', region: '西部大区', area: '重庆一区', h: 32, a: 65, b: 112, other: 68, total: 277 },
        { name: '重庆江北专营店', region: '西部大区', area: '重庆一区', h: 28, a: 55, b: 95, other: 58, total: 236 },
        { name: '重庆沙坪坝专营店', region: '西部大区', area: '重庆二区', h: 22, a: 45, b: 78, other: 48, total: 193 },
        { name: '重庆南岸专营店', region: '西部大区', area: '重庆二区', h: 15, a: 32, b: 55, other: 35, total: 137 },
        { name: '重庆九龙坡专营店', region: '西部大区', area: '重庆三区', h: 8, a: 18, b: 32, other: 22, total: 80 }
    ],
    '西安': [
        { name: '西安雁塔专营店', region: '西部大区', area: '西安一区', h: 28, a: 55, b: 98, other: 58, total: 239 },
        { name: '西安碑林专营店', region: '西部大区', area: '西安一区', h: 24, a: 48, b: 82, other: 48, total: 202 },
        { name: '西安莲湖专营店', region: '西部大区', area: '西安二区', h: 18, a: 38, b: 65, other: 38, total: 159 },
        { name: '西安未央专营店', region: '西部大区', area: '西安二区', h: 15, a: 28, b: 48, other: 32, total: 123 },
        { name: '西安新城专营店', region: '西部大区', area: '西安三区', h: 10, a: 18, b: 32, other: 22, total: 82 }
    ],
    '长沙': [
        { name: '长沙岳麓专营店', region: '华中大区', area: '长沙一区', h: 28, a: 52, b: 95, other: 55, total: 230 },
        { name: '长沙雨花专营店', region: '华中大区', area: '长沙一区', h: 22, a: 42, b: 75, other: 45, total: 184 },
        { name: '长沙天心专营店', region: '华中大区', area: '长沙二区', h: 18, a: 35, b: 58, other: 35, total: 146 },
        { name: '长沙开福专营店', region: '华中大区', area: '长沙二区', h: 12, a: 25, b: 42, other: 28, total: 107 },
        { name: '长沙芙蓉专营店', region: '华中大区', area: '长沙三区', h: 8, a: 15, b: 25, other: 18, total: 66 }
    ]
};

// --- regionChannelData ---
const regionChannelData = {
    'R1': {
        regionName: '华东大区',
        areas: {
            '上海一区': [
                { name: '上海东风南方专营店', h: 85, a: 142, b: 198, c: 80, f: 35, l: 15, e: 10, invalid: 5, total: 570 },
                { name: '上海日产特约店', h: 72, a: 125, b: 180, c: 68, f: 30, l: 12, e: 10, invalid: 8, total: 505 },
                { name: '上海华新专营店', h: 68, a: 118, b: 165, c: 55, f: 28, l: 10, e: 10, invalid: 9, total: 463 }
            ],
            '上海二区': [
                { name: '上海松江专营店', h: 58, a: 102, b: 142, c: 48, f: 22, l: 10, e: 8, invalid: 10, total: 400 },
                { name: '上海嘉定专营店', h: 45, a: 78, b: 105, c: 35, f: 18, l: 8, e: 6, invalid: 5, total: 300 }
            ],
            '上海三区': [
                { name: '上海宝山专营店', h: 22, a: 35, b: 42, c: 12, f: 6, l: 3, e: 2, invalid: 2, total: 124 }
            ],
            '杭州一区': [
                { name: '杭州城西专营店', h: 52, a: 95, b: 138, c: 45, f: 20, l: 8, e: 6, invalid: 6, total: 370 },
                { name: '杭州城东专营店', h: 45, a: 82, b: 120, c: 38, f: 18, l: 7, e: 5, invalid: 4, total: 319 }
            ],
            '杭州二区': [
                { name: '杭州滨江专营店', h: 38, a: 68, b: 98, c: 32, f: 15, l: 6, e: 5, invalid: 4, total: 266 },
                { name: '杭州萧山专营店', h: 28, a: 52, b: 78, c: 25, f: 12, l: 5, e: 3, invalid: 3, total: 206 }
            ],
            '南京一区': [
                { name: '南京鼓楼专营店', h: 42, a: 82, b: 118, c: 40, f: 18, l: 8, e: 6, invalid: 6, total: 320 },
                { name: '南京玄武专营店', h: 35, a: 68, b: 98, c: 32, f: 15, l: 6, e: 5, invalid: 4, total: 263 }
            ],
            '南京二区': [
                { name: '南京江宁专营店', h: 28, a: 55, b: 82, c: 28, f: 12, l: 5, e: 4, invalid: 3, total: 217 },
                { name: '南京浦口专营店', h: 20, a: 38, b: 58, c: 20, f: 9, l: 4, e: 3, invalid: 2, total: 154 }
            ]
        }
    },
    'R2': {
        regionName: '华南大区',
        areas: {
            '广州一区': [
                { name: '广州天河专营店', h: 78, a: 135, b: 195, c: 68, f: 30, l: 12, e: 10, invalid: 12, total: 540 },
                { name: '广州白云专营店', h: 65, a: 112, b: 158, c: 52, f: 25, l: 10, e: 8, invalid: 10, total: 440 }
            ],
            '广州二区': [
                { name: '广州番禺专营店', h: 55, a: 98, b: 135, c: 48, f: 22, l: 9, e: 7, invalid: 6, total: 380 },
                { name: '广州东风南方店', h: 48, a: 85, b: 120, c: 42, f: 20, l: 8, e: 6, invalid: 6, total: 335 }
            ],
            '广州三区': [
                { name: '广州黄埔专营店', h: 32, a: 58, b: 82, c: 28, f: 12, l: 6, e: 5, invalid: 4, total: 227 },
                { name: '广州花都专营店', h: 20, a: 35, b: 55, c: 18, f: 9, l: 4, e: 4, invalid: 3, total: 148 }
            ],
            '深圳一区': [
                { name: '深圳南山专营店', h: 68, a: 128, b: 175, c: 58, f: 25, l: 10, e: 8, invalid: 8, total: 480 },
                { name: '深圳福田专营店', h: 58, a: 105, b: 148, c: 48, f: 22, l: 9, e: 7, invalid: 8, total: 405 }
            ],
            '深圳二区': [
                { name: '深圳宝安专营店', h: 48, a: 88, b: 125, c: 42, f: 18, l: 8, e: 6, invalid: 4, total: 339 },
                { name: '深圳龙岗专营店', h: 38, a: 72, b: 102, c: 35, f: 15, l: 6, e: 5, invalid: 4, total: 277 }
            ],
            '深圳三区': [
                { name: '深圳罗湖专营店', h: 28, a: 52, b: 72, c: 25, f: 11, l: 5, e: 4, invalid: 3, total: 200 },
                { name: '深圳东风南方店', h: 15, a: 28, b: 42, c: 15, f: 8, l: 4, e: 3, invalid: 2, total: 117 }
            ]
        }
    },
    'R3': {
        regionName: '华北大区',
        areas: {
            '北京一区': [
                { name: '北京朝阳专营店', h: 62, a: 118, b: 165, c: 55, f: 25, l: 10, e: 8, invalid: 7, total: 450 },
                { name: '北京海淀专营店', h: 52, a: 98, b: 142, c: 45, f: 20, l: 8, e: 7, invalid: 8, total: 380 }
            ],
            '北京二区': [
                { name: '北京丰台专营店', h: 42, a: 82, b: 118, c: 38, f: 16, l: 7, e: 6, invalid: 5, total: 314 },
                { name: '北京亦庄专营店', h: 28, a: 58, b: 88, c: 28, f: 12, l: 6, e: 5, invalid: 1, total: 226 }
            ],
            '北京三区': [
                { name: '北京通州专营店', h: 14, a: 28, b: 42, c: 16, f: 8, l: 3, e: 3, invalid: 2, total: 116 }
            ],
            '天津一区': [
                { name: '天津河西专营店', h: 45, a: 88, b: 128, c: 42, f: 18, l: 8, e: 7, invalid: 7, total: 343 },
                { name: '天津南开专营店', h: 38, a: 72, b: 105, c: 35, f: 15, l: 7, e: 6, invalid: 5, total: 283 }
            ],
            '天津二区': [
                { name: '天津河东专营店', h: 32, a: 62, b: 92, c: 30, f: 14, l: 6, e: 5, invalid: 3, total: 244 },
                { name: '天津西青专营店', h: 22, a: 42, b: 65, c: 22, f: 10, l: 4, e: 4, invalid: 2, total: 171 }
            ]
        }
    },
    'R4': {
        regionName: '华中大区',
        areas: {
            '武汉一区': [
                { name: '武汉武昌专营店', h: 35, a: 58, b: 115, c: 38, f: 14, l: 6, e: 4, invalid: 3, total: 273 },
                { name: '武汉汉口专营店', h: 28, a: 48, b: 88, c: 28, f: 12, l: 5, e: 4, invalid: 3, total: 216 }
            ],
            '武汉二区': [
                { name: '武汉汉阳专营店', h: 22, a: 38, b: 68, c: 22, f: 10, l: 4, e: 4, invalid: 2, total: 170 },
                { name: '武汉洪山专营店', h: 18, a: 32, b: 52, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 137 }
            ],
            '武汉三区': [
                { name: '武汉青山专营店', h: 12, a: 22, b: 38, c: 12, f: 6, l: 3, e: 2, invalid: 2, total: 97 }
            ],
            '长沙一区': [
                { name: '长沙岳麓专营店', h: 28, a: 52, b: 95, c: 30, f: 12, l: 5, e: 4, invalid: 4, total: 230 },
                { name: '长沙雨花专营店', h: 22, a: 42, b: 75, c: 24, f: 10, l: 4, e: 4, invalid: 3, total: 184 }
            ],
            '长沙二区': [
                { name: '长沙天心专营店', h: 18, a: 35, b: 58, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 146 },
                { name: '长沙开福专营店', h: 12, a: 25, b: 42, c: 14, f: 6, l: 3, e: 3, invalid: 2, total: 107 }
            ]
        }
    },
    'R5': {
        regionName: '西部大区',
        areas: {
            '成都一区': [
                { name: '成都武侯专营店', h: 38, a: 72, b: 108, c: 38, f: 16, l: 6, e: 6, invalid: 6, total: 290 },
                { name: '成都锦江专营店', h: 32, a: 62, b: 92, c: 32, f: 14, l: 5, e: 5, invalid: 2, total: 244 }
            ],
            '成都二区': [
                { name: '成都成华专营店', h: 25, a: 48, b: 72, c: 25, f: 12, l: 5, e: 4, invalid: 2, total: 193 },
                { name: '成都金牛专营店', h: 18, a: 35, b: 52, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 140 }
            ],
            '成都三区': [
                { name: '成都高新专营店', h: 12, a: 22, b: 35, c: 12, f: 6, l: 3, e: 2, invalid: 2, total: 94 }
            ],
            '重庆一区': [
                { name: '重庆渝北专营店', h: 32, a: 65, b: 112, c: 38, f: 15, l: 6, e: 5, invalid: 4, total: 277 },
                { name: '重庆江北专营店', h: 28, a: 55, b: 95, c: 32, f: 13, l: 5, e: 4, invalid: 4, total: 236 }
            ],
            '重庆二区': [
                { name: '重庆沙坪坝专营店', h: 22, a: 45, b: 78, c: 26, f: 11, l: 5, e: 4, invalid: 2, total: 193 },
                { name: '重庆南岸专营店', h: 15, a: 32, b: 55, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 137 }
            ]
        }
    },
    'R6': {
        regionName: '东北大区',
        areas: {
            '沈阳一区': [
                { name: '沈阳铁西专营店', h: 28, a: 52, b: 85, c: 32, f: 15, l: 6, e: 5, invalid: 4, total: 227 },
                { name: '沈阳和平专营店', h: 22, a: 42, b: 68, c: 25, f: 12, l: 5, e: 4, invalid: 3, total: 181 }
            ],
            '沈阳二区': [
                { name: '沈阳皇姑专营店', h: 18, a: 35, b: 55, c: 20, f: 10, l: 4, e: 3, invalid: 3, total: 148 },
                { name: '沈阳大东专营店', h: 15, a: 28, b: 45, c: 16, f: 8, l: 4, e: 3, invalid: 2, total: 121 }
            ],
            '大连一区': [
                { name: '大连甘井子专营店', h: 25, a: 48, b: 78, c: 28, f: 12, l: 5, e: 4, invalid: 3, total: 203 },
                { name: '大连西岗专营店', h: 20, a: 38, b: 62, c: 22, f: 10, l: 4, e: 3, invalid: 2, total: 161 }
            ],
            '大连二区': [
                { name: '大连中山专营店', h: 16, a: 30, b: 48, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 129 }
            ]
        }
    },
    'R7': {
        regionName: '西南大区',
        areas: {
            '昆明一区': [
                { name: '昆明西山专营店', h: 22, a: 42, b: 72, c: 28, f: 12, l: 5, e: 4, invalid: 3, total: 188 },
                { name: '昆明五华专营店', h: 18, a: 35, b: 58, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 153 }
            ],
            '昆明二区': [
                { name: '昆明官渡专营店', h: 15, a: 28, b: 48, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 126 },
                { name: '昆明盘龙专营店', h: 12, a: 22, b: 38, c: 14, f: 6, l: 3, e: 2, invalid: 2, total: 99 }
            ],
            '贵阳一区': [
                { name: '贵阳南明专营店', h: 18, a: 35, b: 58, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 153 },
                { name: '贵阳云岩专营店', h: 15, a: 28, b: 48, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 126 }
            ]
        }
    },
    'R8': {
        regionName: '西北大区',
        areas: {
            '西安一区': [
                { name: '西安雁塔专营店', h: 28, a: 55, b: 98, c: 32, f: 14, l: 6, e: 5, invalid: 1, total: 239 },
                { name: '西安碑林专营店', h: 24, a: 48, b: 82, c: 26, f: 12, l: 5, e: 4, invalid: 1, total: 202 }
            ],
            '西安二区': [
                { name: '西安莲湖专营店', h: 18, a: 38, b: 65, c: 20, f: 9, l: 4, e: 3, invalid: 2, total: 159 },
                { name: '西安未央专营店', h: 15, a: 28, b: 48, c: 16, f: 7, l: 4, e: 3, invalid: 2, total: 123 }
            ],
            '西安三区': [
                { name: '西安新城专营店', h: 10, a: 18, b: 32, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 82 }
            ]
        }
    }
};

// --- projectDrillData ---
const projectDrillData = {
    '夏季大促': {
        projectName: '2024夏季大促-R4核心运营项目',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海东风南方专营店', h: 45, a: 78, b: 95, c: 42, f: 18, l: 8, e: 6, invalid: 8, total: 300 },
                    { name: '上海日产特约店', h: 38, a: 65, b: 82, c: 35, f: 15, l: 6, e: 5, invalid: 6, total: 252 }
                ],
                '浙江小区': [
                    { name: '杭州城西专营店', h: 32, a: 55, b: 72, c: 28, f: 12, l: 5, e: 4, invalid: 5, total: 213 }
                ]
            },
            '华南大区': {
                '广州小区': [
                    { name: '广州天河专营店', h: 42, a: 72, b: 88, c: 38, f: 16, l: 7, e: 5, invalid: 7, total: 275 }
                ],
                '深圳小区': [
                    { name: '深圳南山专营店', h: 35, a: 62, b: 78, c: 32, f: 14, l: 6, e: 5, invalid: 6, total: 238 }
                ]
            }
        }
    },
    '品牌焕新': {
        projectName: '品牌焕新周-R2区域联动',
        channels: {
            '华中大区': {
                '武汉小区': [
                    { name: '武汉汉口专营店', h: 28, a: 48, b: 62, c: 25, f: 12, l: 5, e: 4, invalid: 4, total: 188 },
                    { name: '武汉武昌专营店', h: 22, a: 38, b: 52, c: 20, f: 10, l: 4, e: 3, invalid: 3, total: 152 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都武侯专营店', h: 25, a: 42, b: 55, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 164 }
                ],
                '西安小区': [
                    { name: '西安雁塔专营店', h: 18, a: 32, b: 45, c: 18, f: 8, l: 3, e: 3, invalid: 2, total: 129 }
                ]
            }
        }
    },
    '天籁补贴': {
        projectName: '天籁专项补贴-R1渠道专场',
        channels: {
            '华东大区': {
                '南京小区': [
                    { name: '南京鼓楼专营店', h: 32, a: 55, b: 72, c: 30, f: 12, l: 5, e: 4, invalid: 4, total: 214 }
                ],
                '苏州小区': [
                    { name: '苏州园区专营店', h: 28, a: 48, b: 65, c: 26, f: 11, l: 4, e: 3, invalid: 3, total: 188 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京海淀专营店', h: 35, a: 58, b: 75, c: 32, f: 14, l: 5, e: 5, invalid: 5, total: 229 }
                ],
                '天津小区': [
                    { name: '天津河西专营店', h: 25, a: 42, b: 58, c: 24, f: 10, l: 4, e: 3, invalid: 3, total: 169 }
                ]
            }
        }
    },
    '轩逸混动': {
        projectName: '轩逸超混版上市推广-R5',
        channels: {
            '华南大区': {
                '广州小区': [
                    { name: '广州番禺专营店', h: 30, a: 52, b: 68, c: 28, f: 12, l: 5, e: 4, invalid: 4, total: 203 },
                    { name: '广州白云专营店', h: 25, a: 45, b: 60, c: 24, f: 10, l: 4, e: 3, invalid: 3, total: 174 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都成华专营店', h: 20, a: 35, b: 48, c: 20, f: 8, l: 3, e: 3, invalid: 2, total: 139 }
                ]
            }
        }
    },
    '618购车': {
        projectName: '618全民购车节-全渠道',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海华新专营店', h: 38, a: 65, b: 82, c: 35, f: 15, l: 6, e: 5, invalid: 6, total: 252 }
                ],
                '浙江小区': [
                    { name: '杭州滨江专营店', h: 30, a: 52, b: 68, c: 28, f: 12, l: 5, e: 4, invalid: 4, total: 203 }
                ]
            },
            '华中大区': {
                '长沙小区': [
                    { name: '长沙岳麓专营店', h: 22, a: 38, b: 52, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 154 }
                ]
            }
        }
    },
    '探陆预售': {
        projectName: '探陆预售-到店留存专项',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海浦东专营店', h: 40, a: 68, b: 85, c: 36, f: 14, l: 6, e: 5, invalid: 6, total: 260 }
                ],
                '南京小区': [
                    { name: '南京建邺专营店', h: 28, a: 48, b: 65, c: 25, f: 11, l: 4, e: 3, invalid: 3, total: 187 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京朝阳专营店', h: 35, a: 60, b: 78, c: 32, f: 13, l: 5, e: 4, invalid: 5, total: 232 }
                ],
                '天津小区': [
                    { name: '天津南开专营店', h: 22, a: 38, b: 52, c: 20, f: 9, l: 3, e: 3, invalid: 3, total: 150 }
                ]
            }
        }
    },
    '老带新活动': {
        projectName: '售后维系老带新活动',
        channels: {
            '华中大区': {
                '武汉小区': [
                    { name: '武汉光谷专营店', h: 30, a: 50, b: 68, c: 28, f: 12, l: 5, e: 4, invalid: 4, total: 201 }
                ],
                '长沙小区': [
                    { name: '长沙芙蓉专营店', h: 25, a: 42, b: 58, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 167 }
                ]
            },
            '华南大区': {
                '广州小区': [
                    { name: '广州越秀专营店', h: 28, a: 48, b: 62, c: 25, f: 11, l: 4, e: 3, invalid: 3, total: 184 }
                ]
            }
        }
    },
    '抖音直播': {
        projectName: '抖音直播间获客计划-R3',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海静安专营店', h: 18, a: 32, b: 48, c: 20, f: 10, l: 4, e: 3, invalid: 3, total: 138 }
                ],
                '浙江小区': [
                    { name: '杭州西湖专营店', h: 15, a: 28, b: 42, c: 18, f: 8, l: 3, e: 3, invalid: 2, total: 119 }
                ]
            },
            '华南大区': {
                '深圳小区': [
                    { name: '深圳福田专营店', h: 20, a: 35, b: 50, c: 22, f: 9, l: 4, e: 3, invalid: 3, total: 146 }
                ]
            }
        }
    },
    '快手探店': {
        projectName: '快手探店-引流到店',
        channels: {
            '华北大区': {
                '北京小区': [
                    { name: '北京丰台专营店', h: 12, a: 22, b: 38, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 105 }
                ],
                '石家庄小区': [
                    { name: '石家庄长安专营店', h: 10, a: 20, b: 35, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 94 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都锦江专营店', h: 14, a: 25, b: 40, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 109 }
                ]
            }
        }
    },
    '商超展位': {
        projectName: '线下商超展位-引流',
        channels: {
            '华东大区': {
                '宁波小区': [
                    { name: '宁波海曙专营店', h: 10, a: 18, b: 32, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 89 }
                ],
                '温州小区': [
                    { name: '温州鹿城专营店', h: 8, a: 16, b: 28, c: 12, f: 6, l: 2, e: 2, invalid: 1, total: 75 }
                ]
            },
            '华中大区': {
                '郑州小区': [
                    { name: '郑州金水专营店', h: 12, a: 20, b: 35, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 97 }
                ]
            }
        }
    },
    '电销邀约': {
        projectName: '电销组-邀约到店竞赛',
        channels: {
            '华南大区': {
                '佛山小区': [
                    { name: '佛山禅城专营店', h: 15, a: 28, b: 42, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 118 }
                ],
                '东莞小区': [
                    { name: '东莞南城专营店', h: 12, a: 22, b: 35, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 98 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京顺义专营店', h: 18, a: 30, b: 45, c: 20, f: 9, l: 3, e: 3, invalid: 2, total: 130 }
                ]
            }
        }
    },
    '区域车展': {
        projectName: '区域车展-邀约到场',
        channels: {
            '西部大区': {
                '重庆小区': [
                    { name: '重庆渝北专营店', h: 10, a: 18, b: 30, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 84 }
                ],
                '昆明小区': [
                    { name: '昆明盘龙专营店', h: 8, a: 15, b: 25, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 70 }
                ]
            },
            '华中大区': {
                '合肥小区': [
                    { name: '合肥包河专营店', h: 12, a: 20, b: 32, c: 15, f: 6, l: 3, e: 2, invalid: 2, total: 92 }
                ]
            }
        }
    },
    '上门试驾': {
        projectName: '上门试驾-服务升级项目',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海闵行专营店', h: 20, a: 35, b: 52, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 149 }
                ],
                '无锡小区': [
                    { name: '无锡新吴专营店', h: 16, a: 28, b: 42, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 119 }
                ]
            },
            '华南大区': {
                '珠海小区': [
                    { name: '珠海香洲专营店', h: 14, a: 25, b: 40, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 109 }
                ]
            }
        }
    },
    '竞品对比': {
        projectName: '竞品对比试驾-专项',
        channels: {
            '华北大区': {
                '青岛小区': [
                    { name: '青岛市南专营店', h: 14, a: 25, b: 38, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 107 }
                ],
                '济南小区': [
                    { name: '济南历下专营店', h: 12, a: 22, b: 35, c: 15, f: 6, l: 3, e: 2, invalid: 2, total: 97 }
                ]
            },
            '西部大区': {
                '西安小区': [
                    { name: '西安未央专营店', h: 10, a: 18, b: 30, c: 14, f: 6, l: 2, e: 2, invalid: 1, total: 83 }
                ]
            }
        }
    },
    '夜间试驾': {
        projectName: '夜间试驾-关怀活动',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海徐汇专营店', h: 12, a: 22, b: 35, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 98 }
                ],
                '南京小区': [
                    { name: '南京江宁专营店', h: 10, a: 18, b: 30, c: 12, f: 6, l: 2, e: 2, invalid: 1, total: 81 }
                ]
            },
            '华南大区': {
                '厦门小区': [
                    { name: '厦门湖里专营店', h: 14, a: 24, b: 38, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 106 }
                ]
            }
        }
    },
    '女性试驾': {
        projectName: '女性车主-试驾下午茶',
        channels: {
            '华东大区': {
                '浙江小区': [
                    { name: '杭州拱墅专营店', h: 10, a: 18, b: 28, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 78 }
                ],
                '苏州小区': [
                    { name: '苏州姑苏专营店', h: 8, a: 15, b: 25, c: 10, f: 5, l: 2, e: 2, invalid: 1, total: 68 }
                ]
            },
            '华中大区': {
                '武汉小区': [
                    { name: '武汉洪山专营店', h: 12, a: 20, b: 32, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 90 }
                ]
            }
        }
    },
    '高校试驾': {
        projectName: '高校行-首台车试驾',
        channels: {
            '华北大区': {
                '北京小区': [
                    { name: '北京昌平专营店', h: 8, a: 14, b: 24, c: 10, f: 5, l: 2, e: 1, invalid: 1, total: 65 }
                ],
                '天津小区': [
                    { name: '天津滨海专营店', h: 6, a: 12, b: 20, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 54 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都高新专营店', h: 10, a: 16, b: 28, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 76 }
                ]
            }
        }
    },
    '渠道锁单': {
        projectName: '渠道专享-限时锁单补贴',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海杨浦专营店', h: 12, a: 20, b: 32, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 90 }
                ],
                '宁波小区': [
                    { name: '宁波北仑专营店', h: 10, a: 18, b: 28, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 78 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京通州专营店', h: 14, a: 24, b: 38, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 106 }
                ]
            }
        }
    },
    '电商锁单': {
        projectName: '电商平台-9.9元锁单',
        channels: {
            '华南大区': {
                '广州小区': [
                    { name: '广州增城专营店', h: 8, a: 14, b: 24, c: 10, f: 5, l: 2, e: 1, invalid: 1, total: 65 }
                ],
                '深圳小区': [
                    { name: '深圳龙岗专营店', h: 6, a: 12, b: 20, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 54 }
                ]
            },
            '西部大区': {
                '重庆小区': [
                    { name: '重庆江北专营店', h: 10, a: 16, b: 26, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 74 }
                ]
            }
        }
    },
    '车展锁单': {
        projectName: '车展现场-即时锁单奖',
        channels: {
            '华中大区': {
                '郑州小区': [
                    { name: '郑州二七专营店', h: 6, a: 10, b: 18, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 50 }
                ],
                '武汉小区': [
                    { name: '武汉江汉专营店', h: 8, a: 12, b: 22, c: 10, f: 4, l: 2, e: 1, invalid: 1, total: 60 }
                ]
            },
            '华东大区': {
                '常州小区': [
                    { name: '常州新北专营店', h: 5, a: 10, b: 16, c: 8, f: 3, l: 2, e: 1, invalid: 1, total: 46 }
                ]
            }
        }
    }
};

// --- scheduleDrillData ---
const scheduleDrillData = {
    'douyin0501': {
        scheduleName: '抖音信息流-0501-R4核心排期',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海东风南方专营店', h: 25, a: 42, b: 55, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 164 }
                ],
                '浙江小区': [
                    { name: '杭州滨江专营店', h: 20, a: 35, b: 48, c: 18, f: 8, l: 3, e: 3, invalid: 2, total: 137 }
                ]
            },
            '华南大区': {
                '广州小区': [
                    { name: '广州天河专营店', h: 22, a: 38, b: 50, c: 20, f: 9, l: 4, e: 3, invalid: 3, total: 149 }
                ],
                '深圳小区': [
                    { name: '深圳南山专营店', h: 18, a: 32, b: 45, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 128 }
                ]
            }
        }
    },
    'chekong0428': {
        scheduleName: '懂车帝CPS-0428-R4效果通',
        channels: {
            '华中大区': {
                '武汉小区': [
                    { name: '武汉汉口专营店', h: 18, a: 32, b: 45, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 128 },
                    { name: '武汉武昌专营店', h: 15, a: 28, b: 40, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 112 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都武侯专营店', h: 16, a: 30, b: 42, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 118 }
                ]
            }
        }
    },
    'baidu0502': {
        scheduleName: '百度搜索竞价-0502-R2品牌专区',
        channels: {
            '华北大区': {
                '北京小区': [
                    { name: '北京海淀专营店', h: 20, a: 35, b: 48, c: 20, f: 9, l: 4, e: 3, invalid: 3, total: 142 }
                ],
                '天津小区': [
                    { name: '天津河西专营店', h: 15, a: 28, b: 40, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 113 }
                ]
            },
            '华东大区': {
                '南京小区': [
                    { name: '南京鼓楼专营店', h: 14, a: 25, b: 38, c: 15, f: 6, l: 3, e: 2, invalid: 2, total: 105 }
                ]
            }
        }
    },
    'kuaishou0505': {
        scheduleName: '快手短视频-0505-R3核心排期',
        channels: {
            '西部大区': {
                '成都小区': [
                    { name: '成都成华专营店', h: 12, a: 22, b: 35, c: 14, f: 6, l: 2, e: 2, invalid: 1, total: 94 }
                ],
                '西安小区': [
                    { name: '西安雁塔专营店', h: 10, a: 18, b: 30, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 80 }
                ]
            },
            '华南大区': {
                '广州小区': [
                    { name: '广州白云专营店', h: 14, a: 25, b: 38, c: 15, f: 6, l: 3, e: 2, invalid: 2, total: 105 }
                ]
            }
        }
    },
    'xiaohongshu0425': {
        scheduleName: '小红书种草-0425-R1专项排期',
        channels: {
            '华东大区': {
                '苏州小区': [
                    { name: '苏州园区专营店', h: 15, a: 28, b: 40, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 113 }
                ],
                '上海小区': [
                    { name: '上海华新专营店', h: 18, a: 32, b: 45, c: 18, f: 8, l: 3, e: 3, invalid: 2, total: 129 }
                ]
            },
            '华北大区': {
                '石家庄小区': [
                    { name: '石家庄桥西专营店', h: 10, a: 18, b: 28, c: 12, f: 5, l: 2, e: 1, invalid: 1, total: 77 }
                ]
            }
        }
    },
    'pengyouquan0501': {
        scheduleName: '朋友圈广告-0501-R4核心排期',
        channels: {
            '华南大区': {
                '佛山小区': [
                    { name: '佛山禅城专营店', h: 10, a: 18, b: 30, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 84 }
                ],
                '东莞小区': [
                    { name: '东莞南城专营店', h: 8, a: 15, b: 25, c: 12, f: 5, l: 2, e: 1, invalid: 1, total: 69 }
                ]
            },
            '华东大区': {
                '上海小区': [
                    { name: '上海长宁专营店', h: 12, a: 20, b: 32, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 90 }
                ]
            }
        }
    },
    'toutiao0503': {
        scheduleName: '今日头条-0503-R4品牌联动',
        channels: {
            '华中大区': {
                '郑州小区': [
                    { name: '郑州金水专营店', h: 8, a: 14, b: 25, c: 12, f: 5, l: 2, e: 1, invalid: 1, total: 68 }
                ],
                '合肥小区': [
                    { name: '合肥包河专营店', h: 6, a: 12, b: 20, c: 10, f: 4, l: 2, e: 1, invalid: 1, total: 56 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京大兴专营店', h: 10, a: 16, b: 28, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 76 }
                ]
            }
        }
    },
    'youku0430': {
        scheduleName: '优酷视频插播-0430-R2专项',
        channels: {
            '西部大区': {
                '昆明小区': [
                    { name: '昆明盘龙专营店', h: 8, a: 14, b: 24, c: 10, f: 4, l: 2, e: 1, invalid: 1, total: 64 }
                ],
                '重庆小区': [
                    { name: '重庆渝北专营店', h: 10, a: 16, b: 26, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 74 }
                ]
            },
            '华南大区': {
                '厦门小区': [
                    { name: '厦门湖里专营店', h: 6, a: 12, b: 20, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 54 }
                ]
            }
        }
    },
    'zhihu0502': {
        scheduleName: '知乎内容直投-0502-R3核心',
        channels: {
            '华东大区': {
                '南京小区': [
                    { name: '南京建邺专营店', h: 6, a: 10, b: 18, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 50 }
                ],
                '上海小区': [
                    { name: '上海普陀专营店', h: 8, a: 14, b: 22, c: 10, f: 4, l: 2, e: 1, invalid: 1, total: 62 }
                ]
            },
            '华中大区': {
                '长沙小区': [
                    { name: '长沙岳麓专营店', h: 5, a: 10, b: 16, c: 8, f: 3, l: 2, e: 1, invalid: 1, total: 46 }
                ]
            }
        }
    },
    'bilibili0504': {
        scheduleName: '哔哩哔哩动态-0504-R5新品上市',
        channels: {
            '华北大区': {
                '北京小区': [
                    { name: '北京昌平专营店', h: 5, a: 10, b: 16, c: 8, f: 3, l: 2, e: 1, invalid: 1, total: 46 }
                ],
                '青岛小区': [
                    { name: '青岛崂山专营店', h: 6, a: 10, b: 18, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 50 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都高新专营店', h: 4, a: 8, b: 14, c: 6, f: 3, l: 1, e: 1, invalid: 1, total: 38 }
                ]
            }
        }
    }
};


// --- projectRankData (from initProjectRankInteraction) ---
const projectRankData = {
        hab: [
            { name: "2024夏季大促-R4核心运营项目", projectCode: "夏季大促", h: 15, a: 12, b: 18, other: 55, val: "45%" },
            { name: "品牌焕新周-R2区域联动", projectCode: "品牌焕新", h: 12, a: 15, b: 15, other: 58, val: "42%" },
            { name: "天籁专项补贴-R1渠道专场", projectCode: "天籁补贴", h: 10, a: 12, b: 18, other: 60, val: "40%" },
            { name: "轩逸超混版上市推广-R5", projectCode: "轩逸混动", h: 8, a: 12, b: 18, other: 62, val: "38%" },
            { name: "618全民购车节-全渠道", projectCode: "618购车", h: 9, a: 10, b: 16, other: 65, val: "35%" },
            { name: "售后维系老带新活动", h: 8, a: 10, b: 15, other: 67, val: "33%" },
            { name: "东风日产探陆预售项目", h: 7, a: 11, b: 14, other: 68, val: "32%" },
            { name: "春季自驾游专项线索清洗", h: 6, a: 10, b: 14, other: 70, val: "30%" },
            { name: "抖音直播间获客计划-R3", h: 5, a: 9, b: 14, other: 72, val: "28%" },
            { name: "懂车帝效果通投放-R6", h: 4, a: 8, b: 14, other: 74, val: "26%" }
        ],
        arrival: [
            { name: "探陆预售-到店留存专项", projectCode: "探陆预售", val: "28.5%" },
            { name: "夏季大促-到店领取礼包", projectCode: "夏季大促", val: "26.2%" },
            { name: "品牌周-进店试驾有礼", projectCode: "品牌焕新", val: "25.0%" },
            { name: "R1 渠道到店优化项目", projectCode: "天籁补贴", val: "23.4%" },
            { name: "老带新-回店保养转介绍", projectCode: "老带新活动", val: "21.8%" },
            { name: "抖音本地生活-到店核销", projectCode: "抖音直播", val: "20.5%" },
            { name: "快手探店-引流到店", projectCode: "快手探店", val: "19.2%" },
            { name: "线下商超展位-引流", projectCode: "商超展位", val: "18.5%" },
            { name: "电销组-邀约到店竞赛", projectCode: "电销邀约", val: "17.6%" },
            { name: "区域车展-邀约到场", projectCode: "区域车展", val: "16.8%" }
        ],
        testdrive: [
            { name: "轩逸超混-全城试驾会", projectCode: "轩逸混动", val: "18.3%" },
            { name: "探陆-深度体验营", projectCode: "探陆预售", val: "16.5%" },
            { name: "夏季促-周末试驾专场", projectCode: "夏季大促", val: "15.2%" },
            { name: "天籁-静谧性试驾体验", projectCode: "天籁补贴", val: "14.8%" },
            { name: "品牌焕新-试驾礼遇", projectCode: "品牌焕新", val: "13.9%" },
            { name: "上门试驾-服务升级项目", projectCode: "上门试驾", val: "12.5%" },
            { name: "竞品对比试驾-专项", projectCode: "竞品对比", val: "11.2%" },
            { name: "夜间试驾-关怀活动", projectCode: "夜间试驾", val: "10.8%" },
            { name: "女性车主-试驾下午茶", projectCode: "女性试驾", val: "9.5%" },
            { name: "高校行-首台车试驾", projectCode: "高校试驾", val: "8.2%" }
        ],
        order: [
            { name: "618-锁单现金返现活动", projectCode: "618购车", val: "8.5%" },
            { name: "大促-最后48小时抢订", projectCode: "夏季大促", val: "7.8%" },
            { name: "探陆-首批预订锁单", projectCode: "探陆预售", val: "7.2%" },
            { name: "品牌周-订车抽大奖", projectCode: "品牌焕新", val: "6.5%" },
            { name: "渠道专享-限时锁单补贴", projectCode: "渠道锁单", val: "5.8%" },
            { name: "轩逸-锁单送保养包", projectCode: "轩逸混动", val: "5.2%" },
            { name: "老客户增换购-锁单礼", projectCode: "老带新活动", val: "4.8%" },
            { name: "区域联动-万人订车会", projectCode: "区域车展", val: "4.2%" },
            { name: "电商平台-9.9元锁单", projectCode: "电商锁单", val: "3.5%" },
            { name: "车展现场-即时锁单奖", projectCode: "车展锁单", val: "2.8%" }
        ]
    };

// --- scheduleRankData (from initScheduleRankInteraction) ---
const scheduleRankData = {
        hab: [
            { name: "抖音信息流-0501-R4核心排期", scheduleCode: "douyin0501", h: 18, a: 14, b: 15, other: 53, val: "47%" },
            { name: "懂车帝CPS-0428-R4效果通", scheduleCode: "chekong0428", h: 15, a: 12, b: 16, other: 57, val: "43%" },
            { name: "百度搜索竞价-0502-R2品牌专区", scheduleCode: "baidu0502", h: 12, a: 10, b: 18, other: 60, val: "40%" },
            { name: "快手短视频-0505-R3核心排期", scheduleCode: "kuaishou0505", h: 10, a: 12, b: 15, other: 63, val: "37%" },
            { name: "小红书种草-0425-R1专项排期", scheduleCode: "xiaohongshu0425", h: 8, a: 10, b: 16, other: 66, val: "34%" },
            { name: "朋友圈广告-0501-R4核心排期", h: 7, a: 11, b: 15, other: 67, val: "33%" },
            { name: "今日头条-0503-R4品牌联动", h: 6, a: 10, b: 16, other: 68, val: "32%" },
            { name: "优酷视频插播-0430-R2专项", h: 6, a: 9, b: 15, other: 70, val: "30%" },
            { name: "知乎内容直投-0502-R3核心", h: 5, a: 8, b: 16, other: 71, val: "29%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", h: 5, a: 8, b: 15, other: 72, val: "28%" }
        ],
        arrival: [
            { name: "抖音信息流-0501-R4核心排期", scheduleCode: "douyin0501", val: "22.5%" },
            { name: "百度搜索竞价-0502-R2品牌专区", scheduleCode: "baidu0502", val: "20.1%" },
            { name: "懂车帝CPS-0428-R4效果通", scheduleCode: "chekong0428", val: "18.8%" },
            { name: "快手短视频-0505-R3核心排期", scheduleCode: "kuaishou0505", val: "16.5%" },
            { name: "小红书种草-0425-R1专项排期", scheduleCode: "xiaohongshu0425", val: "15.2%" },
            { name: "朋友圈广告-0501-R4核心排期", scheduleCode: "pengyouquan0501", val: "14.8%" },
            { name: "今日头条-0503-R4品牌联动", scheduleCode: "toutiao0503", val: "13.5%" },
            { name: "优酷视频插播-0430-R2专项", scheduleCode: "youku0430", val: "12.2%" },
            { name: "知乎内容直投-0502-R3核心", scheduleCode: "zhihu0502", val: "11.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", scheduleCode: "bilibili0504", val: "10.8%" }
        ],
        testdrive: [
            { name: "抖音信息流-0501-R4核心排期", scheduleCode: "douyin0501", val: "15.3%" },
            { name: "百度搜索竞价-0502-R2品牌专区", scheduleCode: "baidu0502", val: "13.8%" },
            { name: "懂车帝CPS-0428-R4效果通", scheduleCode: "chekong0428", val: "12.5%" },
            { name: "快手短视频-0505-R3核心排期", scheduleCode: "kuaishou0505", val: "11.2%" },
            { name: "小红书种草-0425-R1专项排期", scheduleCode: "xiaohongshu0425", val: "9.8%" },
            { name: "朋友圈广告-0501-R4核心排期", scheduleCode: "pengyouquan0501", val: "8.5%" },
            { name: "今日头条-0503-R4品牌联动", scheduleCode: "toutiao0503", val: "7.8%" },
            { name: "优酷视频插播-0430-R2专项", scheduleCode: "youku0430", val: "7.2%" },
            { name: "知乎内容直投-0502-R3核心", scheduleCode: "zhihu0502", val: "6.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", scheduleCode: "bilibili0504", val: "5.8%" }
        ],
        order: [
            { name: "抖音信息流-0501-R4核心排期", scheduleCode: "douyin0501", val: "5.5%" },
            { name: "百度搜索竞价-0502-R2品牌专区", scheduleCode: "baidu0502", val: "4.8%" },
            { name: "懂车帝CPS-0428-R4效果通", scheduleCode: "chekong0428", val: "4.2%" },
            { name: "快手短视频-0505-R3核心排期", scheduleCode: "kuaishou0505", val: "3.5%" },
            { name: "小红书种草-0425-R1专项排期", scheduleCode: "xiaohongshu0425", val: "2.8%" },
            { name: "朋友圈广告-0501-R4核心排期", scheduleCode: "pengyouquan0501", val: "2.5%" },
            { name: "今日头条-0503-R4品牌联动", scheduleCode: "toutiao0503", val: "2.2%" },
            { name: "优酷视频插播-0430-R2专项", scheduleCode: "youku0430", val: "1.8%" },
            { name: "知乎内容直投-0502-R3核心", scheduleCode: "zhihu0502", val: "1.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", scheduleCode: "bilibili0504", val: "1.2%" }
        ]
    };

// --- storeFullData (from openFullRanking) ---
const storeFullData = {
    assignedStore: [
        { rank:1, name:'上海东风南方', count:1980, percent:'16.0%' },
        { rank:2, name:'广州天河', count:1520, percent:'12.3%' },
        { rank:3, name:'深圳南山', count:1080, percent:'8.7%' },
        { rank:4, name:'北京朝阳', count:940, percent:'7.6%' },
        { rank:5, name:'武汉光谷', count:820, percent:'6.6%' },
        { rank:6, name:'成都锦江', count:700, percent:'5.7%' },
        { rank:7, name:'杭州西湖', count:610, percent:'4.9%' },
        { rank:8, name:'南京鼓楼', count:520, percent:'4.2%' },
        { rank:9, name:'重庆渝北', count:430, percent:'3.5%' },
        { rank:10, name:'苏州工业园', count:360, percent:'2.9%' },
        { rank:11, name:'长沙岳麓', count:310, percent:'2.5%' },
        { rank:12, name:'天津河西', count:270, percent:'2.2%' },
        { rank:13, name:'西安雁塔', count:240, percent:'1.9%' },
        { rank:14, name:'郑州金水', count:210, percent:'1.7%' },
        { rank:15, name:'合肥蜀山', count:185, percent:'1.5%' }
    ],
    dealStore: [
        { rank:1, name:'上海东风南方', count:520, percent:'22.0%' },
        { rank:2, name:'北京朝阳', count:430, percent:'18.0%' },
        { rank:3, name:'广州天河', count:360, percent:'15.0%' },
        { rank:4, name:'深圳南山', count:280, percent:'12.0%' },
        { rank:5, name:'成都锦江', count:220, percent:'9.0%' },
        { rank:6, name:'武汉光谷', count:180, percent:'7.5%' },
        { rank:7, name:'杭州西湖', count:140, percent:'6.0%' },
        { rank:8, name:'重庆渝北', count:105, percent:'4.4%' },
        { rank:9, name:'南京鼓楼', count:72, percent:'3.0%' },
        { rank:10, name:'苏州工业园', count:50, percent:'2.1%' }
    ],
    firstTouchDealStore: [
        { rank:1, name:'上海东风南方', count:420, percent:'18.0%' },
        { rank:2, name:'广州天河', count:320, percent:'14.0%' },
        { rank:3, name:'北京朝阳', count:260, percent:'11.0%' },
        { rank:4, name:'深圳南山', count:220, percent:'9.5%' },
        { rank:5, name:'成都锦江', count:180, percent:'7.7%' },
        { rank:6, name:'武汉光谷', count:140, percent:'6.0%' },
        { rank:7, name:'杭州西湖', count:110, percent:'4.7%' },
        { rank:8, name:'重庆渝北', count:88, percent:'3.8%' },
        { rank:9, name:'南京鼓楼', count:65, percent:'2.8%' },
        { rank:10, name:'苏州工业园', count:48, percent:'2.1%' }
    ],
    reachStore: [
        { rank:1, name:'上海东风南方', count:2340, percent:'19.0%' },
        { rank:2, name:'广州天河', count:1860, percent:'15.0%' },
        { rank:3, name:'深圳南山', count:1480, percent:'12.0%' },
        { rank:4, name:'北京朝阳', count:1260, percent:'10.0%' },
        { rank:5, name:'成都锦江', count:1100, percent:'9.0%' },
        { rank:6, name:'武汉光谷', count:920, percent:'7.5%' },
        { rank:7, name:'杭州西湖', count:760, percent:'6.2%' },
        { rank:8, name:'重庆渝北', count:590, percent:'4.8%' },
        { rank:9, name:'南京鼓楼', count:460, percent:'3.7%' },
        { rank:10, name:'苏州工业园', count:350, percent:'2.8%' },
        { rank:11, name:'长沙岳麓', count:280, percent:'2.3%' },
        { rank:12, name:'天津河西', count:230, percent:'1.9%' },
        { rank:13, name:'西安雁塔', count:195, percent:'1.6%' },
        { rank:14, name:'郑州金水', count:160, percent:'1.3%' },
        { rank:15, name:'合肥蜀山', count:130, percent:'1.1%' }
    ]
};

