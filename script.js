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

// 初始化日期区间为最近30天
function initDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    document.getElementById('startDate').value = formatDate(startDate);
    document.getElementById('endDate').value = formatDate(endDate);
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
    initMdGeneration();     // 初始化 MD 生成功能
    initManualReview();     // 初始化人工复核功能
    initFaqModal();
    initTrendModal();
    initHotRankingModal();
    initHotTrendsModal();
});

// 人工复核跳转逻辑
function initManualReview() {
    const btn = document.getElementById('manualReviewBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        // 跳转到人工复核任务中心
        window.location.href = 'manual_review.html';
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

function initCommonTagCharts() {
    const container = document.getElementById('commonTagChart');
    if (!container) return;

    // 读取 common-issues-modal 树数据
    const modal = document.getElementById('common-issues-modal');
    if (!modal) return;

    // 收集一级分类
    const l1Nodes = modal.querySelectorAll(':scope > .category-tree > .tree-node.tree-level-1');
    const l1Data = [];
    l1Nodes.forEach(node => {
        const labelEl = node.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
        if (labelEl) {
            const name = labelEl.textContent.replace(/\s*\([^)]*\)$/, '');
            const l2Count = node.querySelectorAll(':scope > .tree-children > .tree-node.tree-level-2').length;
            l1Data.push({ name, count: l2Count });
        }
    });

    // 收集二级分类
    const l2Data = [];
    l1Nodes.forEach(node => {
        const l1LabelEl = node.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
        const l1Name = l1LabelEl ? l1LabelEl.textContent.replace(/\s*\([^)]*\)$/, '') : '';
        const l2Nodes = node.querySelectorAll(':scope > .tree-children > .tree-node.tree-level-2');
        l2Nodes.forEach(l2 => {
            const labelEl = l2.querySelector(':scope > .tree-header > .tree-header-left > .tree-label');
            if (labelEl) {
                const name = labelEl.textContent.replace(/\s*\([^)]*\)$/, '');
                const l3Count = l2.querySelectorAll(':scope > .tree-children > .tree-node.tree-level-3').length;
                l2Data.push({ name, count: l3Count, l1Name });
            }
        });
    });

    // 计算百分比
    const totalL1 = l1Data.reduce((sum, item) => sum + item.count, 0) || 1;
    const totalL2 = l2Data.reduce((sum, item) => sum + item.count, 0) || 1;

    // 双环SVG：内环(L1) r=11 圆周≈69.12，外环(L2) r=17 圆周≈106.82
    const L1_R = 11, L1_C = 2 * Math.PI * L1_R;       // 69.115
    const L2_R = 17, L2_C = 2 * Math.PI * L2_R;       // 106.814

    let svg = `<svg width="160" height="160" viewBox="0 0 44 44" class="pie-chart-svg">`;

    // 内环：一级分类
    let l1Offset = 0;
    l1Data.forEach((item, i) => {
        const percent = Math.round((item.count / totalL1) * 100);
        const dashLen = (percent / 100) * L1_C;
        const color = chartColors[i % chartColors.length];
        svg += `<circle cx="22" cy="22" r="${L1_R}" fill="transparent" stroke="${color}" stroke-width="5" stroke-dasharray="${dashLen.toFixed(2)} ${(L1_C - dashLen).toFixed(2)}" stroke-dashoffset="${(-l1Offset).toFixed(2)}"></circle>`;
        l1Offset += dashLen;
    });

    // 外环：二级分类
    let l2Offset = 0;
    l2Data.forEach((item, i) => {
        const percent = Math.round((item.count / totalL2) * 100);
        const dashLen = (percent / 100) * L2_C;
        const color = chartColors[i % chartColors.length];
        svg += `<circle cx="22" cy="22" r="${L2_R}" fill="transparent" stroke="${color}" stroke-width="4" stroke-dasharray="${dashLen.toFixed(2)} ${(L2_C - dashLen).toFixed(2)}" stroke-dashoffset="${(-l2Offset).toFixed(2)}"></circle>`;
        l2Offset += dashLen;
    });

    svg += '</svg>';

    // 图例：先一级后二级，带环层级指示
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
            legend += `<div class="legend-item"><span class="legend-ring-dot outer" style="background:${color};"></span><span class="legend-label">${item.name}</span><span class="percent">${item.count} (${percent}%)</span></div>`;
        });
    }
    legend += '</div>';

    container.innerHTML = '<div class="pie-chart-container"><div class="double-ring-wrapper">' + svg + '</div>' + legend + '</div>';
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
        document.getElementById('nodeCode').setAttribute('readonly', 'readonly');
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
        document.getElementById('nodeCode').setAttribute('readonly', 'readonly');
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

// 全量明细数据下载逻辑
function initFullDetailExport() {
    const downloadBtn = document.getElementById('downloadFullDetailBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
        // 模拟生成全量详细数据
        // 每条记录: [基础字段..., 常见问题列表, 抗拒点列表]
        // 基础字段: callid, 外呼开始时间, 外呼结束时间, 主叫号码, 被叫号码, 业务类型, R渠道, 大项目, sc值, 呼叫类型
        const rawData = [
            { base: ['CALL_20240520_001', '2024-05-20 10:30:15', '2024-05-20 10:32:40', '075588881234', '13800138001', '新车新线索', 'R1', '大项目A', '85', '呼出-手动'], common: ['落地价', '购置税'], resistance: ['价格无优惠'] },
            { base: ['CALL_20240520_002', '2024-05-20 11:15:20', '2024-05-20 11:16:46', '075588885678', '13911122223', '新车新线索', 'R2', '大项目B', '72', '呼出-预测'], common: ['样车到店', '提车周期'], resistance: ['交付周期长'] },
            { base: ['CALL_20240520_003', '2024-05-20 14:45:10', '2024-05-20 14:48:40', '075588881234', '13722233334', '冷线索培育', 'R1', '大项目A', '68', '呼出-AI'], common: ['置换补贴', '二手车评估'], resistance: ['库存短缺'] },
            { base: ['CALL_20240519_001', '2024-05-19 09:12:05', '2024-05-19 09:13:07', '075588881234', '13644455556', '新车新线索', 'R3', '大项目C', '90', '呼出-手动'], common: ['分期利率', '贷款政策'], resistance: ['续航焦虑'] },
            { base: ['CALL_20240519_002', '2024-05-19 16:20:33', '2024-05-19 16:25:45', '075588885678', '15055566667', '留资未满培育', 'R2', '大项目B', '55', '呼入'], common: ['样车到店', '颜色选择'], resistance: ['家人反对'] },
            { base: ['CALL_20240518_001', '2024-05-18 10:05:44', '2024-05-18 10:07:42', '075588881234', '15177889900', '新车新线索', 'R4', '大项目D', '78', '呼出-预测'], common: ['活动优惠'], resistance: ['品牌认可度低'] },
            { base: ['CALL_20240518_002', '2024-05-18 15:30:12', '2024-05-18 15:33:27', '075588885678', '18899011122', '线索导入', 'R1', '大项目A', '62', '呼出-AI'], common: ['提车时间'], resistance: ['服务态度差'] }
        ];

        const baseHeaders = ['callid', '外呼开始时间', '外呼结束时间', '主叫号码', '被叫号码', '业务类型', 'R渠道', '大项目', 'sc值', '呼叫类型'];

        // 计算最大标签数量
        const maxCommon = Math.max(...rawData.map(d => d.common.length));
        const maxResistance = Math.max(...rawData.map(d => d.resistance.length));

        // 动态生成表头
        const commonHeaders = Array.from({ length: maxCommon }, (_, i) => `涉及常见标签${i + 1}`);
        const resistanceHeaders = Array.from({ length: maxResistance }, (_, i) => `涉及抗拒点${i + 1}`);
        const headers = [...baseHeaders, ...commonHeaders, ...resistanceHeaders];

        // 生成数据行
        const dataRows = rawData.map(item => {
            // 基础字段
            const row = [...item.base];
            // 常见问题（补空列）
            for (let i = 0; i < maxCommon; i++) {
                row.push(item.common[i] || '');
            }
            // 抗拒点（补空列）
            for (let i = 0; i < maxResistance; i++) {
                row.push(item.resistance[i] || '');
            }
            return row;
        });

        const csvContent = '\uFEFF' + [headers, ...dataRows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 10);
        a.download = `用户洞察明细数据_${timestamp}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
    // 使用更精确的选择器，注意HTML中Tab ID是common-issues
    const sortBtns = document.querySelectorAll('.tab-pane#common-issues .sort-switch-btn');
    if (!sortBtns.length) return;

    const tableBody = document.querySelector('.tab-pane#common-issues .ranking-card .data-table tbody');
    if (!tableBody) return;

    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const sortType = this.dataset.sort;
            const rows = Array.from(tableBody.querySelectorAll('tr'));

            // 提取每行数据进行排序
            const rowData = rows.map(row => {
                const cells = row.querySelectorAll('td');
                const count = parseInt(cells[2]?.textContent?.trim()) || 0;
                // 提取环比数值（可能是正数或负数）
                const trendEl = cells[4]?.querySelector('.trend-up, .trend-down');
                const trendText = trendEl?.textContent?.trim() || '0%';
                const trendMatch = trendText.match(/([\d.]+)%/);
                const trend = trendMatch ? parseFloat(trendMatch[1]) * (trendText.includes('down') ? -1 : 1) : 0;
                const hot = parseInt(cells[5]?.querySelector('.hot-value')?.textContent?.trim()) || 0;

                return { row: row.cloneNode(true), count, trend, hot };
            });

            // 根据排序类型排序
            if (sortType === 'count') {
                rowData.sort((a, b) => b.count - a.count);
            } else if (sortType === 'trend') {
                rowData.sort((a, b) => b.trend - a.trend);
            } else if (sortType === 'hot') {
                rowData.sort((a, b) => b.hot - a.hot);
            }

            // 重新渲染表格
            tableBody.innerHTML = '';
            rowData.forEach((item, index) => {
                const newRow = item.row;
                // 更新排名显示
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
            // 更新按钮状态
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const sortType = this.dataset.sort;
            const rows = Array.from(tableBody.querySelectorAll('tr'));

            // 提取每行数据进行排序
            const rowData = rows.map(row => {
                const cells = row.querySelectorAll('td');
                const count = parseInt(cells[2]?.textContent?.trim()) || 0;
                // 提取环比数值
                const trendEl = cells[4]?.querySelector('.trend-up, .trend-down');
                const trendText = trendEl?.textContent?.trim() || '0%';
                const trendMatch = trendText.match(/([\d.]+)%/);
                const trend = trendMatch ? parseFloat(trendMatch[1]) * (trendText.includes('down') ? -1 : 1) : 0;

                return { row: row.cloneNode(true), count, trend };
            });

            // 根据排序类型排序
            if (sortType === 'count') {
                rowData.sort((a, b) => b.count - a.count);
            } else if (sortType === 'trend') {
                rowData.sort((a, b) => b.trend - a.trend);
            }

            // 重新渲染表格
            tableBody.innerHTML = '';
            rowData.forEach((item, index) => {
                const newRow = item.row;
                // 更新排名显示
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

window.addEventListener('DOMContentLoaded', () => {
    initCommonTagSort();
    initResistanceSort();
});

