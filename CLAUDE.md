# CLAUDE.md

项目的完整说明、架构、业务规则、修改原则和验证清单统一维护在 [README.md](README.md)。

开始修改前必须：

1. 阅读 `README.md`。
2. 保持纯静态 HTML/CSS/JavaScript 架构，不引入构建工具。
3. 保持 `pages/userinsight.html` 中的脚本加载顺序和全局函数兼容性。
4. 不覆盖业务数据、Mock 记录、标注 ID 或用户未提交修改。
5. 完成后运行：

```bash
node tools/validate-project.js
```
