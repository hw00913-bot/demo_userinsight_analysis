# 用户洞察 (User Insight) - 产品原型

## 项目简介

用户洞察是一个用于分析客服通话记录中常见标签、热门问题和客户抗拒点的数据看板系统。

## 包含页面

- `index.html` - 密码验证入口
- `interaction_docs.html` - 交互逻辑说明文档
- `main.html` - 主容器页面
- `userinsight.html` - 用户洞察看板
- `manual_review.html` - 人工复核任务中心
- `manual_review_detail.html` - 人工复核详情页

## 访问密码

`dndc2026`

## 功能特性

### 用户洞察看板 (userinsight.html)

#### 指标卡片
- 通话总数、接通总数、接通率、平均通话时长
- 支持环比数据展示（红色表示增加，绿色表示减少）

#### 标签分类
- **常见标签**：用于识别客户咨询的常见问题（三级标签体系）
- **抗拒点**：用于识别客户拒绝或顾虑的点（二级标签体系）

#### 报表统计
- 按业务类型统计
- 按 R 渠道统计

#### 下载明细数据
导出的 CSV 包含以下字段：
- callid、外呼开始时间、外呼结束时间、主叫号码、被叫号码
- 业务类型、R渠道、大项目、sc值、呼叫类型
- 涉及常见标签1~N（动态多列）
- 涉及抗拒点1~N（动态多列）

> 注：多个标签会拆分为多列显示在同一行，而非拆分多行

### 人工复核 (manual_review.html / manual_review_detail.html)

支持对 AI 打标结果进行人工复核和修正。

## 技术栈

- HTML5
- CSS3
- Vanilla JavaScript

## 在线访问

部署于 GitHub Pages: https://hw00913-bot.github.io/demo_userinsight/