---
name: feature-changelog
description: "This skill should be used when the user wants to generate a feature changelog list (功能清单). The list contains fixed columns: 项目版本号、修订类型、系统、板块、子板块、功能模块、描述、需求来源. Output is formatted as a table suitable for pasting into 腾讯文档 (Tencent Docs). Trigger phrases: 生成功能清单、功能清单、feature changelog、功能变更记录、版本功能列表、功能需求清单、新建功能清单、导出功能清单"
---

# Feature Changelog Skill

生成标准化「功能清单」，包含固定表头字段，并以腾讯文档可直接粘贴的表格形式输出。

---

## 字段说明

参考 `references/field_guide.md` 了解各字段的含义、常见取值和填写规范。

## 工作流程

### Step 1：收集信息

与用户确认以下内容（若已在对话中提供则跳过）：

- **项目版本号**：如 `v1.0.0`、`2026-Q2` 等
- **涉及系统**：如 APP、小程序、管理后台、Web 端等
- **功能条目**：每条包含：修订类型、板块、子板块、功能模块、描述、需求来源

> 若用户信息不完整，可先用已有信息生成草稿，未填写字段留空。

### Step 2：生成功能清单数据

调用 `scripts/generate_changelog.py`，传入功能条目数据，生成结构化输出。

**脚本用法：**

```bash
python3 scripts/generate_changelog.py --input data.json --format markdown
python3 scripts/generate_changelog.py --input data.json --format csv
```

也可直接在对话中构建功能清单数据并调用脚本。

如无脚本执行环境，直接在对话中生成符合要求的 Markdown 表格。

### Step 3：以腾讯文档表格格式输出

在回复中用以下方式输出，方便用户复制粘贴到腾讯文档：

1. **Markdown 表格**（直接可粘贴到腾讯文档，自动识别为表格）
2. **提示用户**："可直接复制上方表格，粘贴到腾讯文档，腾讯文档会自动将 Markdown 表格转为格式化表格。"
3. 如有必要，同时提供 CSV 格式供 Excel/腾讯表格导入。

### Step 4：功能清单表格格式

固定表头顺序如下，**不得增减或调整列顺序**：

| 项目版本号 | 修订类型 | 系统 | 板块 | 子板块 | 功能模块 | 描述 | 需求来源 |
|-----------|---------|------|------|--------|---------|------|---------|

---

## 输出示例

```markdown
| 项目版本号 | 修订类型 | 系统 | 板块 | 子板块 | 功能模块 | 描述 | 需求来源 |
|-----------|---------|------|------|--------|---------|------|---------|
| v1.0.0 | 新增 | APP | 用户中心 | 账户管理 | 修改密码 | 用户可在个人中心修改登录密码 | 产品规划 |
| v1.0.0 | 优化 | 管理后台 | 数据报表 | 日报 | 导出功能 | 支持将日报数据导出为 Excel | 运营反馈 |
```

---

## 注意事项

- 修订类型字段仅允许使用：新增、修改、优化、删除、修复
- 描述字段应简洁明了，一句话说清功能用途
- 若用户提供 Excel/CSV 数据，先读取再格式化输出
- 输出完毕后询问用户是否需要导出为 CSV 文件