# Agent Context: 用户洞察产品原型

## 项目定位

这是一个用于东风日产企微助手场景的「用户洞察」静态产品原型，用于演示客服通话数据、线索质量、渠道投放、用户培育和人群画像分析。核心目标是把业务数据组织成可演示的数据看板。

项目为纯静态原型：无构建系统、无后端接口、无框架依赖。交互与数据均为 HTML + CSS + Vanilla JavaScript 模拟。部署于 GitHub Pages。

- **在线地址:** https://hw00913-bot.github.io/demo_userinsight/
- **入口密码:** `dndc2026`

## 根目录结构

| 文件 | 行数 | 说明 |
|------|------|------|
| `index.html` | ~130 | 密码验证入口，通过后跳转 `main.html` |
| `main.html` | ~130 | 原型演示容器，顶部 Tab + iframe 加载看板或文档 |
| `userinsight.html` | ~3,900 | 核心看板页面，包含三个主 Tab + 6 个弹窗/抽屉 |
| `interaction_docs.html` | — | 产品交互逻辑说明文档（V2.4） |
| `workbench.html` | — | 独立工作台页面，自包含样式/逻辑，不依赖看板 |
| `style.css` | ~5,000 | 全局样式，CSS 变量 + flex/grid 布局 |
| `script.js` | ~2,900 | 看板核心交互逻辑，~70 个函数 |
| `mock.js` | ~1,400 | `MOCK` 命名空间，12 个数据模块 + 向后兼容别名 |
| `CLAUDE.md` | — | Claude Code 专用上下文（架构约定 + 常见陷阱） |
| `pm_tools/` | — | 辅助工具目录 |

## 运行方式

纯静态文件，可直接用浏览器打开。需要本地服务时：

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000/index.html
```

语法验证：
```bash
node --check script.js && node --check mock.js
```

注意：依赖 CDN 加载 Font Awesome 6.4.0 和 Google Fonts (Inter / Noto Sans SC)，离线时图标/字体可能降级。

## 页面关系

- `index.html` → 密码验证 → 跳转 `main.html`
- `main.html` → 顶部导航栏切换 iframe：`userinsight.html`（用户洞察）或 `interaction_docs.html`（交互说明）
- `userinsight.html` → 三个主 Tab：渠道效果 / 培育运营 / 用户群体洞察
- `workbench.html` → 完全独立，不接入看板导航，不共享 JS/CSS

## 核心业务结构

### 三个主 Tab（userinsight.html）

**1. 渠道效果 (channel-effect)**
- 筛选栏：时间范围、意向车系、渠道名称、媒体名称、大项目、落地平台（多选）、筛选门店（弹窗式）、线索等级（多选10级）、原因类型大类/类型（联动）、时间维度切换
- KPI 卡片组：线索统计、通话统计、线索分类、用户分级、行为转化（Plan B 动态渲染）
- 意向车系占比、线索有效占比、线索级别占比（conic-gradient 饼图）
- 城市投放效果（横向条形图，Top 10/20 切换）
- 渠道线索质量（横向条形图，10级堆叠，点击下钻大区）
- 大项目线索质量排名（水平条形图，支持 HAB/到店/试驾/锁单切换，柱长按总量归一化）
- 媒体线索质量排名（同上）
- 大区投放效果、小区投放效果、质量标签分布
- 触媒习惯：渠道分析 + 媒体分析（首次/末次留资、重合度、旅程筛选）

**2. 培育运营 (cultivation-op)**
- 筛选栏（结构同渠道效果 + 分类多选 + 清洗方式多选）
- KPI 卡片：线索统计、关注范围、跟进过程、通话统计、用户分级、行为转化
- 大区/小区/城市投放效果 + 大项目/媒体线索质量排名
- 总部培育跟进过程 & 门店虚拟号跟进过程（Tab 切换）
  - 呼叫线索：呼叫次数、通话时长、呼叫时段（10段，左右两列）
  - 接通线索：接通次数、接通时段（10段）
  - 激活下发线索：10级饼图
- 用户关注点卡片（价格/产品/服务/竞品），可点击二级下钻
- 回访结果分析
- 首次触达到成交门店分析

**3. 用户群体洞察 (user-group-insight)**
- 筛选栏（结构同渠道效果）
- KPI 卡片：线索统计
- 用户画像分布 + 关注话题热力图
- 竞品对比 + 抗拒原因

### 筛选栏结构（所有 Tab 通用）

| 筛选器 | 类型 | 说明 |
|--------|------|------|
| 时间范围 | 快捷按钮 + 自定义日期 | 7/30/90天 + 自定义 |
| 意向车系 | 下拉单选 | N7/N6/天籁鸿蒙/NX8 |
| 渠道名称 | 下拉单选 | R1-R11 |
| 媒体名称 | 搜索输入框 | 关键字模糊匹配 |
| 大项目 | 搜索输入框 | 关键字查询 |
| 落地平台 | 多选下拉 | 官网/小程序/app，默认全选 |
| 筛选门店 | 弹窗式 | 树形菜单（按大小区/按省市区）+ 模糊搜索 |
| 线索等级 | 多选下拉 | 10级，默认全选 |
| 原因类型大类/类型 | 联动下拉 | 大类切换 → 类型选项联动 |
| 时间维度切换 | 下拉 | 转化维度/线索日期 |
| 分类* | 多选下拉 | 新线索/总部休眠/异地回流/休眠回流/暂败回流 |
| 清洗方式* | 多选下拉 | 人工/AI-冰兰/AI-一知/AI-科大 |
| 查询/重置/下载明细 | 按钮 | 模拟反馈 |

*分类和清洗方式仅在培育运营 Tab 显示。

### 弹窗/抽屉（7 个）

| 弹窗 ID | 标题 | 触发方式 |
|---------|------|---------|
| `storeFilterOverlay` | 筛选门店 | 筛选栏「筛选门店」按钮 |
| `focusDrillDownModal` | 二级关注点分布 | 培育运营关注点卡片点击 |
| `cityStoreModal` | 城市专营店意向等级分布 | 城市投放效果柱状图点击 |
| `regionChannelModal` | 大区渠道质量分布 | 渠道质量柱状图点击 (R1-R11) |
| `projectDrillModal` | 大项目线索质量分布 | 大项目排名列表点击 |
| `scheduleDrillModal` | 媒体线索质量分布 | 媒体排名列表点击 |
| `rankingModal` | 全量排行榜 | 全量排行按钮点击 |

所有弹窗通过 `data-modal-id` 属性委托关闭，点击遮罩也可关闭。`storeFilterOverlay` 使用独立的关闭逻辑。

## JavaScript 逻辑地图

`script.js` 是看板核心逻辑，组织如下：

### 初始化（DOMContentLoaded）
```js
initReasonTypeFilter()              // 原因类型联动下拉
initDateRange()                     // 日期范围快捷选择 + 自定义
initFilterMultiSelects()            // 多选下拉通用初始化（线索等级/落地平台/分类/清洗方式）
initGlobalFilters()                 // 查询/重置按钮
reorderCultivationDeliveryCharts()  // 培育运营图表顺序重排
alignChannelQualityLeadLevels()     // 渠道线索质量图例 + 堆叠段渲染为10级
convertCultivationChartsToHorizontal() // 纵向堆叠图 → 横向条形图
initChannelJourneyFilter()          // 渠道旅程筛选（首次/末次留资渠道联动）
initMediaJourneyFilter()            // 媒体旅程筛选（首次/末次留资媒体联动）
initCultivationScaledCharts()       // 培育运营图表缩放
initRankInteraction({...})          // 大项目排名交互（参数化）
initRankInteraction({...})          // 媒体质量排名交互（参数化）
initStoreFilters()                  // 门店筛选弹窗预初始化
initDynamicRender()                 // KPI卡片 + 饼图动态渲染
```

### 核心工具函数
- `formatDate(date)` / `formatTimestamp(date)` — 日期格式化
- `parseUserCount(text)` — 从文本提取人数
- `pctNum(part, total)` / `pctStr(part, total)` — 百分比计算
- `findCard(title, options)` — 按标题查找卡片
- `closeModal(id)` — 通用弹窗关闭
- `showNotification(msg, type)` — Toast 提示
- `resetDateRange(group)` / `resetGlobalFilters(section)` — 筛选重置
- `trendHtml(trend, tv)` — 趋势 HTML 渲染

### 10级线索等级体系

项目调整为 10 级，与 `MOCK.leadLevels` 完全对齐：

| 索引 | 等级 | 数据 key | 颜色 |
|------|------|---------|------|
| 0 | H-试驾排程单 | hSchedule | #b91c1c |
| 1 | H-试驾线索单 | hLead | #ef4444 |
| 2 | H-非试驾线索单 | hNonTest | #fb7185 |
| 3 | A | a | #f59e0b |
| 4 | B | b | #3b82f6 |
| 5 | C-意向不明 | cUnclear | #14b8a6 |
| 6 | C-无法接通 | cUnreachable | #67e8f9 |
| 7 | F-战败 | f | #8b5cf6 |
| 8 | L-休眠 | l | #ec4899 |
| 9 | E-意向含糊 | e | #84cc16 |

关键常量：
- `LEVEL_COLORS` — 10级 hex 颜色映射
- `LEVEL_LABELS` — `[{key, label}]` 数组，label 从 `MOCK.leadLevels` 动态获取

辅助函数：
- `storeLevel(s, key)` — 安全属性访问
- `storeHTotal(s)` — hSchedule + hLead + hNonTest
- `storeCTotal(s)` — cUnclear + cUnreachable
- `storeTotal(s)` — s.total
- `storeHabTotal(s)` — H+A+B 合计
- `maxStoreTotal(stores)` — 门店数组的最大总量（用于柱长归一化）

### 多选筛选器（通用化）

`initFilterMultiSelects()` 使用完全通用的选择器，不依赖具体 CSS 类名：
- 全选：`input[type="checkbox"][value="all"]`
- 选项：`input[type="checkbox"]:not([value="all"])`
- 文本：`.select-header span`

添加新的多选筛选器只需在 HTML 中放入 `.custom-multi-select` 结构，JS 自动处理。

### 排名与下钻
- `initRankInteraction(config)` — 参数化排名交互（柱长按总量归一化）
- `renderRankList(data, labelText, metric)` — 排名列表渲染，柱长 = `count / maxCount × 100%`
- `showProjectDrillModal(code)` — 大项目下钻，复用 `renderDrillContent()`
- `showScheduleDrillModal(code)` — 媒体下钻，复用 `renderDrillContent()`
- `renderDrillContent(channels)` — 通用下钻渲染（大区→小区→门店）
- `generateStoreCard(store, areaLabel, maxTotal)` — 门店卡片，10级迷你条形图，柱长按 maxTotal 归一化

### 弹窗逻辑
- `showCityStoreModal(name)` — 城市专营店分布
- `showRegionChannelModal(code)` — 大区渠道质量分布（R1-R11 下钻）
- `openFocusDrillDown(cat)` — 关注点二级下钻
- `openFullRanking(type)` — 全量排行榜（支持多种 type 前缀匹配）
- `openStoreFilterModal(btn)` — 门店筛选弹窗（树形菜单 + 模糊搜索）
- `initDrillTabSwitch(containerSelector)` — 通用下钻 Tab 切换

### 门店筛选弹窗
- 树形菜单：按大小区（2级）/ 按省市区选择（3级）
- 模糊搜索：全量 591 家门店名称搜索
- 多选：累计选择状态，全选/取消全选
- 数据来自 `MOCK.hierarchy`（大区→小区→省份→城市→县区→门店）

### 下载功能
- `downloadChannelEffectDetail()` — 异步下载渠道效果明细 CSV
- `simulateAsyncDownload(data)` — Promise + setTimeout 模拟异步
- `generateCsv(data)` — 数组转 CSV
- `downloadFile(content, filename, mimeType)` — Blob + URL.createObjectURL

### 动态渲染（Plan B）
- `renderKpiCards()` — KPI 卡片从 `kpiPageData` 动态渲染
- `renderLeadLevelPie()` — 线索级别饼图从 `pieOverrideData` 动态渲染
- `initDynamicRender()` — 页面加载后延迟触发

### 事件委托
- `[data-modal-id]` 点击 → 关闭对应弹窗
- `.project-bar-item` / `.schedule-bar-item` 点击 → 项目/媒体下钻
- `.ce-dim-btn` 点击 → 维度切换（Top 10/20、排名指标）
- `#channelVChart .ce-v-bar-item` 点击 → 大区渠道质量下钻
- `#regionVChart .ce-v-bar-item` 点击 → 城市专营店下钻
- 关注点卡片 `onclick` → 二级下钻
- 触媒/触店 Tab 切换

## 数据和状态约定

- 数据全部为 Mock，来源：`mock.js`（`MOCK` 命名空间，12 个模块）+ HTML 内静态节点
- `MOCK` 模块：`TOTAL_CULTIVATION_USERS`、`channels`、`intentSeries`、`leadLevels`、`focusSubTags`、`quality`、`resistance`、`areaDelivery`、`touchMedia`、`store`、`project`、`schedule`、`kpi`、`download`、`hierarchy`
- 向后兼容别名：`const qualityFullData = MOCK.quality.fullData;` 等，新代码直接使用 `MOCK.xxx.xxx`
- 筛选栏不执行真实过滤，仅模拟 loading/刷新反馈
- 趋势数值使用随机波动，不保证前后一致
- 弹窗通过 `.classList.add('active')` / `.remove('active')` 控制显示

## 样式约定

- 主色 `--primary-color: #0081ff`，定义在 `style.css :root`
- 布局：后台系统风格 — 左侧 sidebar + 顶部 header + 白色卡片 + 浅灰背景
- 图标：Font Awesome 6.4.0；字体：Google Fonts Inter / Noto Sans SC
- 筛选/图表等存在较多 inline style（原型遗留），新增样式优先放 `style.css`
- 关键组件类名：`.app-container`、`.sidebar`、`.main-wrapper`、`.filter-section`、`.content-card`、`.card-header`、`.drawer-overlay`、`.drawer-container`、`.custom-multi-select`、`.journey-search-select`、`.ce-v-chart-container`、`.ce-h-bar-item`、`.follow-analysis-card`、`.rank-badge`、`.status-tag`

## 修改原则

- 保持纯静态原型形态，不引入框架/构建工具/后端依赖
- 修改前确认 DOM id/class 是否被 `script.js` 硬编码引用
- 修改表格列、排行卡片时，同步检查相关排序、下钻和 modal 渲染函数
- 新增页面：复用 `style.css` 现有样式；加入 `main.html` 需在导航数组注册
- Mock 数据保持中文业务语义，下钻数据使用 10 级属性名（`hSchedule` 等，非旧版 `h`/`c`）
- 避免大规模重排 `userinsight.html`，它是长静态页面，局部修改更安全
- 新增通用函数优先考虑复用（参考 `renderDrillContent`、`generateStoreCard`、`initRankInteraction`、`initFilterMultiSelects` 模式）
- 筛选栏修改需同步 3 个 Tab（使用 `replace_all: true`）
- 线索等级显示必须与 `MOCK.leadLevels` 对齐，优先使用 `LEVEL_LABELS` 动态渲染

## 验证清单

- `index.html` — 密码输入、回车、失败抖动、成功跳转
- `main.html` — Tab 切换 iframe（用户洞察 / 交互说明）
- `userinsight.html` — 三个主 Tab 切换、日期快捷选择、查询按钮 Toast 反馈、重置按钮
- 筛选栏 — 所有多选下拉展开/收起、全选/取消、文本更新；门店筛选弹窗树形菜单 + 搜索
- 排行切换 — Top 10/20、HAB/到店/试驾/锁单指标切换
- 弹窗 — 7 个弹窗的打开、关闭、点击遮罩关闭、Tab 切换
- 下钻 — 大项目/媒体/大区/城市的区域→小区→门店层级导航，门店卡片柱长反映总量差异
- 触媒/触店 Tab 切换 + 旅程筛选联动
- 培育运营关注点二级下钻 + 总部/门店跟进过程切换
- 全量排行榜多种类型切换
- 下载明细按钮异步下载 CSV

## 已知风险

- 大量 inline style + inline JS（`onclick=` 属性），局部选择器变动容易影响交互
- 多个 `DOMContentLoaded` / 事件监听分散，新增初始化逻辑时避免重复绑定
- 部分功能使用 `alert`、随机数和静态 DOM 模拟，演示稳定性优先于数据准确性
- 静态密码仅用于原型演示，不具备真实安全性
- 网络受限时 CDN 图标和字体可能无法加载
- `workbench.html` 完全独立，不共享 `script.js`/`mock.js`/`style.css`
- 脚本加载顺序：`mock.js` → `script.js`，`MOCK` 在 `script.js` 顶层代码中可用
