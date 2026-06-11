# 用户洞察产品原型

## 项目定位

这是一个用于东风日产企微助手场景的「用户洞察」静态产品原型，用于演示客服通话数据、线索质量、渠道投放、用户培育和人群画像分析。核心目标是把业务数据组织成可演示的数据看板。

项目为纯静态原型：无构建系统、无后端接口、无框架依赖。交互与数据均为 HTML + CSS + Vanilla JavaScript 模拟。部署于 GitHub Pages。

- **在线地址:** https://hw00913-bot.github.io/demo_userinsight/
- **入口密码:** `dndc2026`

## 根目录结构

| 文件/目录 | 行数 | 说明 |
|-----------|------|------|
| `index.html` | ~30 | 密码验证入口，通过后跳转 `main.html` |
| `main.html` | ~30 | 原型演示容器，顶部 Tab + iframe 加载看板或文档 |
| `pages/userinsight.html` | ~4,200 | 核心看板页面，包含三个主 Tab、统计口径抽屉和弹窗容器 |
| `pages/workbench.html` | ~400 | 独立工作台页面，使用独立样式和逻辑 |
| `docs/interaction.html` | — | 产品交互逻辑说明文档（含标注目录） |
| `docs/decisions.md` | — | 架构决策记录 |
| `docs/requirements.md` | — | 需求说明 |
| `assets/css/app.css` | — | 看板样式入口，按顺序 `@import` 7 个 CSS 模块 |
| `assets/css/userinsight-overrides.css` | — | 看板样式覆盖（直接在 HTML 中加载） |
| `mock/data.js` | ~1,400 | `MOCK` 命名空间，15 个数据模块 + 向后兼容别名 |
| `js/common.js` | — | 公共工具函数（`formatDate`） |
| `js/nav.js` | — | 左侧导航和主分页切换 |
| `js/app.js` | — | 页面初始化入口，`DOMContentLoaded` 集中调度 |
| `js/pages/index.js` | — | 密码验证页逻辑 |
| `js/pages/main.js` | — | 主容器导航注册 |
| `js/pages/interaction-catalog.js` | — | 交互说明页标注目录渲染 |
| `js/pages/interaction-nav.js` | — | 交互说明页导航高亮 |
| `js/pages/workbench.js` | — | 工作台页面逻辑 |
| `js/pages/userinsight/` | — | 看板业务模块（筛选/旅程/弹窗/渲染/门店/下载/统计） |
| `annotations/` | — | 标注系统：数据定义（`annotations.js`）、运行时（`annotation-runtime.js`）、样式（`annotation.css`） |
| `memory/` | — | 项目记忆：业务规则、变更记录、待确认事项、工作原则 |
| `tools/validate-project.js` | — | 项目验证脚本：HTML 结构校验、标注目标校验、资源引用检查 |
| `CLAUDE.md` | — | AI 工具入口，指向本 README |
| `pm_tools/` | — | 产品经理辅助工具（文档转换、交互说明生成等） |

## 运行方式

纯静态文件，可直接用浏览器打开。需要本地服务时：

```bash
python3 -m http.server 8000
# 访问 http://localhost:8000/index.html
```

项目验证：
```bash
node tools/validate-project.js
```

注意：依赖 CDN 加载 Font Awesome 6.4.0 和 Google Fonts (Inter / Noto Sans SC)，离线时图标/字体可能降级。

## 页面关系

- `index.html` → 密码验证 → 跳转 `main.html`
- `main.html` → 顶部导航栏切换 iframe：`pages/userinsight.html` 或 `docs/interaction.html`
- `pages/userinsight.html` → 三个主 Tab：渠道效果 / 培育运营 / 用户群体洞察
- `pages/workbench.html` → 完全独立，不接入看板导航

## 核心业务结构

### 三个主 Tab（pages/userinsight.html）

**1. 渠道效果 (channel-effect)**
- 筛选栏：时间范围、意向车系、渠道名称、媒体名称、大项目、落地平台（多选）、筛选门店（弹窗式）、线索等级（多选10级）、原因类型大类/类型（联动）、时间维度切换
- KPI 卡片组：线索统计、通话统计、线索分类、用户分级、行为转化（Plan B 动态渲染）
- 意向车系占比、线索有效占比、线索级别占比（conic-gradient 饼图）
- 城市投放效果（横向条形图，Top 10/20 切换）
- 渠道线索质量（横向条形图，10级堆叠，点击下钻大区）
- 大项目线索质量排名（水平条形图，支持 HAB/到店/试驾/锁单切换，柱长按总量归一化）
- 媒体线索质量排名（同上）
- 大区投放效果、小区投放效果、质量标签分布
- 触媒/触店习惯与频率更新：渠道分析 + 媒体分析（首次/末次留资、重合度、旅程筛选）、专营店分析、留资次数；标准人数柱状图均展示交车数和交车占比

**2. 培育运营 (cultivation-op)**
- 筛选栏（结构同渠道效果 + 分类多选 + 清洗方式多选）
- KPI 卡片：线索统计、关注范围、跟进过程、通话统计、用户分级、行为转化
- 大区/小区/城市投放效果 + 大项目/媒体线索质量排名
- 总部培育跟进过程 & 门店虚拟号跟进过程（Tab 切换）
  - 呼叫线索：呼叫次数、通话时长、呼叫时段（9/10/11/12/15/16/17/18/19/20 点，左右两列，含接通率）
  - 接通线索：接通次数、接通时段（9/10/11/12/15/16/17/18/19/20 点）
  - 激活下发线索：10级饼图
- 用户关注点卡片（价格/产品/服务/竞品），可点击二级下钻
- 回访结果分析
- 首次触达到成交门店分析

**3. 用户群体洞察 (user-group-insight)**
- 筛选栏（结构同渠道效果）
- KPI 卡片：线索统计
- 用户画像分布：常驻地、用户类型、现有车系、留资次数、意向等级、购车意向、有车概率、置换意向、购车预算
- 偏好与基础画像：功能偏好、配置偏好、年龄购车分布、品牌认知基础、收入水平、家庭构成、用车场景、关注竞品
- 品牌倾向和门店竞争度待定，暂不展示

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

### 弹窗/抽屉（8 个）

| 弹窗 ID | 标题 | 触发方式 |
|---------|------|---------|
| `storeFilterOverlay` | 筛选门店 | 筛选栏「筛选门店」按钮 |
| `focusDrillDownModal` | 二级关注点分布 | 培育运营关注点卡片点击 |
| `cityStoreModal` | 城市专营店意向等级分布 | 城市投放效果柱状图点击 |
| `regionChannelModal` | 大区渠道质量分布 | 渠道质量柱状图点击 (R1-R11) |
| `projectDrillModal` | 大项目线索质量分布 | 大项目排名列表点击 |
| `scheduleDrillModal` | 媒体线索质量分布 | 媒体排名列表点击 |
| `rankingModal` | 全量排行榜 | 全量排行按钮点击 |
| `stats-drawer` | 统计口径说明 | 页面右上角「统计口径」链接 |

所有弹窗通过 `data-modal-id` 属性委托关闭，点击遮罩也可关闭。`storeFilterOverlay` 和 `stats-drawer` 使用独立的关闭逻辑。

## JavaScript 逻辑地图

`js/pages/userinsight/` 按业务职责拆分看板逻辑：

### 初始化（DOMContentLoaded）
```js
initReasonTypeFilter()              // 原因类型联动下拉
initDateRange()                     // 日期范围快捷选择 + 自定义
initFilterMultiSelects()            // 多选下拉通用初始化（线索等级/落地平台/分类/清洗方式）
initGlobalFilters()                 // 查询/重置按钮
reorderCultivationDeliveryCharts()  // 培育运营图表顺序重排
enhanceHierarchyHabLabels()         // 门店层级 HAB 标签增强
alignChannelQualityLeadLevels()     // 渠道线索质量图例 + 堆叠段渲染为10级
convertCultivationChartsToHorizontal() // 纵向堆叠图 → 横向条形图
enhanceOverviewHabLabels()          // 概览 HAB 标签增强
initChannelJourneyFilter()          // 渠道旅程筛选（首次/末次留资渠道联动）
initMediaJourneyFilter()            // 媒体旅程筛选（首次/末次留资媒体联动）
enhanceTouchHabitDeliveryMetrics()  // 触媒习惯交车指标增强
initCultivationScaledCharts()       // 培育运营图表缩放
initRankInteraction({...})          // 大项目排名交互（参数化）
initRankInteraction({...})          // 媒体质量排名交互（参数化）
initStoreFilters()                  // 门店筛选弹窗预初始化（延迟执行）
initDynamicRender()                 // KPI卡片 + 饼图动态渲染（延迟执行）
```

### 核心工具函数

| 函数 | 所在文件 | 说明 |
|------|---------|------|
| `formatDate(date)` | `js/common.js` | 日期格式化为 YYYY-MM-DD |
| `formatTimestamp(date)` | `js/pages/userinsight/downloads.js` | 时间戳格式化 |
| `parseUserCount(text)` | `js/pages/userinsight/filters.js` | 从文本提取人数 |
| `pctNum(part, total)` | `js/pages/userinsight/filters.js` | 百分比数值计算 |
| `pctStr(part, total)` | `js/pages/userinsight/filters.js` | 百分比字符串 |
| `findCard(title, options)` | `js/pages/userinsight/filters.js` | 按标题查找卡片 |
| `closeModal(id)` | `js/pages/userinsight/dialogs.js` | 通用弹窗关闭 |
| `showNotification(msg, type)` | `js/pages/userinsight/filters.js` | Toast 提示 |
| `resetDateRange(group)` | `js/pages/userinsight/filters.js` | 日期筛选重置 |
| `resetGlobalFilters(section)` | `js/pages/userinsight/filters.js` | 全局筛选重置 |
| `trendHtml(trend, tv)` | `js/pages/userinsight/dashboard.js` | 趋势 HTML 渲染 |

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

- 数据全部为 Mock，来源：`mock/data.js`（`MOCK` 命名空间，15 个模块）+ HTML 内静态节点
- `MOCK` 一级模块（共 15 个）：

| 模块 | 说明 |
|------|------|
| `MOCK.TOTAL_CULTIVATION_USERS` | 培育用户总数常量 |
| `MOCK.channels` | 渠道列表 (R1-R11) |
| `MOCK.intentSeries` | 意向车系列表 |
| `MOCK.leadLevels` | 10 级线索等级标签 |
| `MOCK.focusSubTags` | 用户关注点二级细分标签 |
| `MOCK.quality` | 线索质量 — 通话原因分析 `.fullData` |
| `MOCK.resistance` | 战败/休眠 — 原因分析 `.fullData` |
| `MOCK.areaDelivery` | 区域交付 — 大区排行 `.fullData` |
| `MOCK.touchMedia` | 触媒习惯 — `.channelJourney` `.mediaJourney` `.channelOverlap` `.mediaOverlap` |
| `MOCK.store` | 门店数据 — `.cityData` `.regionChannel` `.fullData` |
| `MOCK.project` | 大项目 — `.drillData` `.rankData` (hab/arrival/testdrive/order) |
| `MOCK.schedule` | 媒体质量排名 — `.drillData` `.rankData` (hab/arrival/testdrive/order) |
| `MOCK.kpi` | KPI 卡片 — `.pageData` `.pieOverride` |
| `MOCK.download` | 下载明细 — `.channelEffectDetail` |
| `MOCK.hierarchy` | 层级关系 — 大区→小区→省份→城市→县区→门店树形结构 |

- 向后兼容别名（共 17 个）：`const qualityFullData = MOCK.quality.fullData;` 等，新代码直接使用 `MOCK.xxx.xxx`
- 筛选栏不执行真实过滤，仅模拟 loading/刷新反馈
- 趋势数值使用随机波动，不保证前后一致
- 弹窗通过 `.classList.add('active')` / `.remove('active')` 控制显示

## 样式约定

- 主色 `--primary-color: #0081ff`，定义在 `assets/css/app.css :root`
- 布局：后台系统风格 — 左侧 sidebar + 顶部 header + 白色卡片 + 浅灰背景
- 图标：Font Awesome 6.4.0；字体：Google Fonts Inter / Noto Sans SC
- 筛选/图表等存在较多 inline style（原型遗留），新增样式优先放对应 CSS 模块

### CSS 模块结构

`assets/css/app.css` 按以下顺序 `@import`：

```css
@import url("./base.css");         /* 基础布局与变量 */
@import url("./filters.css");      /* 筛选栏样式 */
@import url("./components.css");   /* 通用组件 */
@import url("./insight.css");      /* 用户群体洞察 */
@import url("./diagnosis.css");     /* 培育运营诊断 */
@import url("./channel.css");      /* 渠道效果 */
@import url("./store-filter.css"); /* 门店筛选弹窗 */
```

此外，`pages/userinsight.html` 直接加载 `userinsight-overrides.css`（看板样式覆盖），其他页面各自引用对应 CSS（`index.css`、`main.css`、`interaction.css`、`workbench.css`）。

- 关键组件类名：`.app-container`、`.sidebar`、`.main-wrapper`、`.filter-section`、`.content-card`、`.card-header`、`.drawer-overlay`、`.drawer-container`、`.custom-multi-select`、`.journey-search-select`、`.ce-v-chart-container`、`.ce-h-bar-item`、`.follow-analysis-card`、`.rank-badge`、`.status-tag`

## 修改原则

- 保持纯静态原型形态，不引入框架/构建工具/后端依赖
- 修改前确认 DOM id/class 是否被 `js/pages/userinsight/` 中的脚本引用
- 修改表格列、排行卡片时，同步检查相关排序、下钻和 modal 渲染函数
- 新增页面：按需复用 `assets/css/app.css`；加入主导航需在 `js/pages/main.js` 注册
- Mock 数据保持中文业务语义，下钻数据使用 10 级属性名（`hSchedule` 等，非旧版 `h`/`c`）
- 避免大规模重排 `pages/userinsight.html`，它是长静态业务页面
- 新增通用函数优先考虑复用（参考 `renderDrillContent`、`generateStoreCard`、`initRankInteraction`、`initFilterMultiSelects` 模式）
- 筛选栏修改需同步 3 个 Tab（使用 `replace_all: true`）
- 线索等级显示必须与 `MOCK.leadLevels` 对齐，优先使用 `LEVEL_LABELS` 动态渲染
- 接到问题先判断属于哪类问题，优先建立通用检查而非逐个修复
- 修改 HTML 结构前必须定位到具体行号和元素 ID，不能凭统计数字推断；改完立刻运行 `node tools/validate-project.js`
- 业务口径（标签名、筛选条件、计算规则）代码中没有时，不能凭空猜测，需要用户提供或确认
- 发现问题时同步检查三个 Tab（渠道效果/培育运营/用户群体洞察）是否有相同问题
- 用户指出"内容在文件里"时，先搜索特征词定位再操作，搜索范围包括注释、隐藏元素、其他文件和 git 历史
- 修改前先读取项目 `memory/` 文件夹了解业务规则、项目结构和历史变更；修改中积累的新认知及时更新到对应记忆文件（`project.md`、`business-rules.md`、`change-log.md`、`open-items.md`），不要仅依赖个人目录缓存

## 工程约束

- 页面采用经典脚本加载，必须保持 `pages/userinsight.html` 中的脚本顺序：
  1. `mock/data.js` — Mock 数据命名空间
  2. `js/common.js` — 公共工具函数
  3. `js/nav.js` — 导航切换
  4. `js/pages/userinsight/filters.js` — 筛选模块
  5. `js/pages/userinsight/journeys.js` — 旅程与排名
  6. `js/pages/userinsight/dialogs.js` — 弹窗逻辑
  7. `js/pages/userinsight/dashboard.js` — KPI 动态渲染
  8. `js/pages/userinsight/stores.js` — 门店筛选
  9. `js/pages/userinsight/downloads.js` — 下载功能
  10. `js/app.js` — 初始化入口（集中调度所有 init 函数）
  11. `js/pages/userinsight/stats.js` — 统计口径抽屉
  12. `annotations/annotations.js` — 标注数据
  13. `annotations/annotation-runtime.js` — 标注运行时渲染
- `mock/data.js` 必须先于所有业务模块加载；标注系统最后加载。
- 页面保留大量 inline `onclick`，相关函数必须继续暴露在全局作用域。
- 下钻数据使用 `hSchedule`、`hLead`、`hNonTest`、`cUnclear`、`cUnreachable`，不要恢复为旧版 `h` / `c`。
- 门店卡片柱长需要按当前数据范围的最大总量归一化。
- `<i>` 图表元素通过 inline `width` 表示数值，不要用通用 CSS 覆盖。
- 新增多选筛选器应复用 `.custom-multi-select` 结构，不添加专用初始化分支。
- 不覆盖或重置现有业务数据、标注 ID、Mock 记录及用户未提交修改。

## 验证清单

- `index.html` — 密码输入、回车、失败抖动、成功跳转
- `main.html` — Tab 切换 iframe（用户洞察 / 交互说明）
- `pages/userinsight.html` — 三个主 Tab 切换、日期快捷选择、查询按钮 Toast 反馈、重置按钮
- 筛选栏 — 所有多选下拉展开/收起、全选/取消、文本更新；门店筛选弹窗树形菜单 + 搜索
- 排行切换 — Top 10/20、HAB/到店/试驾/锁单指标切换
- 弹窗 — 8 个弹窗/抽屉的打开、关闭、点击遮罩关闭、Tab 切换
- 统计口径抽屉 — 三个 Tab 切换（渠道效果/培育运营/用户群体洞察）、页面内统计口径链接联动打开
- 下钻 — 大项目/媒体/大区/城市的区域→小区→门店层级导航，门店卡片柱长反映总量差异
- 触媒/触店 Tab 切换 + 旅程筛选联动
- 培育运营关注点二级下钻 + 总部/门店跟进过程切换
- 全量排行榜多种类型切换
- 下载明细按钮异步下载 CSV
- 标注系统 — 标注标记渲染、悬停显示详情、拖动标记位置、双击复位
- `node tools/validate-project.js` — 通过所有校验（HTML 结构 / 标注目标 / 本地资源）

## 已知风险

- 大量 inline style + inline JS（`onclick=` 属性），局部选择器变动容易影响交互
- 多个 `DOMContentLoaded` / 事件监听分散，新增初始化逻辑时避免重复绑定
- 部分功能使用 `alert`、随机数和静态 DOM 模拟，演示稳定性优先于数据准确性
- 静态密码仅用于原型演示，不具备真实安全性
- 网络受限时 CDN 图标和字体可能无法加载
- `pages/workbench.html` 完全独立，不共享用户洞察页面的业务脚本、Mock 数据和主样式
- 脚本加载顺序以 `pages/userinsight.html` 中声明的模块顺序为准，标注系统最后加载
- `js/app.js` 不是最后一个脚本——`stats.js` 和标注系统在其之后加载，因为这些模块依赖 DOM 完全就绪
- 标注系统运行时通过 `data-anno` 属性在 DOM 中查找锚点，修改 HTML 结构时需确保标注锚点不被破坏
