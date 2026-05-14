// Toggle navigation groups
document.querySelectorAll('.nav-group-header').forEach(header => {
    header.addEventListener('click', () => {
        const navGroup = header.closest('.nav-group');
        navGroup.classList.toggle('open');
    });
});

// Tab 切换功能
document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // 只针对主 Tab 进行状态重置
        document.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(tabId);
        if (targetPane) {
            targetPane.classList.add('active');
        }
    });
});

// 初始化时间范围快捷选择 + 自定义日期
function initDateRange() {
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    const shortcuts = document.getElementById('dateShortcuts');
    const customInputs = document.getElementById('customDateInputs');
    if (!startInput || !endInput || !shortcuts) return;

    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    const todayStr = formatDate(today);
    const twoYearsAgoStr = formatDate(twoYearsAgo);

    startInput.min = twoYearsAgoStr;
    startInput.max = todayStr;
    endInput.min = twoYearsAgoStr;
    endInput.max = todayStr;

    // 当前选中范围（内部状态，默认30天）
    let currentDays = 30;

    // 设置日期输入值
    function setDateValues(days) {
        const start = new Date();
        start.setDate(today.getDate() - days);
        startInput.value = formatDate(start);
        endInput.value = todayStr;
    }

    // 初始化：默认近30天
    setDateValues(30);

    // 快捷按钮点击事件
    shortcuts.addEventListener('click', (e) => {
        const btn = e.target.closest('.shortcut-btn');
        if (!btn) return;

        // 更新按钮 active 状态
        shortcuts.querySelectorAll('.shortcut-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const range = btn.dataset.range;
        if (range === 'custom') {
            // 显示自定义日期输入
            customInputs.style.display = 'flex';
            // 用当前 internal days 填充自定义输入
            setDateValues(currentDays);
        } else {
            // 隐藏自定义日期输入
            customInputs.style.display = 'none';
            currentDays = parseInt(range);
            setDateValues(currentDays);
        }
    });

    // 自定义日期变更校验：最大92天
    const validateCustomRange = (changedInput) => {
        const start = new Date(startInput.value);
        const end = new Date(endInput.value);

        if (start > end) {
            if (changedInput === 'start') endInput.value = startInput.value;
            else startInput.value = endInput.value;
            return;
        }

        const maxRange = 92 * 24 * 60 * 60 * 1000;
        if (end - start > maxRange) {
            alert('统计日期区间最大可选 90 天范围');
            if (changedInput === 'start') {
                const newEnd = new Date(start.getTime() + maxRange);
                endInput.value = formatDate(newEnd > today ? today : newEnd);
            } else {
                const newStart = new Date(end.getTime() - maxRange);
                startInput.value = formatDate(newStart < twoYearsAgo ? twoYearsAgo : newStart);
            }
        }
    };

    startInput.addEventListener('change', () => validateCustomRange('start'));
    endInput.addEventListener('change', () => validateCustomRange('end'));
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
    initDateRange();
    initModal();
    initGlobalFilters();    // 新增：全局筛选器逻辑
    initProjectRankInteraction(); // 初始化大项目排名交互
    initScheduleRankInteraction(); // 初始化排期排名交互
});

// 全局筛选器交互逻辑
function initGlobalFilters() {
    const queryBtn = document.getElementById('queryBtn');
    const resetBtn = document.getElementById('resetBtn');

    if (queryBtn) {
        queryBtn.addEventListener('click', () => {
            showNotification('正在基于线索创建日期为您聚合统计数据...', 'info');

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

                showNotification('数据更新成功（已基于所选条件重新取值）', 'success');
            }, 800);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            showNotification('正在重置筛选条件...', 'info');
            // 重置所有筛选器
            setTimeout(() => {
                showNotification('筛选条件已重置', 'success');
            }, 300);
        });
    }
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

        const hasLevel3 = true;
        const rows = [];
        const level1Nodes = modal.querySelectorAll('.tree-level-1');

        level1Nodes.forEach(l1 => {
            const l1Header = l1.querySelector('.tree-header-left');
            const l1Name = l1Header?.querySelector('.tree-label')?.textContent?.trim() || '';
            const l1Code = l1Header?.querySelector('.tree-code')?.textContent?.trim()?.replace(/[\[\]]/g, '') || '';

            const l2Nodes = l1.querySelectorAll('.tree-level-2');
            l2Nodes.forEach(l2 => {
                const l2Header = l2.querySelector('.tree-header-left');
                const l2Name = l2Header?.querySelector('.tree-label')?.textContent?.trim() || '';
                const l2Code = l2Header?.querySelector('.tree-code')?.textContent?.trim()?.replace(/[\[\]]/g, '') || '';

                const l3Nodes = l2.querySelectorAll('.tree-level-3');
                if (l3Nodes.length > 0) {
                    l3Nodes.forEach(l3 => {
                        const l3Header = l3.querySelector('.tree-header-left');
                        const l3Name = l3Header?.querySelector('.tree-label')?.textContent?.trim() || '';
                        const l3Code = l3Header?.querySelector('.tree-code')?.textContent?.trim()?.replace(/[\[\]]/g, '') || '';
                        const logicDesc = l3.dataset.logicDesc || '';
                        rows.push([l1Name, l1Code, l2Name, l2Code, l3Name, l3Code, logicDesc]);
                    });
                } else {
                    // 如果没有三级，则导出二级信息，三级列留空
                    const logicDesc = l2.dataset.logicDesc || '';
                    rows.push([l1Name, l1Code, l2Name, l2Code, '-', '-', logicDesc]);
                }
            });
        });

        const headers = ['一级分类名称', '一级分类编码', '二级分类名称', '二级分类编码', '三级分类名称', '三级分类编码', '标签逻辑说明'];

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

    // 模板下载逻辑
    const downloadTemplate = (headers, filename) => {
        const csvContent = '\ufeff' + headers.join(',');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    document.getElementById('templateCommonIssues')?.addEventListener('click', () => {
        downloadTemplate(['一级名称', '一级编码', '二级名称', '二级编码', '三级名称', '三级编码', '标签逻辑说明'], '常见问题标签导入模板.csv');
    });

    document.getElementById('templateResistancePoints')?.addEventListener('click', () => {
        downloadTemplate(['一级名称', '一级编码', '二级名称', '二级编码', '标签逻辑说明'], '客户抗拒点标签导入模板.csv');
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

            const formTitle = document.getElementById('nodeFormTitle').textContent;
            const isEditMode = formTitle.includes('编辑');

            // 新增模式下校验编码唯一性
            if (!isEditMode) {
                const allLabels = document.querySelectorAll('.tree-label');
                const isDuplicate = Array.from(allLabels).some(el => {
                    const text = el.textContent;
                    const match = text.match(/\(([^)]+)\)$/);
                    return match && match[1] === nodeCode;
                });

                if (isDuplicate) {
                    alert(`编码 "${nodeCode}" 已被使用，请更换一个唯一的编码`);
                    return;
                }
            }

            const isLogicDescRequired = formModal.dataset.isLogicDescRequired === 'true';
            if (isLogicDescRequired && !logicDesc) {
                alert('请输入标签逻辑说明');
                return;
            }

            // const formTitle = document.getElementById('nodeFormTitle').textContent;
            // const isEditMode = formTitle.includes('编辑');

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
        document.getElementById('nodeCode').removeAttribute('readonly');
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
                        ${isPos ? `
                <td class="col-name">${item.name}</td>
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
        btn.addEventListener('click', function () {
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
        btn.addEventListener('click', function () {
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

        const isSameL1 = (i > 0 && rows[i - 1].dataset.l1 === v1);
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
        { name: 'A. 人 (决策主体)', count: 890 },
        { name: 'B. 货 (产品价值)', count: 620 },
        { name: 'C. 场 (购车环境)', count: 430 }
    ],
    l2: [
        { name: '强抗拒 (流失预警)', l1Name: 'A. 人 (决策主体)', count: 510 },
        { name: '弱抗拒 (培育空间)', l1Name: 'A. 人 (决策主体)', count: 380 },
        { name: '强抗拒 (硬伤)', l1Name: 'B. 货 (产品价值)', count: 320 },
        { name: '弱抗拒 (博弈点)', l1Name: 'B. 货 (产品价值)', count: 300 },
        { name: '强抗拒 (地域/政策)', l1Name: 'C. 场 (购车环境)', count: 210 },
        { name: '弱抗拒 (体验感)', l1Name: 'C. 场 (购车环境)', count: 220 }
    ],
    l3: [
        // A. 人 - 强抗拒
        { name: '已购竞品', l1Name: 'A. 人 (决策主体)', l2Name: '强抗拒 (流失预警)', count: 215 },
        { name: '明确无购车计划', l1Name: 'A. 人 (决策主体)', l2Name: '强抗拒 (流失预警)', count: 178 },
        { name: '电话拉黑/拒绝联系', l1Name: 'A. 人 (决策主体)', l2Name: '强抗拒 (流失预警)', count: 117 },
        // A. 人 - 弱抗拒
        { name: '购买力暂时不足', l1Name: 'A. 人 (决策主体)', l2Name: '弱抗拒 (培育空间)', count: 156 },
        { name: '近期不便到店', l1Name: 'A. 人 (决策主体)', l2Name: '弱抗拒 (培育空间)', count: 134 },
        { name: '非核心决策人（需请示家人）', l1Name: 'A. 人 (决策主体)', l2Name: '弱抗拒 (培育空间)', count: 90 },
        // B. 货 - 强抗拒
        { name: '品牌形象不认可', l1Name: 'B. 货 (产品价值)', l2Name: '强抗拒 (硬伤)', count: 178 },
        { name: '核心配置缺失（如无通风座椅）', l1Name: 'B. 货 (产品价值)', l2Name: '强抗拒 (硬伤)', count: 142 },
        // B. 货 - 弱抗拒
        { name: '觉得价格偏高', l1Name: 'B. 货 (产品价值)', l2Name: '弱抗拒 (博弈点)', count: 134 },
        { name: '对优惠力度不满', l1Name: 'B. 货 (产品价值)', l2Name: '弱抗拒 (博弈点)', count: 98 },
        { name: '正在深度对比竞品', l1Name: 'B. 货 (产品价值)', l2Name: '弱抗拒 (博弈点)', count: 68 },
        // C. 场 - 强抗拒
        { name: '无法跨区域购买', l1Name: 'C. 场 (购车环境)', l2Name: '强抗拒 (地域/政策)', count: 112 },
        { name: '店内无相关资质（如新能源牌照业务）', l1Name: 'C. 场 (购车环境)', l2Name: '强抗拒 (地域/政策)', count: 98 },
        // C. 场 - 弱抗拒
        { name: '离家太远', l1Name: 'C. 场 (购车环境)', l2Name: '弱抗拒 (体验感)', count: 78 },
        { name: '无试驾车', l1Name: 'C. 场 (购车环境)', l2Name: '弱抗拒 (体验感)', count: 62 },
        { name: '对到店礼不满意', l1Name: 'C. 场 (购车环境)', l2Name: '弱抗拒 (体验感)', count: 45 },
        { name: '无法给到底价', l1Name: 'C. 场 (购车环境)', l2Name: '弱抗拒 (体验感)', count: 35 }
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
                        <span class="tag-item-color" style="background:${trendChartColors[(l1Idx * 3 + l2Idx) % 10]}"></span>
                        <span class="tag-level-badge">二级</span>
                    </div><div class="tag-tree-children" style="display:none">`;

                treeData.l3.filter(l3 => l3.l2Name === l2.name).forEach((l3, l3Idx) => {
                    html += `<div class="tag-tree-level tag-tree-l3" data-level="3" data-name="${l3.name}" data-l1name="${l1.name}" data-l2name="${l2.name}">
                        <div class="tag-tree-row">
                            <div class="tag-checkbox"><i class="fa-solid fa-check"></i></div>
                            <span class="tag-item-name">${l3.name}</span>
                            <span class="tag-item-color" style="background:${trendChartColors[(l1Idx * 5 + l2Idx * 2 + l3Idx) % 10]}"></span>
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
                this.selectedTags.push({ name, level, l1Name, l2Name, count: data ? data.count : 50, color: trendChartColors[this.selectedTags.length % 10] });
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
        const w = svg.parentElement.clientWidth - 32, h = 260, pad = { t: 30, b: 40, l: 60, r: 20 }, plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;

        const allVal = allData.flatMap(d => d.values);
        const maxVal = Math.ceil(Math.max(...allVal, 10) * 1.1);
        const minVal = Math.floor(Math.min(...allVal, 0) * 0.9);

        // 动态计算横轴步长
        const xStep = plotW / Math.max(pointCount - 1, 1);

        let svgHtml = '';
        // 绘制 Y 轴
        for (let i = 0; i <= 5; i++) {
            const y = pad.t + (plotH / 5) * i;
            svgHtml += `<line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" stroke="#f0f0f0" stroke-dasharray="4,2"/>`;
            svgHtml += `<text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#999">${Math.round(maxVal - (maxVal - minVal) * i / 5)}</text>`;
        }

        // 绘制 X 轴日期标签
        const labelInterval = isWeekly ? 1 : (pointCount > 15 ? 5 : 2);
        for (let i = 0; i < pointCount; i += labelInterval) {
            const x = pad.l + i * xStep;
            const fullDate = dates[i];
            const displayDate = isWeekly ? fullDate : fullDate.substring(5); // 周展示全名/日期截取
            svgHtml += `<text x="${x}" y="${h - 15}" text-anchor="middle" font-size="10" fill="#999">${displayDate}</text>`;
        }

        allData.forEach((s, sIdx) => {
            const points = s.values.map((v, i) => `${pad.l + i * xStep},${pad.t + plotH - ((v - minVal) / (maxVal - minVal || 1)) * plotH}`).join(' ');
            svgHtml += `<polyline points="${points}" fill="none" stroke="${s.color}" stroke-width="2.5" />`;
            s.values.forEach((v, i) => {
                const x = pad.l + i * xStep, y = pad.t + plotH - ((v - minVal) / (maxVal - minVal || 1)) * plotH;
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
            cont.innerHTML = allData.map((s, i) => `<text x="12" y="${38 + i * 16}" fill="${s.color}" font-size="11">${s.name}: ${s.values[p.dataset.idx]}</text>`).join('');
            bg.setAttribute('width', 140); bg.setAttribute('height', 45 + allData.length * 16);
            const r = svg.getBoundingClientRect();
            let x = e.clientX - r.left + 15, y = e.clientY - r.top - 40;
            if (x + 150 > r.width) x -= 170;
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
            for (let i = 0; i < diffDays; i++) {
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
        for (let i = 0; i < count; i++) v.push(Math.round(base * (0.8 + Math.random() * 0.4)));
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

// 区域投放效果 Top 10/20 切换逻辑
document.addEventListener('click', (e) => {
    const btn = e.target.closest('#regionTopTabs .ce-dim-btn');
    if (!btn) return;

    // 切换按钮状态
    const parent = btn.parentElement;
    parent.querySelectorAll('.ce-dim-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 切换数据展示
    const topVal = btn.dataset.top;
    const container = document.getElementById('regionBarsContainer');
    if (!container) return;

    const extras = container.querySelectorAll('.ce-v-bar-extra');
    if (topVal === '20') {
        extras.forEach(el => el.style.display = 'flex');
    } else {
        extras.forEach(el => el.style.display = 'none');
    }
});

// 通用维度切换按钮样式切换（仅视觉效果，用于原型展示）
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ce-dim-btn');
    // 如果是区域切换按钮，上面已经处理过了，这里跳过
    if (!btn || btn.closest('#regionTopTabs')) return;

    const parent = btn.parentElement;
    parent.querySelectorAll('.ce-dim-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
});



// 大项目排名切换交互逻辑
function initProjectRankInteraction() {
    const tabs = document.getElementById('rankMetricTabs');
    const listContainer = document.getElementById('projectRankList');
    if (!tabs || !listContainer) return;

    // 模拟不同维度的 Top 10 数据
    const RANK_DATA = {
        hab: [
            { name: "2024夏季大促-R4核心运营项目", h: 15, a: 12, b: 18, other: 55, val: "45%" },
            { name: "品牌焕新周-R2区域联动", h: 12, a: 15, b: 15, other: 58, val: "42%" },
            { name: "天籁专项补贴-R1渠道专场", h: 10, a: 12, b: 18, other: 60, val: "40%" },
            { name: "轩逸超混版上市推广-R5", h: 8, a: 12, b: 18, other: 62, val: "38%" },
            { name: "618全民购车节-全渠道", h: 9, a: 10, b: 16, other: 65, val: "35%" },
            { name: "售后维系老带新活动", h: 8, a: 10, b: 15, other: 67, val: "33%" },
            { name: "东风日产探陆预售项目", h: 7, a: 11, b: 14, other: 68, val: "32%" },
            { name: "春季自驾游专项线索清洗", h: 6, a: 10, b: 14, other: 70, val: "30%" },
            { name: "抖音直播间获客计划-R3", h: 5, a: 9, b: 14, other: 72, val: "28%" },
            { name: "懂车帝效果通投放-R6", h: 4, a: 8, b: 14, other: 74, val: "26%" }
        ],
        arrival: [
            { name: "探陆预售-到店留存专项", val: "28.5%" },
            { name: "夏季大促-到店领取礼包", val: "26.2%" },
            { name: "品牌周-进店试驾有礼", val: "25.0%" },
            { name: "R1 渠道到店优化项目", val: "23.4%" },
            { name: "老带新-回店保养转介绍", val: "21.8%" },
            { name: "抖音本地生活-到店核销", val: "20.5%" },
            { name: "快手探店-引流到店", val: "19.2%" },
            { name: "线下商超展位-引流", val: "18.5%" },
            { name: "电销组-邀约到店竞赛", val: "17.6%" },
            { name: "区域车展-邀约到场", val: "16.8%" }
        ],
        testdrive: [
            { name: "轩逸超混-全城试驾会", val: "18.3%" },
            { name: "探陆-深度体验营", val: "16.5%" },
            { name: "夏季促-周末试驾专场", val: "15.2%" },
            { name: "天籁-静谧性试驾体验", val: "14.8%" },
            { name: "品牌焕新-试驾礼遇", val: "13.9%" },
            { name: "上门试驾-服务升级项目", val: "12.5%" },
            { name: "竞品对比试驾-专项", val: "11.2%" },
            { name: "夜间试驾-关怀活动", val: "10.8%" },
            { name: "女性车主-试驾下午茶", val: "9.5%" },
            { name: "高校行-首台车试驾", val: "8.2%" }
        ],
        order: [
            { name: "618-锁单现金返现活动", val: "8.5%" },
            { name: "大促-最后48小时抢订", val: "7.8%" },
            { name: "探陆-首批预订锁单", val: "7.2%" },
            { name: "品牌周-订车抽大奖", val: "6.5%" },
            { name: "渠道专享-限时锁单补贴", val: "5.8%" },
            { name: "轩逸-锁单送保养包", val: "5.2%" },
            { name: "老客户增换购-锁单礼", val: "4.8%" },
            { name: "区域联动-万人订车会", val: "4.2%" },
            { name: "电商平台-9.9元锁单", val: "3.5%" },
            { name: "车展现场-即时锁单奖", val: "2.8%" }
        ]
    };

    const metricLabels = {
        hab: "HAB 占比",
        arrival: "到店率",
        testdrive: "试驾率",
        order: "锁单率"
    };

    tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.ce-dim-btn');
        if (!btn) return;

        // 切换 active 状态
        tabs.querySelectorAll('.ce-dim-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const metric = btn.dataset.metric;
        const data = RANK_DATA[metric];
        const labelText = metricLabels[metric];

        // 渲染列表
        renderRankList(data, labelText, metric);
    });

    function renderRankList(data, labelText, metric) {
        listContainer.style.opacity = '0';

        setTimeout(() => {
            let html = '';
            data.forEach((item, index) => {
                const rankClass = index < 3 ? 'top3' : '';

                let barHtml = '';
                if (metric === 'hab') {
                    // 堆叠模式
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg h" style="width: ${item.h}%;"></div>
                            <div class="ce-h-seg a" style="width: ${item.a}%;"></div>
                            <div class="ce-h-seg b" style="width: ${item.b}%;"></div>
                            <div class="ce-h-seg other" style="width: ${item.other}%;"></div>
                        </div>
                    `;
                } else {
                    // 单值模式 (主色蓝)
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg a" style="width: ${item.val};"></div>
                        </div>
                    `;
                }

                html += `
                    <div class="ce-h-bar-item">
                        <div class="ce-h-info">
                            <span class="ce-h-rank ${rankClass}">${index + 1}</span>
                            <span class="ce-h-name">${item.name}</span>
                        </div>
                        <div class="ce-h-chart-wrapper">
                            ${barHtml}
                            <span class="ce-h-total">${labelText}: ${item.val}</span>
                        </div>
                    </div>
                `;
            });
            listContainer.innerHTML = html;
            listContainer.style.opacity = '1';
        }, 300);
    }
}

// 线索质量排名切换交互逻辑

// 排期排名切换交互逻辑
function initScheduleRankInteraction() {
    const tabs = document.getElementById('scheduleMetricTabs');
    const listContainer = document.getElementById('scheduleRankList');
    if (!tabs || !listContainer) return;

    const RANK_DATA = {
        hab: [
            { name: "抖音信息流-0501-R4核心排期", h: 18, a: 14, b: 15, other: 53, val: "47%" },
            { name: "懂车帝CPS-0428-R4效果通", h: 15, a: 12, b: 16, other: 57, val: "43%" },
            { name: "百度搜索竞价-0502-R2品牌专区", h: 12, a: 10, b: 18, other: 60, val: "40%" },
            { name: "快手短视频-0505-R3核心排期", h: 10, a: 12, b: 15, other: 63, val: "37%" },
            { name: "小红书种草-0425-R1专项排期", h: 8, a: 10, b: 16, other: 66, val: "34%" },
            { name: "朋友圈广告-0501-R4核心排期", h: 7, a: 11, b: 15, other: 67, val: "33%" },
            { name: "今日头条-0503-R4品牌联动", h: 6, a: 10, b: 16, other: 68, val: "32%" },
            { name: "优酷视频插播-0430-R2专项", h: 6, a: 9, b: 15, other: 70, val: "30%" },
            { name: "知乎内容直投-0502-R3核心", h: 5, a: 8, b: 16, other: 71, val: "29%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", h: 5, a: 8, b: 15, other: 72, val: "28%" }
        ],
        arrival: [
            { name: "抖音信息流-0501-R4核心排期", val: "22.5%" },
            { name: "百度搜索竞价-0502-R2品牌专区", val: "20.1%" },
            { name: "懂车帝CPS-0428-R4效果通", val: "18.8%" },
            { name: "快手短视频-0505-R3核心排期", val: "16.5%" },
            { name: "小红书种草-0425-R1专项排期", val: "15.2%" },
            { name: "朋友圈广告-0501-R4核心排期", val: "14.8%" },
            { name: "今日头条-0503-R4品牌联动", val: "13.5%" },
            { name: "优酷视频插播-0430-R2专项", val: "12.2%" },
            { name: "知乎内容直投-0502-R3核心", val: "11.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", val: "10.8%" }
        ],
        testdrive: [
            { name: "抖音信息流-0501-R4核心排期", val: "15.3%" },
            { name: "百度搜索竞价-0502-R2品牌专区", val: "13.8%" },
            { name: "懂车帝CPS-0428-R4效果通", val: "12.5%" },
            { name: "快手短视频-0505-R3核心排期", val: "11.2%" },
            { name: "小红书种草-0425-R1专项排期", val: "9.8%" },
            { name: "朋友圈广告-0501-R4核心排期", val: "8.5%" },
            { name: "今日头条-0503-R4品牌联动", val: "7.8%" },
            { name: "优酷视频插播-0430-R2专项", val: "7.2%" },
            { name: "知乎内容直投-0502-R3核心", val: "6.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", val: "5.8%" }
        ],
        order: [
            { name: "抖音信息流-0501-R4核心排期", val: "5.5%" },
            { name: "百度搜索竞价-0502-R2品牌专区", val: "4.8%" },
            { name: "懂车帝CPS-0428-R4效果通", val: "4.2%" },
            { name: "快手短视频-0505-R3核心排期", val: "3.5%" },
            { name: "小红书种草-0425-R1专项排期", val: "2.8%" },
            { name: "朋友圈广告-0501-R4核心排期", val: "2.5%" },
            { name: "今日头条-0503-R4品牌联动", val: "2.2%" },
            { name: "优酷视频插播-0430-R2专项", val: "1.8%" },
            { name: "知乎内容直投-0502-R3核心", val: "1.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", val: "1.2%" }
        ]
    };

    const metricLabels = {
        hab: "HAB 占比",
        arrival: "到店率",
        testdrive: "试驾率",
        order: "锁单率"
    };

    tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.ce-dim-btn');
        if (!btn) return;

        tabs.querySelectorAll('.ce-dim-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const metric = btn.dataset.metric;
        const data = RANK_DATA[metric];
        const labelText = metricLabels[metric];

        renderRankList(data, labelText, metric);
    });

    function renderRankList(data, labelText, metric) {
        listContainer.style.opacity = '0';

        setTimeout(() => {
            let html = '';
            data.forEach((item, index) => {
                const rankClass = index < 3 ? 'top3' : '';

                let barHtml = '';
                if (metric === 'hab') {
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg h" style="width: ${item.h}%;"></div>
                            <div class="ce-h-seg a" style="width: ${item.a}%;"></div>
                            <div class="ce-h-seg b" style="width: ${item.b}%;"></div>
                            <div class="ce-h-seg other" style="width: ${item.other}%;"></div>
                        </div>
                    `;
                } else {
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg a" style="width: ${item.val};"></div>
                        </div>
                    `;
                }

                html += `
                    <div class="ce-h-bar-item">
                        <div class="ce-h-info">
                            <span class="ce-h-rank ${rankClass}">${index + 1}</span>
                            <span class="ce-h-name">${item.name}</span>
                        </div>
                        <div class="ce-h-chart-wrapper">
                            ${barHtml}
                            <span class="ce-h-total">${labelText}: ${item.val}</span>
                        </div>
                    </div>
                `;
            });
            listContainer.innerHTML = html;
            listContainer.style.opacity = '1';
        }, 300);
    }
}



// === 培育运营：关注点下钻逻辑 ===

const TOTAL_CULTIVATION_USERS = 15248;

const focusSubTagsData = {
    '价格与优惠': [
        { name: '店内活动', rate: 42 },
        { name: '补贴价格', rate: 38 },
        { name: '贷款内容', rate: 35 },
        { name: '车辆价格', rate: 32 },
        { name: '店内优惠', rate: 30 },
        { name: '全款优惠', rate: 28 },
        { name: '贷款服务', rate: 25 },
        { name: '活动期限', rate: 22 },
        { name: '活动参与方式', rate: 20 },
        { name: '金融因子', rate: 18 }
    ],
    '产品与配置': [
        { name: '智能化配置', rate: 58 },
        { name: '辅助驾驶', rate: 52 },
        { name: '舒适性', rate: 48 },
        { name: '动力系统', rate: 45 },
        { name: '新能源车型', rate: 42 },
        { name: '安全性', rate: 38 },
        { name: '品牌认知', rate: 35 },
        { name: '能耗表现', rate: 30 },
        { name: '环保表现', rate: 25 },
        { name: '车辆养护', rate: 20 }
    ],
    '服务与售后': [
        { name: '售后服务', rate: 45 },
        { name: '保养服务', rate: 40 },
        { name: '保险业务', rate: 35 },
        { name: '上牌政策', rate: 32 },
        { name: '置换服务', rate: 28 },
        { name: '评估内容', rate: 25 }
    ],
    '竞品对比': [
        { name: '对比竞品详情', rate: 48 },
        { name: '配置差异化', rate: 42 },
        { name: '价格力对比', rate: 38 },
        { name: '性能横测', rate: 30 }
    ]
};

function openFocusDrillDown(category) {
    const modal = document.getElementById('focusDrillDownModal');
    const title = document.getElementById('focusDrillDownTitle');
    const content = document.getElementById('focusDrillDownContent');

    if (!modal || !content) return;

    // 设置标题
    title.innerText = `[${category}] 二级分布 - 提及率排名`;

    // 获取数据并渲染
    const subTags = focusSubTagsData[category] || [];
    let html = '';

    subTags.forEach(item => {
        const userCount = Math.floor(TOTAL_CULTIVATION_USERS * (item.rate / 100));
        html += `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="width: 100px; font-size: 11px; color: #6b7280; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.name}</span>
                <div style="flex: 1; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${item.rate}%; height: 100%; background: #3b82f6;"></div>
                </div>
                <span style="width: 120px; font-size: 11px; font-weight: 600; color: #111827;">${item.rate}% (${userCount.toLocaleString()}人)</span>
            </div>
        `;
    });

    if (subTags.length === 0) {
        html = '<div style="padding: 20px; text-align: center; color: #9ca3af;">暂无二级数据</div>';
    }

    content.innerHTML = html;
    modal.classList.add('active');
}

function closeFocusModal() {
    const modal = document.getElementById('focusDrillDownModal');
    if (modal) modal.classList.remove('active');
}

/**
 * 全量排行榜相关逻辑
 */
const qualityFullData = [
    { rank: 1, type: '休眠失联', reason: '处于考虑/纠结期', count: 1245, percent: '10.1%', trend: 'up', trendVal: '1.2%' },
    { rank: 2, type: '休眠失联', reason: '正在开车/忙碌', count: 952, percent: '7.7%', trend: 'down', trendVal: '0.5%' },
    { rank: 3, type: '接通有效', reason: '确认有购车意向', count: 880, percent: '7.1%', trend: 'up', trendVal: '2.4%' },
    { rank: 4, type: '休眠失联', reason: '接通后挂断', count: 720, percent: '5.8%', trend: 'none', trendVal: '0%' },
    { rank: 5, type: '再次联系', reason: '无人接听', count: 680, percent: '5.5%', trend: 'down', trendVal: '1.8%' },
    { rank: 6, type: '已接无效', reason: '已购车', count: 550, percent: '4.5%', trend: 'up', trendVal: '0.3%' },
    { rank: 7, type: '空号/停机', reason: '空号', count: 520, percent: '4.2%', trend: 'down', trendVal: '0.9%' },
    { rank: 8, type: '已接无效', reason: '购车意愿不明确', count: 480, percent: '3.9%', trend: 'up', trendVal: '0.1%' },
    { rank: 9, type: '再次联系', reason: '忙线 (占线)', count: 420, percent: '3.4%', trend: 'none', trendVal: '0%' },
    { rank: 10, type: '已接无效', reason: '强烈抗议', count: 320, percent: '2.6%', trend: 'up', trendVal: '0.4%' },
    { rank: 11, type: '再次联系', reason: '关机', count: 280, percent: '2.3%', trend: 'down', trendVal: '0.2%' },
    { rank: 12, type: '再次联系', reason: '不在服务区', count: 210, percent: '1.7%', trend: 'none', trendVal: '0%' },
    { rank: 13, type: '拦截/黑名单', reason: '黑名单过滤', count: 180, percent: '1.5%', trend: 'up', trendVal: '0.1%' },
    { rank: 14, type: '空号/停机', reason: '停机', count: 150, percent: '1.2%', trend: 'down', trendVal: '0.4%' },
    { rank: 15, type: '休眠未购', reason: '其他琐碎沟通', count: 120, percent: '1.0%', trend: 'none', trendVal: '0%' }
];

const resistanceFullData = [
    { rank: 1, result: '战败', reason: '价格因素', count: 840, percent: '19.2%', trend: 'up', trendVal: '2.1%' },
    { rank: 2, result: '休眠未购', reason: '资金不足', count: 750, percent: '17.2%', trend: 'down', trendVal: '1.5%' },
    { rank: 3, result: '休眠未购', reason: '半年内不购车', count: 620, percent: '14.2%', trend: 'up', trendVal: '0.8%' },
    { rank: 4, result: '战败', reason: '产品设计和配置', count: 480, percent: '11.0%', trend: 'none', trendVal: '0%' },
    { rank: 5, result: '战败', reason: '品牌偏好', count: 420, percent: '9.6%', trend: 'down', trendVal: '0.2%' },
    { rank: 6, result: '休眠未购', reason: '家人不同意', count: 320, percent: '7.3%', trend: 'up', trendVal: '0.4%' },
    { rank: 7, result: '休眠未购', reason: '关注竞品车型', count: 280, percent: '6.4%', trend: 'down', trendVal: '0.7%' },
    { rank: 8, result: '休眠未购', reason: '征信不通过', count: 210, percent: '4.8%', trend: 'none', trendVal: '0%' },
    { rank: 9, result: '战败', reason: '等待期长', count: 180, percent: '4.1%', trend: 'up', trendVal: '0.2%' },
    { rank: 10, result: '其他', reason: '其他原因', count: 120, percent: '2.7%', trend: 'down', trendVal: '0.1%' },
    { rank: 11, result: '休眠未购', reason: '驾照没考到', count: 80, percent: '1.8%', trend: 'none', trendVal: '0%' },
    { rank: 12, result: '战败', reason: '金融方案不满意', count: 50, percent: '1.1%', trend: 'up', trendVal: '0.1%' }
];

function openFullRanking(type) {
    const modal = document.getElementById('rankingModal');
    const title = document.getElementById('rankingModalTitle');
    const thead = document.getElementById('rankingModalThead');
    const tbody = document.getElementById('rankingModalTableBody');

    if (!modal || !tbody) return;

    tbody.innerHTML = '';

    if (type === 'quality') {
        title.innerText = '质量标签全量排行榜';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
                <th style="width: 140px;">原因类型</th>
                <th>具体原因标签</th>
                <th style="width: 120px; text-align: right;">用户数</th>
                <th style="width: 120px; text-align: right;">占比</th>
                <th style="width: 120px; text-align: right;">环比</th>
            </tr>
        `;
        qualityFullData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td><span class="status-tag" style="background: #f1f5f9; color: #475569; border: none;">${item.type}</span></td>
                <td style="font-weight: 500;">${item.reason}</td>
                <td style="text-align: right; font-weight: 600;">${item.count.toLocaleString()}</td>
                <td style="text-align: right;">${item.percent}</td>
                <td style="text-align: right; color: ${getTrendColor(item.trend)}">${getTrendIcon(item.trend)} ${item.trendVal}</td>
            `;
            tbody.appendChild(row);
        });
    } else if (type === 'resistance') {
        title.innerText = '抗拒点标签全量排行榜';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
                <th style="width: 140px;">回访结果</th>
                <th>具体原因</th>
                <th style="width: 120px; text-align: right;">用户数</th>
                <th style="width: 120px; text-align: right;">占比</th>
                <th style="width: 120px; text-align: right;">环比</th>
            </tr>
        `;
        resistanceFullData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td><span class="status-tag" style="background: #f1f5f9; color: #475569; border: none;">${item.result}</span></td>
                <td style="font-weight: 500;">${item.reason}</td>
                <td style="text-align: right; font-weight: 600;">${item.count.toLocaleString()}</td>
                <td style="text-align: right;">${item.percent}</td>
                <td style="text-align: right; color: ${getTrendColor(item.trend)}">${getTrendIcon(item.trend)} ${item.trendVal}</td>
            `;
            tbody.appendChild(row);
        });
    } else if (type === 'project' || type === 'schedule') {
        title.innerText = type === 'project' ? '全量大项目线索质量排名' : '全量排期线索质量排名';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
                <th>${type === 'project' ? '项目名称' : '排期名称'}</th>
                <th style="width: 150px; text-align: right;">H/A/B 占比</th>
                <th style="width: 100px; text-align: right;">到店率</th>
                <th style="width: 100px; text-align: right;">试驾率</th>
                <th style="width: 100px; text-align: right;">锁单率</th>
            </tr>
        `;

        const names = type === 'project' ?
            ["2024夏季大促-R4核心运营项目", "品牌焕新周-R2区域联动", "天籁专项补贴-R1渠道专场", "轩逸超混版上市推广-R5", "618全民购车节-全渠道", "售后维系老带新活动"] :
            ["抖音信息流-0501-R4核心排期", "懂车帝CPS-0428-R4效果通", "百度搜索竞价-0502-R2品牌专区", "快手短视频-0505-R3核心排期", "小红书种草-0425-R1专项排期", "朋友圈广告-0501-R4"];

        for (let i = 1; i <= 30; i++) {
            const name = names[(i - 1) % names.length] + (i > names.length ? ` #${i}` : '');
            const hab = (45 - i * 0.5).toFixed(1) + '%';
            const arrival = (28 - i * 0.4).toFixed(1) + '%';
            const testdrive = (18 - i * 0.3).toFixed(1) + '%';
            const order = (8 - i * 0.1).toFixed(1) + '%';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${i <= 3 ? 'rank-' + i : ''}">${i}</span></td>
                <td style="font-weight: 500;">${name}</td>
                <td style="text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <div style="flex: 1; height: 6px; background: #f3f4f6; border-radius: 3px; max-width: 60px; overflow: hidden;">
                            <div style="height: 100%; background: #00337c; width: ${hab};"></div>
                        </div>
                        <span style="font-weight: 600; min-width: 45px;">${hab}</span>
                    </div>
                </td>
                <td style="text-align: right;">${arrival}</td>
                <td style="text-align: right;">${testdrive}</td>
                <td style="text-align: right;">${order}</td>
            `;
            tbody.appendChild(row);
        }
    }

    modal.classList.add('active');
}

function closeRankingModal() {
    document.getElementById('rankingModal').classList.remove('active');
}

function getTrendColor(trend) {
    if (trend === 'up') return '#ef4444';
    if (trend === 'down') return '#10b981';
    return '#6b7280';
}

function getTrendIcon(trend) {
    if (trend === 'up') return '<i class="fa-solid fa-caret-up"></i>';
    if (trend === 'down') return '<i class="fa-solid fa-caret-down"></i>';
    return '<i class="fa-solid fa-minus"></i>';
}
