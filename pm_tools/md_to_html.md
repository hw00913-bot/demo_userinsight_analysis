# Skill: md_to_html — 功能说明文档 MD → 极简风格 HTML

**说明**：  
读取项目根目录的 `功能说明文档.md`，按照固定的极简文档风格生成 `interaction.html`。

## 触发条件
当用户说"生成 interaction.html"、"更新 interaction"、"md 转 html"等时触发。

## HTML 样式规范（固定，不可偏离）

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #f5f5f5; padding: 40px 20px; color: #333; line-height: 1.6; }
.container { max-width: 1000px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 48px; }
h1 { font-size: 24px; font-weight: 600; margin-bottom: 32px; color: #1a1a1a; border-bottom: 2px solid #1677ff; padding-bottom: 12px; }
h2 { font-size: 18px; font-weight: 600; margin: 32px 0 16px; color: #1a1a1a; }
h3 { font-size: 16px; font-weight: 600; margin: 24px 0 12px; color: #333; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14px; }
th, td { border: 1px solid #d9d9d9; padding: 10px 12px; text-align: left; }
th { background: #fafafa; font-weight: 600; color: #333; }
tr:hover { background: #fafafa; }
hr { border: none; border-top: 1px solid #e8e8e8; margin: 24px 0; }
.section-divider { margin: 32px 0; }
p { margin: 8px 0; font-size: 14px; }
strong { color: #333; }
.jump-btn { display: inline-block; padding: 8px 20px; background: #1677ff; color: #fff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; }
.jump-btn:hover { background: #4096ff; text-decoration: none; }
```

## MD → HTML 映射规则

| MD 元素 | HTML 输出 |
|---------|-----------|
| `# 标题` | `<h1>标题</h1>` + `<p style="color:#888;font-size:13px;...">最后更新：日期</p>` |
| `> 最后更新：...` | 提取日期，放入 h1 下方的 `<p>` 副标题 |
| `## 一. xxx` | `<h2>一. xxx</h2>` |
| `## 四. 功能说明` | `<h2>四. 功能说明</h2><hr>` |
| `### N. xxx` | `<h3>N. xxx</h3>` |
| `**1）key：**value` | `<p><strong>1）key：</strong>value</p>` |
| `**5）功能明细**` | `<p><strong>5）功能明细</strong></p>` |
| Markdown 表格 | 标准 `<table><thead><tr><th>...</th></tr></thead><tbody>...</tbody></table>` |
| `---` 分隔线 | 在功能说明板块之间用 `<hr class="section-divider">`；其他位置用 `<hr>` |
| 链接 `[text](url)` | `<a href="url" target="_blank">text</a>` |

## 页面骨架（固定结构）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>智能外呼报表系统 · 功能说明文档</title>
  <style>/* 上述固定样式 */</style>
</head>
<body>
  <div class="container">
    <!-- 右上角跳转按钮 -->
    <div style="text-align: right; margin-bottom: 24px;">
      <a href="index.html" class="jump-btn">跳转演示页面 →</a>
    </div>
    <!-- h1 标题 + 更新日期副标题 -->
    
    <!-- 二. 项目范围 → h2 + table -->
    <!-- 三. 逻辑说明 → h2 + table（链接用 a target=_blank） -->
    <!-- 四. 功能说明 → h2 + hr + h3 子版块（板块间用 hr.section-divider） -->
    <!-- 五. 其他说明 → h2 + h3 子版块 + table -->
  </div>
</body>
</html>
```

## 执行步骤

1. **读取** `功能说明文档.md`（项目根目录）
2. **解析** 5 段结构：一.版本说明 / 二.项目范围 / 三.逻辑说明 / 四.功能说明 / 五.其他说明
3. **按映射规则转换**为极简 HTML：CSS 固定不变，骨架固定不变，仅替换 body 内各 section 的内容
4. **写入** `interaction.html`（项目根目录），覆盖已有文件
5. **通知**用户完成

## 注意事项

- CSS 样式 100% 固定，不可添加额外样式
- HTML 骨架结构 100% 固定（包括右上角跳转按钮、<title> 标签内容）
- 板块间分隔：四.功能说明 下面的 `<h3>` 板块之间使用 `<hr class="section-divider">`；其他位置使用 `<hr>`
- 链接自动加 `target="_blank"`
- `title` 标签统一为「智能外呼报表系统 · 功能说明文档」
- 从 MD blockquote `> 最后更新：YYYY-MM-DD` 中提取日期填入副标题 `<p>`
- 输出编码 UTF-8
