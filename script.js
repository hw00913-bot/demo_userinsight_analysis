// Toggle navigation groups
document.querySelectorAll('.nav-group-header').forEach(header => {
    header.addEventListener('click', () => {
        const navGroup = header.closest('.nav-group');
        navGroup.classList.toggle('open');
    });
});

// Tab 切换功能
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// 初始化日期区间为最近30天，并增加约束限制
function initDateRange() {
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    if (!startInput || !endInput) return;

    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    // 设置全局最远和最近限制
    const todayStr = formatDate(today);
    const twoYearsAgoStr = formatDate(twoYearsAgo);

    startInput.min = twoYearsAgoStr;
    startInput.max = todayStr;
    endInput.min = twoYearsAgoStr;
    endInput.max = todayStr;

    // 默认展示最近30天
    const defaultStart = new Date();
    defaultStart.setDate(today.getDate() - 30);
    startInput.value = formatDate(defaultStart);
    endInput.value = todayStr;

    // 日期变更校验逻辑：最大可选3个月
    const validateRange = (changedInput) => {
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);

        if (start > end) {
            if (changedInput === 'start') endInput.value = startInput.value;
            else startInput.value = endInput.value;
            return;
        }

        const maxRange = 92 * 24 * 60 * 60 * 1000; // 约3个月 (92天)
        if (end - start > maxRange) {
            alert('统计日期区间最大可选 3 个月范围');
            if (changedInput === 'start') {
                const newEnd = new Date(start.getTime() + maxRange);
                endInput.value = formatDate(newEnd > today ? today : newEnd);
            } else {
                const newStart = new Date(end.getTime() - maxRange);
                startInput.value = formatDate(newStart < twoYearsAgo ? twoYearsAgo : newStart);
            }
        }
    };

    startInput.addEventListener('change', () => validateRange('start'));
    endInput.addEventListener('change', () => validateRange('end'));
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
    initDateRange();
    initModal();
    initFaqExport();
    initFullDetailExport(); // 初始化全量明细下载
    initReportTableExport(); // 新增：报表表格导出功能
    initGlobalFilters();    // 新增：全局筛选器逻辑
    initMdGeneration();     // 初始化 MD 生成功能
    initFaqModal();
    initTrendModal();
    initHotRankingModal();
    initHotTrendsModal();
});

// 全局筛选器交互逻辑
function initGlobalFilters() {
    const searchBtn = document.querySelector('.filter-section .fa-search')?.parentElement;
    const resetBtn = document.querySelector('.filter-section .fa-rotate-right')?.parentElement;

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showNotification('正在根据“通话开始时间”为您聚合统计数据...', 'info');
            
            // 模拟加载效果和数据变动
            const metrics = document.querySelectorAll('.metric-value');
            metrics.forEach(m => m.style.opacity = '0.5');

            setTimeout(() => {
                metrics.forEach(m => {
                    const original = parseInt(m.textContent.replace(/,/g, ''));
                    // 随机浮动 5% 以内，模拟筛选后的数据变化
                    const newVal = Math.floor(original * (0.95 + Math.random() * 0.1));
                    m.textContent = newVal.toLocaleString();
                    m.style.opacity = '1';
                });

                // 更新趋势图
                if (window.commonAnalyzer) window.commonAnalyzer.renderLineChart();
                if (window.resistanceAnalyzer) window.resistanceAnalyzer.renderLineChart();

                showNotification('数据更新成功（已基于所选时间范围重新取值）', 'success');
            }, 800);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            initDateRange(); // 恢复默认日期
            document.querySelectorAll('.filter-select').forEach(s => s.selectedIndex = 0);
            document.querySelectorAll('.filter-input[type="text"]').forEach(i => i.value = '');
            showNotification('筛选条件已重置', 'info');
        });
    }
}

// 通用报表表格导出逻辑
function initReportTableExport() {
    const exportBtns = document.querySelectorAll('.export-btn:not(.trend-export-btn):not(#downloadFullDetailBtn)');
    
    exportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 支持 .report-section 或 .content-card
            const section = btn.closest('.report-section') || btn.closest('.content-card');
            const titleEl = section.querySelector('.report-title') || section.querySelector('.card-title');
            const title = titleEl ? titleEl.textContent : '报表导出';
            const table = section.querySelector('table');
            if (!table) return;

            // 模拟异步体验
            const originalHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 导出中...';
            showNotification(`已开始为您生成 ${title} 报表，请稍候...`, 'info');

            setTimeout(() => {
                const headerRow = table.querySelector('thead tr');
                const bodyRows = Array.from(table.querySelectorAll('tbody tr'));
                
                // 1. 处理表头：如果表头下方数据包含 count/trend，则拆分表头
                const headers = [];
                const headerCells = Array.from(headerRow.querySelectorAll('th'));
                const columnMap = []; // 标记哪些列需要拆分

                headerCells.forEach((th, idx) => {
                    const text = th.textContent.trim();
                    // 判断该列是否包含 count/trend (通过检查 tbody 第一行同索引列)
                    const sampleCell = bodyRows[0]?.querySelectorAll('td')[idx];
                    if (sampleCell && sampleCell.querySelector('.count') && sampleCell.querySelector('.trend')) {
                        headers.push(`"${text}(数量)"`, `"${text}(环比)"`);
                        columnMap[idx] = 'split';
                    } else {
                        headers.push(`"${text}"`);
                        columnMap[idx] = 'normal';
                    }
                });

                const csvRows = [headers.join(',')];

                // 2. 处理数据行
                bodyRows.forEach(tr => {
                    const rowData = [];
                    const cells = Array.from(tr.querySelectorAll('td, th'));
                    
                    cells.forEach((td, idx) => {
                        if (columnMap[idx] === 'split') {
                            const count = td.querySelector('.count')?.textContent.trim() || '0';
                            const trend = td.querySelector('.trend')?.textContent.trim() || '0%';
                            rowData.push(`"${count}"`, `"${trend}"`);
                        } else {
                            let text = (td.innerText || td.textContent).replace(/\s+/g, ' ').trim();
                            rowData.push(`"${text.replace(/"/g, '""')}"`);
                        }
                    });
                    csvRows.push(rowData.join(','));
                });

                const blob = new Blob(['\ufeff' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                btn.disabled = false;
                btn.innerHTML = originalHtml;
                showNotification(`${title} 报表导出完成。`, 'success');
            }, 1000);
        });
    });
}


// MD 提示词生成逻辑
function initMdGeneration() {
    const btn = document.getElementById('generateMdBtn');
    const modal = document.getElementById('mdModal');
    const closeBtn = document.getElementById('closeMdModal');
    const content = document.getElementById('mdContent');
    const copyBtn = document.getElementById('copyMdBtn');
    const tabs = document.querySelectorAll('.md-tab');

    if (!btn || !modal) return;

    // 当前选中的 Tab 类型
    let currentMdType = 'logic';

    // 生成标签逻辑提示词
    function generateLogicMd() {
        let md = "";

        // 1. 处理常见问题分类 (common-issues-modal)
        const faqModal = document.getElementById('common-issues-modal');
        if (faqModal) {
            md += "# 常见问题分类提示词定义\n\n";
            const leafNodes = faqModal.querySelectorAll('.tree-node.tree-level-3');
            leafNodes.forEach(node => {
                const label = node.querySelector(':scope > .tree-header > .tree-header-left > .tree-label')?.textContent || '';
                const logic = node.dataset.logicDesc || '无逻辑说明';
                
                // 溯源路径
                let path = [];
                let parent = node.closest('.tree-children')?.parentElement;
                while (parent && parent.classList.contains('tree-node')) {
                    const pLabel = parent.querySelector(':scope > .tree-header > .tree-header-left > .tree-label')?.textContent || '';
                    path.unshift(pLabel.replace(/\s*\(.*?\)$/, '')); // 移除编码
                    parent = parent.closest('.tree-children')?.parentElement;
                }
                
                const pathStr = path.join(' > ');
                md += `### ${pathStr} > ${label}\n`;
                md += `**逻辑定义**：${logic}\n\n`;
            });
        }

        md += "---\n\n";

        // 2. 处理客户抗拒点分类 (resistance-points-modal)
        const resModal = document.getElementById('resistance-points-modal');
        if (resModal) {
            md += "# 客户抗拒点分类提示词定义\n\n";
            const leafNodes = resModal.querySelectorAll('.tree-node.tree-level-2');
            leafNodes.forEach(node => {
                const label = node.querySelector(':scope > .tree-header > .tree-header-left > .tree-label')?.textContent || '';
                const logic = node.dataset.logicDesc || '无逻辑说明';
                
                // 溯源路径
                let path = [];
                let parent = node.closest('.tree-children')?.parentElement;
                while (parent && parent.classList.contains('tree-node')) {
                    const pLabel = parent.querySelector(':scope > .tree-header > .tree-header-left > .tree-label')?.textContent || '';
                    path.unshift(pLabel.replace(/\s*\(.*?\)$/, ''));
                    parent = parent.closest('.tree-children')?.parentElement;
                }
                
                const pathStr = path.join(' > ');
                md += `### ${pathStr} > ${label}\n`;
                md += `**逻辑定义**：${logic}\n\n`;
            });
        }

        return md;
    }

    // 生成输出结果提示词
    function generateOutputMd() {
        let md = "";

        // 标题
        md += "# AI 通话标签输出结果提示词\n\n";

        md += "## 打标规则\n\n";
        md += "1. **逐句分析**：仔细阅读通话转写内容，识别客户提出的问题或表达的抗拒点。\n";
        md += "2. **精准匹配**：根据标签分类体系，选择最匹配的标签。\n";
        md += "3. **多标签支持**：一次通话可能涉及多个问题，请打上所有相关的标签。\n";
        md += "4. **编码要求**：每个标签必须包含对应的编码（如：全包落地含保险总价[Xk9m2P]）。\n";
        md += "5. **空值处理**：如未命中任何标签，数组返回 null 而非空数组。\n\n";

        md += "## 输出格式（JSON）\n请直接输出 JSON 格式结果，包含以下字段：\n";
        md += "- `callid`：通话唯一标识\n";
        md += "- `涉及常见问题`：数组类型，命中的一级分类下的三级标签（含编码），未命中则返回 null\n";
        md += "- `涉及抗拒点`：数组类型，命中的一级分类下的三级标签（含编码），未命中则返回 null\n\n";
        md += "```json\n{\n  \"callid\": \"1234567890\",\n  \"涉及常见问题\": [\"全包落地含保险总价[Xk9m2P]\", \"置换旧车现金补贴细节[Ab3cD4]\"],\n  \"涉及抗拒点\": [\"忙于工作等私人事务[gL0t2V]\", \"落地价高出预期[mN5pQ6]\"]\n}\n```\n\n";
        md += "```json\n{\n  \"callid\": \"9876543210\",\n  \"涉及常见问题\": null,\n  \"涉及抗拒点\": null\n}\n```";

        return md;
    }

    // Tab 切换事件
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMdType = tab.dataset.mdType;
            
            // 根据类型生成对应的 MD
            content.textContent = currentMdType === 'logic' ? generateLogicMd() : generateOutputMd();
        });
    });

    // 监听弹窗打开事件，每次打开都读取最新标签树
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target === modal && mutation.attributeName === 'class') {
                if (modal.classList.contains('active')) {
                    // 重置为默认 Tab 和内容
                    tabs.forEach(t => t.classList.remove('active'));
                    document.querySelector('.md-tab[data-md-type="logic"]')?.classList.add('active');
                    currentMdType = 'logic';
                    content.textContent = generateLogicMd();
                }
            }
        });
    });
    observer.observe(modal, { attributes: true });

    btn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    copyBtn?.addEventListener('click', () => {
        const textToCopy = content.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制到剪贴板';
            copyBtn.style.background = 'var(--success-color)';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        });
    });
}

// 全局事件委托处理树节点展开/收起
document.addEventListener('click', (e) => {
    const modal = document.getElementById('insightModal');
    if (!modal || !modal.classList.contains('active')) {
        return;
    }

    const treeHeader = e.target.closest('.tree-header');
    if (!treeHeader) return;

    if (e.target.closest('.tree-actions')) return;

    const treeNode = treeHeader.parentElement;
    if (treeNode && treeNode.classList.contains('tree-node')) {
        const treeChildren = treeNode.querySelector(':scope > .tree-children');
        if (treeChildren) {
            const isOpen = treeNode.classList.toggle('open');
            treeChildren.style.display = isOpen ? 'block' : 'none';
            const icon = treeNode.querySelector(':scope > .tree-header > .tree-header-left > .tree-icon');
            if (icon) {
                icon.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
            }
            e.stopPropagation();
        }
    }
});

// 初始化：设置所有tree-children的display，同步open节点状态
function initTreeState() {
    document.querySelectorAll('.tree-node').forEach(node => {
        const tc = node.querySelector(':scope > .tree-children');
        const icon = node.querySelector(':scope > .tree-header > .tree-header-left > .tree-icon');
        if (tc) {
            const isOpen = node.classList.contains('open');
            tc.style.display = isOpen ? 'block' : 'none';
            if (icon) {
                icon.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
            }
        }
    });
}
window.addEventListener('DOMContentLoaded', initTreeState);

// 导入/导出功能
function initImportExport() {
    function exportTreeData(modalId, fileName) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const hasLevel3 = modalId === 'common-issues-modal';
        const rows = [];
        const level1Nodes = modal.querySelectorAll(':scope > .category-tree > .tree-node.tree-level-1');

        level1Nodes.forEach(l1 => {
            const l1Label = l1.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
            const l1Text = l1Label ? l1Label.textContent : '';
            const l1Name = l1Text.replace(/\s*\([^)]*\)$/, '');
            const l1Code = l1Text.match(/\(([^)]+)\)$/)?.[1] || '';

            const l2Nodes = l1.querySelectorAll(':scope > .tree-children > .tree-node.tree-level-2');
            l2Nodes.forEach(l2 => {
                const l2Label = l2.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
                const l2Text = l2Label ? l2Label.textContent : '';
                const l2Name = l2Text.replace(/\s*\([^)]*\)$/, '');
                const l2Code = l2Text.match(/\(([^)]+)\)$/)?.[1] || '';

                if (hasLevel3) {
                    const l3Nodes = l2.querySelectorAll(':scope > .tree-children > .tree-node.tree-level-3');
                    l3Nodes.forEach(l3 => {
                        const l3Label = l3.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
                        const l3Text = l3Label ? l3Label.textContent : '';
                        const l3Name = l3Text.replace(/\s*\([^)]*\)$/, '');
                        const l3Code = l3Text.match(/\(([^)]+)\)$/)?.[1] || '';
                        const logicDesc = l3.dataset.logicDesc || '';
                        rows.push([l1Name, l1Code, l2Name, l2Code, l3Name, l3Code, logicDesc]);
                    });
                } else {
                    const logicDesc = l2.dataset.logicDesc || '';
                    rows.push([l1Name, l1Code, l2Name, l2Code, logicDesc]);
                }
            });
        });

        const headers = hasLevel3
            ? ['一级分类名称', '一级分类编码', '二级分类名称', '二级分类编码', '三级分类名称', '三级分类编码', '标签逻辑说明']
            : ['一级分类名称', '一级分类编码', '二级分类名称', '二级分类编码', '标签逻辑说明'];

        const csvContent = '\uFEFF' + [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importTreeData(modalId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const text = evt.target.result;
                    // 解析CSV（处理带引号和逗号的情况）
                    const lines = text.split('\n').filter(line => line.trim());
                    if (lines.length < 2) {
                        alert('导入文件为空或格式不正确');
                        return;
                    }

                    const modal = document.getElementById(modalId);
                    if (!modal) return;

                    const hasLevel3 = modalId === 'common-issues-modal';

                    // 用于存储去重后的数据（重复编码只保留最后一个）
                    const importDataMap = new Map();

                    // 解析CSV数据，跳过表头
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i];
                        // 简单解析CSV（处理引号内的逗号）
                        const row = [];
                        let current = '';
                        let inQuote = false;
                        for (let j = 0; j < line.length; j++) {
                            const char = line[j];
                            if (char === '"') {
                                inQuote = !inQuote;
                            } else if (char === ',' && !inQuote) {
                                row.push(current.trim());
                                current = '';
                            } else {
                                current += char;
                            }
                        }
                        row.push(current.trim());

                        if (hasLevel3) {
                            // 三级分类: 一级名称, 一级编码, 二级名称, 二级编码, 三级名称, 三级编码, 标签逻辑说明
                            const [l1Name, l1Code, l2Name, l2Code, l3Name, l3Code, logicDesc] = row;
                            // 编码为空则跳过
                            if (!l3Code) continue;
                            // 使用编码作为key，保留最后一个
                            importDataMap.set(l3Code, { l1Name, l1Code, l2Name, l2Code, l3Name, l3Code, logicDesc });
                        } else {
                            // 二级分类: 一级名称, 一级编码, 二级名称, 二级编码, 标签逻辑说明
                            const [l1Name, l1Code, l2Name, l2Code, logicDesc] = row;
                            // 编码为空则跳过
                            if (!l2Code) continue;
                            importDataMap.set(l2Code, { l1Name, l1Code, l2Name, l2Code, logicDesc });
                        }
                    }

                    // 遍历页面现有节点，匹配并更新
                    let updateCount = 0;
                    if (hasLevel3) {
                        // 常见问题分类 - 匹配三级节点
                        modal.querySelectorAll('.tree-node.tree-level-3').forEach(l3Node => {
                            const label = l3Node.querySelector('.tree-label');
                            if (!label) return;
                            const text = label.textContent;
                            const codeMatch = text.match(/\(([^)]+)\)$/);
                            if (!codeMatch) return;
                            const code = codeMatch[1];

                            if (importDataMap.has(code)) {
                                const data = importDataMap.get(code);
                                label.textContent = `${data.l3Name} (${data.l3Code})`;
                                l3Node.dataset.logicDesc = data.logicDesc || '';
                                updateCount++;
                            }
                        });
                    } else {
                        // 客户抗拒点分类 - 匹配二级节点
                        modal.querySelectorAll('.tree-node.tree-level-2').forEach(l2Node => {
                            const label = l2Node.querySelector('.tree-label');
                            if (!label) return;
                            const text = label.textContent;
                            const codeMatch = text.match(/\(([^)]+)\)$/);
                            if (!codeMatch) return;
                            const code = codeMatch[1];

                            if (importDataMap.has(code)) {
                                const data = importDataMap.get(code);
                                label.textContent = `${data.l2Name} (${data.l2Code})`;
                                l2Node.dataset.logicDesc = data.logicDesc || '';
                                updateCount++;
                            }
                        });
                    }

                    alert(`导入完成！共更新 ${updateCount} 条数据。`);
                } catch (err) {
                    console.error(err);
                    alert('导入失败，请检查文件格式是否正确。');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    document.getElementById('exportCommonIssues')?.addEventListener('click', () => {
        exportTreeData('common-issues-modal', '常见问题分类');
    });
    document.getElementById('importCommonIssues')?.addEventListener('click', () => {
        importTreeData('common-issues-modal');
    });

    document.getElementById('exportResistancePoints')?.addEventListener('click', () => {
        exportTreeData('resistance-points-modal', '客户抗拒点分类');
    });
    document.getElementById('importResistancePoints')?.addEventListener('click', () => {
        importTreeData('resistance-points-modal');
    });
}
window.addEventListener('DOMContentLoaded', initImportExport);

// 动态读取标签树数据并更新饼图
const chartColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#ff9f7f',
    '#0081ff', '#00b894', '#6c5ce7', '#f50', '#2db7f5', '#87d068'
];

// 模拟分布权重数据（仅针对二级分类定义权重，一级分类会自动求和）
const DISTRIBUTION_MOCKS = {
    // 常见问题 L2
    '购车时间': 2800, '购车意向': 3700,
    '到店行为': 1500, '购买形态': 1200, '客服意愿': 1500,
    
    // 抗拒点 L2
    '价格因素': 2200, '产品力': 1500, '品牌逻辑': 800,
    '政策抗拒': 1200, '交付时间': 600
};

function renderDoubleRingChart(containerId, modalId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const modal = document.getElementById(modalId);
    if (!modal) return;

    const l1Nodes = modal.querySelectorAll(':scope > .category-tree > .tree-node.tree-level-1');
    const l1Data = [];
    const l2Data = [];

    l1Nodes.forEach(node => {
        const l1LabelEl = node.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
        if (!l1LabelEl) return;
        const l1Name = l1LabelEl.textContent.trim().replace(/\s*\(.*?\)$/, '');
        
        let l1Sum = 0;
        const l2Nodes = node.querySelectorAll(':scope > .tree-children > .tree-node.tree-level-2');
        
        l2Nodes.forEach(l2 => {
            const labelEl = l2.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
            if (labelEl) {
                const name = labelEl.textContent.trim().replace(/\s*\(.*?\)$/, '');
                // 如果字典没定义，则根据该节点是否有子节点(L3)给一个默认权值
                const l3Count = l2.querySelectorAll(':scope > .tree-children > .tree-node.tree-level-3').length;
                const mockVal = DISTRIBUTION_MOCKS[name] || (l3Count > 0 ? l3Count * 200 : 300);
                
                l2Data.push({ name, count: mockVal, l1Name });
                l1Sum += mockVal;
            }
        });

        // 核心修正：一级分类数由二级分类之和决定
        l1Data.push({ name: l1Name, count: l1Sum });
    });

    // 计算总数（此时总数相等）
    const totalCount = l1Data.reduce((sum, item) => sum + item.count, 0) || 1;
    const totalL1 = totalCount;
    const totalL2 = totalCount;

    // 双环SVG：内环(L1) r=11，外环(L2) r=17
    const L1_R = 11, L1_C = 2 * Math.PI * L1_R;
    const L2_R = 17, L2_C = 2 * Math.PI * L2_R;

    let svg = `<svg width="160" height="160" viewBox="0 0 44 44" class="pie-chart-svg">`;

    // 内环：一级分类
    let l1Offset = 0;
    l1Data.forEach((item, i) => {
        const percent = Math.round((item.count / totalL1) * 100);
        const dashLen = (item.count / totalL1) * L1_C;
        const color = chartColors[i % chartColors.length];
        svg += `<circle cx="22" cy="22" r="${L1_R}" fill="transparent" stroke="${color}" stroke-width="5" stroke-dasharray="${dashLen.toFixed(2)} ${(L1_C - dashLen).toFixed(2)}" stroke-dashoffset="${(-l1Offset).toFixed(2)}"></circle>`;
        l1Offset += dashLen;
    });

    // 外环：二级分类
    let l2Offset = 0;
    l2Data.forEach((item, i) => {
        const percent = Math.round((item.count / totalL2) * 100);
        const dashLen = (item.count / totalL2) * L2_C;
        const color = chartColors[i % chartColors.length];
        svg += `<circle cx="22" cy="22" r="${L2_R}" fill="transparent" stroke="${color}" stroke-width="4" stroke-dasharray="${dashLen.toFixed(2)} ${(L2_C - dashLen).toFixed(2)}" stroke-dashoffset="${(-l2Offset).toFixed(2)}"></circle>`;
        l2Offset += dashLen;
    });

    svg += '</svg>';

    // 图例
    let legend = '<div class="pie-legend">';
    if (l1Data.length > 0) {
        legend += '<div class="legend-group">一级分类</div>';
        l1Data.forEach((item, i) => {
            const percent = Math.round((item.count / totalL1) * 100);
            const color = chartColors[i % chartColors.length];
            legend += `<div class="legend-item"><span class="legend-ring-dot" style="background:${color};"></span><span class="legend-label">${item.name}</span><span class="percent">${item.count} (${percent}%)</span></div>`;
        });
    }
    if (l2Data.length > 0) {
        legend += '<div class="legend-group">二级分类</div>';
        l2Data.forEach((item, i) => {
            const percent = Math.round((item.count / totalL2) * 100);
            const color = chartColors[i % chartColors.length];
            legend += `<div class="legend-item"><span class="legend-ring-dot outer" style="background:${color};"></span><span class="legend-label">${item.name}</span><span class="percent">${item.count || 0} (${percent}%)</span></div>`;
        });
    }
    legend += '</div>';

    container.innerHTML = '<div class="pie-chart-container"><div class="double-ring-wrapper">' + svg + '</div>' + legend + '</div>';
}

function initCommonTagCharts() {
    renderDoubleRingChart('commonTagChart', 'common-issues-modal');
    renderDoubleRingChart('resistanceTagChart', 'resistance-points-modal');
}

// 监听标签树变化，更新饼图
function initTagTreeObserver() {
    const modal = document.getElementById('insightModal');
    if (!modal) return;

    // 初始化饼图
    initCommonTagCharts();

    // 监听弹窗内容变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                // 防抖更新
                clearTimeout(window.tagChartUpdateTimer);
                window.tagChartUpdateTimer = setTimeout(() => {
                    initCommonTagCharts();
                }, 100);
            }
        });
    });

    const commonIssuesModal = document.getElementById('common-issues-modal');
    if (commonIssuesModal) {
        observer.observe(commonIssuesModal, { childList: true, subtree: true });
    }

    // 监听弹窗打开/关闭事件
    const modalObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                const isActive = modal.classList.contains('active');
                if (isActive) {
                    // 弹窗打开时更新饼图
                    clearTimeout(window.tagChartUpdateTimer);
                    window.tagChartUpdateTimer = setTimeout(() => {
                        initCommonTagCharts();
                    }, 50);
                }
            }
        });
    });
    modalObserver.observe(modal, { attributes: true });
}

// 为底层节点动态添加查看按钮
function initViewButtons() {
    document.querySelectorAll('#common-issues-modal .tree-node.tree-level-3').forEach(node => {
        const actions = node.querySelector(':scope > .tree-header > .tree-actions');
        if (actions && !actions.querySelector('[title="查看"]')) {
            const viewBtn = document.createElement('button');
            viewBtn.className = 'tree-action-btn';
            viewBtn.title = '查看';
            viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            actions.insertBefore(viewBtn, actions.firstChild);
        }
    });

    document.querySelectorAll('#resistance-points-modal .tree-node.tree-level-2').forEach(node => {
        const actions = node.querySelector(':scope > .tree-header > .tree-actions');
        if (actions && !actions.querySelector('[title="查看"]')) {
            const viewBtn = document.createElement('button');
            viewBtn.className = 'tree-action-btn';
            viewBtn.title = '查看';
            viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            actions.insertBefore(viewBtn, actions.firstChild);
        }
    });
}

window.addEventListener('DOMContentLoaded', initTagTreeObserver);
window.addEventListener('DOMContentLoaded', initViewButtons);

// 显示节点详情
function showNodeDetail(node) {
    let level1 = '-', level2 = '-', level3 = '-';

    const currentLabel = node.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
    const currentName = currentLabel ? currentLabel.textContent : '-';

    if (node.classList.contains('tree-level-3')) {
        level3 = currentName;
    } else if (node.classList.contains('tree-level-2')) {
        level2 = currentName;
    }

    const parentTreeChildren = node.parentElement;
    if (parentTreeChildren && parentTreeChildren.classList.contains('tree-children')) {
        const parentNode = parentTreeChildren.parentElement;
        if (parentNode) {
            const parentLabel = parentNode.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
            const parentName = parentLabel ? parentLabel.textContent : '-';

            if (parentNode.classList.contains('tree-level-2')) {
                level2 = parentName;
            } else if (parentNode.classList.contains('tree-level-1')) {
                level1 = parentName;
            }

            if (parentNode.classList.contains('tree-level-2')) {
                const grandTreeChildren = parentNode.parentElement;
                if (grandTreeChildren && grandTreeChildren.classList.contains('tree-children')) {
                    const grandNode = grandTreeChildren.parentElement;
                    if (grandNode) {
                        const grandLabel = grandNode.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
                        level1 = grandLabel ? grandLabel.textContent : '-';
                    }
                }
            }
        }
    }

    const isResistancePoints = node.closest('#resistance-points-modal') !== null;
    const level3Item = document.getElementById('viewLevel3Item');
    if (isResistancePoints) {
        level3Item.style.display = 'none';
    } else {
        level3Item.style.display = '';
        document.getElementById('viewLevel3').textContent = level3;
        document.getElementById('viewLevel3').classList.toggle('empty', level3 === '-');
    }

    const logicDesc = node.dataset.logicDesc || '-';
    document.getElementById('viewLogicDesc').textContent = logicDesc;
    document.getElementById('viewLogicDesc').classList.toggle('empty', logicDesc === '-');

    document.getElementById('viewLevel1').textContent = level1;
    document.getElementById('viewLevel1').classList.toggle('empty', level1 === '-');
    document.getElementById('viewLevel2').textContent = level2;
    document.getElementById('viewLevel2').classList.toggle('empty', level2 === '-');

    document.getElementById('nodeViewModal').classList.add('active');
}

window.addEventListener('DOMContentLoaded', initViewButtons);

// 弹窗功能
function initModal() {
    const addBtn = document.getElementById('addInsightBtn');
    const modal = document.getElementById('insightModal');
    const closeBtn = document.querySelector('.modal-close');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.modal-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    const viewModal = document.getElementById('nodeViewModal');
    if (viewModal) {
        viewModal.addEventListener('click', (e) => {
            if (e.target === viewModal) {
                viewModal.classList.remove('active');
            }
        });
    }

    initNodeFormModal();
}

// 节点表单弹窗功能
function initNodeFormModal() {
    const formModal = document.getElementById('nodeFormModal');
    const formCloseBtn = formModal.querySelector('.form-modal-close');
    const cancelBtn = formModal.querySelector('.btn-cancel');
    const confirmBtn = formModal.querySelector('.btn-confirm');

    let currentEditLabelElement = null;
    let currentEditTreeNode = null;
    let addNodeContext = null;

    function closeFormModal() {
        formModal.classList.remove('active');
        document.getElementById('nodeName').value = '';
        document.getElementById('nodeCode').value = '';
        document.getElementById('nodeLogicDesc').value = '';
        document.getElementById('logicDescGroup').style.display = 'none';
        currentEditLabelElement = null;
        currentEditTreeNode = null;
        addNodeContext = null;
        document.getElementById('nodeCode').removeAttribute('readonly');
    }

    if (formCloseBtn) {
        formCloseBtn.addEventListener('click', closeFormModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeFormModal);
    }

    formModal.addEventListener('click', (e) => {
        if (e.target === formModal) {
            closeFormModal();
        }
    });

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const nodeName = document.getElementById('nodeName').value.trim();
            const nodeCode = document.getElementById('nodeCode').value.trim();
            const logicDesc = document.getElementById('nodeLogicDesc').value.trim();

            if (!nodeName) {
                alert('请输入标签名称');
                return;
            }

            if (!nodeCode) {
                alert('请输入标签编码');
                return;
            }

            const isLogicDescRequired = formModal.dataset.isLogicDescRequired === 'true';
            if (isLogicDescRequired && !logicDesc) {
                alert('请输入标签逻辑说明');
                return;
            }

            const formTitle = document.getElementById('nodeFormTitle').textContent;
            const isEditMode = formTitle.includes('编辑');

            if (isEditMode) {
                if (currentEditLabelElement) {
                    currentEditLabelElement.textContent = `${nodeName} (${nodeCode})`;
                }
                if (currentEditTreeNode) {
                    currentEditTreeNode.dataset.logicDesc = logicDesc;
                }
            } else if (addNodeContext) {
                const { parentNode: addParentNode, level: addLevel, modalId: addModalId } = addNodeContext;
                const newNode = document.createElement('div');
                newNode.className = `tree-node tree-level-${addLevel}`;
                if (logicDesc) newNode.dataset.logicDesc = logicDesc;

                const hasChildren = (addModalId === 'common-issues-modal' && addLevel < 3)
                    || (addModalId === 'resistance-points-modal' && addLevel < 2);

                newNode.innerHTML = `
                    <div class="tree-header">
                        <div class="tree-header-left">
                            ${hasChildren ? '<i class="fa-solid fa-chevron-right tree-icon"></i>' : ''}
                            <span class="tree-label">${nodeName} (${nodeCode})</span>
                        </div>
                        <div class="tree-actions">
                            ${!hasChildren ? '<button class="tree-action-btn" title="查看"><i class="fa-solid fa-eye"></i></button>' : ''}
                            ${hasChildren ? '<button class="tree-action-btn" title="新增下级节点"><i class="fa-solid fa-plus"></i></button>' : ''}
                            <button class="tree-action-btn" title="编辑"><i class="fa-solid fa-pen"></i></button>
                            <button class="tree-action-btn delete" title="删除"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    ${hasChildren ? '<div class="tree-children"></div>' : ''}
                `;

                if (addParentNode) {
                    let treeChildren = addParentNode.querySelector(':scope > .tree-children');
                    if (!treeChildren) {
                        treeChildren = document.createElement('div');
                        treeChildren.className = 'tree-children';
                        addParentNode.appendChild(treeChildren);
                    }
                    treeChildren.insertBefore(newNode, treeChildren.firstElementChild);
                } else {
                    const categoryTree = document.querySelector(`#${addModalId} > .category-tree`);
                    if (categoryTree) categoryTree.insertBefore(newNode, categoryTree.firstElementChild);
                }

                if (addParentNode) {
                    addParentNode.classList.add('open');
                    const tc = addParentNode.querySelector(':scope > .tree-children');
                    if (tc) tc.style.display = 'block';
                    const icon = addParentNode.querySelector(':scope > .tree-header > .tree-header-left > .tree-icon');
                    if (icon) icon.style.transform = 'rotate(90deg)';
                }

                // 更新饼图
                clearTimeout(window.tagChartUpdateTimer);
                window.tagChartUpdateTimer = setTimeout(() => {
                    initCommonTagCharts();
                }, 100);
            }

            closeFormModal();
        });
    }

    // 使用事件委托处理所有树操作按钮
    const insightModal = document.getElementById('insightModal');
    if (insightModal) {
        insightModal.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.tree-action-btn[title="新增下级节点"]');
            if (addBtn) {
                e.stopPropagation();
                handleAddNode(addBtn);
                return;
            }

            const rootAddBtn = e.target.closest('.btn-add-root');
            if (rootAddBtn) {
                e.stopPropagation();
                handleAddNode(rootAddBtn);
                return;
            }

            const editBtn = e.target.closest('.tree-action-btn[title="编辑"]');
            if (editBtn) {
                e.stopPropagation();
                handleEditNode(editBtn);
                return;
            }

            const deleteBtn = e.target.closest('.tree-action-btn.delete');
            if (deleteBtn) {
                e.stopPropagation();
                handleDeleteNode(deleteBtn);
                return;
            }

            const viewBtn = e.target.closest('.tree-action-btn[title="查看"]');
            if (viewBtn) {
                e.stopPropagation();
                const treeNode = viewBtn.closest('.tree-node');
                if (treeNode) showNodeDetail(treeNode);
                return;
            }
        });
    }

    function handleAddNode(btn) {
        const treeNode = btn.closest('.tree-node');
        const isRootNode = btn.classList.contains('btn-add-root');

        let level = 1;
        if (isRootNode) {
            level = 1;
        } else if (treeNode) {
            if (treeNode.classList.contains('tree-level-1')) {
                level = 2;
            } else if (treeNode.classList.contains('tree-level-2')) {
                level = 3;
            }
        }

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomCode = '';
        for (let i = 0; i < 6; i++) {
            randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const generatedCode = randomCode;

        const modalContent = btn.closest('.modal-content');
        document.getElementById('nodeFormTitle').textContent = `新增${level}级分类`;

        let isBottomLevel = false;
        if (modalContent && modalContent.id === 'resistance-points-modal') {
            isBottomLevel = level >= 2;
        } else if (modalContent && modalContent.id === 'common-issues-modal') {
            isBottomLevel = level >= 3;
        }

        if (isBottomLevel) {
            document.getElementById('logicDescGroup').style.display = 'block';
            const logicDescLabel = document.querySelector('#logicDescGroup .form-label');
            if (logicDescLabel) {
                logicDescLabel.classList.add('required');
                logicDescLabel.textContent = '标签逻辑说明';
            }
        } else {
            document.getElementById('logicDescGroup').style.display = 'none';
            const logicDescLabel = document.querySelector('#logicDescGroup .form-label');
            if (logicDescLabel) {
                logicDescLabel.classList.remove('required');
                logicDescLabel.textContent = '标签逻辑说明';
            }
        }

        addNodeContext = {
            parentNode: isRootNode ? null : treeNode,
            level: level,
            modalId: modalContent ? modalContent.id : ''
        };

        document.getElementById('nodeName').value = '';
        document.getElementById('nodeCode').value = generatedCode;
        // document.getElementById('nodeCode').setAttribute('readonly', 'readonly');
        document.getElementById('nodeLogicDesc').value = '';

        formModal.dataset.isLogicDescRequired = String(isBottomLevel);
        formModal.classList.add('active');
    }

    function handleEditNode(btn) {
        const treeNode = btn.closest('.tree-node');
        const labelElement = treeNode.querySelector('.tree-label');
        const label = labelElement.textContent;
        const isBottomLevel = isBottomLevelNode(treeNode);

        let level = 1;
        if (treeNode.classList.contains('tree-level-1')) {
            level = 1;
        } else if (treeNode.classList.contains('tree-level-2')) {
            level = 2;
        } else if (treeNode.classList.contains('tree-level-3')) {
            level = 3;
        }

        let nodeName = label;
        let nodeCode = '';
        const codeMatch = label.match(/\(([^)]+)\)$/);
        if (codeMatch) {
            nodeName = label.replace(/\s*\([^)]+\)$/, '');
            nodeCode = codeMatch[1];
        }

        document.getElementById('nodeFormTitle').textContent = `编辑${level}级分类`;

        document.getElementById('nodeName').value = nodeName;
        document.getElementById('nodeCode').value = nodeCode;
        // document.getElementById('nodeCode').setAttribute('readonly', 'readonly');
        document.getElementById('nodeLogicDesc').value = treeNode.dataset.logicDesc || '';

        currentEditLabelElement = labelElement;
        currentEditTreeNode = treeNode;

        if (isBottomLevel) {
            document.getElementById('logicDescGroup').style.display = 'block';
            const logicDescLabel = document.querySelector('#logicDescGroup .form-label');
            if (logicDescLabel) {
                logicDescLabel.classList.add('required');
                logicDescLabel.textContent = '标签逻辑说明';
            }
            formModal.dataset.isLogicDescRequired = 'true';
        } else {
            document.getElementById('logicDescGroup').style.display = 'none';
            const logicDescLabel = document.querySelector('#logicDescGroup .form-label');
            if (logicDescLabel) {
                logicDescLabel.classList.remove('required');
                logicDescLabel.textContent = '标签逻辑说明';
            }
            formModal.dataset.isLogicDescRequired = 'false';
        }

        formModal.classList.add('active');
    }

    function handleDeleteNode(btn) {
        const treeNode = btn.closest('.tree-node');
        const label = treeNode.querySelector('.tree-label').textContent;

        const treeChildren = treeNode.querySelector(':scope > .tree-children');
        const hasChildren = treeChildren && treeChildren.children.length > 0;

        if (hasChildren) {
            if (!confirm(`确定要删除"${label}"吗?`)) return;
            if (!confirm('当前分类有子分类，如果删除所有子分类一并删除')) return;
        } else {
            if (!confirm(`确定要删除"${label}"吗?`)) return;
        }

        treeNode.remove();
        
        // 更新饼图
        clearTimeout(window.tagChartUpdateTimer);
        window.tagChartUpdateTimer = setTimeout(() => {
            initCommonTagCharts();
        }, 100);
    }
}

// 判断是否为底层节点
function isBottomLevelNode(treeNode) {
    if (!treeNode) return false;

    const children = treeNode.querySelector('.tree-children');
    if (!children || children.children.length === 0) {
        return true;
    }

    return false;
}
// 导出常见问题 Top 10 明细
function initFaqExport() {
    const exportBtn = document.getElementById('exportFaqTop10');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', () => {
        // 模拟生成详细数据
        const headers = ['callid', '被叫手机号', '提及问题', '呼叫时间', '业务类型', '呼叫类型'];
        const dataRows = [
            ['CALL_12345678', '138****0001', '车辆参数, 落地价', '2024-05-20 10:30:15', '新车业务', '呼出'],
            ['CALL_12345679', '139****1112', '配置咨询, 现货情况', '2024-05-20 11:15:20', '新车业务', '呼入'],
            ['CALL_12345680', '137****2223', '贷款政策', '2024-05-20 14:45:10', '售后业务', '呼出'],
            ['CALL_12345681', '136****4445', '续航里程, 电池质保', '2024-05-19 09:12:05', '新车业务', '呼入'],
            ['CALL_12345682', '150****5556', '优惠活动, 样车位置', '2024-05-19 16:20:33', '新车业务', '呼出'],
            ['CALL_12345683', '151****7788', '置换补贴', '2024-05-18 10:05:44', '置换业务', '呼入'],
            ['CALL_12345684', '188****9900', '颜色选择, 提车周期', '2024-05-18 15:30:12', '新车业务', '呼出']
        ];

        // 拼接 CSV 内容
        const csvContent = '\uFEFF' + [headers, ...dataRows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        // 下载文件
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.download = `常见问题Top10明细_${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.async-notify');
    if (existing) existing.remove();

    const notify = document.createElement('div');
    notify.className = `async-notify ${type}`;
    notify.innerHTML = `
        <div class="notify-icon"><i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-info-circle'}"></i></div>
        <div class="notify-content">${message}</div>
    `;
    document.body.appendChild(notify);

    setTimeout(() => {
        notify.classList.add('fade-out');
        setTimeout(() => notify.remove(), 500);
    }, 3000);
}

// 全量明细数据下载逻辑 - 升级为异步模拟
function initFullDetailExport() {
    const downloadBtn = document.getElementById('downloadFullDetailBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
        const originalHtml = downloadBtn.innerHTML;
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 任务处理中...';
        
        showNotification('导出任务已提交，系统正在后台生成全量数据报表，请稍候...', 'info');

        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalHtml;
            
            const rawData = [
                { base: ['CALL_20240520_001', '2024-05-20 10:30:15', '2024-05-20 10:32:40', '075588881234', '13800138001', '新车新线索', 'R1', '大项目A', '85', '呼出-手动'], common: ['落地价', '购置税'], resistance: ['价格无优惠'] },
                { base: ['CALL_20240520_002', '2024-05-20 11:15:20', '2024-05-20 11:16:46', '075588885678', '13911122223', '新车新线索', 'R2', '大项目B', '72', '呼出-预测'], common: ['样车到店', '提车周期'], resistance: ['交付周期长'] },
                { base: ['CALL_20240520_003', '2024-05-20 14:45:10', '2024-05-20 14:48:40', '075588881234', '13722233334', '冷线索培育', 'R1', '大项目A', '68', '呼出-AI'], common: ['置换补贴', '二手车评估'], resistance: ['库存短缺'] },
                { base: ['CALL_20240519_001', '2024-05-19 09:12:05', '2024-05-19 09:13:07', '075588881234', '13644455556', '新车新线索', 'R3', '大项目C', '90', '呼出-手动'], common: ['分期利率', '贷款政策'], resistance: ['续航焦虑'] },
                { base: ['CALL_20240519_002', '2024-05-19 16:20:33', '2024-05-19 16:25:45', '075588885678', '15055566667', '留资未满培育', 'R2', '大项目B', '55', '呼入'], common: ['样车到店', '颜色选择'], resistance: ['家人反对'] }
            ];

            const baseHeaders = ['callid', '外呼开始时间', '外呼结束时间', '主叫号码', '被叫号码', '业务类型', 'R渠道', '大项目', 'sc值', '呼叫类型'];
            const maxCommon = Math.max(...rawData.map(d => d.common.length));
            const maxResistance = Math.max(...rawData.map(d => d.resistance.length));
            const commonHeaders = Array.from({ length: maxCommon }, (_, i) => `涉及常见标签${i + 1}`);
            const resHeaders = Array.from({ length: maxResistance }, (_, i) => `涉及抗拒点标签${i + 1}`);
            
            const fullHeaders = [...baseHeaders, ...commonHeaders, ...resHeaders];
            const csvRows = [fullHeaders.join(',')];

            rawData.forEach(item => {
                const row = [...item.base];
                for (let i = 0; i < maxCommon; i++) row.push(item.common[i] || '');
                for (let i = 0; i < maxResistance; i++) row.push(item.resistance[i] || '');
                csvRows.push(row.map(v => `"${v}"`).join(','));
            });

            const blob = new Blob(['\ufeff' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `全量话务明细_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showNotification('数据报表生成成功，已开始自动下载。', 'success');
        }, 2500);
    });
}
// 全量常见问题弹窗逻辑
function initFaqModal() {
    const viewBtn = document.getElementById('viewAllFaq');
    const modal = document.getElementById('faqModal');
    const closeBtn = document.getElementById('closeFaqModal');
    const tableBody = document.getElementById('allFaqBody');

    if (!viewBtn || !modal || !closeBtn || !tableBody) return;

    // 模拟数据 (更多数据)
    const allData = [
        { name: '秦L 价格咨询', count: 428, percent: 12.5 },
        { name: '置换补贴政策', count: 315, percent: 8.2 },
        { name: '续航里程表现', count: 286, percent: 7.4 },
        { name: '分期贷款利率', count: 198, percent: 5.1 },
        { name: '内饰颜色选择', count: 156, percent: 4.0 },
        { name: '北京车展时间', count: 145, percent: 3.8 },
        { name: '提车周期咨询', count: 128, percent: 3.2 },
        { name: '车辆配置差异', count: 110, percent: 2.8 },
        { name: '样车到店情况', count: 98, percent: 2.5 },
        { name: '二手车评估', count: 86, percent: 2.2 },
        { name: '智能驾驶配置', count: 75, percent: 1.9 },
        { name: '售后维保政策', count: 68, percent: 1.7 },
        { name: '快充桩安装', count: 52, percent: 1.3 },
        { name: '旧车置换流程', count: 45, percent: 1.1 },
        { name: '保险项目对比', count: 38, percent: 0.9 },
        { name: '试驾车安排', count: 30, percent: 0.7 },
        { name: 'APP 注册问题', count: 25, percent: 0.6 }
    ];

    viewBtn.addEventListener('click', () => {
        // 清空并渲染
        tableBody.innerHTML = '';
        allData.forEach((item, index) => {
            const rankClass = index < 3 ? `top-${index + 1}` : '';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="rank-badge ${rankClass}">${index + 1}</div></td>
                <td class="col-name">${item.name}</td>
                <td class="col-count">${item.count}</td>
                <td class="col-proportion">
                    <div class="progress-bar-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${item.percent * 4}%"></div>
                        </div>
                        <span style="font-size: 11px; color: #666; width: 35px;">${item.percent}%</span>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}
// 全量趋势弹窗逻辑
function initTrendModal() {
    const viewBtn = document.getElementById('viewAllTrends');
    const modal = document.getElementById('trendModal');
    const closeBtn = document.getElementById('closeTrendModal');
    const chartArea = document.getElementById('allTrendChart');

    if (!viewBtn || !modal || !closeBtn || !chartArea) return;

    // 模拟数据 (更多趋势数据)
    const trendData = [
        { name: '库存问题咨询', val: 5.36 },
        { name: '贷款问题咨询', val: 4.56 },
        { name: '价格比较', val: 1.35 },
        { name: '车辆参数', val: 1.14 },
        { name: '配置咨询', val: 1.11 },
        { name: '秦L 续航', val: 0.85 },
        { name: '自动泊车', val: 0.42 },
        { name: '生产问题', val: -0.98 },
        { name: '店铺位置', val: -1.58 },
        { name: '联系方式', val: -2.34 },
        { name: '订车问题', val: -3.32 },
        { name: '索要微信', val: -7.13 },
        { name: '分步补贴政策', val: -0.45 },
        { name: '交车时间问询', val: -1.22 }
    ];

    viewBtn.addEventListener('click', () => {
        chartArea.innerHTML = `
            <div class="chart-grid">
                <div class="grid-v"></div><div class="grid-v"></div>
                <div class="grid-v"></div><div class="grid-v"></div>
                <div class="grid-v"></div>
            </div>
        `;

        trendData.forEach(item => {
            const isPos = item.val >= 0;
            const absVal = Math.abs(item.val);
            const row = document.createElement('div');
            row.className = 'chart-row';
            row.innerHTML = `
                <div class="chart-label">${item.name}</div>
                <div class="chart-visual">
                    <div class="neg-track">
                        ${!isPos ? `
                            <div class="bar-base bar-neg" style="width: ${absVal * 10}%">
                                <span class="bar-val">${item.val}%</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="pos-track">
                        ${isPos ? `
                            <div class="bar-base bar-pos" style="width: ${absVal * 10}%">
                                <span class="bar-val">${item.val}%</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            chartArea.appendChild(row);
        });

        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// 热门排行全量弹窗逻辑
function initHotRankingModal() {
    const viewBtn = document.getElementById('viewAllHotRanking');
    const modal = document.getElementById('hotRankingModal');
    const closeBtn = document.getElementById('closeHotRankingModal');
    const tableBody = document.getElementById('allHotRankingBody');

    if (!viewBtn || !modal || !closeBtn || !tableBody) return;

    const allData = [
        { name: '秦L 价格咨询', score: 92.5, trend: 12.5 },
        { name: '配置咨询', score: 85.4, trend: 8.2 },
        { name: '车辆参数', score: 78.2, trend: -5.4 },
        { name: '咨询落地价', score: 65.1, trend: 15.0 },
        { name: '口碑咨询', score: 58.4, trend: 2.1 },
        { name: '金融政策', score: 52.6, trend: -1.2 },
        { name: '权益咨询', score: 48.9, trend: 20.4 },
        { name: '试驾预约', score: 45.2, trend: 7.8 },
        { name: '库存状态', score: 42.1, trend: -2.3 },
        { name: '活动权益', score: 38.5, trend: 10.5 },
        { name: '提车周期', score: 32.4, trend: 4.2 },
        { name: '售后服务', score: 28.9, trend: -1.8 }
    ];

    viewBtn.addEventListener('click', () => {
        tableBody.innerHTML = '';
        allData.forEach((item, index) => {
            const rankClass = index < 3 ? `top-${index + 1}` : '';
            const trendClass = item.trend >= 0 ? 'rise' : 'fall';
            const trendIcon = item.trend >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="rank-badge ${rankClass}">${index + 1}</div></td>
                <td class="col-name">${item.name}</td>
                <td class="col-count">${item.score}</td>
                <td class="col-proportion">
                    <span class="trend-indicator ${trendClass}">
                        <i class="fa-solid ${trendIcon}"></i>
                        ${Math.abs(item.trend)}%
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// 热门趋势极端分析全量弹窗逻辑
function initHotTrendsModal() {
    const viewBtn = document.getElementById('viewAllHotTrends');
    const modal = document.getElementById('hotTrendsModal');
    const closeBtn = document.getElementById('closeHotTrendsModal');
    const content = document.getElementById('allHotTrendsContent');

    if (!viewBtn || !modal || !closeBtn || !content) return;

    viewBtn.addEventListener('click', () => {
        // 渲染对比布局
        content.innerHTML = `
            <div class="trend-extreme-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px;">
                <div class="trend-extreme-group">
                    <h4 style="font-size: 16px; color: #f5222d; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-arrow-up-right-dots"></i> 全量环比热度激增排行榜
                    </h4>
                    <div class="extreme-list" id="allRiseList"></div>
                </div>
                <div class="trend-extreme-group">
                    <h4 style="font-size: 16px; color: #52c41a; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-arrow-trend-down"></i> 全量环比热度回落排行榜
                    </h4>
                    <div class="extreme-list" id="allFallList"></div>
                </div>
            </div>
        `;

        const rises = [
            { name: '咨询落地价', val: 15.0 }, { name: '权益咨询', val: 12.4 }, 
            { name: '新车交付', val: 9.8 }, { name: '配置咨询', val: 8.2 },
            { name: '试驾预约', val: 7.8 }, { name: '金融政策', val: 6.5 },
            { name: '活动权益', val: 5.2 }, { name: '提车周期', val: 4.2 }
        ];
        const falls = [
            { name: '保养预约', val: -10.2 }, { name: '旧车评估', val: -8.4 },
            { name: '投诉处理', val: -6.1 }, { name: '车辆参数', val: -5.4 },
            { name: '退订咨询', val: -4.8 }, { name: '分店位置', val: -2.3 },
            { name: '售后服务', val: -1.8 }, { name: '保险项目', val: -1.1 }
        ];

        const riseList = document.getElementById('allRiseList');
        const fallList = document.getElementById('allFallList');

        rises.forEach(item => {
            const row = document.createElement('div');
            row.className = 'extreme-item';
            row.style.height = '32px';
            row.innerHTML = `
                <span class="extreme-label" style="width: 100px;">${item.name}</span>
                <div class="extreme-bar-wrap"><div class="extreme-bar rise" style="width: ${item.val * 5}%"></div></div>
                <span class="extreme-val rise" style="width: 60px;">+${item.val}%</span>
            `;
            riseList.appendChild(row);
        });

        falls.forEach(item => {
            const row = document.createElement('div');
            row.className = 'extreme-item';
            row.style.height = '32px';
            row.innerHTML = `
                <span class="extreme-label" style="width: 100px;">${item.name}</span>
                <div class="extreme-bar-wrap"><div class="extreme-bar fall" style="width: ${Math.abs(item.val) * 5}%"></div></div>
                <span class="extreme-val fall" style="width: 60px;">${item.val}%</span>
            `;
            fallList.appendChild(row);
        });

        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// 常见标签排行排序功能
function initCommonTagSort() {
    const sortBtns = document.querySelectorAll('.tab-pane#common-issues .sort-switch-btn');
    if (!sortBtns.length) return;

    const tableBody = document.querySelector('.tab-pane#common-issues .ranking-card .data-table tbody');
    if (!tableBody) return;

    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const sortType = this.dataset.sort;
            const rows = Array.from(tableBody.querySelectorAll('tr'));

            const rowData = rows.map(row => {
                const cells = row.querySelectorAll('td');
                // 索引：0rank, 1L1, 2L2, 3L3, 4Count, 5Prop, 6Trend, 7Hot
                const count = parseInt(cells[4]?.textContent?.replace(/,/g, '')?.trim()) || 0;
                
                // 环比提取
                const trendEl = cells[6]?.querySelector('.trend-up, .trend-down, .rise, .fall, .trend');
                const trendText = trendEl?.textContent?.trim() || '0%';
                const trendVal = parseFloat(trendText.replace(/[^0-9.-]/g, '')) || 0;
                const trendSign = (trendEl?.classList.contains('trend-down') || trendEl?.classList.contains('fall')) ? -1 : 1;
                const trend = trendVal * trendSign;

                const hotEl = cells[7]?.querySelector('.hot-value');
                const hot = parseInt(hotEl?.textContent?.trim() || cells[7]?.textContent?.trim()) || 0;

                return { row: row.cloneNode(true), count, trend, hot };
            });

            if (sortType === 'count') {
                rowData.sort((a, b) => b.count - a.count);
            } else if (sortType === 'trend') {
                rowData.sort((a, b) => b.trend - a.trend);
            } else if (sortType === 'hot') {
                rowData.sort((a, b) => b.hot - a.hot);
            }

            tableBody.innerHTML = '';
            rowData.forEach((item, index) => {
                const newRow = item.row;
                const rankBadge = newRow.querySelector('.rank-badge');
                if (rankBadge) {
                    rankBadge.textContent = index + 1;
                    rankBadge.className = 'rank-badge' + (index < 3 ? ` top-${index + 1}` : '');
                }
                tableBody.appendChild(newRow);
            });
        });
    });
}

// 抗拒点排行排序功能
function initResistanceSort() {
    const sortBtns = document.querySelectorAll('.tab-pane#resistance-points .sort-switch-btn');
    if (!sortBtns.length) return;

    const tableBody = document.querySelector('.tab-pane#resistance-points .ranking-card .data-table tbody');
    if (!tableBody) return;

    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const sortType = this.dataset.sort;
            const rows = Array.from(tableBody.querySelectorAll('tr'));

            const rowData = rows.map(row => {
                const cells = row.querySelectorAll('td');
                // 索引同上：4Count, 6Trend, 7Hot
                const count = parseInt(cells[4]?.textContent?.replace(/,/g, '')?.trim()) || 0;
                
                const trendEl = cells[6]?.querySelector('.trend-up, .trend-down, .rise, .fall, .trend');
                const trendText = trendEl?.textContent?.trim() || '0%';
                const trendVal = parseFloat(trendText.replace(/[^0-9.-]/g, '')) || 0;
                const trendSign = (trendEl?.classList.contains('trend-down') || trendEl?.classList.contains('fall')) ? -1 : 1;
                const trend = trendVal * trendSign;

                const hotEl = cells[7]?.querySelector('.hot-value');
                const hot = parseInt(hotEl?.textContent?.trim() || cells[7]?.textContent?.trim()) || 0;

                return { row: row.cloneNode(true), count, trend, hot };
            });

            if (sortType === 'count') {
                rowData.sort((a, b) => b.count - a.count);
            } else if (sortType === 'trend') {
                rowData.sort((a, b) => b.trend - a.trend);
            } else if (sortType === 'hot') {
                rowData.sort((a, b) => b.hot - a.hot);
            }

            tableBody.innerHTML = '';
            rowData.forEach((item, index) => {
                const newRow = item.row;
                const rankBadge = newRow.querySelector('.rank-badge');
                if (rankBadge) {
                    rankBadge.textContent = index + 1;
                    rankBadge.className = 'rank-badge' + (index < 3 ? ` top-${index + 1}` : '');
                }
                tableBody.appendChild(newRow);
            });
        });
    });
}

/**
 * 修复报表表格的层级结构（处理 rowspan）
 */
function fixTableHierarchy(tbody) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.length === 0) return;

    // 先补全所有行的分类单元格，确保每行都有 L1, L2, L3 对应的 td
    rows.forEach(row => {
        let l1 = row.querySelector('.col-l1');
        if (!l1) {
            l1 = document.createElement('td');
            l1.className = 'row-header col-l1';
            row.insertBefore(l1, row.firstChild);
        }
        l1.textContent = row.dataset.l1 || '';
        l1.rowSpan = 1;
        l1.style.display = '';

        let l2 = row.querySelector('.col-l2');
        if (!l2) {
            l2 = document.createElement('td');
            l2.className = 'row-header col-l2';
            const l3 = row.querySelector('.col-l3');
            row.insertBefore(l2, l3);
        }
        l2.textContent = row.dataset.l2 || '';
        l2.rowSpan = 1;
        l2.style.display = '';
    });

    // 重新计算并应用合并逻辑
    let prevL1Cell = null, prevL2Cell = null;
    let l1Count = 0, l2Count = 0;

    rows.forEach((row, i) => {
        const l1 = row.querySelector('.col-l1'), l2 = row.querySelector('.col-l2');
        const v1 = row.dataset.l1, v2 = row.dataset.l2;

        if (prevL1Cell && prevL1Cell.textContent === v1) {
            l1.style.display = 'none';
            l1Count++;
            prevL1Cell.rowSpan = l1Count;
        } else {
            prevL1Cell = l1;
            l1Count = 1;
        }

        const isSameL1 = (i > 0 && rows[i-1].dataset.l1 === v1);
        if (prevL2Cell && prevL2Cell.textContent === v2 && isSameL1) {
            l2.style.display = 'none';
            l2Count++;
            prevL2Cell.rowSpan = l2Count;
        } else {
            prevL2Cell = l2;
            l2Count = 1;
        }
    });
}

function initReportTableSort() {
    const tables = document.querySelectorAll('.report-table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('thead th');
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        headers.forEach((th, index) => {
            const sortIcon = th.querySelector('.sort-icon');
            if (!sortIcon) return;
            th.onclick = () => {
                const dir = th.dataset.sortDir === 'desc' ? 'asc' : 'desc';
                th.dataset.sortDir = dir;
                headers.forEach(h => h !== th && (h.dataset.sortDir = ''));

                const rows = Array.from(tbody.querySelectorAll('tr'));
                rows.sort((a, b) => {
                    const getNum = (r) => {
                        const td = r.querySelectorAll('td:not(.col-l1):not(.col-l2):not(.col-l3)')[index - 3];
                        return parseInt(td?.querySelector('.count')?.textContent || '0');
                    };
                    return dir === 'desc' ? getNum(b) - getNum(a) : getNum(a) - getNum(b);
                });
                tbody.innerHTML = '';
                rows.forEach(r => tbody.appendChild(r));
                fixTableHierarchy(tbody);
            };
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initCommonTagSort();
    initResistanceSort();
    initReportTableSort();
    initReportTableFilter();
});

/**
 * 报表筛选层级数据定义
 */
const filterHierarchyData = {
    common: {
        '核心标签': {
            '购车时间': ['计划7天', '计划一个月内买车', '计划三个月内买车']
        },
        '补充标签': {
            '到店行为': ['7天内到店', '已到店-是'],
            '购车意向': ['有意向未确定', '明确购车意向'],
            '购买形态': ['首购', '换购'],
            '客服意愿': ['同意/已经加微信']
        }
    },
    res: {
        '强抗拒': {
            '需求终止': ['无购车需求', '已买车'],
            '意愿拒绝': ['拒绝被联系', '对品牌不认可'],
            '条件限制': ['店内无法上牌', '无法跨区域购买']
        },
        '弱抗拒': {
            '资金障碍': ['购买力不足', '无法获取底价'],
            '便利性障碍': ['近期不方便到店', '店铺距离远'],
            '决策障碍': ['无法直接决策'],
            '产品方案': ['配置不满意', '无现车'],
            '价格方案': ['价格不满意', '优惠不满意']
        }
    }
};

/**
 * 初始化分析报表的筛选功能
 * 升级：支持三级级联下拉、查询与重置按钮
 */
function initReportTableFilter() {
    const tables = document.querySelectorAll('.report-table');
    tables.forEach(table => {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        const originalRows = Array.from(tbody.querySelectorAll('tr'));
        const filterArea = table.closest('.report-section').querySelector('.report-filters');
        if (!filterArea) return;

        const type = filterArea.dataset.type;
        const l1Select = filterArea.querySelector('.l1-filter');
        const l2Select = filterArea.querySelector('.l2-filter');
        const l3Select = filterArea.querySelector('.l3-filter');
        const btnSearch = filterArea.querySelector('.btn-search');
        const btnReset = filterArea.querySelector('.btn-reset');

        // 初始化每行的 dataset
        let curL1 = '', curL2 = '';
        originalRows.forEach(row => {
            const l1 = row.querySelector('.col-l1');
            const l2 = row.querySelector('.col-l2');
            if (l1) curL1 = l1.textContent.trim();
            if (l2) curL2 = l2.textContent.trim();
            row.dataset.l1 = curL1;
            row.dataset.l2 = curL2;
            row.dataset.l3 = row.querySelector('.col-l3')?.textContent.trim() || '';
        });

        const updateL2 = () => {
            const v1 = l1Select.value;
            l2Select.innerHTML = '<option value="">二级分类</option>';
            l3Select.innerHTML = '<option value="">三级标签</option>';
            if (v1 && filterHierarchyData[type][v1]) {
                Object.keys(filterHierarchyData[type][v1]).forEach(v2 => {
                    const opt = document.createElement('option');
                    opt.value = opt.textContent = v2;
                    l2Select.appendChild(opt);
                });
            }
        };

        const updateL3 = () => {
            const v1 = l1Select.value, v2 = l2Select.value;
            l3Select.innerHTML = '<option value="">三级标签</option>';
            if (v1 && v2 && filterHierarchyData[type][v1][v2]) {
                filterHierarchyData[type][v1][v2].forEach(v3 => {
                    const opt = document.createElement('option');
                    opt.value = opt.textContent = v3;
                    l3Select.appendChild(opt);
                });
            }
        };

        l1Select.onchange = updateL2;
        l2Select.onchange = updateL3;

        const apply = () => {
            const v1 = l1Select.value, v2 = l2Select.value, v3 = l3Select.value;
            const matches = originalRows.filter(r => 
                (!v1 || r.dataset.l1 === v1) && 
                (!v2 || r.dataset.l2 === v2) && 
                (!v3 || r.dataset.l3 === v3)
            );
            tbody.innerHTML = '';
            if (matches.length === 0) {
                const colspan = table.querySelectorAll('thead th').length;
                tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center;padding:40px;color:#999">暂无匹配数据</td></tr>`;
            } else {
                matches.forEach(r => tbody.appendChild(r));
                fixTableHierarchy(tbody);
            }
        };

        btnSearch.onclick = apply;
        btnReset.onclick = () => {
            l1Select.value = '';
            updateL2();
            apply();
        };

        // 初次加载确保状态正确
        fixTableHierarchy(tbody);
    });
}

// ==================== 趋势分析核心数据 ====================

// 常见标签三级分类数据（用于趋势分析模拟）
const commonTagsTreeData = {
    l1: [
        { name: '核心标签 (A7ED8A)', count: 1250 },
        { name: '补充标签 (6542E7)', count: 680 }
    ],
    l2: [
        { name: '计划购车时间 (CDA824)', l1Name: '核心标签 (A7ED8A)', count: 580 },
        { name: '预计到店时间 (F109A8)', l1Name: '核心标签 (A7ED8A)', count: 420 },
        { name: '购车意向 (1B0E51)', l1Name: '补充标签 (6542E7)', count: 380 },
        { name: '首购/换购 (1C2FE5)', l1Name: '补充标签 (6542E7)', count: 180 },
        { name: '到店情况 (49AEA6)', l1Name: '补充标签 (6542E7)', count: 120 }
    ],
    l3: [
        { name: '计划7天 (D1E2F4)', l1Name: '核心标签 (A7ED8A)', l2Name: '计划购车时间 (CDA824)', count: 98 },
        { name: '计划一个月内买车 (37F6E4)', l1Name: '核心标签 (A7ED8A)', l2Name: '计划购车时间 (CDA824)', count: 245 },
        { name: '计划三个月内买车 (2DE44A)', l1Name: '核心标签 (A7ED8A)', l2Name: '计划购车时间 (CDA824)', count: 428 },
        { name: '计划三个月后买车 (E1850F)', l1Name: '核心标签 (A7ED8A)', l2Name: '计划购车时间 (CDA824)', count: 156 },
        { name: '7天内 (C76485)', l1Name: '核心标签 (A7ED8A)', l2Name: '预计到店时间 (F109A8)', count: 128 },
        { name: '14天内 (000FA3)', l1Name: '核心标签 (A7ED8A)', l2Name: '预计到店时间 (F109A8)', count: 356 },
        { name: '30天内 (C10710)', l1Name: '核心标签 (A7ED8A)', l2Name: '预计到店时间 (F109A8)', count: 89 },
        { name: '有意向未确定 (105666)', l1Name: '核心标签 (A7ED8A)', l2Name: '预计到店时间 (F109A8)', count: 186 },
        { name: '明确购车意向 (0BB120)', l1Name: '补充标签 (6542E7)', l2Name: '购车意向 (1B0E51)', count: 298 },
        { name: '有意向未确定 (105666)', l1Name: '补充标签 (6542E7)', l2Name: '购车意向 (1B0E51)', count: 82 },
        { name: '首购 (FC3D71)', l1Name: '补充标签 (6542E7)', l2Name: '首购/换购 (1C2FE5)', count: 142 },
        { name: '换购 (1687B1)', l1Name: '补充标签 (6542E7)', l2Name: '首购/换购 (1C2FE5)', count: 86 },
        { name: '已到店-是 (B8B9C5)', l1Name: '补充标签 (6542E7)', l2Name: '到店情况 (49AEA6)', count: 76 },
        { name: '同意 (E61F2C)', l1Name: '补充标签 (6542E7)', l2Name: '到店情况 (49AEA6)', count: 44 }
    ]
};

// 抗拒点三级分类数据（用于趋势分析模拟）
const resistanceTagsTreeData = {
    l1: [
        { name: '强抗拒 (3E097F)', count: 890 },
        { name: '弱抗拒 (FE772A)', count: 567 }
    ],
    l2: [
        { name: '需求终止 (763D53)', l1Name: '强抗拒 (3E097F)', count: 445 },
        { name: '意愿拒绝 (3A1D15)', l1Name: '强抗拒 (3E097F)', count: 320 },
        { name: '产品方案 (AD4E6D)', l1Name: '弱抗拒 (FE772A)', count: 189 },
        { name: '价格方案 (D27120)', l1Name: '弱抗拒 (FE772A)', count: 234 },
        { name: '资金障碍 (AE7F71)', l1Name: '弱抗拒 (FE772A)', count: 144 }
    ],
    l3: [
        { name: '无购车需求 (0806E4)', l1Name: '强抗拒 (3E097F)', l2Name: '需求终止 (763D53)', count: 278 },
        { name: '已买车 (F572FE)', l1Name: '强抗拒 (3E097F)', l2Name: '需求终止 (763D53)', count: 167 },
        { name: '拒绝被联系 (84D150)', l1Name: '强抗拒 (3E097F)', l2Name: '意愿拒绝 (3A1D15)', count: 78 },
        { name: '优惠不满意 (619D48)', l1Name: '弱抗拒 (FE772A)', l2Name: '价格方案 (D27120)', count: 189 },
        { name: '价格不满意 (5A05F3)', l1Name: '弱抗拒 (FE772A)', l2Name: '价格方案 (D27120)', count: 312 },
        { name: '分期费用高 (D78729)', l1Name: '弱抗拒 (FE772A)', l2Name: '价格方案 (D27120)', count: 123 },
        { name: '配置不满意 (C9A1AB)', l1Name: '弱抗拒 (FE772A)', l2Name: '产品方案 (AD4E6D)', count: 112 },
        { name: '无现车 (1C9A8C)', l1Name: '弱抗拒 (FE772A)', l2Name: '产品方案 (AD4E6D)', count: 98 },
        { name: '首付不够 (E400AD)', l1Name: '弱抗拒 (FE772A)', l2Name: '资金障碍 (AE7F71)', count: 89 }
    ]
};

// ==================== 趋势分析核心逻辑 ====================

// 统一趋势图颜色方案
const trendChartColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#ff9f7f'
];

/**
 * 通用趋势分析组件类
 */
class TrendAnalyzer {
    constructor(config) {
        this.config = config;
        this.selectedTags = [];
        this.init();
    }

    init() {
        const { selectorBtnId, dropdownId, tagListId, chartSvgId, emptyStateId, legendId, searchInputId, clearBtnId, countElId, treeDataGetter } = this.config;

        const selectorBtn = document.getElementById(selectorBtnId);
        const dropdown = document.getElementById(dropdownId);
        if (!selectorBtn || !dropdown) return;

        selectorBtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            if (dropdown.classList.contains('show')) {
                this.renderTagList();
            }
        };

        document.addEventListener('click', (e) => {
            if (!e.target.closest(`#${dropdownId}`) && !e.target.closest(`#${selectorBtnId}`)) {
                dropdown.classList.remove('show');
            }
        });

        const searchInput = document.getElementById(searchInputId);
        if (searchInput) {
            searchInput.oninput = (e) => {
                const keyword = e.target.value.toLowerCase();
                const items = document.querySelectorAll(`#${tagListId} .tag-tree-level`);
                items.forEach(item => {
                    const nameEl = item.querySelector('.tag-item-name');
                    if (nameEl) {
                        const name = nameEl.textContent.toLowerCase();
                        item.style.display = name.includes(keyword) ? '' : 'none';
                    }
                });
            };
        }

        const clearBtn = document.getElementById(clearBtnId);
        if (clearBtn) {
            clearBtn.onclick = () => {
                this.selectedTags = [];
                this.updateUI();
            };
        }

        this.setDefaultSelection();

        // 绑定导出按钮
        const exportBtn = document.getElementById(this.config.exportBtnId);
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCsv());
        }
    }

    exportCsv() {
        if (this.selectedTags.length === 0) {
            showNotification('请先选择至少一个标签后再导出', 'info');
            return;
        }

        const exportBtn = document.getElementById(this.config.exportBtnId);
        const originalHtml = exportBtn?.innerHTML;
        if (exportBtn) {
            exportBtn.disabled = true;
            exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 导出中...';
        }

        showNotification('正在生成趋势分析报表...', 'info');

        setTimeout(() => {
            const { dates, isWeekly } = this.getDatesAndGranularity();
            const treeData = this.config.treeDataGetter();

            // ---- 构建表头：一级分类 | 二级分类 | 三级标签 | 日期1 | 日期2 | ...
            const headerCols = ['一级分类', '二级分类', '三级标签'];
            const dateCols = dates.map(d => isWeekly ? d : d.substring(5)); // 周保留全名，日截短为 MM-DD
            const headers = [...headerCols, ...dateCols];

            const csvRows = [headers.map(h => `"${h}"`).join(',')];

            // ---- 为每个选中标签生成一行数据
            this.selectedTags.forEach((tag, idx) => {
                // 从 treeData 中找到对应的层级信息
                let l1Name = '', l2Name = '', l3Name = '';
                if (tag.level === 1) {
                    l1Name = tag.name;
                } else if (tag.level === 2) {
                    l1Name = tag.l1Name || '';
                    l2Name = tag.name;
                } else {
                    l1Name = tag.l1Name || '';
                    l2Name = tag.l2Name || '';
                    l3Name = tag.name;
                }

                // 生成该标签在各个时间点的模拟数值
                const values = this.getValues(tag.count, dates.length);
                const dataRow = [
                    `"${l1Name}"`,
                    `"${l2Name}"`,
                    `"${l3Name}"`,
                    ...values.map(v => `"${v}"`)
                ];
                csvRows.push(dataRow.join(','));
            });

            const blob = new Blob(['\ufeff' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const title = isWeekly ? '按周趋势分析' : '按日趋势分析';
            a.download = `${title}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (exportBtn) {
                exportBtn.disabled = false;
                exportBtn.innerHTML = originalHtml;
            }
            showNotification('趋势分析报表导出完成', 'success');
        }, 800);
    }

    setDefaultSelection() {
        const treeData = this.config.treeDataGetter();
        if (!treeData || !treeData.l3 || treeData.l3.length === 0) return;
        const topTag = treeData.l3.reduce((max, tag) => tag.count > max.count ? tag : max, treeData.l3[0]);
        if (topTag) {
            this.selectedTags = [{
                name: topTag.name, level: 3, l1Name: topTag.l1Name, l2Name: topTag.l2Name,
                color: trendChartColors[0], count: topTag.count
            }];
            this.updateUI();
        }
    }

    renderTagList() {
        const container = document.getElementById(this.config.tagListId);
        if (!container) return;
        const treeData = this.config.treeDataGetter();
        let html = '';

        treeData.l1.forEach((l1, l1Idx) => {
            html += `<div class="tag-tree-level tag-tree-l1" data-level="1" data-name="${l1.name}">
                <div class="tag-tree-row">
                    <i class="fa-solid fa-chevron-right tag-tree-toggle"></i>
                    <div class="tag-checkbox"><i class="fa-solid fa-check"></i></div>
                    <span class="tag-item-name">${l1.name}</span>
                    <span class="tag-item-color" style="background:${trendChartColors[l1Idx % 10]}"></span>
                    <span class="tag-level-badge">一级</span>
                </div><div class="tag-tree-children" style="display:none">`;
            
            treeData.l2.filter(l2 => l2.l1Name === l1.name).forEach((l2, l2Idx) => {
                html += `<div class="tag-tree-level tag-tree-l2" data-level="2" data-name="${l2.name}" data-l1name="${l1.name}">
                    <div class="tag-tree-row">
                        <i class="fa-solid fa-chevron-right tag-tree-toggle"></i>
                        <div class="tag-checkbox"><i class="fa-solid fa-check"></i></div>
                        <span class="tag-item-name">${l2.name}</span>
                        <span class="tag-item-color" style="background:${trendChartColors[(l1Idx*3+l2Idx)%10]}"></span>
                        <span class="tag-level-badge">二级</span>
                    </div><div class="tag-tree-children" style="display:none">`;
                
                treeData.l3.filter(l3 => l3.l2Name === l2.name).forEach((l3, l3Idx) => {
                    html += `<div class="tag-tree-level tag-tree-l3" data-level="3" data-name="${l3.name}" data-l1name="${l1.name}" data-l2name="${l2.name}">
                        <div class="tag-tree-row">
                            <div class="tag-checkbox"><i class="fa-solid fa-check"></i></div>
                            <span class="tag-item-name">${l3.name}</span>
                            <span class="tag-item-color" style="background:${trendChartColors[(l1Idx*5+l2Idx*2+l3Idx)%10]}"></span>
                            <span class="tag-level-badge">三级</span>
                        </div></div>`;
                });
                html += `</div></div>`;
            });
            html += `</div></div>`;
        });

        container.innerHTML = html;
        container.querySelectorAll('.tag-tree-toggle').forEach(t => t.onclick = (e) => {
            e.stopPropagation();
            const child = t.closest('.tag-tree-row').nextElementSibling;
            child.style.display = child.style.display === 'none' ? 'block' : 'none';
            t.classList.toggle('expanded');
        });

        container.querySelectorAll('.tag-tree-row').forEach(row => row.onclick = () => {
            const item = row.closest('.tag-tree-level');
            const level = parseInt(item.dataset.level);
            const name = item.dataset.name;
            const l1Name = item.dataset.l1name || '';
            const l2Name = item.dataset.l2name || '';

            const idx = this.selectedTags.findIndex(t => t.name === name && t.level === level && (level < 2 || t.l1Name === l1Name) && (level < 3 || t.l2Name === l2Name));
            if (idx >= 0) this.selectedTags.splice(idx, 1);
            else if (this.selectedTags.length < 8) {
                const data = treeData[`l${level}`].find(d => d.name === name && (level < 2 || d.l1Name === l1Name) && (level < 3 || d.l2Name === l2Name));
                this.selectedTags.push({ name, level, l1Name, l2Name, count: data?data.count:50, color: trendChartColors[this.selectedTags.length % 10] });
            } else alert('最多选择8个标签');
            this.updateUI();
        });
        this.updateTagListUI();
    }

    updateTagListUI() {
        const container = document.getElementById(this.config.tagListId);
        if (container) container.querySelectorAll('.tag-tree-level').forEach(item => {
            const isSelected = this.selectedTags.some(t => t.name === item.dataset.name && t.level === parseInt(item.dataset.level));
            item.classList.toggle('selected', isSelected);
        });
    }

    updateUI() {
        this.updateTagListUI();
        const countEl = document.getElementById(this.config.countElId);
        if (countEl) {
            countEl.textContent = this.selectedTags.length;
            countEl.style.display = this.selectedTags.length > 0 ? '' : 'none';
        }
        this.renderLineChart();
    }

    renderLineChart() {
        const svg = document.getElementById(this.config.chartSvgId);
        if (!svg) return;
        const legend = document.getElementById(this.config.legendId);
        const empty = document.getElementById(this.config.emptyStateId);

        if (this.selectedTags.length === 0) {
            svg.style.display = 'none';
            empty.style.display = 'flex';
            legend.innerHTML = '';
            return;
        }

        svg.style.display = '';
        empty.style.display = 'none';

        // 根据日期区间动态决定粒度
        const dateInfo = this.getDatesAndGranularity();
        const { dates, isWeekly } = dateInfo;
        const pointCount = dates.length;

        const allData = this.selectedTags.map(tag => ({ ...tag, dates: dates, values: this.getValues(tag.count, pointCount) }));
        const w = svg.parentElement.clientWidth - 32, h = 260, pad = { t: 30, b:40, l:60, r:20 }, plotW = w-pad.l-pad.r, plotH = h-pad.t-pad.b;
        
        const allVal = allData.flatMap(d => d.values);
        const maxVal = Math.ceil(Math.max(...allVal, 10) * 1.1);
        const minVal = Math.floor(Math.min(...allVal, 0) * 0.9);
        
        // 动态计算横轴步长
        const xStep = plotW / Math.max(pointCount - 1, 1);

        let svgHtml = '';
        // 绘制 Y 轴
        for(let i=0; i<=5; i++) {
            const y = pad.t + (plotH/5)*i;
            svgHtml += `<line x1="${pad.l}" y1="${y}" x2="${w-pad.r}" y2="${y}" stroke="#f0f0f0" stroke-dasharray="4,2"/>`;
            svgHtml += `<text x="${pad.l-10}" y="${y+4}" text-anchor="end" font-size="11" fill="#999">${Math.round(maxVal - (maxVal-minVal)*i/5)}</text>`;
        }

        // 绘制 X 轴日期标签
        const labelInterval = isWeekly ? 1 : (pointCount > 15 ? 5 : 2);
        for(let i=0; i < pointCount; i += labelInterval) {
            const x = pad.l + i * xStep;
            const fullDate = dates[i];
            const displayDate = isWeekly ? fullDate : fullDate.substring(5); // 周展示全名/日期截取
            svgHtml += `<text x="${x}" y="${h-15}" text-anchor="middle" font-size="10" fill="#999">${displayDate}</text>`;
        }

        allData.forEach((s, sIdx) => {
            const points = s.values.map((v, i) => `${pad.l+i*xStep},${pad.t+plotH-((v-minVal)/(maxVal-minVal || 1))*plotH}`).join(' ');
            svgHtml += `<polyline points="${points}" fill="none" stroke="${s.color}" stroke-width="2.5" />`;
            s.values.forEach((v, i) => {
                const x = pad.l+i*xStep, y = pad.t+plotH-((v-minVal)/(maxVal-minVal || 1))*plotH;
                svgHtml += `<circle cx="${x}" cy="${y}" r="12" fill="transparent" class="data-point" data-idx="${i}" data-v="${v}" data-date="${s.dates[i]}" data-sidx="${sIdx}"/>`;
                svgHtml += `<circle cx="${x}" cy="${y}" r="4" fill="${s.color}" stroke="white" stroke-width="2"/>`;
            });
        });

        svgHtml += `<g class="chart-tooltip" style="display:none"><rect class="tip-bg" rx="6" fill="rgba(0,0,0,0.85)"/><text class="tip-date" text-anchor="middle" fill="white" font-size="11"/><g class="tip-content"></g></g>`;
        svg.innerHTML = svgHtml;
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);

        const tip = svg.querySelector('.chart-tooltip'), bg = tip.querySelector('.tip-bg'), dateEl = tip.querySelector('.tip-date'), cont = tip.querySelector('.tip-content');
        svg.onmousemove = (e) => {
            const p = e.target.closest('.data-point');
            if (!p) { tip.style.display = 'none'; return; }
            tip.style.display = 'block';
            dateEl.textContent = p.dataset.date;
            dateEl.setAttribute('x', 70); dateEl.setAttribute('y', 20);
            cont.innerHTML = allData.map((s, i) => `<text x="12" y="${38+i*16}" fill="${s.color}" font-size="11">${s.name}: ${s.values[p.dataset.idx]}</text>`).join('');
            bg.setAttribute('width', 140); bg.setAttribute('height', 45+allData.length*16);
            const r = svg.getBoundingClientRect();
            let x = e.clientX-r.left+15, y = e.clientY-r.top-40;
            if (x+150 > r.width) x -= 170;
            tip.setAttribute('transform', `translate(${x},${y})`);
        };
        svg.onmouseleave = () => tip.style.display = 'none';
        legend.innerHTML = allData.map(s => `<div class="legend-item"><span class="legend-dot" style="background:${s.color}"></span><span>${s.name}</span></div>`).join('');
    }

    getDatesAndGranularity() {
        const startInput = document.getElementById('startDate');
        const endInput = document.getElementById('endDate');
        const start = new Date(startInput?.value || '2024-05-01');
        const end = new Date(endInput?.value || '2024-05-30');
        
        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
        const isWeekly = diffDays > 31;
        const dates = [];

        if (isWeekly) {
            // 按周生成，如 2024-W19
            let current = new Date(start);
            while (current <= end) {
                const weekNum = this.getWeekNumber(current);
                const label = `${current.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
                if (!dates.includes(label)) dates.push(label);
                current.setDate(current.getDate() + 7);
            }
        } else {
            // 按日生成
            let current = new Date(start);
            for(let i=0; i < diffDays; i++) {
                dates.push(formatDate(current));
                current.setDate(current.getDate() + 1);
            }
        }
        return { dates, isWeekly };
    }

    getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    }

    getValues(base, count) {
        const v = [];
        for(let i=0; i < count; i++) v.push(Math.round(base * (0.8 + Math.random()*0.4)));
        return v;
    }
}

function initAnalyzers() {
    window.commonAnalyzer = new TrendAnalyzer({
        selectorBtnId: 'openTagSelector', dropdownId: 'tagDropdown', tagListId: 'tagListForSelection',
        chartSvgId: 'lineChartSvg', emptyStateId: 'chartEmptyState', legendId: 'chartLegend',
        searchInputId: 'tagSearchInput', clearBtnId: 'clearAllTags', countElId: 'selectedTagCount',
        exportBtnId: 'exportTrendBtn',
        treeDataGetter: () => commonTagsTreeData
    });

    window.resistanceAnalyzer = new TrendAnalyzer({
        selectorBtnId: 'openTagSelector2', dropdownId: 'tagDropdown2', tagListId: 'tagListForSelection2',
        chartSvgId: 'lineChartSvg2', emptyStateId: 'chartEmptyState2', legendId: 'chartLegend2',
        searchInputId: 'tagSearchInput2', clearBtnId: 'clearAllTags2', countElId: 'selectedTagCount2',
        exportBtnId: 'exportTrendBtn2',
        treeDataGetter: () => resistanceTagsTreeData
    });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(() => {
            if (window.commonAnalyzer) window.commonAnalyzer.renderLineChart();
            if (window.resistanceAnalyzer) window.resistanceAnalyzer.renderLineChart();
        }, 300);
    });
});

window.addEventListener('load', initAnalyzers);


