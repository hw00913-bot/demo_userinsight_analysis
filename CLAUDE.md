# CLAUDE.md

项目的完整说明、架构、业务规则、修改原则和验证清单统一维护在 [README.md](README.md)。

开始修改前必须：

1. 阅读 `README.md`。
2. 保持纯静态 HTML/CSS/JavaScript 架构，不引入构建工具。
3. 保持 `pages/userinsight.html` 中的脚本加载顺序和全局函数兼容性。
4. 不覆盖业务数据、Mock 记录、标注 ID 或用户未提交修改。
5. 业务、Mock、文档、记忆和标注工具分别维护；涉及口径或交互变化时同步更新 `annotations/annotations.js`、`docs/interaction.html` 和 `memory/`。
6. 完成后运行：

```bash
node tools/validate-project.js
```

## 当前重点

- 触媒/触店习惯中的「首次到末次留资渠道」「首次到末次留资媒体」「首触-成交专营店」均以一级入口 + 二级右侧抽屉桑基图呈现。
- 桑基图使用原生 SVG，不引入 ECharts 等新依赖；桑基图抽屉桌面宽度为页面 `80vw`。
- 大量媒体/专营店的「全部」视图采用分页渲染，避免一次性生成过高 SVG 导致页面空白。
- 培育运营的总部培育跟进过程和门店虚拟号跟进过程使用数据列表式过程分析，不显示统计柱。
- 培育跟进中，呼叫线索按「呼叫次数 / 通话时长 / 呼叫时段」三段同一行展示；接通线索按「接通次数 / 接通时段」左右等分展示，并在接通次数、接通时段中展示呼叫次数。

## 标注保存

编辑标注并需要回写 `annotations/annotations.js` 时，启动本地保存服务：

```bash
node annotation-save-server.js
```

访问 `http://127.0.0.1:5178/pages/userinsight.html` 或 `pages/workbench.html` 后保存标注，运行时会通过 `POST /__annotations/save` 回写文件。普通静态服务只能浏览页面，标注保存会先落到浏览器缓存。
