# Agent Context: 用户洞察产品原型

## 项目定位

这是一个用于东风日产企微助手场景的「用户洞察」静态产品原型，用于演示客服通话数据、线索质量、渠道投放、用户培育和人群画像分析。核心目标是把业务数据组织成可演示的数据看板。

项目为纯静态原型：无构建系统、无后端接口、无框架依赖。交互与数据均为 HTML + CSS + Vanilla JavaScript 模拟。部署于 GitHub Pages。

- **在线地址:** https://hw00913-bot.github.io/demo_userinsight/
- **入口密码:** `dndc2026`

## 根目录结构

| 文件 | 说明 |
|------|------|
| `index.html` | 密码验证入口，通过后跳转 `main.html` |
| `main.html` | 原型演示容器，顶部 Tab + iframe 加载看板或文档 |
| `userinsight.html` | 核心看板页面（~3,900 行），包含三个主 Tab |
| `interaction_docs.html` | 产品交互逻辑说明文档（V2.4） |
| `workbench.html` | 独立工作台页面，自包含样式/逻辑，不依赖看板 |
| `style.css` | 全局样式（~4,200 行），CSS 变量 + flex/grid 布局 |
| `script.js` | 看板核心交互逻辑（~1,900 行，经过两轮重构） |
| `mock.js` | 集中式 Mock 数据仓库（~1,400 行） |
| `pm_tools/` | 辅助工具目录 |

## 运行方式

纯静态文件，可直接用浏览器打开。需要本地服务时：

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000/index.html
```

注意：依赖 CDN 加载 Font Awesome 6.4.0 和 Google Fonts (Inter / Noto Sans SC)，离线时图标/字体可能降级。

## 页面关系

- `index.html` → 密码验证 → 跳转 `main.html`
- `main.html` → 顶部导航栏切换 iframe：`userinsight.html`（用户洞察）或 `interaction_docs.html`（交互说明）
- `userinsight.html` → 三个主 Tab：渠道效果 / 用户群体洞察 / 培育运营
- `workbench.html` → 完全独立，不接入看板导航，不共享 JS/CSS

## 核心业务结构

### 三个主 Tab（userinsight.html）

**1. 渠道效果 (channel-effect)**
- 筛选栏：日期范围、意向车系、渠道、媒体、大项目、大区、小区、省份、城市、专营店、线索等级、原因类型、时间维度
- KPI 卡片组：线索统计、通话统计、线索分类、用户分级、行为转化（Plan B 动态渲染）
- 意向车系占比（饼图 + 条形图）
- 线索有效占比、线索级别占比（conic-gradient 饼图，Plan B 动态渲染）
- 区域投放效果（柱状图，Top 10/20 切换）
- 渠道线索质量（柱状图，点击可下钻大区）
- 大项目线索质量排名（水平条形图，支持 HAB/到店/试驾/锁单切换，可点击下钻）
- 媒体线索质量排名（同上）
- 大区投放效果、小区投放效果、质量标签分布（表格）
- 触媒/触店习惯分析（渠道/媒体重叠分布，支持 Tab 切换）

**2. 用户群体洞察 (user-group-insight)**
- 筛选栏（结构同渠道效果）
- KPI 卡片：线索统计
- 用户画像分布展示

**3. 培育运营 (cultivation-op)**
- 筛选栏（结构同渠道效果）
- KPI 卡片：线索统计、关注范围、跟进过程、通话统计、用户分级、行为转化
- 用户关注点卡片（价格/产品/服务/竞品），可点击二级下钻
- 回访结果分析（Top 10 表格）
- 跟进过程分析（总部/门店 Tab 切换）

### 抽屉/弹窗（6 个）

| 弹窗 ID | 标题 | 触发方式 |
|---------|------|---------|
| `focusDrillDownModal` | 二级关注点分布 | 培育运营关注点卡片点击 |
| `cityStoreModal` | 城市专营店意向等级分布 | 区域投放效果柱状图点击 |
| `regionChannelModal` | 大区渠道质量分布 | 渠道质量柱状图点击 |
| `projectDrillModal` | 大项目线索质量分布 | 大项目排名列表点击 |
| `scheduleDrillModal` | 媒体线索质量分布 | 媒体排名列表点击 |
| `rankingModal` | 全量排行榜 | 全量排行按钮点击 |

所有弹窗通过 `data-modal-id` 属性委托关闭，点击遮罩也可关闭。

## JavaScript 逻辑地图

`script.js` 是看板核心逻辑，经两轮重构后组织如下：

### 初始化（DOMContentLoaded）
```js
initReasonTypeFilter()       // 原因类型联动下拉
initDateRange()              // 日期范围快捷选择 + 自定义
initFilterMultiSelects()     // 线索等级多选下拉
initGlobalFilters()          // 查询/重置按钮
initCultivationScaledCharts()// 培育运营图表缩放
initRankInteraction({...})   // 大项目排名交互（参数化）
initRankInteraction({...})   // 媒体质量排名交互（参数化）
```

### 工具函数
- `formatDate(date)` — 日期 → `YYYY-MM-DD`
- `parseUserCount(text)` — 从文本提取人数
- `pctNum(part, total)` / `pctStr(part, total)` — 百分比计算
- `findCard(title, {scope, returnBody})` — 按标题查找卡片
- `closeModal(id)` — 通用弹窗关闭
- `showNotification(msg, type)` — Toast 提示
- `resetDateRange(group)` — 日期范围重置
- `getTrendInfo(trend)` — 趋势图标/颜色映射
- `trendHtml(trend, tv)` — 趋势 HTML 渲染

### 常量
- `LEVEL_COLORS` — 等级颜色映射（H/A/B/C/F/L/E/invalid/hab/other）
- `TREND_ICONS` / `TREND_COLORS` — 趋势图标/颜色映射

### 排名与下钻
- `initRankInteraction(config)` — 参数化排名交互（合并了旧 `initProjectRankInteraction` + `initScheduleRankInteraction`）
- `showProjectDrillModal(code)` — 大项目下钻，复用 `renderDrillContent()`
- `showScheduleDrillModal(code)` — 媒体下钻，复用 `renderDrillContent()`
- `renderDrillContent(channels)` — 通用下钻渲染（大区→小区→门店）
- `generateStoreCard(store, areaLabel)` — 门店卡片 HTML 生成

### 弹窗逻辑
- `showCityStoreModal(name)` — 城市专营店分布
- `showRegionChannelModal(code)` — 大区渠道质量分布
- `openFocusDrillDown(cat)` — 关注点二级下钻
- `openFullRanking(type)` — 全量排行榜（质量/抗拒/区域投放/渠道重叠/媒体重叠/门店维度）
- `initDrillTabSwitch(containerSelector)` — 通用下钻 Tab 切换

### 动态渲染（Plan B）
- `renderKpiCards()` — KPI 卡片从 `kpiPageData` 动态渲染
- `renderLeadLevelPie()` — 线索级别饼图从 `pieOverrideData` 动态渲染
- `initDynamicRender()` — 页面加载后延迟触发

### 事件委托
- `[data-modal-id]` 点击 → 关闭对应弹窗
- `.project-bar-item` 点击 → 项目/媒体下钻
- `.ce-dim-btn` 点击 → 维度切换（Top 10/20、排名指标）

## 数据和状态约定

- 数据全部为 Mock，来源：`mock.js`（主要数据对象）+ HTML 内静态节点
- `mock.js` 包含 14 个大数据结构：`focusSubTagsData`、`qualityFullData`、`resistanceFullData`、`areaDeliveryFullData`、`channelOverlapFullData`、`mediaOverlapFullData`、`cityStoreData`、`regionChannelData`、`projectDrillData`、`scheduleDrillData`、`projectRankData`、`scheduleRankData`、`storeFullData`、`kpiPageData`、`pieOverrideData`
- 筛选栏不执行真实过滤，仅模拟 loading/刷新反馈
- 趋势数值使用随机波动，不保证前后一致
- 弹窗通过 `.classList.add('active')` / `.remove('active')` 控制显示
- 表格排序/筛选依赖固定 DOM 结构和列索引
- KPI 卡片和饼图通过 Plan B 动态渲染覆盖静态占位数据

## 样式约定

- 主色 `--primary-color: #0081ff`，定义在 `style.css :root`
- 布局：后台系统风格 — 左侧 sidebar + 顶部 header + 白色卡片 + 浅灰背景
- 图标：Font Awesome 6.4.0；字体：Google Fonts Inter / Noto Sans SC
- 筛选/图表等存在较多 inline style（原型遗留），新增样式优先放 `style.css`
- 关键组件类名：`.app-container`、`.sidebar`、`.main-wrapper`、`.filter-section`、`.content-card`、`.card-header`、`.drawer-overlay`、`.drawer-container`、`.rank-badge`、`.status-tag`、`.report-table`

## 修改原则

- 保持纯静态原型形态，不引入框架/构建工具/后端依赖
- 修改前确认 DOM id/class 是否被 `script.js` 硬编码引用
- 修改表格列、排行卡片时，同步检查相关排序、下钻和 modal 渲染函数
- 新增页面：复用 `style.css` 现有样式；加入 `main.html` 需在导航数组注册
- Mock 数据保持中文业务语义（线索等级 H/A/B/C/F/L/E/无效号码，大区/区域/专营店 等）
- 避免大规模重排 `userinsight.html`，它是长静态页面，局部修改更安全
- 新增通用函数优先考虑复用（参考 `renderDrillContent`、`generateStoreCard`、`initRankInteraction` 模式）

## 验证清单

- `index.html` — 密码输入、回车、失败抖动、成功跳转
- `main.html` — Tab 切换 iframe（用户洞察 / 交互说明）
- `userinsight.html` — 三个主 Tab 切换、日期快捷选择、查询按钮 Toast 反馈、重置按钮
- 排行切换 — Top 10/20、HAB/到店/试驾/锁单指标切换
- 弹窗 — 6 个弹窗的打开、关闭、点击遮罩关闭、Tab 切换
- 下钻 — 大项目/媒体/大区/城市的区域→小区→门店层级导航
- 触媒/触店 Tab 切换
- 培育运营关注点二级下钻
- 全量排行榜多种类型切换

## 已知风险

- 大量 inline style + inline JS，局部选择器变动容易影响交互
- 多个 `DOMContentLoaded` / 事件监听分散，新增初始化逻辑时避免重复绑定
- 部分功能使用 `alert`、随机数和静态 DOM 模拟，演示稳定性优先于数据准确性
- 静态密码仅用于原型演示，不具备真实安全性
- 网络受限时 CDN 图标和字体可能无法加载
- `workbench.html` 完全独立，不共享 `script.js`/`mock.js`/`style.css`
