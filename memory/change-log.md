# 项目变更记录

## 2026-06-05

- 将现有静态原型迁移为标准目录结构。
- 将主样式迁入 `assets/css/app.css`。
- 将 Mock 数据迁入 `mock/data.js`。
- 将原 `script.js` 拆分为公共工具、导航、页面逻辑和启动入口。
- 将交互说明迁入 `docs/interaction.html`。
- 将标注资源迁入 `annotations/` 并更新全部页面引用。
- 完成 JavaScript、静态资源路径和浏览器回归检查。
- 第三阶段将业务页面归档至 `pages/`。
- 将用户洞察脚本进一步拆分为 7 个职责模块。
- 将用户洞察样式拆分为 7 个 CSS 模块，由 `assets/css/app.css` 按原顺序导入。
- 将入口、主容器、工作台和交互文档的内联 CSS/JS 外置。
- 新增 `tools/validate-project.js`，统一校验标准目录、本地资源引用和 JavaScript 语法。
- 将 `agent.md` 和 `CLAUDE.md` 的重复内容合并到 `README.md`；`CLAUDE.md` 仅保留工具入口和强制约束。

## 2026-06-06

- 按 DCC 培育任务参考图重建 `pages/workbench.html`。
- 新增预测画像页签和客户智能概览，保留回访记录、客户档案及 AI 画像页签。
- 新增预测画像宽面板展开、遮罩关闭和 Esc 收起交互。
- 调整购买预测、品牌倾向、功能偏好、配置偏好及留资记录字段。
- 删除门店竞争度、关注车系排名和关注品牌排名。
- 将留资记录优化为最近一次留资信息卡和第一次留资渠道链路卡。
- 完成项目校验及工作台浏览器视觉、折叠、页签和展开交互回归。
- 删除已停用的 `.workbuddy/` 历史记忆目录，项目记忆统一由 `memory/` 维护。
- 为培育工作台新增 11 条功能标注，覆盖任务、线索、回访、坐席工具、预测画像及留资记录。
- 交互说明页标注目录新增“培育工作台”分组，并增加标注版本键避免旧浏览器缓存覆盖新标注。
- 修复用户群体洞察分页被嵌套在培育运营面板内导致空白的问题。
- 恢复统计口径说明的渠道效果、培育运营、用户群体洞察三个分页及主页面联动。
- 将 HTML 校验从全文件 `<div>` 数量比较升级为层级栈检查，并校验用户洞察三个主分页必须直属 `.tab-content`。

## 2026-06-07

- 修复 `js/pages/userinsight/downloads.js` 中已废弃的 `unescape` 函数，替换为 UTF-8 手动编码。
- 修复 `js/pages/userinsight/filters.js` 中自定义日期范围验证，增加空值和 Invalid Date 检查。
- 将 `js/app.js` 中 `setTimeout(50)` 改为双重 `requestAnimationFrame` 以确保样式就绪。
- 为标注标记新增拖动功能（`annotations/annotation-runtime.js`）：mousedown/move/up + dblclick 复位，使用 IIFE 闭包修复 for 循环中 var 作用域问题。
- 为培育运营 Tab 新增 16 个 `data-anno` 属性，覆盖此前缺失的标注目标。
- 重构统计口径说明面板：渠道效果（统一表格 + 触媒习惯/触店习惯/频率更新）、培育运营（KPI 口径更新、总部/门店拆分、回访分析重构）。
- 修复用户群体洞察 Tab 空白问题（分页被嵌套在培育运营面板内）。
- README.md 新增 5 条修改原则：问题分类优先、HTML 定位到行号、业务口径不猜测、三 Tab 同步检查、内容在文件时先搜索。

## 2026-06-07

- README.md 根目录结构表全量更新：修正行数、补充缺失文件（stats.js、annotations/、memory/、CSS 模块等）。
- README.md MOCK 模块从 12 个更正为 15 个，新增模块说明表。
- README.md 初始化函数列表补充 3 个缺失函数（enhanceHierarchyHabLabels、enhanceOverviewHabLabels、enhanceTouchHabitDeliveryMetrics）。
- README.md 核心工具函数从平铺列表改为表格，标注每个函数的实际所在文件。
- README.md 弹窗数量从 7 个更新为 8 个（新增统计口径抽屉）。
- README.md 脚本加载顺序更新为 13 步完整列表，修正"app.js 最后加载"的旧说法。
- README.md 新增 CSS 模块结构表和标注系统验证项。
- 项目 memory/ 工作原则新增：项目记忆优先更新到项目文件夹、修改前读取 memory/ 文件。
