# 用户洞察产品原型（user_insight_pm v1.0）审计报告

本审计报告对东风日产企微助手“用户洞察”静态产品原型的架构设计、工程规范、业务逻辑一致性、UI/UX 交互体验及潜在技术债务进行了全面审计与评估。本原型作为演示系统，核心目标是为产品经理和业务部门提供高拟真度、高可用、高稳定性的数据看板。

---

## 1. 审计摘要

### 核心亮点
* **卓越的职责拆分架构**：尽管是无构建步骤的原生静态系统，业务 JavaScript 代码仍按职责划分为筛选、旅程、弹窗、门店、下载和统计说明等模块，实现了优良的模块化。
* **高水准的本地防御性验证**：引入了自定义的工程校验脚本 [validate-project.js](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm v1.0/tools/validate-project.js)，可自动化校验资源引用、HTML 嵌套闭合以及标注目标，大幅降低了协作修改中的失误风险。
* **极具表现力的原生 SVG 桑基图**：利用轻量级的 SVG 流向路径渲染实现了触媒/触店习惯流向，并利用 Top20 收纳与全部视图分页控制，巧妙地规避了海量 SVG 节点渲染带来的卡顿和页面空白。
* **拟真交互极其细致**：支持 10 级线索筛选、原因类型联动、树形省市区门店筛选、基于 CSV 的模拟异步下载及体验友好的 Toast 反馈。

### 主要风险与优化建议
* **全局作用域污染隐患**：由于采用原生脚本逐个引入的模式，所有业务逻辑、Mock 数据、状态变量和初始化程序均直接绑定至全局 `window` 作用域，存在全局变量冲突与命名覆盖风险。
* **DOM 与 JS 的强耦合**：页面包含较多 inline style 和 inline `onclick` 回调，这给后续原型升级或向 React / Vue 现代框架的重构增加了极高的成本。
* **强依赖外部 CDN 资源**：页面渲染强烈依赖外部 Google Fonts 和 Font Awesome CDN。如果演示环境处于封闭内网或网络较差，将可能发生图标与字体降级，严重影响演示视觉效果。

---

## 2. 架构与工程规范审计

### 2.1 职责分层结构
系统文件分离逻辑非常清晰：
1. **数据层 (`mock/data.js`)**：全局定义 `MOCK` 命名空间，统一集中存储演示所需的所有静态假数据，为后续后端接口对接预留了清晰的契约定义。
2. **公共逻辑层 (`js/common.js`, `js/nav.js`)**：统一抽取如日期格式化等基础函数，处理主容器的 Tab 切换。
3. **页面业务层 (`js/pages/userinsight/`)**：按功能深度拆分（例如，[filters.js](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm%20v1.0/js/pages/userinsight/filters.js) 负责级联与日期重置，[journeys.js](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm%20v1.0/js/pages/userinsight/journeys.js) 负责桑基图与排行列表，[stores.js](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm%20v1.0/js/pages/userinsight/stores.js) 负责庞大的门店筛选树）。
4. **演示说明层 (`annotations/`)**：与业务完全解耦，采用运行时注入并按页面隔离的标注系统，展示在说明页 [interaction.html](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm%20v1.0/docs/interaction.html)。

### 2.2 防御性自动化校验
[validate-project.js](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm v1.0/tools/validate-project.js) 的设计极为巧妙，建议在未来的静态原型项目中推广。它实现了：
* **静态语法校验**：使用 `node --check` 对项目内的所有 JS 文件做词法分析，在不执行代码的前提下，第一时间暴露语法拼写错误。
* **HTML/CSS 引用校验**：深度遍历本地的 `href` 和 `src`，验证路径的真实存在性，防止拼写导致 404 死链。
* **结构树合规性校验**：通过正则引擎过滤注释及标签后对 `div` 进行入栈出栈验证，不仅能精准定位到未闭合元素的行号，还强制要求了 `tab-pane` 必须是 `tab-content` 的直接子节点。
* **标注与取值逻辑的一致性校验**：使用 Node.js `vm` 运行沙箱，直接导入标注数据，核对并校验 DOM 绑定位置。

### 2.3 CDN 依赖可用性分析
* **现状**：HTML 引入了外部 `Google Fonts` (Inter & Noto Sans SC) 与 `Font Awesome 6.4.0` (all.min.css)。
* **隐患**：若在无网环境（如保密的封闭演示会、离线网络沙箱）中操作，将会出现网络超时，并且由于缺乏本地兜底字体及图标包，所有图标将直接破损（显示为空白或乱码小方块），视觉 WOW 体验大打折扣。
* **优化策略**：可考虑将核心字体和图标库通过 `npm` 包下载，或者离线下载到本地 `assets/vendor/` 中，从而实现原型的完全离线演示。

---

## 3. 业务逻辑与数据一致性审计

### 3.1 10级线索体系对齐度评估
业务约定的 10 级线索如下：
`hSchedule`, `hLead`, `hNonTest`, `a`, `b`, `cUnclear`, `cUnreachable`, `f`, `l`, `e`。

* **一致性实现**：
  * Mock 定义中 `MOCK.leadLevels` 提供了完备的 10 级中文名称。
  * [filters.js](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm%20v1.0/js/pages/userinsight/filters.js#L286-L316) 中通过全局的 `LEVEL_COLORS` 及 `LEVEL_LABELS` 与其实现了精准的一致性关联，且提供了兜底静态值。
  * 渠道线索质量堆叠柱状图通过 `alignChannelQualityLeadLevels()` 进行了渲染增强，生成 10 个层级。
  * 下钻卡片 `generateStoreCard` 在构造 10 级线索等级迷你图时，准确解析并归一化了每一层的数据。
* **审计结果**：10级线索设计在底层数据结构与前端渲染层中实现了完美闭环，无数据错漏。

### 3.2 培育运营“双口径”跟进算法审计
依据 [business-rules.md](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm%20v1.0/memory/business-rules.md#L39-L46)，总部培育与门店虚拟号跟进需要严格区别线索去重维度（主值）与通话记录维度（副指标）。

* **算法设计审计**：
  * **主指标（线索维度）**：`呼叫线索`（至少外呼一次的去重线索数），`接通线索`（至少接通一次的去重线索数）。
  * **副指标（通话维度）**：`呼叫次数`（外呼次数累计值），`接通次数`（通话时长 > 0 的外呼总数）。
  * **转化率定义**：
    * 通话接通率 = 接通次数 ÷ 呼叫次数
    * 线索接通率 = 接通线索 ÷ 呼叫线索
* **数据校验**：
  * 模拟数据有效维护了“呼叫次数 >= 接通次数”及“呼叫线索 >= 接通线索”的关系。
  * 总部培育和门店虚拟号布局均舍弃了传统的走势柱状图，全量改用了数据列表形式呈现，且将呼叫时段细项和接通时段细项做了合理的左右分列设计。
* **审计结果**：满足精细化业务指标核对要求，口径与原型呈现一致。

### 3.3 触媒/触店习惯桑基图实现深度审计
* **设计精妙之处**：
  * **原生 SVG 渲染**：利用 CSS 样式的 `.sankey-link` (`stroke-width` 反映线索量) 和 `.sankey-node-label` 构建出了具备高扩展度的桑基流向。
  * **防渲染崩溃机制**：
    * 在媒体桑基图 (`renderInteractiveMediaSankey`) 以及门店桑基图中，由于下游节点可能有上百个，如果一次性绘制会导致页面加载卡顿且产生巨大的垂直空白。
    * 审计发现，系统引入了 `Top20`、`Top50` 和 `全部` 展示范围。在选择 `全部` 时，巧妙配置了 `pageSize = 50` 的前端分页，超出的媒体归于 `其他媒体` 节点下。这极大地保证了浏览器渲染的性能和美观。
  * **交互性**：左侧首次留资节点具备 `onclick` 与 `keydown` 监听器，点击可以实时重绘 SVG，流向动画过度平稳。

---

## 4. UI/UX 及演示拟真度审计

### 4.1 门店树形筛选器 (Store Filter Modal)
* 门店树形筛选支持“按大区-小区”两级管理和“省-市-县/区”三级地区筛选，同时为所有专营店（591家）提供了即时模糊搜索。
* 在交互上做到了“累计选择状态”同步，即在搜索或在不同 Tab 之间切换时，临时选中的状态不丢失，只有在点击“确认”后才最终更新，提供了极佳的拟真操作体验。
* 唯一需要注意的边界条件是：在“首触”专营店的特定模式下，仅允许单选，组件中利用 `isSingleStoreSelection()` 做了条件判定并隐藏了“全选”按钮，逻辑非常严密。

### 4.2 响应式和图表等宽对齐 (Fidelity in Scale)
* 原型对于排版有较高的自适应要求。在 [filters.js](file:///Users/huhaowen/Documents/35-用户洞察/user_insight_pm%20v1.0/js/pages/userinsight/filters.js#L329-L403) 中引入的 `scaleCultivationHorizontalBars()`，在页面初始化时对大区投放、城市投放等排名的条形图进行了水平柱状长度的动态缩放。
* 它以当前视窗/数据集内最大数值为分母，通过百分比样式设置柱状宽度比例，解决了静态原型页面常有的“图表数据与柱子长度对不上”的问题。

### 4.3 演示细节优化
* 页面中对“下载明细”功能利用 `setTimeout` 异步模拟加载，并产生真实的带有 CSV 格式的明细数据 Blob 供浏览器下载。
* 级联筛选条件：在第一 Tab 中，“原因大类”与“原因类型”具有严格的从属选择关系，联动切换十分顺畅。

---

## 5. 潜在技术债务与代码重构建议

### 5.1 代码异味 (Code Smells) 与架构优化建议

| 潜在风险点 | 业务影响 | 长期架构隐患 | 优化建议 |
| :--- | :--- | :--- | :--- |
| **全局作用域泛滥** | 挂载了大量全局函数及状态变量，如 `storeFilterState` | 随着原型的庞大或对接真实系统，很容易产生变量命名冲突。 | 在每个 JS 脚本内使用立即执行函数（IIFE）或将公共状态绑定到统一的原型上下文对象下。 |
| **DOM 与事件逻辑强耦合** | HTML 节点包含大量类似 `onclick="closeModal('rankingModal')"` 的行内 JS。 | 难以实施有效的单元测试，在转向模块化现代前端框架时需要全量人工重构。 | 改为使用原生事件委托（`addEventListener`）处理，保持结构与行为的分离。 |
| **样式覆盖与污染** | `userinsight-overrides.css` 具有较多 Ad-hoc (特设的) inline style。 | 缺乏集中的 CSS 设计变量隔离（CSS Variables），修改配色极其困难。 | 规范化使用 `:root` 变量声明颜色和字号，移除标签内的行内样式。 |

---

## 6. 未来生产落地重构指南

若该原型在评审通过后被批准正式立项进入生产环境开发，我们推荐采用以下重构路线：

### 阶段一：前端框架组件化（Vue 3 / React）
1. **统一状态管理**：使用 Pinia (Vue) 或 Redux / Zustand (React) 统一管理全局的筛选条件（日期、门店树、车系）以及当前 Tab 的高亮状态。
2. **组件抽取**：
   * 将多选下拉、树状专营店选择器重构为通用 UI 组件。
   * 将原生 SVG 桑基图抽取为高阶图形组件，利用数据驱动（D3-Sankey 或原生 SVG 模板语法）重新绑定。
3. **样式隔离**：引入 TailwindCSS 或 CSS Modules，统一在全局配置文件中指定品牌色（主色 `--primary-color: #0081ff` 等）。

### 阶段二：接口标准化定义 (API Contract)
* 原型中的 `MOCK` 命名空间数据结构天然适合作为 API 的契约接口模型：
  * 将 `MOCK.channels` 对接后端渠道列表字典接口。
  * 将 `MOCK.store.regionChannel` 与 `MOCK.project.rankData` 重构为基于筛选条件的 POST 接口。
  * 引入分页插件，将桑基图的媒体/专营店的分页提取到后端接口层完成。

---
*审计执行：Antigravity Coding Assistant*
*审计日期：2026-06-29*
