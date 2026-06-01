// ============================================
// Mock Data - 所有模拟数据集中管理
// 命名空间: MOCK
// 使用方式: MOCK.module.property
// 向后兼容: 原有 const 变量名保留为别名
// ============================================

// ============================================
// 一级命名空间
// ============================================
const MOCK = {

// ============================================
// 1. 常量
// ============================================
TOTAL_CULTIVATION_USERS: 15248,
channels: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11'],
intentSeries: ['N7', 'N6', '天籁鸿蒙', 'NX8'],
leadLevels: [
    'H-试驾排程单',
    'H-试驾线索单',
    'H-非试驾线索单',
    'A',
    'B',
    'C-意向不明',
    'C-无法接通',
    'F-战败',
    'L-休眠',
    'E-意向含糊',
    '无效号码'
],

// ============================================
// 2. 用户关注点 - 关注话题细分
// ============================================
focusSubTags: {
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
},

// ============================================
// 3. 线索质量 - 通话原因分析
// ============================================
quality: {
    fullData: [
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
    ]
},

// ============================================
// 4. 战败/休眠 - 原因分析
// ============================================
resistance: {
    fullData: [
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
    ]
},

// ============================================
// 5. 区域交付 - 大区排行
// ============================================
areaDelivery: {
    fullData: [
        { rank: 1, area: '华南区', count: 4042, h: 10, a: 28, b: 25, other: 37 },
        { rank: 2, area: '华北区', count: 4992, h: 23, a: 23, b: 15, other: 39 },
        { rank: 3, area: '华中一区', count: 3825, h: 21, a: 15, b: 21, other: 43 },
        { rank: 4, area: '华中二区', count: 3596, h: 25, a: 28, b: 22, other: 25 },
        { rank: 5, area: '华东二区', count: 2596, h: 5, a: 17, b: 21, other: 57 },
        { rank: 6, area: '华东一区', count: 2090, h: 13, a: 22, b: 22, other: 43 },
        { rank: 7, area: '东北区', count: 4620, h: 25, a: 18, b: 15, other: 42 },
        { rank: 8, area: '西南区', count: 2964, h: 7, a: 27, b: 18, other: 48 },
        { rank: 9, area: '华东三区', count: 1568, h: 8, a: 17, b: 28, other: 47 },
        { rank: 10, area: '西北区', count: 1728, h: 9, a: 21, b: 25, other: 45 },
    ]
},

// ============================================
// 6. 触媒习惯 - 渠道/媒体重合度分析
// ============================================
touchMedia: {
    channelJourney: {
        firstChannelWeights: {
            R1: 0.92, R2: 0.95, R3: 0.88, R4: 1, R5: 0.82, R6: 0.78,
            R7: 0.7, R8: 0.64, R9: 0.58, R10: 0.52, R11: 0.46
        },
        lastChannelCounts: {
            R1: 1180, R2: 1095, R3: 980, R4: 880, R5: 795, R6: 705,
            R7: 620, R8: 535, R9: 450, R10: 365, R11: 310
        },
        totalUsers: 12345
    },
    channelOverlap: {
        '5plus': {
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
        '5': {
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
        '4': {
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
        '3': {
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
        '2': {
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
        '1': {
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
                { rank: 10, media: 'R10', unionCount: 320, overlapCount: 320, overlapRate: '100%' },
                { rank: 11, media: 'R11', unionCount: 220, overlapCount: 220, overlapRate: '100%' }
            ]
        }
    },
    mediaOverlap: {
        '5plus': {
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
        '5': {
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
        '4': {
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
        '3': {
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
        '2': {
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
        '1': {
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
    }
},

// ============================================
// 7. 门店 - 城市门店 / 区域渠道 / 全量排行
// ============================================
store: {
    cityData: {
        '广州': [
            { name: '广州珠峰黄埔', region: '华南区', subregion: '广州区', district: '黄埔区', h: 28, a: 52, b: 45, other: 112, total: 240 },
            { name: '广州京安', region: '华南区', subregion: '广州区', district: '增城区', h: 38, a: 81, b: 133, other: 224, total: 477 },
            { name: '广东龙骑ZNA', region: '华南区', subregion: '广州区', district: '', h: 5, a: 19, b: 24, other: 66, total: 116 },
            { name: '广州龙日', region: '华南区', subregion: '广州区', district: '天河区', h: 45, a: 32, b: 45, other: 94, total: 219 },
        ],
        '北京': [
            { name: '北京东风南方丽泽', region: '华北区', subregion: '北京区', district: '丰台区', h: 37, a: 91, b: 72, other: 113, total: 314 },
            { name: '北京东风南方亮马', region: '华北区', subregion: '北京区', district: '朝阳区', h: 10, a: 28, b: 25, other: 38, total: 103 },
            { name: '北京君诚驰悦', region: '华北区', subregion: '北京区', district: '顺义区', h: 21, a: 50, b: 60, other: 108, total: 242 },
            { name: '北京福源', region: '华北区', subregion: '北京区', district: '朝阳区', h: 10, a: 41, b: 27, other: 72, total: 152 },
        ],
        '重庆': [
            { name: '重庆东新', region: '西南区', subregion: '重庆区', district: '两江新区', h: 89, a: 85, b: 127, other: 170, total: 473 },
            { name: '重庆东风南方渝兴', region: '西南区', subregion: '重庆区', district: '九龙坡区', h: 30, a: 33, b: 36, other: 39, total: 140 },
            { name: '重庆东风南方盛泰', region: '西南区', subregion: '重庆区', district: '两江新区', h: 43, a: 67, b: 63, other: 221, total: 395 },
            { name: '重庆东风南方渝东', region: '西南区', subregion: '重庆区', district: '北碚区', h: 52, a: 105, b: 74, other: 205, total: 438 },
        ],
        '深圳': [
            { name: '深圳东风南方华瑞福田', region: '华南区', subregion: '深圳区', district: '福田区', h: 83, a: 86, b: 66, other: 96, total: 332 },
            { name: '深圳东风南方华新', region: '华南区', subregion: '深圳区', district: '宝安区', h: 46, a: 60, b: 66, other: 115, total: 289 },
            { name: '深圳东风南方华翔', region: '华南区', subregion: '深圳区', district: '龙岗区', h: 114, a: 78, b: 91, other: 174, total: 459 },
            { name: '深圳里程福田（服务店）', region: '华南区', subregion: '深圳区', district: '福田区', h: 44, a: 74, b: 108, other: 145, total: 373 },
        ],
        '上海': [
            { name: '新能源上海东风南方虹桥零售交付中心', region: '华东一区', subregion: '上海区', district: '闵行区', h: 15, a: 58, b: 42, other: 148, total: 266 },
            { name: '上海安吉普陀', region: '华东一区', subregion: '上海区', district: '普陀区', h: 44, a: 60, b: 44, other: 112, total: 261 },
            { name: '上海东风南方威铭', region: '华东一区', subregion: '上海区', district: '普陀区', h: 47, a: 52, b: 43, other: 64, total: 208 },
            { name: '上海安吉闵行', region: '华东一区', subregion: '上海区', district: '闵行区', h: 87, a: 117, b: 126, other: 104, total: 435 },
        ],
        '苏州': [
            { name: '昆山华明', region: '华东二区', subregion: '苏州区', district: '昆山市', h: 105, a: 110, b: 134, other: 129, total: 481 },
            { name: '苏州诚邦松陵', region: '华东二区', subregion: '苏州区', district: '吴江区', h: 67, a: 103, b: 87, other: 139, total: 398 },
            { name: '昆山华翔达', region: '华东二区', subregion: '苏州区', district: '昆山市', h: 35, a: 51, b: 28, other: 54, total: 170 },
            { name: '苏州相诚', region: '华东二区', subregion: '苏州区', district: '相城区', h: 29, a: 87, b: 92, other: 277, total: 486 },
        ],
        '郑州': [
            { name: '郑州威佳新郑', region: '华中一区', subregion: '郑州区', district: '新郑市', h: 28, a: 109, b: 109, other: 157, total: 405 },
            { name: '郑州东风南方郑工', region: '华中一区', subregion: '郑州区', district: '管城回族区', h: 76, a: 93, b: 60, other: 174, total: 405 },
            { name: '郑州威佳圃田', region: '华中一区', subregion: '郑州区', district: '管城回族区', h: 35, a: 103, b: 112, other: 197, total: 448 },
            { name: '郑州东风南方威耀', region: '华中一区', subregion: '郑州区', district: '新密市', h: 21, a: 43, b: 31, other: 59, total: 157 },
        ],
        '南通': [
            { name: '南通太平洋如东', region: '华东二区', subregion: '苏中区', district: '如东县', h: 35, a: 64, b: 85, other: 170, total: 356 },
            { name: '南通太平洋启东', region: '华东二区', subregion: '苏中区', district: '启东市', h: 89, a: 89, b: 81, other: 166, total: 427 },
            { name: '南通名尼威', region: '华东二区', subregion: '苏中区', district: '崇川区', h: 29, a: 43, b: 72, other: 145, total: 291 },
            { name: '南通海通', region: '华东二区', subregion: '苏中区', district: '海门区', h: 17, a: 63, b: 91, other: 178, total: 350 },
        ],
        '佛山': [
            { name: '佛山禅车城', region: '华南区', subregion: '佛肇区', district: '禅城区', h: 27, a: 66, b: 117, other: 179, total: 390 },
            { name: '顺德金桂', region: '华南区', subregion: '佛肇区', district: '顺德区', h: 29, a: 25, b: 25, other: 54, total: 135 },
            { name: '顺德东炬', region: '华南区', subregion: '佛肇区', district: '顺德区', h: 87, a: 87, b: 100, other: 161, total: 437 },
            { name: '佛山利隆', region: '华南区', subregion: '佛肇区', district: '三水区', h: 88, a: 103, b: 77, other: 99, total: 370 },
        ],
        '长沙': [
            { name: '长沙兰天星沙', region: '华中二区', subregion: '长株潭区', district: '长沙县', h: 110, a: 115, b: 128, other: 88, total: 443 },
            { name: '长沙华洋星城', region: '华中二区', subregion: '长株潭区', district: '雨花区', h: 69, a: 65, b: 80, other: 149, total: 364 },
            { name: '浏阳兰天集里', region: '华中二区', subregion: '长株潭区', district: '浏阳市', h: 15, a: 53, b: 32, other: 113, total: 215 },
            { name: '宁乡中拓瑞宁', region: '华中二区', subregion: '长株潭区', district: '宁乡市', h: 88, a: 88, b: 88, other: 136, total: 401 },
        ],
    },
    regionChannel: {
        'R1': {
            regionName: '华南区',
            areas: {
                '河源区': [
                    { name: '河源合利丰', h: 29, a: 18, b: 25, c: 14, f: 6, l: 8, e: 3, invalid: 9, total: 116 },
                ],
                '广州区': [
                    { name: '广州耀骏', h: 36, a: 62, b: 98, c: 25, f: 20, l: 15, e: 8, invalid: 4, total: 328 },
                    { name: '广州东风南方广辰', h: 10, a: 35, b: 33, c: 37, f: 18, l: 10, e: 2, invalid: 2, total: 128 },
                    { name: '广州珠峰黄埔', h: 18, a: 27, b: 19, c: 25, f: 11, l: 6, e: 10, invalid: 8, total: 111 },
                ],
                '珠海区': [
                    { name: '珠海明珠', h: 22, a: 50, b: 38, c: 14, f: 19, l: 15, e: 10, invalid: 2, total: 173 },
                    { name: '珠海黄浦金湾', h: 26, a: 15, b: 17, c: 25, f: 10, l: 9, e: 9, invalid: 8, total: 105 },
                ],
            }
        },
        'R2': {
            regionName: '华北区',
            areas: {
                '石家庄区': [
                    { name: '石家庄东风南方新华', h: 27, a: 24, b: 44, c: 26, f: 19, l: 7, e: 8, invalid: 9, total: 164 },
                    { name: '石家庄东风南方联德', h: 83, a: 79, b: 87, c: 28, f: 11, l: 3, e: 11, invalid: 9, total: 418 },
                    { name: '石家庄东风南方裕华', h: 16, a: 17, b: 17, c: 47, f: 20, l: 11, e: 10, invalid: 3, total: 111 },
                ],
                '廊坊区': [
                    { name: '廊坊华盛昌广阳', h: 12, a: 29, b: 38, c: 35, f: 8, l: 12, e: 5, invalid: 10, total: 175 },
                    { name: '廊坊华盛昌安次', h: 23, a: 65, b: 107, c: 47, f: 23, l: 11, e: 7, invalid: 5, total: 384 },
                ],
                '北京区': [
                    { name: '北京华盛昌', h: 28, a: 55, b: 64, c: 18, f: 25, l: 7, e: 9, invalid: 6, total: 240 },
                    { name: '北京东风南方亮马', h: 32, a: 69, b: 134, c: 49, f: 23, l: 4, e: 3, invalid: 9, total: 464 },
                    { name: '北京东风南方丽泽', h: 39, a: 43, b: 35, c: 32, f: 7, l: 6, e: 7, invalid: 5, total: 189 },
                ],
                '大同区': [
                    { name: '大同东昊', h: 66, a: 72, b: 45, c: 45, f: 14, l: 13, e: 3, invalid: 3, total: 304 },
                ],
            }
        },
        'R3': {
            regionName: '华中二区',
            areas: {
                '南宁区': [
                    { name: '南宁恒信东顺', h: 101, a: 87, b: 105, c: 28, f: 24, l: 6, e: 7, invalid: 4, total: 460 },
                    { name: '南宁广缘仙葫', h: 107, a: 99, b: 129, c: 26, f: 6, l: 4, e: 12, invalid: 7, total: 431 },
                    { name: '南宁兴宁邕宾', h: 13, a: 33, b: 55, c: 18, f: 25, l: 7, e: 4, invalid: 8, total: 221 },
                ],
                '宜春区': [
                    { name: '宜春利隆丰樟高', h: 9, a: 26, b: 21, c: 33, f: 23, l: 11, e: 4, invalid: 7, total: 137 },
                    { name: '宜春利泰袁州', h: 8, a: 34, b: 37, c: 12, f: 16, l: 6, e: 12, invalid: 4, total: 145 },
                ],
                '长沙区': [
                    { name: '长沙兰天河西', h: 69, a: 54, b: 63, c: 20, f: 10, l: 9, e: 2, invalid: 3, total: 288 },
                    { name: '浏阳兰天集里', h: 68, a: 127, b: 100, c: 27, f: 10, l: 15, e: 3, invalid: 7, total: 457 },
                    { name: '长沙兰天城西', h: 19, a: 21, b: 20, c: 39, f: 16, l: 7, e: 5, invalid: 4, total: 99 },
                ],
            }
        },
        'R4': {
            regionName: '东北区',
            areas: {
                '赤峰区': [
                    { name: '赤峰金鹏', h: 42, a: 65, b: 48, c: 27, f: 16, l: 13, e: 10, invalid: 7, total: 284 },
                    { name: '赤峰世鹏', h: 93, a: 106, b: 64, c: 17, f: 13, l: 5, e: 11, invalid: 5, total: 427 },
                ],
                '双鸭山区': [
                    { name: '双鸭山凯华运通', h: 32, a: 37, b: 35, c: 30, f: 18, l: 12, e: 10, invalid: 2, total: 135 },
                ],
                '四平区': [
                    { name: '四平成拓', h: 41, a: 86, b: 60, c: 37, f: 5, l: 11, e: 10, invalid: 4, total: 375 },
                ],
            }
        },
        'R5': {
            regionName: '华东二区',
            areas: {
                '合肥区': [
                    { name: '合肥伟业', h: 63, a: 105, b: 75, c: 29, f: 21, l: 7, e: 12, invalid: 7, total: 420 },
                    { name: '合肥小小宝湾', h: 41, a: 59, b: 46, c: 22, f: 18, l: 13, e: 8, invalid: 3, total: 247 },
                    { name: '合肥恒信东顺合肥北', h: 90, a: 94, b: 106, c: 45, f: 5, l: 7, e: 6, invalid: 4, total: 395 },
                ],
                '连云港区': [
                    { name: '连云港中信华耀', h: 110, a: 120, b: 139, c: 38, f: 19, l: 13, e: 5, invalid: 9, total: 482 },
                ],
                '常州区': [
                    { name: '常州中天日晟', h: 17, a: 30, b: 20, c: 25, f: 14, l: 6, e: 5, invalid: 3, total: 123 },
                    { name: '常州中天', h: 5, a: 20, b: 27, c: 49, f: 7, l: 10, e: 8, invalid: 10, total: 92 },
                    { name: '溧阳中天日盛', h: 30, a: 53, b: 48, c: 25, f: 9, l: 13, e: 2, invalid: 2, total: 179 },
                ],
            }
        },
        'R6': {
            regionName: '西南区',
            areas: {
                '昆明区': [
                    { name: '昆明东风南方经开区', h: 103, a: 142, b: 78, c: 45, f: 12, l: 4, e: 9, invalid: 3, total: 491 },
                    { name: '昆明东风南方三佳', h: 93, a: 122, b: 142, c: 49, f: 21, l: 9, e: 10, invalid: 8, total: 490 },
                    { name: '昆明东风南方一佳', h: 32, a: 46, b: 37, c: 25, f: 25, l: 7, e: 10, invalid: 8, total: 161 },
                ],
                '重庆区': [
                    { name: '重庆东风南方渝兴', h: 21, a: 73, b: 67, c: 27, f: 15, l: 8, e: 10, invalid: 2, total: 305 },
                    { name: '重庆东风南方西南汽贸城', h: 13, a: 33, b: 40, c: 19, f: 11, l: 4, e: 8, invalid: 7, total: 150 },
                    { name: '重庆东风南方盛泰', h: 54, a: 72, b: 69, c: 13, f: 11, l: 9, e: 8, invalid: 10, total: 249 },
                ],
                '安顺区': [
                    { name: '安顺恒信东顺', h: 108, a: 127, b: 141, c: 10, f: 16, l: 7, e: 8, invalid: 7, total: 471 },
                ],
            }
        },
        'R7': {
            regionName: '华东一区',
            areas: {
                '泉州区': [
                    { name: '晋江汇京豪信', h: 39, a: 65, b: 32, c: 34, f: 15, l: 13, e: 12, invalid: 7, total: 219 },
                    { name: '泉州亿兴', h: 45, a: 130, b: 85, c: 49, f: 22, l: 3, e: 8, invalid: 10, total: 450 },
                    { name: '泉州汇京南环路', h: 18, a: 62, b: 103, c: 18, f: 19, l: 5, e: 2, invalid: 5, total: 368 },
                ],
                '台州区': [
                    { name: '台州临海康富', h: 46, a: 78, b: 84, c: 27, f: 18, l: 7, e: 3, invalid: 8, total: 312 },
                    { name: '台州铠利', h: 19, a: 14, b: 23, c: 24, f: 25, l: 4, e: 12, invalid: 1, total: 89 },
                    { name: '台州刚泰路桥', h: 23, a: 102, b: 97, c: 11, f: 24, l: 5, e: 5, invalid: 3, total: 466 },
                ],
                '上海区': [
                    { name: '上海松江', h: 41, a: 82, b: 63, c: 48, f: 24, l: 14, e: 3, invalid: 3, total: 318 },
                    { name: '上海安吉浦东金桥', h: 19, a: 35, b: 57, c: 46, f: 17, l: 9, e: 5, invalid: 2, total: 239 },
                    { name: '上海东风南方威铭', h: 95, a: 84, b: 68, c: 29, f: 24, l: 15, e: 3, invalid: 10, total: 383 },
                ],
            }
        },
        'R8': {
            regionName: '华中一区',
            areas: {
                '潜江区': [
                    { name: '潜江三环劲通', h: 56, a: 71, b: 66, c: 14, f: 21, l: 13, e: 7, invalid: 1, total: 257 },
                ],
                '郑州区': [
                    { name: '郑州东风南方郑工', h: 24, a: 34, b: 38, c: 19, f: 18, l: 5, e: 10, invalid: 5, total: 134 },
                    { name: '郑州威佳宏远', h: 86, a: 118, b: 114, c: 37, f: 23, l: 7, e: 7, invalid: 4, total: 395 },
                    { name: '郑州东风南方威耀', h: 16, a: 35, b: 27, c: 39, f: 23, l: 12, e: 12, invalid: 7, total: 124 },
                ],
                '宜昌区': [
                    { name: '宜昌交运麟宏', h: 49, a: 66, b: 99, c: 23, f: 16, l: 15, e: 6, invalid: 6, total: 333 },
                    { name: '宜昌交运', h: 53, a: 51, b: 33, c: 43, f: 11, l: 4, e: 5, invalid: 7, total: 223 },
                ],
            }
        },
    },
    fullData: {
        assignedStore: [
            { rank:1, name:'南阳威佳宏昌', count:1941, percent:'16.2%' },
            { rank:2, name:'沧州东风南方瑞鑫', count:1251, percent:'10.4%' },
            { rank:3, name:'沈阳东风南方辽沈', count:1667, percent:'13.9%' },
            { rank:4, name:'唐山京佰朋昇', count:1387, percent:'11.6%' },
            { rank:5, name:'南昌东维高鑫', count:1444, percent:'12.0%' },
            { rank:6, name:'南通太平洋如皋', count:1519, percent:'12.7%' },
            { rank:7, name:'广州东风南方广辰', count:949, percent:'7.9%' },
            { rank:8, name:'东莞东风南方万江', count:1846, percent:'15.4%' },
            { rank:9, name:'黄山奕兴', count:1206, percent:'10.1%' },
            { rank:10, name:'南充东风南方潆溪树生', count:1554, percent:'13.0%' },
            { rank:11, name:'北京鑫达润城', count:1969, percent:'16.4%' },
            { rank:12, name:'黄石裕鑫', count:1773, percent:'14.8%' },
            { rank:13, name:'晋江汇京豪信', count:1333, percent:'11.1%' },
            { rank:14, name:'唐山港新', count:1173, percent:'9.8%' },
            { rank:15, name:'嘉兴康桥', count:1422, percent:'11.8%' }
        ],
        dealStore: [
            { rank:1, name:'东风日产新能源零售交付中心广州店', count:448, percent:'3.7%' },
            { rank:2, name:'佛山利泰', count:316, percent:'2.6%' },
            { rank:3, name:'贵港润泰金港', count:298, percent:'2.5%' },
            { rank:4, name:'上海安吉普陀', count:370, percent:'3.1%' },
            { rank:5, name:'寿光华神鼎泰', count:172, percent:'1.4%' },
            { rank:6, name:'阜新全一', count:190, percent:'1.6%' },
            { rank:7, name:'淮安东风南方城北', count:275, percent:'2.3%' },
            { rank:8, name:'池州鑫福隆', count:89, percent:'0.7%' },
            { rank:9, name:'云浮罗定怡诚', count:415, percent:'3.5%' },
            { rank:10, name:'唐山冀东', count:196, percent:'1.6%' }
        ],
        firstTouchDealStore: [
            { rank:1, name:'保定东风南方涿州', count:395, percent:'3.3%' },
            { rank:2, name:'南宁广缘仙葫', count:118, percent:'1.0%' },
            { rank:3, name:'成都启阳五龙山', count:149, percent:'1.2%' },
            { rank:4, name:'桂林友爱', count:72, percent:'0.6%' },
            { rank:5, name:'宜春利泰袁州', count:252, percent:'2.1%' },
            { rank:6, name:'北京鑫达润城', count:248, percent:'2.1%' },
            { rank:7, name:'南通太平洋', count:209, percent:'1.7%' },
            { rank:8, name:'茂名东风南方金泰', count:317, percent:'2.6%' },
            { rank:9, name:'武威鑫成', count:278, percent:'2.3%' },
            { rank:10, name:'济宁华源', count:252, percent:'2.1%' }
        ],
        reachStore: [
            { rank:1, name:'桐乡中顺', count:405, percent:'3.4%' },
            { rank:2, name:'长春恒瑞', count:997, percent:'8.3%' },
            { rank:3, name:'南通太平洋', count:1870, percent:'15.6%' },
            { rank:4, name:'拉萨协合', count:1745, percent:'14.5%' },
            { rank:5, name:'茂名东风南方金泰', count:230, percent:'1.9%' },
            { rank:6, name:'佛山利泰', count:1708, percent:'14.2%' },
            { rank:7, name:'万宁东风南方海狮服务中心', count:2103, percent:'17.5%' },
            { rank:8, name:'钦州广缘金海湾', count:174, percent:'1.5%' },
            { rank:9, name:'温州龙元', count:1590, percent:'13.2%' },
            { rank:10, name:'合肥伟盛行', count:1373, percent:'11.4%' },
            { rank:11, name:'青岛东风南方吉源', count:1747, percent:'14.6%' },
            { rank:12, name:'商丘威佳宏祥', count:1866, percent:'15.6%' },
            { rank:13, name:'长治锦程', count:2354, percent:'19.6%' },
            { rank:14, name:'武汉卓联关山', count:2386, percent:'19.9%' },
            { rank:15, name:'武威鑫成', count:1053, percent:'8.8%' }
        ]
    }
},

// ============================================
// 8. 项目运营 - 下钻数据 / 排行数据
// ============================================
project: {
drillData: {
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
},
rankData: {
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
}
},

// ============================================
// 9. 排期管理 - 下钻数据 / 排行数据
// ============================================
schedule: {
drillData: {
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
},
rankData: {
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
}
},

// ============================================
// 10. KPI & 图表 - 页面配置 / 饼图备用数据
// ============================================
kpi: {
    pageData: {
        'channel-effect': [
            { border: 'kpi-border-purple', flex: 0.9, icon: 'fa-filter', title: '线索统计', metrics: [
                { label: '新增线索量', val: '22,345', unit: '条', trend: 'up', tv: '5.2%' },
                { label: '总部培育新增线索', val: '12,345', unit: '条', trend: 'up', tv: '4.8%' }
            ]},
            { border: 'kpi-border-blue', flex: 1.4, icon: 'fa-phone', title: '通话统计（有通话记录）（总部培育+门店虚拟号）', metrics: [
                { label: '通话总数', val: '9,876', unit: '通', trend: 'up', tv: '3.1%' },
                { label: '接通总数', val: '8,234', unit: '通', trend: 'up', tv: '2.8%' },
                { label: '平均时长', val: '30', unit: 's', trend: 'up', tv: '1s' }
            ]},
            { border: 'kpi-border-cyan', flex: 1.6, icon: 'fa-layer-group', title: '线索大类（含占比）（有通话记录）（总部培育）', metrics: [
                { label: '外呼有效量', val: '9,876', unit: '人', trend: 'up', tv: '0.5pp' },
                { label: '有效号码占比', val: '68', unit: '%', trend: 'up', tv: '0.5pp' },
                { label: '无法建联用户', val: '3,210', unit: '人', trend: 'down', tv: '0.4%' },
                { label: '无法建联占比', val: '18', unit: '%', trend: 'down', tv: '0.4pp' },
                { label: '外呼无效用户', val: '2,469', unit: '人', trend: 'down', tv: '1.1%' },
                { label: '无效号码占比', val: '32', unit: '%', trend: 'down', tv: '1.1pp' }
            ]},
            { border: 'kpi-border-blue', flex: 1.6, icon: 'fa-user-check', title: '用户分级（含占比）', metrics: [
                { label: 'H-试驾排程单/H-试驾线索单/H-非试驾线索单/A/B用户', val: '4,321', unit: '人', trend: 'up', tv: '1.2pp' },
                { label: 'H/A/B 用户占比', val: '35', unit: '%', trend: 'up', tv: '1.2pp' }
            ]},
            { border: 'kpi-border-green', flex: 1.8, icon: 'fa-arrows-to-dot', title: '行为转化（含占比）', metrics: [
                { label: '到店数（首次）', val: '2,345', unit: '人', trend: 'up', tv: '2pp' },
                { label: '到店占比', val: '35', unit: '%', trend: 'up', tv: '2pp' },
                { label: '试驾数', val: '1,234', unit: '人', trend: 'up', tv: '0.8pp' },
                { label: '试驾占比', val: '12', unit: '%', trend: 'up', tv: '0.8pp' },
                { label: '锁单数', val: '456', unit: '人', trend: 'up', tv: '0.3pp' },
                { label: '锁单占比', val: '5.4', unit: '%', trend: 'up', tv: '0.3pp' },
                { label: '交车数', val: '218', unit: '人', trend: 'up', tv: '0.2pp' },
                { label: '交车占比', val: '2.6', unit: '%', trend: 'up', tv: '0.2pp' }
            ]}
        ]
    },
    pieOverride: {
        '线索级别占比': {
            centerTotal: '12,345', centerLabel: '新增线索用户',
            segments: [
                { color: '#00337c', label: 'H-试驾排程单', count: '1,481', pct: '12%', start: 0, end: 12 },
                { color: '#0052cc', label: 'H-试驾线索单', count: '1,852', pct: '15%', start: 12, end: 27 },
                { color: '#0081ff', label: 'H-非试驾线索单', count: '988', pct: '8%', start: 27, end: 35 },
                { color: '#1a75ff', label: 'A', count: '1,358', pct: '11%', start: 35, end: 46 },
                { color: '#3b82f6', label: 'B', count: '1,481', pct: '12%', start: 46, end: 58 },
                { color: '#60a5fa', label: 'C-意向不明', count: '1,111', pct: '9%', start: 58, end: 67 },
                { color: '#7cc4ff', label: 'C-无法接通', count: '741', pct: '6%', start: 67, end: 73 },
                { color: '#93c5fd', label: 'F-战败', count: '617', pct: '5%', start: 73, end: 78 },
                { color: '#bfdbfe', label: 'L-休眠', count: '494', pct: '4%', start: 78, end: 82 },
                { color: '#cfe2ff', label: 'E-意向含糊', count: '370', pct: '3%', start: 82, end: 85 },
                { color: '#dbeafe', label: '无效号码', count: '1,852', pct: '15%', start: 85, end: 100 }
            ]
        }
    }
},

// ============================================
// 11. 下载数据 - 渠道效果明细导出
// ============================================
download: {
    channelEffectDetail: {
        headers: ['渠道名称', '媒体名称', '意向车系', '线索日期', '线索级别', '通话状态', '通话时长(s)', '到店日期', '试驾日期', '锁单日期', '交车日期', '用户姓名', '手机号'],
        rows: [
            ['R1-抖音信息流', '抖音', 'N7', '2026-05-28', 'H-试驾排程单', '已接通', '45', '2026-05-29', '-', '-', '-', '张三', '138****1234'],
            ['R2-懂车帝', '懂车帝', 'N7', '2026-05-27', 'H-试驾线索单', '已接通', '32', '2026-05-28', '2026-05-29', '-', '-', '李四', '139****5678'],
            ['R3-百度竞价', '百度', 'N6', '2026-05-26', 'A', '未接通', '0', '-', '-', '-', '-', '王五', '136****9012'],
            ['R1-抖音信息流', '抖音', 'NX8', '2026-05-25', 'B', '已接通', '28', '-', '-', '-', '-', '赵六', '137****3456'],
            ['R4-快手', '快手', 'N7', '2026-05-24', 'H-非试驾线索单', '已接通', '55', '2026-05-26', '2026-05-28', '2026-05-30', '-', '孙七', '135****7890'],
            ['R5-小红书', '小红书', 'N6', '2026-05-23', 'C-意向不明', '已接通', '18', '-', '-', '-', '-', '周八', '133****2345'],
            ['R2-懂车帝', '懂车帝', 'N7', '2026-05-22', 'H-试驾排程单', '已接通', '62', '2026-05-24', '2026-05-25', '2026-05-28', '2026-05-30', '吴九', '132****6789'],
            ['R6-朋友圈', '朋友圈', 'NX8', '2026-05-21', 'F-战败', '未接通', '0', '-', '-', '-', '-', '郑十', '131****0123'],
            ['R3-百度竞价', '百度', 'N7', '2026-05-20', 'A', '已接通', '41', '2026-05-22', '-', '-', '-', '陈十一', '130****4567'],
            ['R1-抖音信息流', '抖音', 'N6', '2026-05-19', 'L-休眠', '已接通', '22', '-', '-', '-', '-', '刘十二', '129****8901'],
            ['R7-头条', '头条', 'N7', '2026-05-18', 'E-意向含糊', '空号', '0', '-', '-', '-', '-', '黄十三', '128****2345'],
            ['R4-快手', '快手', 'NX8', '2026-05-17', 'B', '已接通', '37', '-', '-', '-', '-', '杨十四', '127****6789'],
            ['R8-优酷', '优酷', 'N7', '2026-05-16', '无效号码', '停机', '0', '-', '-', '-', '-', '朱十五', '126****0123'],
            ['R5-小红书', '小红书', 'N6', '2026-05-15', 'H-试驾线索单', '已接通', '48', '2026-05-17', '2026-05-19', '-', '-', '马十六', '125****4567'],
            ['R2-懂车帝', '懂车帝', 'N7', '2026-05-14', 'C-无法接通', '已接通', '19', '-', '-', '-', '-', '胡十七', '124****8901'],
            ['R9-知乎内容直投', '知乎', 'NX8', '2026-05-13', 'A', '已接通', '36', '2026-05-15', '-', '-', '-', '林十八', '123****2345'],
            ['R10-B站动态推广', 'B站', 'N6', '2026-05-12', 'B', '已接通', '24', '-', '-', '-', '-', '何十九', '122****6789'],
            ['R11-头条品牌联动', '头条', 'N7', '2026-05-11', 'H-非试驾线索单', '已接通', '51', '2026-05-13', '2026-05-15', '-', '-', '高二十', '121****0123']
        ]
    }
},


// ============================================
// 12. 层级关系 - 大区→小区→省份→城市→县区→门店（用于联动筛选）
// ============================================
hierarchy: {"东北区": [{"name": "内蒙古区", "provinces": [{"name": "内蒙古自治区", "cities": [{"name": "乌兰察布", "districts": [{"name": "察哈尔右翼前旗", "stores": ["乌兰察布佰会"]}]}, {"name": "乌海", "districts": [{"name": "海勃湾区", "stores": ["乌海宏通"]}]}, {"name": "兴安盟", "districts": [{"name": "扎赉特旗", "stores": ["兴安盟星耀扎旗"]}, {"name": "科尔沁右翼前旗", "stores": ["兴安盟华楠"]}]}, {"name": "包头", "districts": [{"name": "九原区", "stores": ["包头恒通新茗领"]}, {"name": "青山区", "stores": ["包头金达"]}]}, {"name": "呼伦贝尔", "districts": [{"name": "海拉尔区", "stores": ["呼伦贝尔庞大广源"]}, {"name": "鄂温克族自治旗", "stores": ["呼伦贝尔星跃"]}]}, {"name": "呼和浩特", "districts": [{"name": "新城区", "stores": ["呼和浩特嘉丰"]}, {"name": "赛罕区", "stores": ["呼和浩特世通"]}]}, {"name": "赤峰", "districts": [{"name": "敖汉旗", "stores": ["赤峰金鹏"]}, {"name": "红山区", "stores": ["赤峰世鹏"]}]}, {"name": "通辽", "districts": [{"name": "科尔沁区", "stores": ["通辽方胜", "通辽龙兴伟业"]}]}, {"name": "鄂尔多斯", "districts": [{"name": "东胜区", "stores": ["鄂尔多斯银达"]}]}, {"name": "锡林浩特", "districts": [{"name": "市辖区", "stores": ["锡林浩特嘉洋"]}]}]}]}, {"name": "吉林区", "provinces": [{"name": "吉林", "cities": [{"name": "吉林", "districts": [{"name": "丰满区", "stores": ["吉林裕富"]}]}, {"name": "四平", "districts": [{"name": "铁东区", "stores": ["四平成拓"]}]}, {"name": "延边", "districts": [{"name": "延吉市", "stores": ["延吉裕富"]}]}, {"name": "白城", "districts": [{"name": "洮北区", "stores": ["白城鑫世纪"]}]}, {"name": "白山", "districts": [{"name": "浑江区", "stores": ["白山宝信"]}]}, {"name": "通化", "districts": [{"name": "东昌区", "stores": ["通化汇泉"]}]}, {"name": "长春", "districts": [{"name": "二道区", "stores": ["长春佳艺", "长春恒瑞"]}, {"name": "宽城区", "stores": ["长春恒通"]}, {"name": "绿园区", "stores": ["长春中基展航"]}]}]}]}, {"name": "沈阳区", "provinces": [{"name": "辽宁", "cities": [{"name": "沈阳", "districts": [{"name": "于洪区", "stores": ["沈阳汇丰沈大"]}, {"name": "大东区", "stores": ["沈阳新世纪"]}, {"name": "沈河区", "stores": ["沈阳中晨诚隆"]}, {"name": "浑南区", "stores": ["沈阳新世纪浑南"]}, {"name": "苏家屯区", "stores": ["沈阳中升越通"]}, {"name": "铁西区", "stores": ["沈阳东风南方辽沈", "沈阳佳艺"]}]}]}]}, {"name": "辽东区", "provinces": [{"name": "辽宁", "cities": [{"name": "丹东", "districts": [{"name": "振兴区", "stores": ["丹东中升花园"]}]}, {"name": "抚顺", "districts": [{"name": "望花区", "stores": ["抚顺东风南方沈抚"]}]}, {"name": "本溪", "districts": [{"name": "明山区", "stores": ["本溪中升广通"]}]}, {"name": "辽阳", "districts": [{"name": "太子河区", "stores": ["辽阳亿通日成"]}]}, {"name": "铁岭", "districts": [{"name": "铁岭县", "stores": ["铁岭东风南方"]}]}, {"name": "鞍山", "districts": [{"name": "铁西区", "stores": ["鞍山亿通东尼"]}]}]}]}, {"name": "辽西区", "provinces": [{"name": "辽宁", "cities": [{"name": "大连", "districts": [{"name": "甘井子区", "stores": ["大连佳艺"]}, {"name": "金州区", "stores": ["大连中升盛通"]}]}, {"name": "朝阳", "districts": [{"name": "朝阳县", "stores": ["朝阳川达"]}, {"name": "龙城区", "stores": ["朝阳百盛"]}]}, {"name": "营口", "districts": [{"name": "站前区", "stores": ["营口中升大通"]}]}, {"name": "葫芦岛", "districts": [{"name": "龙港区", "stores": ["葫芦岛川达"]}]}, {"name": "锦州", "districts": [{"name": "太和区", "stores": ["锦州维立达"]}]}, {"name": "阜新", "districts": [{"name": "细河区", "stores": ["阜新全一"]}]}]}]}, {"name": "黑龙江区", "provinces": [{"name": "黑龙江", "cities": [{"name": "七台河", "districts": [{"name": "桃山区", "stores": ["七台河钰丰恒"]}]}, {"name": "佳木斯", "districts": [{"name": "向阳区", "stores": ["佳木斯凯华运通"]}]}, {"name": "双鸭山", "districts": [{"name": "市辖区", "stores": ["双鸭山凯华运通"]}]}, {"name": "哈尔滨", "districts": [{"name": "南岗区", "stores": ["哈尔滨东风南方学府路"]}, {"name": "道外区", "stores": ["哈尔滨东风南方先锋路", "哈尔滨中基展航"]}, {"name": "道里区", "stores": ["哈尔滨东风南方机场路"]}]}, {"name": "大庆", "districts": [{"name": "龙凤区", "stores": ["大庆富庄"]}]}, {"name": "牡丹江", "districts": [{"name": "阳明区", "stores": ["牡丹江佰佳"]}]}, {"name": "绥化", "districts": [{"name": "市辖区", "stores": ["绥化东风南方鸿运"]}]}, {"name": "鸡西", "districts": [{"name": "鸡冠区", "stores": ["鸡西吉顺达"]}]}, {"name": "鹤岗", "districts": [{"name": "东山区", "stores": ["鹤岗凯华运通东山"]}]}, {"name": "齐齐哈尔", "districts": [{"name": "铁锋区", "stores": ["齐齐哈尔华宇瑞通"]}]}]}]}], "华东一区": [{"name": "上海区", "provinces": [{"name": "上海", "cities": [{"name": "上海", "districts": [{"name": "奉贤区", "stores": ["上海奉贤"]}, {"name": "普陀区", "stores": ["上海东风南方威铭", "上海安吉普陀"]}, {"name": "松江区", "stores": ["上海松江"]}, {"name": "浦东新区", "stores": ["上海东风南方威顺", "上海安吉浦东金桥", "东风日产新能源体验中心（上海尚悦湾店）"]}, {"name": "闵行区", "stores": ["上海安吉闵行", "新能源上海东风南方虹桥零售交付中心"]}, {"name": "静安区", "stores": ["东风日产新能源体验中心（上海南京西路店）"]}]}]}]}, {"name": "杭州区", "provinces": [{"name": "浙江", "cities": [{"name": "杭州", "districts": [{"name": "拱墅区", "stores": ["杭州东风南方杭城", "杭州元通友通", "杭州元通城北"]}, {"name": "萧山区", "stores": ["杭州东风南方宁围", "杭州东风南方新通惠"]}, {"name": "钱塘区", "stores": ["杭州东风南方金沙"]}]}, {"name": "湖州", "districts": [{"name": "吴兴区", "stores": ["湖州东风南方金恒德"]}, {"name": "长兴县", "stores": ["湖州东风南方常兴"]}]}, {"name": "绍兴", "districts": [{"name": "嵊州市", "stores": ["绍兴广成八达"]}, {"name": "越城区", "stores": ["绍兴元通日通"]}]}]}]}, {"name": "浙东区", "provinces": [{"name": "浙江", "cities": [{"name": "台州", "districts": [{"name": "临海市", "stores": ["台州临海康富"]}, {"name": "路桥区", "stores": ["台州刚泰路桥"]}, {"name": "黄岩区", "stores": ["台州铠利"]}]}, {"name": "嘉兴", "districts": [{"name": "南湖区", "stores": ["嘉兴之远", "嘉兴康桥"]}, {"name": "桐乡市", "stores": ["桐乡中顺"]}, {"name": "海宁市", "stores": ["海宁百胜"]}]}, {"name": "宁波", "districts": [{"name": "余姚市", "stores": ["余姚东风南方恒田"]}, {"name": "北仑区", "stores": ["宁波大港启航"]}, {"name": "宁海县", "stores": ["宁波君会"]}, {"name": "慈溪市", "stores": ["慈溪飞跃"]}, {"name": "海曙区", "stores": ["宁波元通友和"]}]}]}]}, {"name": "浙南区", "provinces": [{"name": "浙江", "cities": [{"name": "丽水", "districts": [{"name": "莲都区", "stores": ["丽水瓯翔南城"]}]}, {"name": "温州", "districts": [{"name": "苍南县", "stores": ["温州龙元"]}, {"name": "龙湾区", "stores": ["温州华鸿"]}]}, {"name": "衢州", "districts": [{"name": "柯城区", "stores": ["衢州德众"]}]}, {"name": "金华", "districts": [{"name": "义乌市", "stores": ["义乌元通广通"]}, {"name": "婺城区", "stores": ["金华大昌"]}, {"name": "永康市", "stores": ["永康元通友米"]}]}]}]}, {"name": "福建区", "provinces": [{"name": "福建", "cities": [{"name": "厦门", "districts": [{"name": "同安区", "stores": ["厦门信达国贸启帆"]}, {"name": "海沧区", "stores": ["厦门海沧（服务店）"]}, {"name": "湖里区", "stores": ["厦门信达国贸启航"]}]}, {"name": "宁德", "districts": [{"name": "蕉城区", "stores": ["宁德中域东侨"]}]}, {"name": "泉州", "districts": [{"name": "丰泽区", "stores": ["泉州亿兴"]}, {"name": "安溪县", "stores": ["泉州汇京友联"]}, {"name": "晋江市", "stores": ["晋江汇京豪信"]}, {"name": "鲤城区", "stores": ["泉州汇京南环路"]}]}, {"name": "漳州", "districts": [{"name": "芗城区", "stores": ["漳州万事达众保"]}, {"name": "龙文区", "stores": ["漳州聚力"]}]}, {"name": "福州", "districts": [{"name": "仓山区", "stores": ["福州汇京盛新", "福州汇京金山"]}, {"name": "晋安区", "stores": ["福州汇京福飞北"]}, {"name": "福清市", "stores": ["福清华盛"]}]}, {"name": "莆田", "districts": [{"name": "荔城区", "stores": ["莆田华宝"]}]}, {"name": "龙岩", "districts": [{"name": "新罗区", "stores": ["龙岩汇京龙兴"]}]}]}]}], "华东三区": [{"name": "鲁东区", "provinces": [{"name": "山东", "cities": [{"name": "威海", "districts": [{"name": "环翠区", "stores": ["威海世通"]}, {"name": "荣成市", "stores": ["荣成海源"]}]}, {"name": "烟台", "districts": [{"name": "芝罘区", "stores": ["烟台天航", "烟台富嘉"]}]}, {"name": "青岛", "districts": [{"name": "即墨区", "stores": ["青岛珠峰即墨"]}, {"name": "城阳区", "stores": ["青岛珠峰城阳"]}, {"name": "市北区", "stores": ["青岛东风南方吉源"]}, {"name": "平度市", "stores": ["青岛珠峰平度"]}, {"name": "胶州市", "stores": ["青岛珠峰胶州"]}, {"name": "黄岛区", "stores": ["青岛天也"]}]}]}]}, {"name": "鲁北区", "provinces": [{"name": "山东", "cities": [{"name": "东营", "districts": [{"name": "东营区", "stores": ["东营百川凌云西城"]}, {"name": "垦利区", "stores": ["东营兴达"]}, {"name": "广饶县", "stores": ["东营顺达润嘉"]}]}, {"name": "德州", "districts": [{"name": "德城区", "stores": ["德州华丰"]}]}, {"name": "淄博", "districts": [{"name": "临淄区", "stores": ["淄博远方骏顺"]}, {"name": "张店区", "stores": ["淄博泰达", "淄博泰通"]}]}, {"name": "滨州", "districts": [{"name": "滨城区", "stores": ["滨州远泰"]}]}, {"name": "潍坊", "districts": [{"name": "奎文区", "stores": ["潍坊恒安"]}, {"name": "寒亭区", "stores": ["潍坊玉山"]}, {"name": "寿光市", "stores": ["寿光华神鼎泰"]}, {"name": "诸城市", "stores": ["诸城英华"]}, {"name": "青州市", "stores": ["潍坊珠峰青州"]}]}]}]}, {"name": "鲁南区", "provinces": [{"name": "山东", "cities": [{"name": "临沂", "districts": [{"name": "兰山区", "stores": ["临沂易利"]}, {"name": "沂水县", "stores": ["临沂易通沂水"]}, {"name": "河东区", "stores": ["临沂易丰"]}, {"name": "罗庄区", "stores": ["临沂易华", "临沂沂河路"]}]}, {"name": "日照", "districts": [{"name": "东港区", "stores": ["日照易通奎山"]}]}, {"name": "枣庄", "districts": [{"name": "市中区", "stores": ["枣庄远方"]}, {"name": "滕州市", "stores": ["枣庄华源腾达滕州"]}, {"name": "薛城区", "stores": ["枣庄光明大道北于", "枣庄天朗"]}]}, {"name": "泰安", "districts": [{"name": "岱岳区", "stores": ["泰安德义"]}]}, {"name": "济宁", "districts": [{"name": "任城区", "stores": ["济宁东风南方东源", "济宁华源"]}, {"name": "曲阜市", "stores": ["曲阜新圣达"]}, {"name": "梁山县", "stores": ["济宁华源通达梁山"]}, {"name": "邹城市", "stores": ["邹城东风南方宝丰源服务中心"]}]}]}]}, {"name": "鲁西区", "provinces": [{"name": "山东", "cities": [{"name": "济南", "districts": [{"name": "历下区", "stores": ["济南卓联卓华"]}, {"name": "槐荫区", "stores": ["济南匡山", "济南卓联卓风"]}, {"name": "章丘区", "stores": ["济南卓联卓正"]}, {"name": "莱芜区", "stores": ["莱芜顺通"]}]}, {"name": "聊城", "districts": [{"name": "东昌府区", "stores": ["聊城东风南方天瑞", "聊城东风南方金天瑞"]}]}, {"name": "菏泽", "districts": [{"name": "定陶区", "stores": ["菏泽东风南方定陶"]}, {"name": "牡丹区", "stores": ["菏泽东风南方佳达", "菏泽东风南方开源"]}]}]}]}], "华东二区": [{"name": "安徽区", "provinces": [{"name": "安徽", "cities": [{"name": "亳州", "districts": [{"name": "谯城区", "stores": ["亳州国轩"]}]}, {"name": "合肥", "districts": [{"name": "包河区", "stores": ["合肥伟盛行"]}, {"name": "庐阳区", "stores": ["合肥恒信东顺合肥北"]}, {"name": "蜀山区", "stores": ["合肥伟业"]}, {"name": "长丰县", "stores": ["合肥小小宝湾"]}]}, {"name": "安庆", "districts": [{"name": "宜秀区", "stores": ["安庆恒业"]}]}, {"name": "宣城", "districts": [{"name": "宣州区", "stores": ["宣城东风南方宣州"]}]}, {"name": "宿州", "districts": [{"name": "埇桥区", "stores": ["宿州东十里"]}]}, {"name": "池州", "districts": [{"name": "贵池区", "stores": ["池州鑫福隆"]}]}, {"name": "淮南", "districts": [{"name": "大通区", "stores": ["淮南中骏"]}]}, {"name": "芜湖", "districts": [{"name": "鸠江区", "stores": ["芜湖东风南方鸠江"]}]}, {"name": "蚌埠", "districts": [{"name": "禹会区", "stores": ["蚌埠禹会"]}]}, {"name": "阜阳", "districts": [{"name": "颍州区", "stores": ["阜阳中源开发区"]}]}, {"name": "马鞍山", "districts": [{"name": "雨山区", "stores": ["马鞍山博洲"]}]}, {"name": "黄山", "districts": [{"name": "休宁县", "stores": ["黄山奕兴"]}]}]}]}, {"name": "常锡区", "provinces": [{"name": "江苏", "cities": [{"name": "常州", "districts": [{"name": "新北区", "stores": ["常州中天"]}, {"name": "武进区", "stores": ["常州中天日新"]}, {"name": "溧阳市", "stores": ["溧阳中天日盛"]}, {"name": "金坛区", "stores": ["常州中天日昇"]}, {"name": "钟楼区", "stores": ["常州中天日晟"]}]}, {"name": "无锡", "districts": [{"name": "宜兴市", "stores": ["无锡苏源宜兴"]}, {"name": "惠山区", "stores": ["无锡盛岸西路"]}, {"name": "新吴区", "stores": ["无锡威邦新区", "无锡明乐"]}, {"name": "江阴市", "stores": ["江阴海华"]}, {"name": "锡山区", "stores": ["无锡汇鑫先锋"]}]}]}]}, {"name": "苏中区", "provinces": [{"name": "江苏", "cities": [{"name": "南通", "districts": [{"name": "南通经济技术开发区", "stores": ["南通太平洋开发区"]}, {"name": "启东市", "stores": ["南通太平洋启东"]}, {"name": "如东县", "stores": ["南通太平洋如东"]}, {"name": "如皋市", "stores": ["南通太平洋如皋"]}, {"name": "崇川区", "stores": ["南通名尼威", "南通太平洋"]}, {"name": "海安市", "stores": ["南通太平洋海安"]}, {"name": "海门区", "stores": ["南通海通"]}]}, {"name": "盐城", "districts": [{"name": "东台市", "stores": ["盐城太平洋东台"]}, {"name": "亭湖区", "stores": ["盐城苏缘"]}]}]}]}, {"name": "苏北区", "provinces": [{"name": "江苏", "cities": [{"name": "南京", "districts": [{"name": "栖霞区", "stores": ["南京峰豪"]}, {"name": "江宁区", "stores": ["南京东风南方东麒", "南京文华"]}]}, {"name": "宿迁", "districts": [{"name": "宿城区", "stores": ["宿迁金奥"]}]}, {"name": "徐州", "districts": [{"name": "云龙区", "stores": ["徐州尊悦", "徐州欣欣路"]}, {"name": "鼓楼区", "stores": ["徐州鼓楼"]}]}, {"name": "扬州", "districts": [{"name": "邗江区", "stores": ["扬州东风南方东峻", "扬州东风南方扬辰"]}]}, {"name": "泰州", "districts": [{"name": "泰兴市", "stores": ["泰州东风南方泰兴"]}, {"name": "海陵区", "stores": ["泰州东风南方天辰"]}]}, {"name": "淮安", "districts": [{"name": "淮阴区", "stores": ["淮安东风南方城北"]}]}, {"name": "连云港", "districts": [{"name": "海州区", "stores": ["连云港中信华耀"]}]}, {"name": "镇江", "districts": [{"name": "京口区", "stores": ["镇江东风南方新区"]}]}]}]}, {"name": "苏州区", "provinces": [{"name": "江苏", "cities": [{"name": "苏州", "districts": [{"name": "吴中区", "stores": ["苏州伟海"]}, {"name": "吴江区", "stores": ["吴江连诚", "苏州诚邦松陵"]}, {"name": "太仓市", "stores": ["太仓诚茂"]}, {"name": "昆山市", "stores": ["昆山华明", "昆山华翔达", "昆山昆众中华园路"]}, {"name": "相城区", "stores": ["苏州相诚"]}, {"name": "虎丘区", "stores": ["苏州华裕"]}]}]}]}], "华中一区": [{"name": "武汉区", "provinces": [{"name": "湖北", "cities": [{"name": "武汉", "districts": [{"name": "汉阳区", "stores": ["武汉三环劲通"]}, {"name": "江夏区", "stores": ["武汉三环轩通", "武汉卓联关山"]}, {"name": "洪山区", "stores": ["武汉三环华通", "武汉恒信东顺"]}, {"name": "硚口区", "stores": ["武汉裕信"]}]}]}]}, {"name": "豫东区", "provinces": [{"name": "河南", "cities": [{"name": "周口", "districts": [{"name": "川汇区", "stores": ["周口宏诚"]}]}, {"name": "商丘", "districts": [{"name": "梁园区", "stores": ["商丘威佳宏祥"]}]}, {"name": "开封", "districts": [{"name": "龙亭区", "stores": ["开封威瑞"]}]}, {"name": "驻马店", "districts": [{"name": "驿城区", "stores": ["驻马店威浩"]}]}]}]}, {"name": "豫北区", "provinces": [{"name": "河南", "cities": [{"name": "安阳", "districts": [{"name": "安阳县", "stores": ["安阳威佳文峰"]}]}, {"name": "新乡", "districts": [{"name": "新乡县", "stores": ["新乡威兴"]}]}, {"name": "济源", "districts": [{"name": "市辖区", "stores": ["济源威源"]}]}, {"name": "濮阳", "districts": [{"name": "华龙区", "stores": ["濮阳威佳高新"]}]}, {"name": "焦作", "districts": [{"name": "山阳区", "stores": ["焦作威佳未来"]}]}, {"name": "鹤壁", "districts": [{"name": "淇滨区", "stores": ["鹤壁威佳宏利"]}]}]}]}, {"name": "豫西区", "provinces": [{"name": "河南", "cities": [{"name": "三门峡", "districts": [{"name": "湖滨区", "stores": ["三门峡威顺"]}]}, {"name": "信阳", "districts": [{"name": "平桥区", "stores": ["信阳威通"]}]}, {"name": "南阳", "districts": [{"name": "卧龙区", "stores": ["南阳威佳宏昌"]}]}, {"name": "平顶山", "districts": [{"name": "卫东区", "stores": ["平顶山威泰"]}]}, {"name": "洛阳", "districts": [{"name": "洛龙区", "stores": ["洛阳威佳宏盛"]}, {"name": "瀍河回族区", "stores": ["洛阳威丰"]}]}]}]}, {"name": "郑州区", "provinces": [{"name": "河南", "cities": [{"name": "许昌", "districts": [{"name": "魏都区", "stores": ["许昌威佳威旺"]}]}, {"name": "郑州", "districts": [{"name": "中原区", "stores": ["郑州威佳宏鹏"]}, {"name": "二七区", "stores": ["郑州威佳宏远"]}, {"name": "巩义市", "stores": ["郑州威佳宏义"]}, {"name": "惠济区", "stores": ["郑州威佳"]}, {"name": "新密市", "stores": ["郑州东风南方威耀"]}, {"name": "新郑市", "stores": ["郑州威佳新郑"]}, {"name": "管城回族区", "stores": ["郑州东风南方郑工", "郑州威佳圃田"]}]}]}]}, {"name": "鄂北区", "provinces": [{"name": "湖北", "cities": [{"name": "仙桃", "districts": [{"name": "市辖区", "stores": ["仙桃三环劲通"]}]}, {"name": "十堰", "districts": [{"name": "张湾区", "stores": ["十堰东贸轩威"]}, {"name": "茅箭区", "stores": ["十堰东风大道"]}]}, {"name": "天门", "districts": [{"name": "市辖区", "stores": ["天门三环劲通"]}]}, {"name": "孝感", "districts": [{"name": "孝南区", "stores": ["孝感裕丰"]}]}, {"name": "潜江", "districts": [{"name": "市辖区", "stores": ["潜江三环劲通"]}]}, {"name": "襄阳", "districts": [{"name": "樊城区", "stores": ["襄阳樊城"]}, {"name": "襄州区", "stores": ["襄阳车城"]}]}, {"name": "鄂州", "districts": [{"name": "鄂城区", "stores": ["鄂州三环劲通"]}]}, {"name": "随州", "districts": [{"name": "曾都区", "stores": ["随州东盛"]}]}, {"name": "黄冈市", "districts": [{"name": "武穴市", "stores": ["黄冈宝鑫武穴"]}, {"name": "黄州区", "stores": ["黄冈恒信德龙"]}]}]}]}, {"name": "鄂南区", "provinces": [{"name": "湖北", "cities": [{"name": "咸宁市", "districts": [{"name": "咸安区", "stores": ["咸宁恒信南星"]}]}, {"name": "宜昌", "districts": [{"name": "伍家岗区", "stores": ["宜昌交运麟宏"]}, {"name": "西陵区", "stores": ["宜昌交运"]}]}, {"name": "恩施土家苗族自治州", "districts": [{"name": "恩施市", "stores": ["恩施麟觉"]}]}, {"name": "荆州", "districts": [{"name": "沙市区", "stores": ["荆州宏道"]}, {"name": "荆州区", "stores": ["荆州恒信"]}]}, {"name": "荆门", "districts": [{"name": "掇刀区", "stores": ["荆门风雅"]}]}, {"name": "黄石", "districts": [{"name": "铁山区", "stores": ["黄石裕鑫"]}]}]}]}], "华中二区": [{"name": "广西区", "provinces": [{"name": "广西", "cities": [{"name": "北海", "districts": [{"name": "海城区", "stores": ["北海新兴盛"]}]}, {"name": "南宁", "districts": [{"name": "兴宁区", "stores": ["南宁兴宁邕宾", "南宁润轩江南白沙"]}, {"name": "良庆区", "stores": ["南宁利泰五象"]}, {"name": "西乡塘区", "stores": ["南宁广缘", "南宁恒信东顺"]}, {"name": "青秀区", "stores": ["南宁广缘仙葫"]}]}, {"name": "崇左", "districts": [{"name": "江州区", "stores": ["崇左广利"]}]}, {"name": "柳州", "districts": [{"name": "城中区", "stores": ["柳州骏朋"]}, {"name": "鱼峰区", "stores": ["柳州丰正华"]}]}, {"name": "桂林", "districts": [{"name": "七星区", "stores": ["桂林盛泰七星"]}, {"name": "灵川县", "stores": ["桂林友爱"]}]}, {"name": "梧州", "districts": [{"name": "长洲区", "stores": ["梧州雄利"]}]}, {"name": "玉林", "districts": [{"name": "玉州区", "stores": ["玉林汇利成"]}]}, {"name": "百色", "districts": [{"name": "右江区", "stores": ["百色广缘城东"]}]}, {"name": "贵港", "districts": [{"name": "港北区", "stores": ["贵港润泰金港"]}]}, {"name": "贺州", "districts": [{"name": "八步区", "stores": ["贺州雄利"]}]}, {"name": "钦州", "districts": [{"name": "钦南区", "stores": ["钦州广缘金海湾"]}]}, {"name": "防城港", "districts": [{"name": "防城区", "stores": ["防城港鑫广达"]}]}]}]}, {"name": "江西区", "provinces": [{"name": "江西", "cities": [{"name": "上饶", "districts": [{"name": "广信区", "stores": ["上饶东信"]}]}, {"name": "九江", "districts": [{"name": "濂溪区", "stores": ["九江东浔"]}]}, {"name": "南昌", "districts": [{"name": "红谷滩区", "stores": ["南昌洪城"]}, {"name": "青云谱区", "stores": ["南昌泰辰洪都"]}, {"name": "青山湖区", "stores": ["南昌东维高鑫"]}]}, {"name": "吉安", "districts": [{"name": "吉州区", "stores": ["吉安东维兴达利"]}, {"name": "青原区", "stores": ["吉安通九州青原"]}]}, {"name": "宜春", "districts": [{"name": "袁州区", "stores": ["宜春利泰袁州"]}, {"name": "高安市", "stores": ["宜春利隆丰樟高"]}]}, {"name": "抚州", "districts": [{"name": "临川区", "stores": ["抚州利泰文昌"]}]}, {"name": "新余", "districts": [{"name": "市辖区", "stores": ["新余利隆仙女湖"]}]}, {"name": "景德镇", "districts": [{"name": "浮梁县", "stores": ["景德镇和谐"]}]}, {"name": "赣州", "districts": [{"name": "南康区", "stores": ["赣州昌泰南康"]}, {"name": "章贡区", "stores": ["赣州东维", "赣州东维红金", "赣州利隆章贡"]}]}, {"name": "鹰潭", "districts": [{"name": "月湖区", "stores": ["鹰潭东辉天洁"]}]}]}]}, {"name": "湘北区", "provinces": [{"name": "湖南", "cities": [{"name": "吉首", "districts": [{"name": "吉首市", "stores": ["吉首吉日"]}]}, {"name": "岳阳", "districts": [{"name": "云溪区", "stores": ["岳阳东风卓联"]}, {"name": "平江县", "stores": ["平江华安"]}]}, {"name": "常德", "districts": [{"name": "武陵区", "stores": ["常德日丰"]}]}, {"name": "张家界", "districts": [{"name": "永定区", "stores": ["张家界华盛"]}]}, {"name": "益阳", "districts": [{"name": "赫山区", "stores": ["益阳兰天"]}]}]}]}, {"name": "湘南区", "provinces": [{"name": "湖南", "cities": [{"name": "娄底", "districts": [{"name": "娄星区", "stores": ["娄底兰天"]}]}, {"name": "怀化", "districts": [{"name": "鹤城区", "stores": ["怀化兰天恒裕"]}]}, {"name": "永州", "districts": [{"name": "冷水滩区", "stores": ["永州高翔"]}, {"name": "零陵区", "stores": ["永州天际"]}]}, {"name": "衡阳", "districts": [{"name": "石鼓区", "stores": ["衡阳高翔"]}, {"name": "蒸湘区", "stores": ["衡阳高卫", "衡阳高卫(旧)"]}]}, {"name": "邵阳", "districts": [{"name": "双清区", "stores": ["邵阳兰天佳旭"]}, {"name": "武冈市", "stores": ["武冈兰天"]}]}, {"name": "郴州", "districts": [{"name": "北湖区", "stores": ["郴州高卫"]}]}]}]}, {"name": "长株潭区", "provinces": [{"name": "湖南", "cities": [{"name": "株洲", "districts": [{"name": "荷塘区", "stores": ["株洲兰天海联"]}]}, {"name": "湘潭", "districts": [{"name": "雨湖区", "stores": ["湘潭兰天九华"]}]}, {"name": "长沙", "districts": [{"name": "宁乡市", "stores": ["宁乡中拓瑞宁"]}, {"name": "岳麓区", "stores": ["长沙兰天河西", "长沙兰天麓谷"]}, {"name": "望城区", "stores": ["长沙兰天城西"]}, {"name": "浏阳市", "stores": ["浏阳兰天集里"]}, {"name": "长沙县", "stores": ["长沙兰天星沙"]}, {"name": "雨花区", "stores": ["长沙兰天雨花", "长沙华洋星城"]}]}]}]}], "华北区": [{"name": "冀北区", "provinces": [{"name": "河北", "cities": [{"name": "唐山", "districts": [{"name": "开平区", "stores": ["唐山汇京唐信"]}, {"name": "滦南县", "stores": ["唐山京佰朋昇"]}, {"name": "路北区", "stores": ["唐山港新"]}, {"name": "路南区", "stores": ["唐山冀东"]}, {"name": "迁安市", "stores": ["唐山鸿业智途"]}]}, {"name": "张家口", "districts": [{"name": "桥西区", "stores": ["张家口北榕胜兴"]}]}, {"name": "承德", "districts": [{"name": "双滦区", "stores": ["承德万焱"]}]}, {"name": "秦皇岛", "districts": [{"name": "抚宁区", "stores": ["秦皇岛京佰"]}, {"name": "海港区", "stores": ["秦皇岛京德", "秦皇岛佳浩"]}]}]}]}, {"name": "冀南区", "provinces": [{"name": "河北", "cities": [{"name": "保定", "districts": [{"name": "定州市", "stores": ["保定东风南方定州"]}, {"name": "涿州市", "stores": ["保定东风南方涿州"]}, {"name": "竞秀区", "stores": ["保定东风南方竞秀"]}, {"name": "莲池区", "stores": ["保定东风南方和顺"]}]}, {"name": "沧州", "districts": [{"name": "任丘市", "stores": ["沧州东风南方任丘"]}, {"name": "新华区", "stores": ["沧州东风南方瑞鑫"]}]}, {"name": "石家庄", "districts": [{"name": "新华区", "stores": ["石家庄东风南方新华"]}, {"name": "桥西区", "stores": ["石家庄东风南方联德"]}, {"name": "裕华区", "stores": ["石家庄东风南方裕华"]}, {"name": "长安区", "stores": ["石家庄东风南方长安"]}]}, {"name": "衡水", "districts": [{"name": "桃城区", "stores": ["衡水圣启龙", "衡水蓝池泽龙桃城"]}]}, {"name": "邢台", "districts": [{"name": "任泽区", "stores": ["邢台仁骏德"]}, {"name": "信都区", "stores": ["邢台圣士龙"]}, {"name": "襄都区", "stores": ["邢台蓝池圣启龙"]}]}, {"name": "邯郸", "districts": [{"name": "复兴区", "stores": ["邯郸恒信东顺"]}, {"name": "邯山区", "stores": ["邯郸东风南方南环"]}]}]}]}, {"name": "北京区", "provinces": [{"name": "北京", "cities": [{"name": "北京", "districts": [{"name": "丰台区", "stores": ["北京东风南方丽泽"]}, {"name": "大兴区", "stores": ["北京东风南方三合", "北京东风南方大兴"]}, {"name": "密云区", "stores": ["北京鑫达润城"]}, {"name": "平谷区", "stores": ["北京福源平谷"]}, {"name": "昌平区", "stores": ["北京东风南方大成", "北京福源易众"]}, {"name": "朝阳区", "stores": ["北京东风南方亮马", "北京汇京世纪", "北京福源"]}, {"name": "海淀区", "stores": ["北京华盛昌", "北京华盛昌四季青", "北京华盛昌百旺"]}, {"name": "通州区", "stores": ["北京东方华中"]}, {"name": "顺义区", "stores": ["北京君诚驰悦"]}]}]}, {"name": "河北", "cities": [{"name": "廊坊", "districts": [{"name": "安次区", "stores": ["廊坊华盛昌安次"]}, {"name": "广阳区", "stores": ["廊坊华盛昌广阳"]}]}]}]}, {"name": "天津区", "provinces": [{"name": "天津", "cities": [{"name": "天津", "districts": [{"name": "东丽区", "stores": ["天津名宣"]}, {"name": "武清区", "stores": ["天津宝静武清"]}, {"name": "滨海新区", "stores": ["天津滨海"]}, {"name": "蓟州区", "stores": ["天津鹏兴鑫达蓟州"]}, {"name": "西青区", "stores": ["天津名达", "天津新骏濠"]}]}]}]}, {"name": "山西区", "provinces": [{"name": "山西", "cities": [{"name": "临汾", "districts": [{"name": "尧都区", "stores": ["临汾东盛源", "临汾东腾源"]}]}, {"name": "大同", "districts": [{"name": "云冈区", "stores": ["大同东昊"]}]}, {"name": "太原", "districts": [{"name": "万柏林区", "stores": ["太原东风南方汇泽"]}, {"name": "小店区", "stores": ["太原东风南方龙城", "太原大源"]}]}, {"name": "忻州", "districts": [{"name": "忻府区", "stores": ["忻州东风南方汇润"]}]}, {"name": "晋中", "districts": [{"name": "榆次区", "stores": ["晋中东风南方汇盛"]}]}, {"name": "晋城", "districts": [{"name": "城区", "stores": ["晋城华洋"]}]}, {"name": "朔州", "districts": [{"name": "朔城区", "stores": ["朔州汇海"]}]}, {"name": "运城", "districts": [{"name": "河津市", "stores": ["运城瑞盈河津"]}, {"name": "盐湖区", "stores": ["运城瑞盈"]}]}, {"name": "长治", "districts": [{"name": "潞州区", "stores": ["长治锦程"]}]}, {"name": "阳泉", "districts": [{"name": "郊区", "stores": ["阳泉东风南方太行"]}]}]}]}], "华南区": [{"name": "东莞区", "provinces": [{"name": "广东", "cities": [{"name": "东莞", "districts": [{"name": "东城区", "stores": ["东莞汇京长海"]}, {"name": "东莞市辖", "stores": ["东莞东风南方万江", "东莞东风南方塘厦", "东莞东风南方振安", "东莞东风南方莞太", "东莞东风南方莞樟", "东莞东风南方莞龙"]}]}]}]}, {"name": "佛肇区", "provinces": [{"name": "广东", "cities": [{"name": "佛山", "districts": [{"name": "三水区", "stores": ["佛山利隆"]}, {"name": "南海区", "stores": ["佛山利泰"]}, {"name": "禅城区", "stores": ["佛山吉泰", "佛山禅车城"]}, {"name": "顺德区", "stores": ["顺德东炬", "顺德协力", "顺德金桂"]}, {"name": "高明区", "stores": ["佛山明泰"]}]}, {"name": "肇庆", "districts": [{"name": "四会市", "stores": ["肇庆合利恒四会"]}, {"name": "端州区", "stores": ["肇庆锦利"]}]}]}]}, {"name": "广州区", "provinces": [{"name": "广东", "cities": [{"name": "广州", "districts": [{"name": "", "stores": ["广东龙骑ZNA"]}, {"name": "南沙区", "stores": ["广州东风南方南沙"]}, {"name": "增城区", "stores": ["广州东风南方新塘", "广州京安", "广州耀骏"]}, {"name": "天河区", "stores": ["广州龙日"]}, {"name": "番禺区", "stores": ["广州东风南方广辰", "广州新光明珠"]}, {"name": "白云区", "stores": ["广州白云"]}, {"name": "花都区", "stores": ["广州绿日", "广州风日"]}, {"name": "荔湾区", "stores": ["东风日产新能源零售交付中心广州店", "广州荔湾"]}, {"name": "黄埔区", "stores": ["广州东风南方中大", "广州珠峰黄埔"]}]}]}]}, {"name": "海粤区", "provinces": [{"name": "广东", "cities": [{"name": "湛江", "districts": [{"name": "赤坎区", "stores": ["湛江东升行", "湛江东风南方海田"]}]}, {"name": "茂名", "districts": [{"name": "茂南区", "stores": ["茂名东风南方茂南", "茂名东风南方金泰"]}]}, {"name": "阳江", "districts": [{"name": "江城区", "stores": ["阳江金山"]}]}]}, {"name": "海南", "cities": [{"name": "万宁", "districts": [{"name": "万宁市", "stores": ["万宁东风南方海狮服务中心"]}]}, {"name": "三亚", "districts": [{"name": "吉阳区", "stores": ["三亚东风南方海燕"]}]}, {"name": "东方", "districts": [{"name": "东方市", "stores": ["东方东风南方海鹰服务中心"]}]}, {"name": "儋州", "districts": [{"name": "市辖区", "stores": ["儋州东风南方海星"]}]}, {"name": "海口", "districts": [{"name": "秀英区", "stores": ["海口东风南方海神"]}, {"name": "美兰区", "stores": ["海口东风南方海龙"]}, {"name": "龙华区", "stores": ["海口东风南方海鹏"]}]}, {"name": "琼海", "districts": [{"name": "琼海市", "stores": ["琼海东风南方海豹服务中心"]}]}]}]}, {"name": "深圳区", "provinces": [{"name": "广东", "cities": [{"name": "深圳", "districts": [{"name": "光明区", "stores": ["深圳里程福田"]}, {"name": "坪山区", "stores": ["深圳金源"]}, {"name": "宝安区", "stores": ["深圳东风南方华新", "深圳东风南方华昌", "深圳新大兴"]}, {"name": "福田区", "stores": ["深圳东风南方华瑞福田", "深圳里程福田（服务店）"]}, {"name": "龙华区", "stores": ["深圳东风南方华龙", "深圳东风南方观澜华盛"]}, {"name": "龙岗区", "stores": ["深圳东风南方华翔", "深圳易德李朗"]}]}]}]}, {"name": "粤东区", "provinces": [{"name": "广东", "cities": [{"name": "惠州", "districts": [{"name": "", "stores": ["惠州坤隆ZNA"]}, {"name": "惠城区", "stores": ["惠州俊通", "惠州南菱君达", "惠州永惠", "惠州永惠金泽"]}, {"name": "惠阳区", "stores": ["惠州惠阳安捷"]}]}, {"name": "揭阳", "districts": [{"name": "普宁市", "stores": ["普宁中升恒悦"]}, {"name": "榕城区", "stores": ["揭阳中升恒泰", "揭阳荣通"]}]}, {"name": "梅州", "districts": [{"name": "梅江区", "stores": ["梅州春天"]}]}, {"name": "汕头", "districts": [{"name": "潮阳区", "stores": ["汕头中升恒利"]}, {"name": "龙湖区", "stores": ["汕头东风南方华茂", "汕头中升恒达-新"]}]}, {"name": "汕尾", "districts": [{"name": "市辖区", "stores": ["汕尾佳艺"]}]}, {"name": "河源", "districts": [{"name": "源城区", "stores": ["河源合利丰"]}]}]}]}, {"name": "粤中区", "provinces": [{"name": "广东", "cities": [{"name": "中山", "districts": [{"name": "中山市辖", "stores": ["中山中裕黄圃", "中山众杰"]}, {"name": "西区", "stores": ["中山东日"]}]}, {"name": "云浮", "districts": [{"name": "云城区", "stores": ["云浮怡诚"]}, {"name": "罗定市", "stores": ["云浮罗定怡诚"]}]}, {"name": "江门", "districts": [{"name": "台山市", "stores": ["江门昌泰台山"]}, {"name": "开平市", "stores": ["江门丰泰"]}, {"name": "恩平市", "stores": ["江门怡泰恩城"]}, {"name": "蓬江区", "stores": ["江门江沙"]}]}, {"name": "清远", "districts": [{"name": "清城区", "stores": ["清远金江"]}, {"name": "英德市", "stores": ["清远银山英德"]}]}, {"name": "珠海", "districts": [{"name": "金湾区", "stores": ["珠海黄浦金湾"]}, {"name": "香洲区", "stores": ["珠海明珠"]}]}, {"name": "韶关", "districts": [{"name": "浈江区", "stores": ["韶关通九州", "韶关通九州韶冶"]}]}]}]}], "西北区": [{"name": "新疆区", "provinces": [{"name": "新疆", "cities": [{"name": "乌鲁木齐", "districts": [{"name": "天山区", "stores": ["乌鲁木齐卓辉"]}, {"name": "新市区", "stores": ["乌鲁木齐开发区迎宾路"]}, {"name": "水磨沟区", "stores": ["乌鲁木齐博望"]}, {"name": "米东区", "stores": ["乌鲁木齐骐辉"]}]}, {"name": "伊犁", "districts": [{"name": "伊宁市", "stores": ["伊犁元辉", "伊犁港裕"]}, {"name": "奎屯市", "stores": ["奎屯盈辉"]}]}, {"name": "克拉玛依", "districts": [{"name": "克拉玛依区", "stores": ["克拉玛依浩辉"]}]}, {"name": "博尔塔拉蒙古自治州", "districts": [{"name": "博乐市", "stores": ["博尔塔拉文汇"]}]}, {"name": "吐鲁番地区", "districts": [{"name": "高昌区", "stores": ["吐鲁番火辉"]}]}, {"name": "哈密", "districts": [{"name": "伊州区", "stores": ["哈密泰辉"]}]}, {"name": "喀什地区", "districts": [{"name": "疏勒县", "stores": ["喀什卓辉"]}]}, {"name": "塔城地区", "districts": [{"name": "额敏县", "stores": ["塔城弘辉"]}]}, {"name": "巴音郭楞蒙古自治州", "districts": [{"name": "库尔勒市", "stores": ["库尔勒瑞丰"]}]}, {"name": "昌吉", "districts": [{"name": "昌吉市", "stores": ["昌吉汇京昌盛"]}]}, {"name": "石河子", "districts": [{"name": "石河子", "stores": ["石河子升辉"]}]}, {"name": "阿克苏", "districts": [{"name": "温宿县‌", "stores": ["阿克苏奕辉"]}]}, {"name": "阿勒泰地区", "districts": [{"name": "北屯市", "stores": ["阿勒泰祥辉"]}]}]}]}, {"name": "甘青区", "provinces": [{"name": "甘肃", "cities": [{"name": "临夏回族自治州", "districts": [{"name": "临夏市", "stores": ["临夏环球万腾"]}]}, {"name": "兰州", "districts": [{"name": "城关区", "stores": ["兰州东风南方城关嘉年华"]}, {"name": "安宁区", "stores": ["兰州东风卓联"]}, {"name": "西固区", "stores": ["兰州泰华"]}]}, {"name": "天水", "districts": [{"name": "麦积区", "stores": ["天水东风南方麦积羲皇"]}]}, {"name": "定西", "districts": [{"name": "安定区", "stores": ["定西恒信东顺"]}]}, {"name": "平凉", "districts": [{"name": "崆峒区", "stores": ["平凉恒信东顺东湖"]}]}, {"name": "庆阳", "districts": [{"name": "西峰区", "stores": ["庆阳东风南方陇东汽车城"]}]}, {"name": "武威", "districts": [{"name": "凉州区", "stores": ["武威鑫成"]}]}, {"name": "酒泉", "districts": [{"name": "肃州区", "stores": ["酒泉东风南方肃州高新"]}]}, {"name": "金昌", "districts": [{"name": "金川区", "stores": ["金昌金奥顺驰"]}]}, {"name": "陇南", "districts": [{"name": "武都区", "stores": ["陇南良志"]}]}]}, {"name": "青海", "cities": [{"name": "西宁", "districts": [{"name": "城东区", "stores": ["西宁金岛越丰"]}, {"name": "城中区", "stores": ["西宁翔鹏"]}, {"name": "城北区", "stores": ["西宁青鹏"]}]}]}]}, {"name": "陕宁区", "provinces": [{"name": "宁夏", "cities": [{"name": "吴忠", "districts": [{"name": "利通区", "stores": ["吴忠天汇志成"]}]}, {"name": "固原", "districts": [{"name": "原州区", "stores": ["固原鸿源"]}]}, {"name": "银川", "districts": [{"name": "贺兰县", "stores": ["银川京胜", "银川德胜"]}, {"name": "金凤区", "stores": ["银川恒晟"]}]}]}, {"name": "陕西", "cities": [{"name": "咸阳", "districts": [{"name": "渭城区", "stores": ["咸阳秦汉新城万沣"]}, {"name": "秦都区", "stores": ["咸阳福瑞秦都"]}]}, {"name": "安康", "districts": [{"name": "汉滨区", "stores": ["安康合裕"]}]}, {"name": "宝鸡", "districts": [{"name": "渭滨区", "stores": ["宝鸡东风南方高新"]}]}, {"name": "汉中", "districts": [{"name": "汉台区", "stores": ["汉中三星"]}]}, {"name": "渭南", "districts": [{"name": "临渭区", "stores": ["渭南东风南方申华汽车城"]}]}, {"name": "西安", "districts": [{"name": "未央区", "stores": ["西安东风南方三桥", "西安东风南方未央汉城"]}, {"name": "灞桥区", "stores": ["西安东风南方浐灞佳泰"]}, {"name": "长安区", "stores": ["西安精英"]}]}]}]}], "西南区": [{"name": "云南区", "provinces": [{"name": "云南", "cities": [{"name": "保山", "districts": [{"name": "隆阳区", "stores": ["保山弘信永昌"]}]}, {"name": "大理", "districts": [{"name": "大理市", "stores": ["大理东风南方苍山路"]}]}, {"name": "文山", "districts": [{"name": "文山市", "stores": ["文山东风南方腾龙"]}]}, {"name": "昆明", "districts": [{"name": "五华区", "stores": ["昆明东风南方三佳", "昆明东风南方龙泉"]}, {"name": "官渡区", "stores": ["昆明东风南方经开区"]}, {"name": "盘龙区", "stores": ["昆明东风南方一佳"]}]}, {"name": "昭通", "districts": [{"name": "昭阳区", "stores": ["昭通晟烽"]}]}, {"name": "曲靖", "districts": [{"name": "沾益区", "stores": ["曲靖靖麒"]}]}, {"name": "玉溪", "districts": [{"name": "红塔区", "stores": ["玉溪东风南方太极路"]}]}, {"name": "西双版纳", "districts": [{"name": "景洪市", "stores": ["版纳东风南方佳旺"]}]}]}]}, {"name": "川北区", "provinces": [{"name": "四川", "cities": [{"name": "南充", "districts": [{"name": "顺庆区", "stores": ["南充东风南方潆溪树生"]}, {"name": "高坪区", "stores": ["南充东风南方高坪"]}]}, {"name": "巴中", "districts": [{"name": "巴州区", "stores": ["巴中东恒云峰"]}]}, {"name": "广元", "districts": [{"name": "利州区", "stores": ["广元东仁"]}]}, {"name": "广安", "districts": [{"name": "广安区", "stores": ["广安东风南方广生"]}]}, {"name": "绵阳", "districts": [{"name": "涪城区", "stores": ["绵阳东风南方机场绵东", "绵阳东风南方绵兴"]}]}, {"name": "达州", "districts": [{"name": "达川区", "stores": ["达州东风南方新川"]}]}]}]}, {"name": "川南区", "provinces": [{"name": "四川", "cities": [{"name": "乐山", "districts": [{"name": "市中区", "stores": ["乐山东风南方联合"]}]}, {"name": "内江", "districts": [{"name": "市中区", "stores": ["内江东风南方星和"]}]}, {"name": "宜宾", "districts": [{"name": "翠屏区", "stores": ["宜宾河田翠屏"]}]}, {"name": "攀枝花", "districts": [{"name": "仁和区", "stores": ["攀枝花启阳攀西"]}]}, {"name": "泸州", "districts": [{"name": "江阳区", "stores": ["泸州江阳"]}, {"name": "纳溪区", "stores": ["泸州东风南方纳溪"]}]}, {"name": "自贡", "districts": [{"name": "贡井区", "stores": ["自贡四达翔宏"]}]}]}]}, {"name": "川藏区", "provinces": [{"name": "四川", "cities": [{"name": "德阳", "districts": [{"name": "旌阳区", "stores": ["德阳东风南方西林"]}]}, {"name": "眉山", "districts": [{"name": "东坡区", "stores": ["眉山超越"]}]}, {"name": "资阳", "districts": [{"name": "雁江区", "stores": ["资阳益合"]}]}, {"name": "遂宁", "districts": [{"name": "船山区", "stores": ["遂宁东风南方遂发"]}]}, {"name": "雅安", "districts": [{"name": "雨城区", "stores": ["雅安超越雨城"]}]}]}, {"name": "西藏", "cities": [{"name": "拉萨", "districts": [{"name": "城关区", "stores": ["拉萨协合"]}]}]}]}, {"name": "成都区", "provinces": [{"name": "四川", "cities": [{"name": "成都", "districts": [{"name": "双流区", "stores": ["成都东风南方双流成发", "成都启阳"]}, {"name": "成华区", "stores": ["成都东风南方成华龙潭"]}, {"name": "新都区", "stores": ["成都启阳五龙山"]}, {"name": "武侯区", "stores": ["成都东风南方机场路"]}, {"name": "青羊区", "stores": ["成都东风南方青羊苏坡"]}]}]}]}, {"name": "贵州区", "provinces": [{"name": "贵州", "cities": [{"name": "六盘水", "districts": [{"name": "水城区", "stores": ["六盘水东风南方黔旺"]}]}, {"name": "安顺", "districts": [{"name": "西秀区", "stores": ["安顺恒信东顺"]}]}, {"name": "毕节", "districts": [{"name": "七星关区", "stores": ["毕节东风南方金海湖"]}]}, {"name": "贵阳", "districts": [{"name": "南明区", "stores": ["贵阳东风南方黔兴"]}, {"name": "花溪区", "stores": ["贵阳东风南方孟关"]}]}, {"name": "遵义", "districts": [{"name": "播州区", "stores": ["遵义东风南方黔发"]}]}, {"name": "黔南布依族苗族自治州", "districts": [{"name": "都匀市", "stores": ["都匀东风南方万胜"]}]}, {"name": "黔西南", "districts": [{"name": "兴义市", "stores": ["兴义恒信东顺"]}]}]}]}, {"name": "重庆区", "provinces": [{"name": "重庆", "cities": [{"name": "重庆", "districts": [{"name": "万州区", "stores": ["万州盛泰飞骏", "万州飞骏"]}, {"name": "两江新区", "stores": ["重庆东新", "重庆东风南方盛泰", "重庆东风南方西南汽贸城"]}, {"name": "九龙坡区", "stores": ["重庆东风南方渝兴"]}, {"name": "北碚区", "stores": ["重庆东风南方渝东", "重庆东风南方茶园"]}, {"name": "南岸区", "stores": ["重庆东风南方海峡"]}, {"name": "巴南区", "stores": ["重庆东风南方渝发"]}, {"name": "涪陵区", "stores": ["涪陵文化"]}]}]}]}]},

}; // end MOCK

// ============================================
// 向后兼容别名（保持现有 script.js 引用可用）
// 新代码请直接使用 MOCK.xxx.xxx
// ============================================
const TOTAL_CULTIVATION_USERS = MOCK.TOTAL_CULTIVATION_USERS;
const focusSubTagsData = MOCK.focusSubTags;
const qualityFullData = MOCK.quality.fullData;
const resistanceFullData = MOCK.resistance.fullData;
const areaDeliveryFullData = MOCK.areaDelivery.fullData;
const channelOverlapFullData = MOCK.touchMedia.channelOverlap;
const mediaOverlapFullData = MOCK.touchMedia.mediaOverlap;
const cityStoreData = MOCK.store.cityData;
const regionChannelData = MOCK.store.regionChannel;
const storeFullData = MOCK.store.fullData;
const projectDrillData = MOCK.project.drillData;
const projectRankData = MOCK.project.rankData;
const scheduleDrillData = MOCK.schedule.drillData;
const scheduleRankData = MOCK.schedule.rankData;
const kpiPageData = MOCK.kpi.pageData;
const pieOverrideData = MOCK.kpi.pieOverride;
const channelEffectDetailData = MOCK.download.channelEffectDetail;
