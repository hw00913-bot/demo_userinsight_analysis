// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

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
            { name: "2024夏季大促-R4核心运营项目", projectCode: "夏季大促", h: 15, a: 12, b: 18, other: 55, val: "45%" },
            { name: "品牌焕新周-R2区域联动", projectCode: "品牌焕新", h: 12, a: 15, b: 15, other: 58, val: "42%" },
            { name: "天籁专项补贴-R1渠道专场", projectCode: "天籁补贴", h: 10, a: 12, b: 18, other: 60, val: "40%" },
            { name: "轩逸超混版上市推广-R5", projectCode: "轩逸混动", h: 8, a: 12, b: 18, other: 62, val: "38%" },
            { name: "618全民购车节-全渠道", projectCode: "618购车", h: 9, a: 10, b: 16, other: 65, val: "35%" },
            { name: "售后维系老带新活动", h: 8, a: 10, b: 15, other: 67, val: "33%" },
            { name: "东风日产探陆预售项目", h: 7, a: 11, b: 14, other: 68, val: "32%" },
            { name: "春季自驾游专项线索清洗", h: 6, a: 10, b: 14, other: 70, val: "30%" },
            { name: "抖音直播间获客计划-R3", h: 5, a: 9, b: 14, other: 72, val: "28%" },
            { name: "懂车帝效果通投放-R6", h: 4, a: 8, b: 14, other: 74, val: "26%" }
        ],
        arrival: [
            { name: "探陆预售-到店留存专项", projectCode: "探陆预售", val: "28.5%" },
            { name: "夏季大促-到店领取礼包", projectCode: "夏季大促", val: "26.2%" },
            { name: "品牌周-进店试驾有礼", projectCode: "品牌焕新", val: "25.0%" },
            { name: "R1 渠道到店优化项目", projectCode: "天籁补贴", val: "23.4%" },
            { name: "老带新-回店保养转介绍", projectCode: "老带新活动", val: "21.8%" },
            { name: "抖音本地生活-到店核销", projectCode: "抖音直播", val: "20.5%" },
            { name: "快手探店-引流到店", projectCode: "快手探店", val: "19.2%" },
            { name: "线下商超展位-引流", projectCode: "商超展位", val: "18.5%" },
            { name: "电销组-邀约到店竞赛", projectCode: "电销邀约", val: "17.6%" },
            { name: "区域车展-邀约到场", projectCode: "区域车展", val: "16.8%" }
        ],
        testdrive: [
            { name: "轩逸超混-全城试驾会", projectCode: "轩逸混动", val: "18.3%" },
            { name: "探陆-深度体验营", projectCode: "探陆预售", val: "16.5%" },
            { name: "夏季促-周末试驾专场", projectCode: "夏季大促", val: "15.2%" },
            { name: "天籁-静谧性试驾体验", projectCode: "天籁补贴", val: "14.8%" },
            { name: "品牌焕新-试驾礼遇", projectCode: "品牌焕新", val: "13.9%" },
            { name: "上门试驾-服务升级项目", projectCode: "上门试驾", val: "12.5%" },
            { name: "竞品对比试驾-专项", projectCode: "竞品对比", val: "11.2%" },
            { name: "夜间试驾-关怀活动", projectCode: "夜间试驾", val: "10.8%" },
            { name: "女性车主-试驾下午茶", projectCode: "女性试驾", val: "9.5%" },
            { name: "高校行-首台车试驾", projectCode: "高校试驾", val: "8.2%" }
        ],
        order: [
            { name: "618-锁单现金返现活动", projectCode: "618购车", val: "8.5%" },
            { name: "大促-最后48小时抢订", projectCode: "夏季大促", val: "7.8%" },
            { name: "探陆-首批预订锁单", projectCode: "探陆预售", val: "7.2%" },
            { name: "品牌周-订车抽大奖", projectCode: "品牌焕新", val: "6.5%" },
            { name: "渠道专享-限时锁单补贴", projectCode: "渠道锁单", val: "5.8%" },
            { name: "轩逸-锁单送保养包", projectCode: "轩逸混动", val: "5.2%" },
            { name: "老客户增换购-锁单礼", projectCode: "老带新活动", val: "4.8%" },
            { name: "区域联动-万人订车会", projectCode: "区域车展", val: "4.2%" },
            { name: "电商平台-9.9元锁单", projectCode: "电商锁单", val: "3.5%" },
            { name: "车展现场-即时锁单奖", projectCode: "车展锁单", val: "2.8%" }
        ]
    };

    const metricLabels = {
        hab: "HAB 占比",
        arrival: "到店率",
        testdrive: "试驾率",
        order: "锁单率"
    };

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
                    <div class="ce-h-bar-item ${item.projectCode ? 'project-bar-item' : ''}" ${item.projectCode ? `data-project="${item.projectCode}"` : ''}>
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

    // 页面加载时渲染默认 HAB 数据
    renderRankList(RANK_DATA.hab, metricLabels.hab, 'hab');

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
}

// 大项目线索质量排名点击事件（事件委托）
document.addEventListener('click', (e) => {
    const projectItem = e.target.closest('.project-bar-item');
    if (!projectItem) return;
    
    const projectCode = projectItem.dataset.project;
    const scheduleCode = projectItem.dataset.schedule;
    if (projectCode) {
        showProjectDrillModal(projectCode);
    } else if (scheduleCode) {
        showScheduleDrillModal(scheduleCode);
    }
});

// 线索质量排名切换交互逻辑

// 排期排名切换交互逻辑
function initScheduleRankInteraction() {
    const tabs = document.getElementById('scheduleMetricTabs');
    const listContainer = document.getElementById('scheduleRankList');
    if (!tabs || !listContainer) return;

    const RANK_DATA = {
        hab: [
            { name: "抖音信息流-0501-R4核心排期", scheduleCode: "douyin0501", h: 18, a: 14, b: 15, other: 53, val: "47%" },
            { name: "懂车帝CPS-0428-R4效果通", scheduleCode: "chekong0428", h: 15, a: 12, b: 16, other: 57, val: "43%" },
            { name: "百度搜索竞价-0502-R2品牌专区", scheduleCode: "baidu0502", h: 12, a: 10, b: 18, other: 60, val: "40%" },
            { name: "快手短视频-0505-R3核心排期", scheduleCode: "kuaishou0505", h: 10, a: 12, b: 15, other: 63, val: "37%" },
            { name: "小红书种草-0425-R1专项排期", scheduleCode: "xiaohongshu0425", h: 8, a: 10, b: 16, other: 66, val: "34%" },
            { name: "朋友圈广告-0501-R4核心排期", h: 7, a: 11, b: 15, other: 67, val: "33%" },
            { name: "今日头条-0503-R4品牌联动", h: 6, a: 10, b: 16, other: 68, val: "32%" },
            { name: "优酷视频插播-0430-R2专项", h: 6, a: 9, b: 15, other: 70, val: "30%" },
            { name: "知乎内容直投-0502-R3核心", h: 5, a: 8, b: 16, other: 71, val: "29%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", h: 5, a: 8, b: 15, other: 72, val: "28%" }
        ],
        arrival: [
            { name: "抖音信息流-0501-R4核心排期", scheduleCode: "douyin0501", val: "22.5%" },
            { name: "百度搜索竞价-0502-R2品牌专区", scheduleCode: "baidu0502", val: "20.1%" },
            { name: "懂车帝CPS-0428-R4效果通", scheduleCode: "chekong0428", val: "18.8%" },
            { name: "快手短视频-0505-R3核心排期", scheduleCode: "kuaishou0505", val: "16.5%" },
            { name: "小红书种草-0425-R1专项排期", scheduleCode: "xiaohongshu0425", val: "15.2%" },
            { name: "朋友圈广告-0501-R4核心排期", scheduleCode: "pengyouquan0501", val: "14.8%" },
            { name: "今日头条-0503-R4品牌联动", scheduleCode: "toutiao0503", val: "13.5%" },
            { name: "优酷视频插播-0430-R2专项", scheduleCode: "youku0430", val: "12.2%" },
            { name: "知乎内容直投-0502-R3核心", scheduleCode: "zhihu0502", val: "11.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", scheduleCode: "bilibili0504", val: "10.8%" }
        ],
        testdrive: [
            { name: "抖音信息流-0501-R4核心排期", scheduleCode: "douyin0501", val: "15.3%" },
            { name: "百度搜索竞价-0502-R2品牌专区", scheduleCode: "baidu0502", val: "13.8%" },
            { name: "懂车帝CPS-0428-R4效果通", scheduleCode: "chekong0428", val: "12.5%" },
            { name: "快手短视频-0505-R3核心排期", scheduleCode: "kuaishou0505", val: "11.2%" },
            { name: "小红书种草-0425-R1专项排期", scheduleCode: "xiaohongshu0425", val: "9.8%" },
            { name: "朋友圈广告-0501-R4核心排期", scheduleCode: "pengyouquan0501", val: "8.5%" },
            { name: "今日头条-0503-R4品牌联动", scheduleCode: "toutiao0503", val: "7.8%" },
            { name: "优酷视频插播-0430-R2专项", scheduleCode: "youku0430", val: "7.2%" },
            { name: "知乎内容直投-0502-R3核心", scheduleCode: "zhihu0502", val: "6.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", scheduleCode: "bilibili0504", val: "5.8%" }
        ],
        order: [
            { name: "抖音信息流-0501-R4核心排期", scheduleCode: "douyin0501", val: "5.5%" },
            { name: "百度搜索竞价-0502-R2品牌专区", scheduleCode: "baidu0502", val: "4.8%" },
            { name: "懂车帝CPS-0428-R4效果通", scheduleCode: "chekong0428", val: "4.2%" },
            { name: "快手短视频-0505-R3核心排期", scheduleCode: "kuaishou0505", val: "3.5%" },
            { name: "小红书种草-0425-R1专项排期", scheduleCode: "xiaohongshu0425", val: "2.8%" },
            { name: "朋友圈广告-0501-R4核心排期", scheduleCode: "pengyouquan0501", val: "2.5%" },
            { name: "今日头条-0503-R4品牌联动", scheduleCode: "toutiao0503", val: "2.2%" },
            { name: "优酷视频插播-0430-R2专项", scheduleCode: "youku0430", val: "1.8%" },
            { name: "知乎内容直投-0502-R3核心", scheduleCode: "zhihu0502", val: "1.5%" },
            { name: "哔哩哔哩动态-0504-R5新品上市", scheduleCode: "bilibili0504", val: "1.2%" }
        ]
    };

    const metricLabels = {
        hab: "HAB 占比",
        arrival: "到店率",
        testdrive: "试驾率",
        order: "锁单率"
    };

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
                    <div class="ce-h-bar-item ${item.scheduleCode ? 'project-bar-item' : ''}" ${item.scheduleCode ? `data-schedule="${item.scheduleCode}"` : ''}>
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

    // 页面加载时渲染默认 HAB 数据
    renderRankList(RANK_DATA.hab, metricLabels.hab, 'hab');

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
    modal.querySelector('.drawer-body').style.padding = '';

    if (type === 'quality') {
        title.innerText = '质量标签全量排行榜';
        modal.querySelector('.drawer-body').style.padding = '0 60px';
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
        modal.querySelector('.drawer-body').style.padding = '0 60px';
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
    } else     if (type === 'project' || type === 'schedule') {
        title.innerText = type === 'project' ? '全量大项目线索质量排名' : '全量排期线索质量排名';
        modal.querySelector('.drawer-body').style.padding = '0 60px';
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

        // 项目名称 → projectCode 映射（用于下钻弹窗）
        const projectCodeMap = {
            '2024夏季大促-R4核心运营项目': '夏季大促',
            '品牌焕新周-R2区域联动': '品牌焕新',
            '天籁专项补贴-R1渠道专场': '天籁补贴',
            '轩逸超混版上市推广-R5': '轩逸混动',
            '618全民购车节-全渠道': '618购车',
            '售后维系老带新活动': '老带新活动'
        };

        // 排期名称 → scheduleCode 映射（用于下钻弹窗）
        const scheduleCodeMap = {
            '抖音信息流-0501-R4核心排期': 'douyin0501',
            '懂车帝CPS-0428-R4效果通': 'chekong0428',
            '百度搜索竞价-0502-R2品牌专区': 'baidu0502',
            '快手短视频-0505-R3核心排期': 'kuaishou0505',
            '小红书种草-0425-R1专项排期': 'xiaohongshu0425',
            '朋友圈广告-0501-R4': 'pengyouquan0501'
        };

        for (let i = 1; i <= 30; i++) {
            const nameIdx = (i - 1) % names.length;
            const baseName = names[nameIdx];
            const name = baseName + (i > names.length ? ` #${i}` : '');
            const hab = (45 - i * 0.5).toFixed(1) + '%';
            const arrival = (28 - i * 0.4).toFixed(1) + '%';
            const testdrive = (18 - i * 0.3).toFixed(1) + '%';
            const order = (8 - i * 0.1).toFixed(1) + '%';
            const projectCode = type === 'project' ? projectCodeMap[baseName] : undefined;
            const scheduleCode = type === 'schedule' ? scheduleCodeMap[baseName] : undefined;

            const row = document.createElement('tr');
            if (projectCode) {
                row.classList.add('project-bar-item');
                row.dataset.project = projectCode;
                row.style.cursor = 'pointer';
            } else if (scheduleCode) {
                row.classList.add('project-bar-item');
                row.dataset.schedule = scheduleCode;
                row.style.cursor = 'pointer';
            }
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

// ============================================
// 城市专营店意向等级详情弹窗功能
// ============================================

// 城市专营店 Mock 数据（包含大区、小区）
const cityStoreData = {
    '上海': [
        { name: '上海东风南方专营店', region: '华东大区', area: '上海一区', h: 85, a: 142, b: 198, other: 145, total: 570 },
        { name: '上海日产特约店', region: '华东大区', area: '上海一区', h: 72, a: 125, b: 180, other: 128, total: 505 },
        { name: '上海华新专营店', region: '华东大区', area: '上海二区', h: 68, a: 118, b: 165, other: 112, total: 463 },
        { name: '上海松江专营店', region: '华东大区', area: '上海三区', h: 58, a: 102, b: 142, other: 98, total: 400 },
        { name: '上海嘉定专营店', region: '华东大区', area: '上海三区', h: 45, a: 78, b: 105, other: 72, total: 300 },
        { name: '上海宝山专营店', region: '华东大区', area: '上海四区', h: 22, a: 35, b: 42, other: 25, total: 124 }
    ],
    '广州': [
        { name: '广州天河专营店', region: '华南大区', area: '广州一区', h: 78, a: 135, b: 195, other: 132, total: 540 },
        { name: '广州白云专营店', region: '华南大区', area: '广州一区', h: 65, a: 112, b: 158, other: 105, total: 440 },
        { name: '广州番禺专营店', region: '华南大区', area: '广州二区', h: 55, a: 98, b: 135, other: 92, total: 380 },
        { name: '广州东风南方店', region: '华南大区', area: '广州二区', h: 48, a: 85, b: 120, other: 82, total: 335 },
        { name: '广州黄埔专营店', region: '华南大区', area: '广州三区', h: 32, a: 58, b: 82, other: 55, total: 227 },
        { name: '广州花都专营店', region: '华南大区', area: '广州三区', h: 20, a: 35, b: 55, other: 38, total: 148 }
    ],
    '深圳': [
        { name: '深圳南山专营店', region: '华南大区', area: '深圳一区', h: 68, a: 128, b: 175, other: 109, total: 480 },
        { name: '深圳福田专营店', region: '华南大区', area: '深圳一区', h: 58, a: 105, b: 148, other: 94, total: 405 },
        { name: '深圳宝安专营店', region: '华南大区', area: '深圳二区', h: 48, a: 88, b: 125, other: 78, total: 339 },
        { name: '深圳龙岗专营店', region: '华南大区', area: '深圳二区', h: 38, a: 72, b: 102, other: 65, total: 277 },
        { name: '深圳罗湖专营店', region: '华南大区', area: '深圳三区', h: 28, a: 52, b: 72, other: 48, total: 200 },
        { name: '深圳东风南方店', region: '华南大区', area: '深圳三区', h: 15, a: 28, b: 42, other: 32, total: 117 }
    ],
    '北京': [
        { name: '北京朝阳专营店', region: '华北大区', area: '北京一区', h: 62, a: 118, b: 165, other: 105, total: 450 },
        { name: '北京海淀专营店', region: '华北大区', area: '北京一区', h: 52, a: 98, b: 142, other: 88, total: 380 },
        { name: '北京丰台专营店', region: '华北大区', area: '北京二区', h: 42, a: 82, b: 118, other: 72, total: 314 },
        { name: '北京亦庄专营店', region: '华北大区', area: '北京二区', h: 28, a: 58, b: 88, other: 52, total: 226 },
        { name: '北京通州专营店', region: '华北大区', area: '北京三区', h: 14, a: 28, b: 42, other: 32, total: 116 }
    ],
    '杭州': [
        { name: '杭州城西专营店', region: '华东大区', area: '杭州一区', h: 52, a: 95, b: 138, other: 85, total: 370 },
        { name: '杭州城东专营店', region: '华东大区', area: '杭州一区', h: 45, a: 82, b: 120, other: 72, total: 319 },
        { name: '杭州滨江专营店', region: '华东大区', area: '杭州二区', h: 38, a: 68, b: 98, other: 62, total: 266 },
        { name: '杭州萧山专营店', region: '华东大区', area: '杭州二区', h: 28, a: 52, b: 78, other: 48, total: 206 },
        { name: '杭州下沙专营店', region: '华东大区', area: '杭州三区', h: 12, a: 25, b: 42, other: 32, total: 111 }
    ],
    '天津': [
        { name: '天津河西专营店', region: '华北大区', area: '天津一区', h: 45, a: 88, b: 128, other: 82, total: 343 },
        { name: '天津南开专营店', region: '华北大区', area: '天津一区', h: 38, a: 72, b: 105, other: 68, total: 283 },
        { name: '天津河东专营店', region: '华北大区', area: '天津二区', h: 32, a: 62, b: 92, other: 58, total: 244 },
        { name: '天津西青专营店', region: '华北大区', area: '天津二区', h: 22, a: 42, b: 65, other: 42, total: 171 },
        { name: '天津武清专营店', region: '华北大区', area: '天津三区', h: 15, a: 28, b: 45, other: 32, total: 120 }
    ],
    '南京': [
        { name: '南京鼓楼专营店', region: '华东大区', area: '南京一区', h: 42, a: 82, b: 118, other: 78, total: 320 },
        { name: '南京玄武专营店', region: '华东大区', area: '南京一区', h: 35, a: 68, b: 98, other: 62, total: 263 },
        { name: '南京江宁专营店', region: '华东大区', area: '南京二区', h: 28, a: 55, b: 82, other: 52, total: 217 },
        { name: '南京浦口专营店', region: '华东大区', area: '南京二区', h: 20, a: 38, b: 58, other: 38, total: 154 },
        { name: '南京栖霞专营店', region: '华东大区', area: '南京三区', h: 13, a: 25, b: 38, other: 28, total: 104 }
    ],
    '成都': [
        { name: '成都武侯专营店', region: '西部大区', area: '成都一区', h: 38, a: 72, b: 108, other: 72, total: 290 },
        { name: '成都锦江专营店', region: '西部大区', area: '成都一区', h: 32, a: 62, b: 92, other: 58, total: 244 },
        { name: '成都成华专营店', region: '西部大区', area: '成都二区', h: 25, a: 48, b: 72, other: 48, total: 193 },
        { name: '成都金牛专营店', region: '西部大区', area: '成都二区', h: 18, a: 35, b: 52, other: 35, total: 140 },
        { name: '成都高新专营店', region: '西部大区', area: '成都三区', h: 12, a: 22, b: 35, other: 25, total: 94 }
    ],
    '武汉': [
        { name: '武汉武昌专营店', region: '华中大区', area: '武汉一区', h: 35, a: 58, b: 115, other: 65, total: 273 },
        { name: '武汉汉口专营店', region: '华中大区', area: '武汉一区', h: 28, a: 48, b: 88, other: 52, total: 216 },
        { name: '武汉汉阳专营店', region: '华中大区', area: '武汉二区', h: 22, a: 38, b: 68, other: 42, total: 170 },
        { name: '武汉洪山专营店', region: '华中大区', area: '武汉二区', h: 18, a: 32, b: 52, other: 35, total: 137 },
        { name: '武汉青山专营店', region: '华中大区', area: '武汉三区', h: 12, a: 22, b: 38, other: 25, total: 97 }
    ],
    '苏州': [
        { name: '苏州园区专营店', region: '华东大区', area: '苏州一区', h: 32, a: 55, b: 88, other: 52, total: 227 },
        { name: '苏州姑苏专营店', region: '华东大区', area: '苏州一区', h: 28, a: 48, b: 75, other: 45, total: 196 },
        { name: '苏州吴中专营店', region: '华东大区', area: '苏州二区', h: 22, a: 38, b: 58, other: 38, total: 156 },
        { name: '苏州相城专营店', region: '华东大区', area: '苏州二区', h: 18, a: 32, b: 48, other: 32, total: 130 },
        { name: '苏州新区专营店', region: '华东大区', area: '苏州三区', h: 10, a: 18, b: 28, other: 20, total: 76 }
    ],
    '重庆': [
        { name: '重庆渝北专营店', region: '西部大区', area: '重庆一区', h: 32, a: 65, b: 112, other: 68, total: 277 },
        { name: '重庆江北专营店', region: '西部大区', area: '重庆一区', h: 28, a: 55, b: 95, other: 58, total: 236 },
        { name: '重庆沙坪坝专营店', region: '西部大区', area: '重庆二区', h: 22, a: 45, b: 78, other: 48, total: 193 },
        { name: '重庆南岸专营店', region: '西部大区', area: '重庆二区', h: 15, a: 32, b: 55, other: 35, total: 137 },
        { name: '重庆九龙坡专营店', region: '西部大区', area: '重庆三区', h: 8, a: 18, b: 32, other: 22, total: 80 }
    ],
    '西安': [
        { name: '西安雁塔专营店', region: '西部大区', area: '西安一区', h: 28, a: 55, b: 98, other: 58, total: 239 },
        { name: '西安碑林专营店', region: '西部大区', area: '西安一区', h: 24, a: 48, b: 82, other: 48, total: 202 },
        { name: '西安莲湖专营店', region: '西部大区', area: '西安二区', h: 18, a: 38, b: 65, other: 38, total: 159 },
        { name: '西安未央专营店', region: '西部大区', area: '西安二区', h: 15, a: 28, b: 48, other: 32, total: 123 },
        { name: '西安新城专营店', region: '西部大区', area: '西安三区', h: 10, a: 18, b: 32, other: 22, total: 82 }
    ],
    '长沙': [
        { name: '长沙岳麓专营店', region: '华中大区', area: '长沙一区', h: 28, a: 52, b: 95, other: 55, total: 230 },
        { name: '长沙雨花专营店', region: '华中大区', area: '长沙一区', h: 22, a: 42, b: 75, other: 45, total: 184 },
        { name: '长沙天心专营店', region: '华中大区', area: '长沙二区', h: 18, a: 35, b: 58, other: 35, total: 146 },
        { name: '长沙开福专营店', region: '华中大区', area: '长沙二区', h: 12, a: 25, b: 42, other: 28, total: 107 },
        { name: '长沙芙蓉专营店', region: '华中大区', area: '长沙三区', h: 8, a: 15, b: 25, other: 18, total: 66 }
    ]
};

// 按大区+小区分组排序门店
function groupStoresByRegion(stores) {
    const groups = {};
    stores.forEach(store => {
        const key = store.region + '|' + store.area;
        if (!groups[key]) {
            groups[key] = { region: store.region, area: store.area, stores: [] };
        }
        groups[key].stores.push(store);
    });
    return Object.values(groups).sort((a, b) => a.region.localeCompare(b.region) || a.area.localeCompare(b.area));
}

/**
 * 显示城市专营店意向等级详情弹窗
 * @param {string} cityName - 城市名称
 */
function showCityStoreModal(cityName) {
    const modal = document.getElementById('cityStoreModal');
    const title = document.getElementById('cityStoreModalTitle');
    const content = document.getElementById('cityStoreModalContent');
    
    if (!modal || !title || !content) return;
    
    // 设置标题
    title.innerText = `${cityName} 专营店意向等级分布`;
    
    // 获取城市数据
    const stores = cityStoreData[cityName] || [];
    
    if (stores.length === 0) {
        content.innerHTML = '<div style="padding: 40px; text-align: center; color: #6b7280;">暂无数据</div>';
    } else {
        // 计算总计行
        const totalRow = {
            name: '合计',
            h: stores.reduce((sum, s) => sum + s.h, 0),
            a: stores.reduce((sum, s) => sum + s.a, 0),
            b: stores.reduce((sum, s) => sum + s.b, 0),
            other: stores.reduce((sum, s) => sum + s.other, 0),
            total: stores.reduce((sum, s) => sum + s.total, 0)
        };
        
        // 计算总占比
        const habTotalSum = totalRow.h + totalRow.a + totalRow.b;
        const habPercentTotal = totalRow.total > 0 ? ((habTotalSum / totalRow.total) * 100).toFixed(1) : '0.0';
        
        // 按大区+小区分组
        const regionGroups = groupStoresByRegion(stores);
        
        // 生成小区 Tab 和内容 HTML
        let cardHtml = `
            <div style="padding: 16px 20px;">
                <!-- 汇总信息栏 -->
                <div style="display: flex; align-items: center; gap: 20px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 16px;">
                    <div style="text-align: center;">
                        <div style="font-size: 11px; color: #6b7280; margin-bottom: 2px;">专营店数量</div>
                        <div style="font-size: 18px; font-weight: 600; color: #111827;">${stores.length} 家</div>
                    </div>
                    <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                    <div style="display: flex; gap: 16px;">
                        <div style="text-align: center;">
                            <div style="font-size: 10px; color: #6b7280;">H级</div>
                            <div style="font-size: 14px; font-weight: 600; color: #00337c;">${totalRow.h}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 10px; color: #6b7280;">A级</div>
                            <div style="font-size: 14px; font-weight: 600; color: #0081ff;">${totalRow.a}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 10px; color: #6b7280;">B级</div>
                            <div style="font-size: 14px; font-weight: 600; color: #6fb8ff;">${totalRow.b}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 10px; color: #6b7280;">其他</div>
                            <div style="font-size: 14px; font-weight: 600; color: #9ca3af;">${totalRow.other}</div>
                        </div>
                    </div>
                    <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                    <div style="text-align: center;">
                        <div style="font-size: 11px; color: #6b7280;">合计线索</div>
                        <div style="font-size: 18px; font-weight: 600; color: #111827;">${totalRow.total}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 11px; color: #6b7280;">H/A/B占比</div>
                        <div style="font-size: 18px; font-weight: 600; color: #059669;">${habPercentTotal}%</div>
                    </div>
                </div>
                
                <!-- 全部 + 小区 Tab 切换 -->
                <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                    <button class="area-tab-btn active" data-area="all" data-region="all">
                        <span>全部</span>
                        <span class="area-tab-count">${stores.length}家</span>
                    </button>
        `;
        
        // 生成 Tab 按钮
        regionGroups.forEach((group, gi) => {
            const areaTotal = {
                h: group.stores.reduce((sum, s) => sum + s.h, 0),
                a: group.stores.reduce((sum, s) => sum + s.a, 0),
                b: group.stores.reduce((sum, s) => sum + s.b, 0),
                other: group.stores.reduce((sum, s) => sum + s.other, 0),
                total: group.stores.reduce((sum, s) => sum + s.total, 0)
            };
            const areaHab = areaTotal.total > 0 ? ((areaTotal.h + areaTotal.a + areaTotal.b) / areaTotal.total * 100).toFixed(1) : '0.0';
            
            cardHtml += `
                    <button class="area-tab-btn" data-area="${group.area}" data-region="${group.region}">
                        <span>${group.area}</span>
                        <span class="area-tab-count">${group.stores.length}家</span>
                    </button>
            `;
        });
        
        cardHtml += `
                </div>
                
                <!-- Tab 内容区域 -->
                <div class="area-tab-content">
                    <!-- 全部内容 -->
                    <div class="area-panel active" data-area="all">
                        <!-- 全部汇总 -->
                        <div style="display: flex; align-items: center; gap: 16px; padding: 10px 14px; background: #fef3c7; border-radius: 6px; margin-bottom: 12px;">
                            <span style="font-size: 12px; font-weight: 600; color: #92400e;">${cityName}全部专营店</span>
                            <span style="margin-left: auto; font-size: 11px; color: #64748b;">${stores.length} 家专营店</span>
                            <span style="font-size: 13px; font-weight: 600; color: #059669;">H/A/B ${habPercentTotal}%</span>
                        </div>
                        <!-- 全部门店列表 -->
                        <div style="display: flex; flex-direction: column; gap: 8px;">
        `;
        
        // 生成全部门店列表
        stores.forEach((store) => {
            const habTotal = store.h + store.a + store.b;
            const habPercent = store.total > 0 ? ((habTotal / store.total) * 100).toFixed(1) : '0.0';
            const hPercent = store.total > 0 ? (store.h / store.total * 100).toFixed(1) : 0;
            const aPercent = store.total > 0 ? (store.a / store.total * 100).toFixed(1) : 0;
            const bPercent = store.total > 0 ? (store.b / store.total * 100).toFixed(1) : 0;
            
            cardHtml += `
                                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                        <div>
                                            <div style="font-weight: 500; color: #111827; font-size: 13px;">${store.name}</div>
                                            <div style="font-size: 11px; color: #6b7280;">${store.region} / ${store.area}</div>
                                        </div>
                                        <div style="font-weight: 600; color: #059669; font-size: 14px;">${habPercent}%</div>
                                    </div>
                                    <div style="height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; display: flex; margin-bottom: 8px;">
                                        <div style="height: 100%; background: #00337c; width: ${hPercent}%;"></div>
                                        <div style="height: 100%; background: #0081ff; width: ${aPercent}%;"></div>
                                        <div style="height: 100%; background: #6fb8ff; width: ${bPercent}%;"></div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px; font-size: 11px;">
                                        <span style="color: #00337c;">H:<span style="font-weight: 600;">${store.h}</span></span>
                                        <span style="color: #0081ff;">A:<span style="font-weight: 600;">${store.a}</span></span>
                                        <span style="color: #6fb8ff;">B:<span style="font-weight: 600;">${store.b}</span></span>
                                        <span style="color: #9ca3af;">其他:<span style="font-weight: 600;">${store.other}</span></span>
                                        <span style="color: #6b7280; margin-left: auto;">合计:<span style="font-weight: 600;">${store.total}</span></span>
                                    </div>
                                </div>
            `;
        });
        
        cardHtml += `
                        </div>
                    </div>
        `;
        
        // 生成每个小区的内容
        regionGroups.forEach((group, gi) => {
            const areaTotal = {
                h: group.stores.reduce((sum, s) => sum + s.h, 0),
                a: group.stores.reduce((sum, s) => sum + s.a, 0),
                b: group.stores.reduce((sum, s) => sum + s.b, 0),
                other: group.stores.reduce((sum, s) => sum + s.other, 0),
                total: group.stores.reduce((sum, s) => sum + s.total, 0)
            };
            const areaHab = areaTotal.total > 0 ? ((areaTotal.h + areaTotal.a + areaTotal.b) / areaTotal.total * 100).toFixed(1) : '0.0';
            
            cardHtml += `
                    <div class="area-panel ${gi === 0 ? 'active' : ''}" data-area="${group.area}">
                        <!-- 小区汇总 -->
                        <div style="display: flex; align-items: center; gap: 16px; padding: 10px 14px; background: #e0f2fe; border-radius: 6px; margin-bottom: 12px;">
                            <span style="font-size: 12px; font-weight: 600; color: #0369a1;">${group.region}</span>
                            <i class="fa-solid fa-angle-right" style="color: #7dd3fc; font-size: 10px;"></i>
                            <span style="font-size: 13px; font-weight: 600; color: #0c4a6e;">${group.area}</span>
                            <span style="margin-left: auto; font-size: 11px; color: #64748b;">${group.stores.length} 家专营店</span>
                            <span style="font-size: 13px; font-weight: 600; color: #059669;">H/A/B ${areaHab}%</span>
                        </div>
                        <!-- 门店列表 -->
                        <div style="display: flex; flex-direction: column; gap: 8px;">
            `;
            
            group.stores.forEach((store) => {
                const habTotal = store.h + store.a + store.b;
                const habPercent = store.total > 0 ? ((habTotal / store.total) * 100).toFixed(1) : '0.0';
                const hPercent = store.total > 0 ? (store.h / store.total * 100).toFixed(1) : 0;
                const aPercent = store.total > 0 ? (store.a / store.total * 100).toFixed(1) : 0;
                const bPercent = store.total > 0 ? (store.b / store.total * 100).toFixed(1) : 0;
                
                cardHtml += `
                                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                        <div style="font-weight: 500; color: #111827; font-size: 13px;">${store.name}</div>
                                        <div style="font-weight: 600; color: #059669; font-size: 14px;">${habPercent}%</div>
                                    </div>
                                    <div style="height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; display: flex; margin-bottom: 8px;">
                                        <div style="height: 100%; background: #00337c; width: ${hPercent}%;"></div>
                                        <div style="height: 100%; background: #0081ff; width: ${aPercent}%;"></div>
                                        <div style="height: 100%; background: #6fb8ff; width: ${bPercent}%;"></div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px; font-size: 11px;">
                                        <span style="color: #00337c;">H:<span style="font-weight: 600;">${store.h}</span></span>
                                        <span style="color: #0081ff;">A:<span style="font-weight: 600;">${store.a}</span></span>
                                        <span style="color: #6fb8ff;">B:<span style="font-weight: 600;">${store.b}</span></span>
                                        <span style="color: #9ca3af;">其他:<span style="font-weight: 600;">${store.other}</span></span>
                                        <span style="color: #6b7280; margin-left: auto;">合计:<span style="font-weight: 600;">${store.total}</span></span>
                                    </div>
                                </div>
                `;
            });
            
            cardHtml += `
                        </div>
                    </div>
            `;
        });
        
        cardHtml += `
                </div>
            </div>
        `;
        
        cardHtml += `
                </div>
            </div>
        `;
        
        content.innerHTML = cardHtml;
        
        // 绑定小区 Tab 切换事件
        initAreaTabSwitch();
    }
    
    // 显示弹窗
    modal.classList.add('active');
}

/**
 * 初始化小区 Tab 切换
 */
function initAreaTabSwitch() {
    const tabBtns = document.querySelectorAll('.area-tab-btn');
    const tabPanels = document.querySelectorAll('.area-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetArea = btn.dataset.area;
            
            // 切换 Tab 按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 切换内容面板
            tabPanels.forEach(panel => {
                if (panel.dataset.area === targetArea) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });
}

/**
 * 关闭城市专营店意向等级详情弹窗
 */
function closeCityStoreModal() {
    const modal = document.getElementById('cityStoreModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 区域投放效果柱状图点击事件（仅限区域投放效果图表）
document.addEventListener('click', (e) => {
    // 只响应区域投放效果图表内的点击
    const chartContainer = e.target.closest('#regionVChart');
    if (!chartContainer) return;
    
    // 查找被点击的柱状图元素
    const barItem = e.target.closest('.ce-v-bar-item');
    if (!barItem) return;
    
    // 获取城市名称（从 X 轴标签中获取）
    const labelEl = barItem.querySelector('.ce-v-x-label');
    if (!labelEl) return;
    
    const cityName = labelEl.innerText.trim();
    
    // 显示弹窗
    showCityStoreModal(cityName);
});

// 点击弹窗/抽屉外部关闭
document.addEventListener('click', (e) => {
    // 关闭城市专营店抽屉
    const cityModal = document.getElementById('cityStoreModal');
    if (cityModal && e.target === cityModal) {
        closeCityStoreModal();
    }
    // 关闭大区渠道质量抽屉
    const regionModal = document.getElementById('regionChannelModal');
    if (regionModal && e.target === regionModal) {
        closeRegionChannelModal();
    }
    // 关闭大项目下钻抽屉
    const projectModal = document.getElementById('projectDrillModal');
    if (projectModal && e.target === projectModal) {
        closeProjectDrillModal();
    }
    // 关闭排期下钻抽屉
    const scheduleModal = document.getElementById('scheduleDrillModal');
    if (scheduleModal && e.target === scheduleModal) {
        closeScheduleDrillModal();
    }
    // 关闭全量排行榜抽屉
    const rankingModal = document.getElementById('rankingModal');
    if (rankingModal && e.target === rankingModal) {
        closeRankingModal();
    }
    // 关闭培育运营下钻抽屉
    const focusModal = document.getElementById('focusDrillDownModal');
    if (focusModal && e.target === focusModal) {
        closeFocusModal();
    }
});

// ============================================
// 大区渠道质量详情弹窗功能
// ============================================

// 大区渠道质量 Mock 数据（按大区-小区-门店结构）
const regionChannelData = {
    'R1': {
        regionName: '华东大区',
        areas: {
            '上海一区': [
                { name: '上海东风南方专营店', h: 85, a: 142, b: 198, c: 80, f: 35, l: 15, e: 10, invalid: 5, total: 570 },
                { name: '上海日产特约店', h: 72, a: 125, b: 180, c: 68, f: 30, l: 12, e: 10, invalid: 8, total: 505 },
                { name: '上海华新专营店', h: 68, a: 118, b: 165, c: 55, f: 28, l: 10, e: 10, invalid: 9, total: 463 }
            ],
            '上海二区': [
                { name: '上海松江专营店', h: 58, a: 102, b: 142, c: 48, f: 22, l: 10, e: 8, invalid: 10, total: 400 },
                { name: '上海嘉定专营店', h: 45, a: 78, b: 105, c: 35, f: 18, l: 8, e: 6, invalid: 5, total: 300 }
            ],
            '上海三区': [
                { name: '上海宝山专营店', h: 22, a: 35, b: 42, c: 12, f: 6, l: 3, e: 2, invalid: 2, total: 124 }
            ],
            '杭州一区': [
                { name: '杭州城西专营店', h: 52, a: 95, b: 138, c: 45, f: 20, l: 8, e: 6, invalid: 6, total: 370 },
                { name: '杭州城东专营店', h: 45, a: 82, b: 120, c: 38, f: 18, l: 7, e: 5, invalid: 4, total: 319 }
            ],
            '杭州二区': [
                { name: '杭州滨江专营店', h: 38, a: 68, b: 98, c: 32, f: 15, l: 6, e: 5, invalid: 4, total: 266 },
                { name: '杭州萧山专营店', h: 28, a: 52, b: 78, c: 25, f: 12, l: 5, e: 3, invalid: 3, total: 206 }
            ],
            '南京一区': [
                { name: '南京鼓楼专营店', h: 42, a: 82, b: 118, c: 40, f: 18, l: 8, e: 6, invalid: 6, total: 320 },
                { name: '南京玄武专营店', h: 35, a: 68, b: 98, c: 32, f: 15, l: 6, e: 5, invalid: 4, total: 263 }
            ],
            '南京二区': [
                { name: '南京江宁专营店', h: 28, a: 55, b: 82, c: 28, f: 12, l: 5, e: 4, invalid: 3, total: 217 },
                { name: '南京浦口专营店', h: 20, a: 38, b: 58, c: 20, f: 9, l: 4, e: 3, invalid: 2, total: 154 }
            ]
        }
    },
    'R2': {
        regionName: '华南大区',
        areas: {
            '广州一区': [
                { name: '广州天河专营店', h: 78, a: 135, b: 195, c: 68, f: 30, l: 12, e: 10, invalid: 12, total: 540 },
                { name: '广州白云专营店', h: 65, a: 112, b: 158, c: 52, f: 25, l: 10, e: 8, invalid: 10, total: 440 }
            ],
            '广州二区': [
                { name: '广州番禺专营店', h: 55, a: 98, b: 135, c: 48, f: 22, l: 9, e: 7, invalid: 6, total: 380 },
                { name: '广州东风南方店', h: 48, a: 85, b: 120, c: 42, f: 20, l: 8, e: 6, invalid: 6, total: 335 }
            ],
            '广州三区': [
                { name: '广州黄埔专营店', h: 32, a: 58, b: 82, c: 28, f: 12, l: 6, e: 5, invalid: 4, total: 227 },
                { name: '广州花都专营店', h: 20, a: 35, b: 55, c: 18, f: 9, l: 4, e: 4, invalid: 3, total: 148 }
            ],
            '深圳一区': [
                { name: '深圳南山专营店', h: 68, a: 128, b: 175, c: 58, f: 25, l: 10, e: 8, invalid: 8, total: 480 },
                { name: '深圳福田专营店', h: 58, a: 105, b: 148, c: 48, f: 22, l: 9, e: 7, invalid: 8, total: 405 }
            ],
            '深圳二区': [
                { name: '深圳宝安专营店', h: 48, a: 88, b: 125, c: 42, f: 18, l: 8, e: 6, invalid: 4, total: 339 },
                { name: '深圳龙岗专营店', h: 38, a: 72, b: 102, c: 35, f: 15, l: 6, e: 5, invalid: 4, total: 277 }
            ],
            '深圳三区': [
                { name: '深圳罗湖专营店', h: 28, a: 52, b: 72, c: 25, f: 11, l: 5, e: 4, invalid: 3, total: 200 },
                { name: '深圳东风南方店', h: 15, a: 28, b: 42, c: 15, f: 8, l: 4, e: 3, invalid: 2, total: 117 }
            ]
        }
    },
    'R3': {
        regionName: '华北大区',
        areas: {
            '北京一区': [
                { name: '北京朝阳专营店', h: 62, a: 118, b: 165, c: 55, f: 25, l: 10, e: 8, invalid: 7, total: 450 },
                { name: '北京海淀专营店', h: 52, a: 98, b: 142, c: 45, f: 20, l: 8, e: 7, invalid: 8, total: 380 }
            ],
            '北京二区': [
                { name: '北京丰台专营店', h: 42, a: 82, b: 118, c: 38, f: 16, l: 7, e: 6, invalid: 5, total: 314 },
                { name: '北京亦庄专营店', h: 28, a: 58, b: 88, c: 28, f: 12, l: 6, e: 5, invalid: 1, total: 226 }
            ],
            '北京三区': [
                { name: '北京通州专营店', h: 14, a: 28, b: 42, c: 16, f: 8, l: 3, e: 3, invalid: 2, total: 116 }
            ],
            '天津一区': [
                { name: '天津河西专营店', h: 45, a: 88, b: 128, c: 42, f: 18, l: 8, e: 7, invalid: 7, total: 343 },
                { name: '天津南开专营店', h: 38, a: 72, b: 105, c: 35, f: 15, l: 7, e: 6, invalid: 5, total: 283 }
            ],
            '天津二区': [
                { name: '天津河东专营店', h: 32, a: 62, b: 92, c: 30, f: 14, l: 6, e: 5, invalid: 3, total: 244 },
                { name: '天津西青专营店', h: 22, a: 42, b: 65, c: 22, f: 10, l: 4, e: 4, invalid: 2, total: 171 }
            ]
        }
    },
    'R4': {
        regionName: '华中大区',
        areas: {
            '武汉一区': [
                { name: '武汉武昌专营店', h: 35, a: 58, b: 115, c: 38, f: 14, l: 6, e: 4, invalid: 3, total: 273 },
                { name: '武汉汉口专营店', h: 28, a: 48, b: 88, c: 28, f: 12, l: 5, e: 4, invalid: 3, total: 216 }
            ],
            '武汉二区': [
                { name: '武汉汉阳专营店', h: 22, a: 38, b: 68, c: 22, f: 10, l: 4, e: 4, invalid: 2, total: 170 },
                { name: '武汉洪山专营店', h: 18, a: 32, b: 52, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 137 }
            ],
            '武汉三区': [
                { name: '武汉青山专营店', h: 12, a: 22, b: 38, c: 12, f: 6, l: 3, e: 2, invalid: 2, total: 97 }
            ],
            '长沙一区': [
                { name: '长沙岳麓专营店', h: 28, a: 52, b: 95, c: 30, f: 12, l: 5, e: 4, invalid: 4, total: 230 },
                { name: '长沙雨花专营店', h: 22, a: 42, b: 75, c: 24, f: 10, l: 4, e: 4, invalid: 3, total: 184 }
            ],
            '长沙二区': [
                { name: '长沙天心专营店', h: 18, a: 35, b: 58, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 146 },
                { name: '长沙开福专营店', h: 12, a: 25, b: 42, c: 14, f: 6, l: 3, e: 3, invalid: 2, total: 107 }
            ]
        }
    },
    'R5': {
        regionName: '西部大区',
        areas: {
            '成都一区': [
                { name: '成都武侯专营店', h: 38, a: 72, b: 108, c: 38, f: 16, l: 6, e: 6, invalid: 6, total: 290 },
                { name: '成都锦江专营店', h: 32, a: 62, b: 92, c: 32, f: 14, l: 5, e: 5, invalid: 2, total: 244 }
            ],
            '成都二区': [
                { name: '成都成华专营店', h: 25, a: 48, b: 72, c: 25, f: 12, l: 5, e: 4, invalid: 2, total: 193 },
                { name: '成都金牛专营店', h: 18, a: 35, b: 52, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 140 }
            ],
            '成都三区': [
                { name: '成都高新专营店', h: 12, a: 22, b: 35, c: 12, f: 6, l: 3, e: 2, invalid: 2, total: 94 }
            ],
            '重庆一区': [
                { name: '重庆渝北专营店', h: 32, a: 65, b: 112, c: 38, f: 15, l: 6, e: 5, invalid: 4, total: 277 },
                { name: '重庆江北专营店', h: 28, a: 55, b: 95, c: 32, f: 13, l: 5, e: 4, invalid: 4, total: 236 }
            ],
            '重庆二区': [
                { name: '重庆沙坪坝专营店', h: 22, a: 45, b: 78, c: 26, f: 11, l: 5, e: 4, invalid: 2, total: 193 },
                { name: '重庆南岸专营店', h: 15, a: 32, b: 55, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 137 }
            ]
        }
    },
    'R6': {
        regionName: '东北大区',
        areas: {
            '沈阳一区': [
                { name: '沈阳铁西专营店', h: 28, a: 52, b: 85, c: 32, f: 15, l: 6, e: 5, invalid: 4, total: 227 },
                { name: '沈阳和平专营店', h: 22, a: 42, b: 68, c: 25, f: 12, l: 5, e: 4, invalid: 3, total: 181 }
            ],
            '沈阳二区': [
                { name: '沈阳皇姑专营店', h: 18, a: 35, b: 55, c: 20, f: 10, l: 4, e: 3, invalid: 3, total: 148 },
                { name: '沈阳大东专营店', h: 15, a: 28, b: 45, c: 16, f: 8, l: 4, e: 3, invalid: 2, total: 121 }
            ],
            '大连一区': [
                { name: '大连甘井子专营店', h: 25, a: 48, b: 78, c: 28, f: 12, l: 5, e: 4, invalid: 3, total: 203 },
                { name: '大连西岗专营店', h: 20, a: 38, b: 62, c: 22, f: 10, l: 4, e: 3, invalid: 2, total: 161 }
            ],
            '大连二区': [
                { name: '大连中山专营店', h: 16, a: 30, b: 48, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 129 }
            ]
        }
    },
    'R7': {
        regionName: '西南大区',
        areas: {
            '昆明一区': [
                { name: '昆明西山专营店', h: 22, a: 42, b: 72, c: 28, f: 12, l: 5, e: 4, invalid: 3, total: 188 },
                { name: '昆明五华专营店', h: 18, a: 35, b: 58, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 153 }
            ],
            '昆明二区': [
                { name: '昆明官渡专营店', h: 15, a: 28, b: 48, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 126 },
                { name: '昆明盘龙专营店', h: 12, a: 22, b: 38, c: 14, f: 6, l: 3, e: 2, invalid: 2, total: 99 }
            ],
            '贵阳一区': [
                { name: '贵阳南明专营店', h: 18, a: 35, b: 58, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 153 },
                { name: '贵阳云岩专营店', h: 15, a: 28, b: 48, c: 18, f: 8, l: 4, e: 3, invalid: 2, total: 126 }
            ]
        }
    },
    'R8': {
        regionName: '西北大区',
        areas: {
            '西安一区': [
                { name: '西安雁塔专营店', h: 28, a: 55, b: 98, c: 32, f: 14, l: 6, e: 5, invalid: 1, total: 239 },
                { name: '西安碑林专营店', h: 24, a: 48, b: 82, c: 26, f: 12, l: 5, e: 4, invalid: 1, total: 202 }
            ],
            '西安二区': [
                { name: '西安莲湖专营店', h: 18, a: 38, b: 65, c: 20, f: 9, l: 4, e: 3, invalid: 2, total: 159 },
                { name: '西安未央专营店', h: 15, a: 28, b: 48, c: 16, f: 7, l: 4, e: 3, invalid: 2, total: 123 }
            ],
            '西安三区': [
                { name: '西安新城专营店', h: 10, a: 18, b: 32, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 82 }
            ]
        }
    }
};

// ============================================
// 大项目线索质量下钻数据
// ============================================
const projectDrillData = {
    '夏季大促': {
        projectName: '2024夏季大促-R4核心运营项目',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海东风南方专营店', h: 45, a: 78, b: 95, c: 42, f: 18, l: 8, e: 6, invalid: 8, total: 300 },
                    { name: '上海日产特约店', h: 38, a: 65, b: 82, c: 35, f: 15, l: 6, e: 5, invalid: 6, total: 252 }
                ],
                '浙江小区': [
                    { name: '杭州城西专营店', h: 32, a: 55, b: 72, c: 28, f: 12, l: 5, e: 4, invalid: 5, total: 213 }
                ]
            },
            '华南大区': {
                '广州小区': [
                    { name: '广州天河专营店', h: 42, a: 72, b: 88, c: 38, f: 16, l: 7, e: 5, invalid: 7, total: 275 }
                ],
                '深圳小区': [
                    { name: '深圳南山专营店', h: 35, a: 62, b: 78, c: 32, f: 14, l: 6, e: 5, invalid: 6, total: 238 }
                ]
            }
        }
    },
    '品牌焕新': {
        projectName: '品牌焕新周-R2区域联动',
        channels: {
            '华中大区': {
                '武汉小区': [
                    { name: '武汉汉口专营店', h: 28, a: 48, b: 62, c: 25, f: 12, l: 5, e: 4, invalid: 4, total: 188 },
                    { name: '武汉武昌专营店', h: 22, a: 38, b: 52, c: 20, f: 10, l: 4, e: 3, invalid: 3, total: 152 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都武侯专营店', h: 25, a: 42, b: 55, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 164 }
                ],
                '西安小区': [
                    { name: '西安雁塔专营店', h: 18, a: 32, b: 45, c: 18, f: 8, l: 3, e: 3, invalid: 2, total: 129 }
                ]
            }
        }
    },
    '天籁补贴': {
        projectName: '天籁专项补贴-R1渠道专场',
        channels: {
            '华东大区': {
                '南京小区': [
                    { name: '南京鼓楼专营店', h: 32, a: 55, b: 72, c: 30, f: 12, l: 5, e: 4, invalid: 4, total: 214 }
                ],
                '苏州小区': [
                    { name: '苏州园区专营店', h: 28, a: 48, b: 65, c: 26, f: 11, l: 4, e: 3, invalid: 3, total: 188 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京海淀专营店', h: 35, a: 58, b: 75, c: 32, f: 14, l: 5, e: 5, invalid: 5, total: 229 }
                ],
                '天津小区': [
                    { name: '天津河西专营店', h: 25, a: 42, b: 58, c: 24, f: 10, l: 4, e: 3, invalid: 3, total: 169 }
                ]
            }
        }
    },
    '轩逸混动': {
        projectName: '轩逸超混版上市推广-R5',
        channels: {
            '华南大区': {
                '广州小区': [
                    { name: '广州番禺专营店', h: 30, a: 52, b: 68, c: 28, f: 12, l: 5, e: 4, invalid: 4, total: 203 },
                    { name: '广州白云专营店', h: 25, a: 45, b: 60, c: 24, f: 10, l: 4, e: 3, invalid: 3, total: 174 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都成华专营店', h: 20, a: 35, b: 48, c: 20, f: 8, l: 3, e: 3, invalid: 2, total: 139 }
                ]
            }
        }
    },
    '618购车': {
        projectName: '618全民购车节-全渠道',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海华新专营店', h: 38, a: 65, b: 82, c: 35, f: 15, l: 6, e: 5, invalid: 6, total: 252 }
                ],
                '浙江小区': [
                    { name: '杭州滨江专营店', h: 30, a: 52, b: 68, c: 28, f: 12, l: 5, e: 4, invalid: 4, total: 203 }
                ]
            },
            '华中大区': {
                '长沙小区': [
                    { name: '长沙岳麓专营店', h: 22, a: 38, b: 52, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 154 }
                ]
            }
        }
    },
    '探陆预售': {
        projectName: '探陆预售-到店留存专项',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海浦东专营店', h: 40, a: 68, b: 85, c: 36, f: 14, l: 6, e: 5, invalid: 6, total: 260 }
                ],
                '南京小区': [
                    { name: '南京建邺专营店', h: 28, a: 48, b: 65, c: 25, f: 11, l: 4, e: 3, invalid: 3, total: 187 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京朝阳专营店', h: 35, a: 60, b: 78, c: 32, f: 13, l: 5, e: 4, invalid: 5, total: 232 }
                ],
                '天津小区': [
                    { name: '天津南开专营店', h: 22, a: 38, b: 52, c: 20, f: 9, l: 3, e: 3, invalid: 3, total: 150 }
                ]
            }
        }
    },
    '老带新活动': {
        projectName: '售后维系老带新活动',
        channels: {
            '华中大区': {
                '武汉小区': [
                    { name: '武汉光谷专营店', h: 30, a: 50, b: 68, c: 28, f: 12, l: 5, e: 4, invalid: 4, total: 201 }
                ],
                '长沙小区': [
                    { name: '长沙芙蓉专营店', h: 25, a: 42, b: 58, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 167 }
                ]
            },
            '华南大区': {
                '广州小区': [
                    { name: '广州越秀专营店', h: 28, a: 48, b: 62, c: 25, f: 11, l: 4, e: 3, invalid: 3, total: 184 }
                ]
            }
        }
    },
    '抖音直播': {
        projectName: '抖音直播间获客计划-R3',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海静安专营店', h: 18, a: 32, b: 48, c: 20, f: 10, l: 4, e: 3, invalid: 3, total: 138 }
                ],
                '浙江小区': [
                    { name: '杭州西湖专营店', h: 15, a: 28, b: 42, c: 18, f: 8, l: 3, e: 3, invalid: 2, total: 119 }
                ]
            },
            '华南大区': {
                '深圳小区': [
                    { name: '深圳福田专营店', h: 20, a: 35, b: 50, c: 22, f: 9, l: 4, e: 3, invalid: 3, total: 146 }
                ]
            }
        }
    },
    '快手探店': {
        projectName: '快手探店-引流到店',
        channels: {
            '华北大区': {
                '北京小区': [
                    { name: '北京丰台专营店', h: 12, a: 22, b: 38, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 105 }
                ],
                '石家庄小区': [
                    { name: '石家庄长安专营店', h: 10, a: 20, b: 35, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 94 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都锦江专营店', h: 14, a: 25, b: 40, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 109 }
                ]
            }
        }
    },
    '商超展位': {
        projectName: '线下商超展位-引流',
        channels: {
            '华东大区': {
                '宁波小区': [
                    { name: '宁波海曙专营店', h: 10, a: 18, b: 32, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 89 }
                ],
                '温州小区': [
                    { name: '温州鹿城专营店', h: 8, a: 16, b: 28, c: 12, f: 6, l: 2, e: 2, invalid: 1, total: 75 }
                ]
            },
            '华中大区': {
                '郑州小区': [
                    { name: '郑州金水专营店', h: 12, a: 20, b: 35, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 97 }
                ]
            }
        }
    },
    '电销邀约': {
        projectName: '电销组-邀约到店竞赛',
        channels: {
            '华南大区': {
                '佛山小区': [
                    { name: '佛山禅城专营店', h: 15, a: 28, b: 42, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 118 }
                ],
                '东莞小区': [
                    { name: '东莞南城专营店', h: 12, a: 22, b: 35, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 98 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京顺义专营店', h: 18, a: 30, b: 45, c: 20, f: 9, l: 3, e: 3, invalid: 2, total: 130 }
                ]
            }
        }
    },
    '区域车展': {
        projectName: '区域车展-邀约到场',
        channels: {
            '西部大区': {
                '重庆小区': [
                    { name: '重庆渝北专营店', h: 10, a: 18, b: 30, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 84 }
                ],
                '昆明小区': [
                    { name: '昆明盘龙专营店', h: 8, a: 15, b: 25, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 70 }
                ]
            },
            '华中大区': {
                '合肥小区': [
                    { name: '合肥包河专营店', h: 12, a: 20, b: 32, c: 15, f: 6, l: 3, e: 2, invalid: 2, total: 92 }
                ]
            }
        }
    },
    '上门试驾': {
        projectName: '上门试驾-服务升级项目',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海闵行专营店', h: 20, a: 35, b: 52, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 149 }
                ],
                '无锡小区': [
                    { name: '无锡新吴专营店', h: 16, a: 28, b: 42, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 119 }
                ]
            },
            '华南大区': {
                '珠海小区': [
                    { name: '珠海香洲专营店', h: 14, a: 25, b: 40, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 109 }
                ]
            }
        }
    },
    '竞品对比': {
        projectName: '竞品对比试驾-专项',
        channels: {
            '华北大区': {
                '青岛小区': [
                    { name: '青岛市南专营店', h: 14, a: 25, b: 38, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 107 }
                ],
                '济南小区': [
                    { name: '济南历下专营店', h: 12, a: 22, b: 35, c: 15, f: 6, l: 3, e: 2, invalid: 2, total: 97 }
                ]
            },
            '西部大区': {
                '西安小区': [
                    { name: '西安未央专营店', h: 10, a: 18, b: 30, c: 14, f: 6, l: 2, e: 2, invalid: 1, total: 83 }
                ]
            }
        }
    },
    '夜间试驾': {
        projectName: '夜间试驾-关怀活动',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海徐汇专营店', h: 12, a: 22, b: 35, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 98 }
                ],
                '南京小区': [
                    { name: '南京江宁专营店', h: 10, a: 18, b: 30, c: 12, f: 6, l: 2, e: 2, invalid: 1, total: 81 }
                ]
            },
            '华南大区': {
                '厦门小区': [
                    { name: '厦门湖里专营店', h: 14, a: 24, b: 38, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 106 }
                ]
            }
        }
    },
    '女性试驾': {
        projectName: '女性车主-试驾下午茶',
        channels: {
            '华东大区': {
                '浙江小区': [
                    { name: '杭州拱墅专营店', h: 10, a: 18, b: 28, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 78 }
                ],
                '苏州小区': [
                    { name: '苏州姑苏专营店', h: 8, a: 15, b: 25, c: 10, f: 5, l: 2, e: 2, invalid: 1, total: 68 }
                ]
            },
            '华中大区': {
                '武汉小区': [
                    { name: '武汉洪山专营店', h: 12, a: 20, b: 32, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 90 }
                ]
            }
        }
    },
    '高校试驾': {
        projectName: '高校行-首台车试驾',
        channels: {
            '华北大区': {
                '北京小区': [
                    { name: '北京昌平专营店', h: 8, a: 14, b: 24, c: 10, f: 5, l: 2, e: 1, invalid: 1, total: 65 }
                ],
                '天津小区': [
                    { name: '天津滨海专营店', h: 6, a: 12, b: 20, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 54 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都高新专营店', h: 10, a: 16, b: 28, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 76 }
                ]
            }
        }
    },
    '渠道锁单': {
        projectName: '渠道专享-限时锁单补贴',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海杨浦专营店', h: 12, a: 20, b: 32, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 90 }
                ],
                '宁波小区': [
                    { name: '宁波北仑专营店', h: 10, a: 18, b: 28, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 78 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京通州专营店', h: 14, a: 24, b: 38, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 106 }
                ]
            }
        }
    },
    '电商锁单': {
        projectName: '电商平台-9.9元锁单',
        channels: {
            '华南大区': {
                '广州小区': [
                    { name: '广州增城专营店', h: 8, a: 14, b: 24, c: 10, f: 5, l: 2, e: 1, invalid: 1, total: 65 }
                ],
                '深圳小区': [
                    { name: '深圳龙岗专营店', h: 6, a: 12, b: 20, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 54 }
                ]
            },
            '西部大区': {
                '重庆小区': [
                    { name: '重庆江北专营店', h: 10, a: 16, b: 26, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 74 }
                ]
            }
        }
    },
    '车展锁单': {
        projectName: '车展现场-即时锁单奖',
        channels: {
            '华中大区': {
                '郑州小区': [
                    { name: '郑州二七专营店', h: 6, a: 10, b: 18, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 50 }
                ],
                '武汉小区': [
                    { name: '武汉江汉专营店', h: 8, a: 12, b: 22, c: 10, f: 4, l: 2, e: 1, invalid: 1, total: 60 }
                ]
            },
            '华东大区': {
                '常州小区': [
                    { name: '常州新北专营店', h: 5, a: 10, b: 16, c: 8, f: 3, l: 2, e: 1, invalid: 1, total: 46 }
                ]
            }
        }
    }
};

// ============================================
// 排期线索质量下钻数据
// ============================================
const scheduleDrillData = {
    'douyin0501': {
        scheduleName: '抖音信息流-0501-R4核心排期',
        channels: {
            '华东大区': {
                '上海小区': [
                    { name: '上海东风南方专营店', h: 25, a: 42, b: 55, c: 22, f: 10, l: 4, e: 3, invalid: 3, total: 164 }
                ],
                '浙江小区': [
                    { name: '杭州滨江专营店', h: 20, a: 35, b: 48, c: 18, f: 8, l: 3, e: 3, invalid: 2, total: 137 }
                ]
            },
            '华南大区': {
                '广州小区': [
                    { name: '广州天河专营店', h: 22, a: 38, b: 50, c: 20, f: 9, l: 4, e: 3, invalid: 3, total: 149 }
                ],
                '深圳小区': [
                    { name: '深圳南山专营店', h: 18, a: 32, b: 45, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 128 }
                ]
            }
        }
    },
    'chekong0428': {
        scheduleName: '懂车帝CPS-0428-R4效果通',
        channels: {
            '华中大区': {
                '武汉小区': [
                    { name: '武汉汉口专营店', h: 18, a: 32, b: 45, c: 18, f: 8, l: 3, e: 2, invalid: 2, total: 128 },
                    { name: '武汉武昌专营店', h: 15, a: 28, b: 40, c: 15, f: 7, l: 3, e: 2, invalid: 2, total: 112 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都武侯专营店', h: 16, a: 30, b: 42, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 118 }
                ]
            }
        }
    },
    'baidu0502': {
        scheduleName: '百度搜索竞价-0502-R2品牌专区',
        channels: {
            '华北大区': {
                '北京小区': [
                    { name: '北京海淀专营店', h: 20, a: 35, b: 48, c: 20, f: 9, l: 4, e: 3, invalid: 3, total: 142 }
                ],
                '天津小区': [
                    { name: '天津河西专营店', h: 15, a: 28, b: 40, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 113 }
                ]
            },
            '华东大区': {
                '南京小区': [
                    { name: '南京鼓楼专营店', h: 14, a: 25, b: 38, c: 15, f: 6, l: 3, e: 2, invalid: 2, total: 105 }
                ]
            }
        }
    },
    'kuaishou0505': {
        scheduleName: '快手短视频-0505-R3核心排期',
        channels: {
            '西部大区': {
                '成都小区': [
                    { name: '成都成华专营店', h: 12, a: 22, b: 35, c: 14, f: 6, l: 2, e: 2, invalid: 1, total: 94 }
                ],
                '西安小区': [
                    { name: '西安雁塔专营店', h: 10, a: 18, b: 30, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 80 }
                ]
            },
            '华南大区': {
                '广州小区': [
                    { name: '广州白云专营店', h: 14, a: 25, b: 38, c: 15, f: 6, l: 3, e: 2, invalid: 2, total: 105 }
                ]
            }
        }
    },
    'xiaohongshu0425': {
        scheduleName: '小红书种草-0425-R1专项排期',
        channels: {
            '华东大区': {
                '苏州小区': [
                    { name: '苏州园区专营店', h: 15, a: 28, b: 40, c: 16, f: 7, l: 3, e: 2, invalid: 2, total: 113 }
                ],
                '上海小区': [
                    { name: '上海华新专营店', h: 18, a: 32, b: 45, c: 18, f: 8, l: 3, e: 3, invalid: 2, total: 129 }
                ]
            },
            '华北大区': {
                '石家庄小区': [
                    { name: '石家庄桥西专营店', h: 10, a: 18, b: 28, c: 12, f: 5, l: 2, e: 1, invalid: 1, total: 77 }
                ]
            }
        }
    },
    'pengyouquan0501': {
        scheduleName: '朋友圈广告-0501-R4核心排期',
        channels: {
            '华南大区': {
                '佛山小区': [
                    { name: '佛山禅城专营店', h: 10, a: 18, b: 30, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 84 }
                ],
                '东莞小区': [
                    { name: '东莞南城专营店', h: 8, a: 15, b: 25, c: 12, f: 5, l: 2, e: 1, invalid: 1, total: 69 }
                ]
            },
            '华东大区': {
                '上海小区': [
                    { name: '上海长宁专营店', h: 12, a: 20, b: 32, c: 14, f: 6, l: 2, e: 2, invalid: 2, total: 90 }
                ]
            }
        }
    },
    'toutiao0503': {
        scheduleName: '今日头条-0503-R4品牌联动',
        channels: {
            '华中大区': {
                '郑州小区': [
                    { name: '郑州金水专营店', h: 8, a: 14, b: 25, c: 12, f: 5, l: 2, e: 1, invalid: 1, total: 68 }
                ],
                '合肥小区': [
                    { name: '合肥包河专营店', h: 6, a: 12, b: 20, c: 10, f: 4, l: 2, e: 1, invalid: 1, total: 56 }
                ]
            },
            '华北大区': {
                '北京小区': [
                    { name: '北京大兴专营店', h: 10, a: 16, b: 28, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 76 }
                ]
            }
        }
    },
    'youku0430': {
        scheduleName: '优酷视频插播-0430-R2专项',
        channels: {
            '西部大区': {
                '昆明小区': [
                    { name: '昆明盘龙专营店', h: 8, a: 14, b: 24, c: 10, f: 4, l: 2, e: 1, invalid: 1, total: 64 }
                ],
                '重庆小区': [
                    { name: '重庆渝北专营店', h: 10, a: 16, b: 26, c: 12, f: 5, l: 2, e: 2, invalid: 1, total: 74 }
                ]
            },
            '华南大区': {
                '厦门小区': [
                    { name: '厦门湖里专营店', h: 6, a: 12, b: 20, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 54 }
                ]
            }
        }
    },
    'zhihu0502': {
        scheduleName: '知乎内容直投-0502-R3核心',
        channels: {
            '华东大区': {
                '南京小区': [
                    { name: '南京建邺专营店', h: 6, a: 10, b: 18, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 50 }
                ],
                '上海小区': [
                    { name: '上海普陀专营店', h: 8, a: 14, b: 22, c: 10, f: 4, l: 2, e: 1, invalid: 1, total: 62 }
                ]
            },
            '华中大区': {
                '长沙小区': [
                    { name: '长沙岳麓专营店', h: 5, a: 10, b: 16, c: 8, f: 3, l: 2, e: 1, invalid: 1, total: 46 }
                ]
            }
        }
    },
    'bilibili0504': {
        scheduleName: '哔哩哔哩动态-0504-R5新品上市',
        channels: {
            '华北大区': {
                '北京小区': [
                    { name: '北京昌平专营店', h: 5, a: 10, b: 16, c: 8, f: 3, l: 2, e: 1, invalid: 1, total: 46 }
                ],
                '青岛小区': [
                    { name: '青岛崂山专营店', h: 6, a: 10, b: 18, c: 8, f: 4, l: 2, e: 1, invalid: 1, total: 50 }
                ]
            },
            '西部大区': {
                '成都小区': [
                    { name: '成都高新专营店', h: 4, a: 8, b: 14, c: 6, f: 3, l: 1, e: 1, invalid: 1, total: 38 }
                ]
            }
        }
    }
};

// 计算大区总计
function calculateRegionTotal(regionData) {
    let total = { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
    Object.values(regionData.areas).forEach(areaStores => {
        areaStores.forEach(store => {
            total.h += store.h;
            total.a += store.a;
            total.b += store.b;
            total.c += store.c;
            total.f += store.f;
            total.l += store.l;
            total.e += store.e;
            total.invalid += store.invalid;
            total.total += store.total;
        });
    });
    return total;
}

/**
 * 显示大区渠道质量详情弹窗
 * @param {string} regionCode - 大区代码，如 R1, R2
 */
function showRegionChannelModal(regionCode) {
    const modal = document.getElementById('regionChannelModal');
    const title = document.getElementById('regionChannelModalTitle');
    const content = document.getElementById('regionChannelModalContent');
    
    if (!modal || !title || !content) return;
    
    // 设置标题
    title.innerText = '各区渠道质量分布';
    
    // 计算全局总计
    const allRegionsTotal = { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
    const regionCodes = Object.keys(regionChannelData);
    regionCodes.forEach(code => {
        const total = calculateRegionTotal(regionChannelData[code]);
        allRegionsTotal.h += total.h;
        allRegionsTotal.a += total.a;
        allRegionsTotal.b += total.b;
        allRegionsTotal.c += total.c;
        allRegionsTotal.f += total.f;
        allRegionsTotal.l += total.l;
        allRegionsTotal.e += total.e;
        allRegionsTotal.invalid += total.invalid;
        allRegionsTotal.total += total.total;
    });
    const allHabTotal = allRegionsTotal.h + allRegionsTotal.a + allRegionsTotal.b;
    const allHabPercent = allRegionsTotal.total > 0 ? ((allHabTotal / allRegionsTotal.total) * 100).toFixed(1) : '0.0';
    const allStoreCount = regionCodes.reduce((sum, code) => {
        return sum + Object.values(regionChannelData[code].areas).reduce((s, stores) => s + stores.length, 0);
    }, 0);
    
    // 生成内容 HTML
    let html = `
        <div style="padding: 16px 20px;">
            <!-- 汇总信息栏 -->
            <div style="display: flex; align-items: center; gap: 20px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #6b7280;">大区数量</div>
                    <div style="font-size: 18px; font-weight: 600; color: #111827;">${regionCodes.length} 个</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #6b7280;">专营店数量</div>
                    <div style="font-size: 18px; font-weight: 600; color: #111827;">${allStoreCount} 家</div>
                </div>
                <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                <div style="display: flex; gap: 12px;">
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #6b7280;">H级</div>
                        <div style="font-size: 14px; font-weight: 600; color: #00337c;">${allRegionsTotal.h}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #6b7280;">A级</div>
                        <div style="font-size: 14px; font-weight: 600; color: #0081ff;">${allRegionsTotal.a}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #6b7280;">B级</div>
                        <div style="font-size: 14px; font-weight: 600; color: #6fb8ff;">${allRegionsTotal.b}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #6b7280;">C级</div>
                        <div style="font-size: 14px; font-weight: 600; color: #22c55e;">${allRegionsTotal.c}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #6b7280;">F级</div>
                        <div style="font-size: 14px; font-weight: 600; color: #f97316;">${allRegionsTotal.f}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #6b7280;">L级</div>
                        <div style="font-size: 14px; font-weight: 600; color: #a855f7;">${allRegionsTotal.l}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #6b7280;">E级</div>
                        <div style="font-size: 14px; font-weight: 600; color: #64748b;">${allRegionsTotal.e}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #6b7280;">无效</div>
                        <div style="font-size: 14px; font-weight: 600; color: #ef4444;">${allRegionsTotal.invalid}</div>
                    </div>
                </div>
                <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #6b7280;">合计线索</div>
                    <div style="font-size: 18px; font-weight: 600; color: #111827;">${allRegionsTotal.total}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #6b7280;">H/A/B占比</div>
                    <div style="font-size: 18px; font-weight: 600; color: #059669;">${allHabPercent}%</div>
                </div>
            </div>
            
            <!-- 一级大区 Tab -->
            <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <!-- 全部大区 Tab -->
                <button class="region-tab-btn active" data-region="all">
                    <span>全部</span>
                    <span class="region-tab-count">${allHabPercent}%</span>
                </button>
    `;
    
    // 生成一级大区 Tab
    regionCodes.forEach((code, idx) => {
        const region = regionChannelData[code];
        const regionTotal = calculateRegionTotal(region);
        const regionHab = regionTotal.total > 0 ? ((regionTotal.h + regionTotal.a + regionTotal.b) / regionTotal.total * 100).toFixed(1) : '0.0';
        
        html += `
                <button class="region-tab-btn" data-region="${code}">
                    <span>${region.regionName}</span>
                    <span class="region-tab-count">${regionHab}%</span>
                </button>
        `;
    });
    
    html += `
            </div>
            
            <!-- 大区内容区域 -->
            <div class="region-tab-content">
                <!-- 全部内容面板 -->
                <div class="region-panel active" data-region="all">
                    <!-- 全部汇总 -->
                    <div style="display: flex; align-items: center; gap: 16px; padding: 10px 14px; background: #fef3c7; border-radius: 6px; margin-bottom: 12px;">
                        <span style="font-size: 12px; font-weight: 600; color: #92400e;">全部大区</span>
                        <span style="font-size: 11px; color: #64748b;">${regionCodes.length} 个大区</span>
                        <span style="margin-left: auto; font-size: 11px; color: #64748b;">${allStoreCount} 家专营店</span>
                        <span style="font-size: 13px; font-weight: 600; color: #059669;">H/A/B ${allHabPercent}%</span>
                    </div>
                    <!-- 二级小区 Tab -->
                    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                        <button class="area-tab-btn active" data-area="all" data-parent="all">
                            <span>全部</span>
                            <span class="area-tab-count">${allStoreCount}家</span>
                        </button>
                    </div>
                    <!-- 全部门店列表 -->
                    <div class="area-tab-content">
                        <div class="area-panel active" data-area="all">
                            <div style="display: flex; flex-direction: column; gap: 8px;">
    `;
    
    // 生成全部门店列表
    regionCodes.forEach((code) => {
        const region = regionChannelData[code];
        Object.values(region.areas).forEach((stores) => {
            stores.forEach((store) => {
                const habTotal = store.h + store.a + store.b;
                const habPercent = store.total > 0 ? ((habTotal / store.total) * 100).toFixed(1) : '0.0';
                const hPercent = store.total > 0 ? (store.h / store.total * 100).toFixed(1) : 0;
                const aPercent = store.total > 0 ? (store.a / store.total * 100).toFixed(1) : 0;
                const bPercent = store.total > 0 ? (store.b / store.total * 100).toFixed(1) : 0;
                const cPercent = store.total > 0 ? (store.c / store.total * 100).toFixed(1) : 0;
                const fPercent = store.total > 0 ? (store.f / store.total * 100).toFixed(1) : 0;
                
                html += `
                                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                        <div>
                                            <div style="font-weight: 500; color: #111827; font-size: 13px;">${store.name}</div>
                                            <div style="font-size: 11px; color: #6b7280;">${region.regionName}</div>
                                        </div>
                                        <div style="font-weight: 600; color: #059669; font-size: 14px;">${habPercent}%</div>
                                    </div>
                                    <div style="height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; display: flex; margin-bottom: 8px;">
                                        <div style="height: 100%; background: #00337c; width: ${hPercent}%;"></div>
                                        <div style="height: 100%; background: #0081ff; width: ${aPercent}%;"></div>
                                        <div style="height: 100%; background: #6fb8ff; width: ${bPercent}%;"></div>
                                        <div style="height: 100%; background: #22c55e; width: ${cPercent}%;"></div>
                                        <div style="height: 100%; background: #f97316; width: ${fPercent}%;"></div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px; font-size: 11px;">
                                        <span style="color: #00337c;">H:<span style="font-weight: 600;">${store.h}</span></span>
                                        <span style="color: #0081ff;">A:<span style="font-weight: 600;">${store.a}</span></span>
                                        <span style="color: #6fb8ff;">B:<span style="font-weight: 600;">${store.b}</span></span>
                                        <span style="color: #22c55e;">C:<span style="font-weight: 600;">${store.c}</span></span>
                                        <span style="color: #f97316;">F:<span style="font-weight: 600;">${store.f}</span></span>
                                        <span style="color: #a855f7;">L:<span style="font-weight: 600;">${store.l}</span></span>
                                        <span style="color: #64748b;">E:<span style="font-weight: 600;">${store.e}</span></span>
                                        <span style="color: #ef4444;">无效:<span style="font-weight: 600;">${store.invalid}</span></span>
                                        <span style="color: #6b7280; margin-left: auto;">合计:<span style="font-weight: 600;">${store.total}</span></span>
                                    </div>
                                </div>
                `;
            });
        });
    });
    
    html += `
                            </div>
                        </div>
                    </div>
                </div>
    `;
    
    // 生成每个大区的内容面板
    regionCodes.forEach((code, idx) => {
        const region = regionChannelData[code];
        const regionTotal = calculateRegionTotal(region);
        const areaNames = Object.keys(region.areas);
        
        html += `
                <div class="region-panel ${idx === 0 ? 'active' : ''}" data-region="${code}">
                    <!-- 大区汇总 -->
                    <div style="display: flex; align-items: center; gap: 16px; padding: 10px 14px; background: #dbeafe; border-radius: 6px; margin-bottom: 12px;">
                        <span style="font-size: 12px; font-weight: 600; color: #0369a1;">${region.regionName}</span>
                        <span style="font-size: 11px; color: #64748b;">${areaNames.length} 个小区</span>
                        <span style="margin-left: auto; font-size: 11px; color: #64748b;">
                            ${Object.values(region.areas).reduce((sum, stores) => sum + stores.length, 0)} 家专营店
                        </span>
                        <span style="font-size: 13px; font-weight: 600; color: #059669;">
                            H/A/B ${regionTotal.total > 0 ? ((regionTotal.h + regionTotal.a + regionTotal.b) / regionTotal.total * 100).toFixed(1) : '0.0'}%
                        </span>
                    </div>
                    
                    <!-- 二级小区 Tab -->
                    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                        <button class="area-tab-btn active" data-area="all" data-parent="${code}">
                            <span>全部</span>
                            <span class="area-tab-count">${Object.values(region.areas).reduce((sum, stores) => sum + stores.length, 0)}家</span>
                        </button>
        `;

        // 生成小区 Tab
        areaNames.forEach((areaName, gi) => {
            const areaStores = region.areas[areaName];
            const areaTotal = areaStores.reduce((sum, s) => {
                sum.h += s.h; sum.a += s.a; sum.b += s.b; sum.total += s.total;
                return sum;
            }, { h: 0, a: 0, b: 0, total: 0 });
            const areaHab = areaTotal.total > 0 ? ((areaTotal.h + areaTotal.a + areaTotal.b) / areaTotal.total * 100).toFixed(1) : '0.0';

            html += `
                        <button class="area-tab-btn" data-area="${areaName}" data-parent="${code}">
                            <span>${areaName}</span>
                            <span class="area-tab-count">${areaStores.length}家</span>
                        </button>
            `;
        });
        
        html += `
                    </div>
                    
                    <!-- 门店列表内容 -->
                    <div class="area-tab-content">
        `;

        // 生成"全部"面板 - 显示该大区下所有门店
        const regionAllHab = regionTotal.total > 0 ? ((regionTotal.h + regionTotal.a + regionTotal.b) / regionTotal.total * 100).toFixed(1) : '0.0';
        html += `
                        <div class="area-panel active" data-area="all">
                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #fef3c7; border-radius: 4px; margin-bottom: 10px;">
                                <span style="font-size: 12px; font-weight: 600; color: #92400e;">全部小区</span>
                                <span style="font-size: 11px; color: #64748b;">${areaNames.length} 个小区</span>
                                <span style="font-size: 11px; color: #64748b;">${Object.values(region.areas).reduce((sum, stores) => sum + stores.length, 0)} 家专营店</span>
                                <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #059669;">H/A/B ${regionAllHab}%</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
        `;

        // 遍历所有小区的门店
        areaNames.forEach((areaName) => {
            region.areas[areaName].forEach((store) => {
                const habTotal = store.h + store.a + store.b;
                const habPercent = store.total > 0 ? ((habTotal / store.total) * 100).toFixed(1) : '0.0';
                const hPercent = store.total > 0 ? (store.h / store.total * 100).toFixed(1) : 0;
                const aPercent = store.total > 0 ? (store.a / store.total * 100).toFixed(1) : 0;
                const bPercent = store.total > 0 ? (store.b / store.total * 100).toFixed(1) : 0;
                const cPercent = store.total > 0 ? (store.c / store.total * 100).toFixed(1) : 0;
                const fPercent = store.total > 0 ? (store.f / store.total * 100).toFixed(1) : 0;

                html += `
                                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 14px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <div>
                                            <div style="font-weight: 500; color: #111827; font-size: 12px;">${store.name}</div>
                                            <div style="font-size: 10px; color: #9ca3af;">${areaName}</div>
                                        </div>
                                        <div style="font-weight: 600; color: #059669; font-size: 13px;">${habPercent}%</div>
                                    </div>
                                    <div style="height: 5px; background: #f3f4f6; border-radius: 3px; overflow: hidden; display: flex; margin-bottom: 6px;">
                                        <div style="height: 100%; background: #00337c; width: ${hPercent}%;"></div>
                                        <div style="height: 100%; background: #0081ff; width: ${aPercent}%;"></div>
                                        <div style="height: 100%; background: #6fb8ff; width: ${bPercent}%;"></div>
                                        <div style="height: 100%; background: #22c55e; width: ${cPercent}%;"></div>
                                        <div style="height: 100%; background: #f97316; width: ${fPercent}%;"></div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 10px; font-size: 10px;">
                                        <span style="color: #00337c;">H:<span style="font-weight: 600;">${store.h}</span></span>
                                        <span style="color: #0081ff;">A:<span style="font-weight: 600;">${store.a}</span></span>
                                        <span style="color: #6fb8ff;">B:<span style="font-weight: 600;">${store.b}</span></span>
                                        <span style="color: #22c55e;">C:<span style="font-weight: 600;">${store.c}</span></span>
                                        <span style="color: #f97316;">F:<span style="font-weight: 600;">${store.f}</span></span>
                                        <span style="color: #a855f7;">L:<span style="font-weight: 600;">${store.l}</span></span>
                                        <span style="color: #64748b;">E:<span style="font-weight: 600;">${store.e}</span></span>
                                        <span style="color: #ef4444;">无效:<span style="font-weight: 600;">${store.invalid}</span></span>
                                        <span style="color: #6b7280; margin-left: auto;">合计:<span style="font-weight: 600;">${store.total}</span></span>
                                    </div>
                                </div>
                `;
            });
        });

        html += `
                            </div>
                        </div>
        `;

        // 生成每个小区的门店列表
        areaNames.forEach((areaName, gi) => {
            const areaStores = region.areas[areaName];
            const areaTotal = areaStores.reduce((sum, s) => {
                sum.h += s.h; sum.a += s.a; sum.b += s.b; sum.c += s.c;
                sum.f += s.f; sum.l += s.l; sum.e += s.e; sum.invalid += s.invalid; sum.total += s.total;
                return sum;
            }, { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 });
            const areaHab = areaTotal.total > 0 ? ((areaTotal.h + areaTotal.a + areaTotal.b) / areaTotal.total * 100).toFixed(1) : '0.0';

            html += `
                        <div class="area-panel" data-area="${areaName}">
                            <!-- 小区汇总 -->
                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f1f5f9; border-radius: 4px; margin-bottom: 10px;">
                                <span style="font-size: 12px; font-weight: 600; color: #475569;">${areaName}</span>
                                <span style="font-size: 11px; color: #64748b;">${areaStores.length} 家专营店</span>
                                <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #059669;">H/A/B ${areaHab}%</span>
                            </div>
                            <!-- 门店列表 -->
                            <div style="display: flex; flex-direction: column; gap: 6px;">
            `;
            
            areaStores.forEach((store) => {
                const habTotal = store.h + store.a + store.b;
                const habPercent = store.total > 0 ? ((habTotal / store.total) * 100).toFixed(1) : '0.0';
                const hPercent = store.total > 0 ? (store.h / store.total * 100).toFixed(1) : 0;
                const aPercent = store.total > 0 ? (store.a / store.total * 100).toFixed(1) : 0;
                const bPercent = store.total > 0 ? (store.b / store.total * 100).toFixed(1) : 0;
                const cPercent = store.total > 0 ? (store.c / store.total * 100).toFixed(1) : 0;
                const fPercent = store.total > 0 ? (store.f / store.total * 100).toFixed(1) : 0;
                
                html += `
                                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 14px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <div style="font-weight: 500; color: #111827; font-size: 12px;">${store.name}</div>
                                        <div style="font-weight: 600; color: #059669; font-size: 13px;">${habPercent}%</div>
                                    </div>
                                    <div style="height: 5px; background: #f3f4f6; border-radius: 3px; overflow: hidden; display: flex; margin-bottom: 6px;">
                                        <div style="height: 100%; background: #00337c; width: ${hPercent}%;" title="H级"></div>
                                        <div style="height: 100%; background: #0081ff; width: ${aPercent}%;" title="A级"></div>
                                        <div style="height: 100%; background: #6fb8ff; width: ${bPercent}%;" title="B级"></div>
                                        <div style="height: 100%; background: #22c55e; width: ${cPercent}%;" title="C级"></div>
                                        <div style="height: 100%; background: #f97316; width: ${fPercent}%;" title="F级"></div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 10px; font-size: 10px;">
                                        <span style="color: #00337c;">H:<span style="font-weight: 600;">${store.h}</span></span>
                                        <span style="color: #0081ff;">A:<span style="font-weight: 600;">${store.a}</span></span>
                                        <span style="color: #6fb8ff;">B:<span style="font-weight: 600;">${store.b}</span></span>
                                        <span style="color: #22c55e;">C:<span style="font-weight: 600;">${store.c}</span></span>
                                        <span style="color: #f97316;">F:<span style="font-weight: 600;">${store.f}</span></span>
                                        <span style="color: #a855f7;">L:<span style="font-weight: 600;">${store.l}</span></span>
                                        <span style="color: #64748b;">E:<span style="font-weight: 600;">${store.e}</span></span>
                                        <span style="color: #ef4444;">无效:<span style="font-weight: 600;">${store.invalid}</span></span>
                                        <span style="color: #6b7280; margin-left: auto;">合计:<span style="font-weight: 600;">${store.total}</span></span>
                                    </div>
                                </div>
                `;
            });
            
            html += `
                            </div>
                        </div>
            `;
        });
        
        html += `
                    </div>
                </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    // 绑定小区 Tab 切换事件
    initRegionTabSwitch();
    
    // 显示弹窗
    modal.classList.add('active');
}

/**
 * 初始化大区 Tab 切换
 */
function initRegionTabSwitch() {
    // 一级大区 Tab 切换
    const regionTabBtns = document.querySelectorAll('.region-tab-btn');
    const regionPanels = document.querySelectorAll('.region-panel');
    
    regionTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetRegion = btn.dataset.region;
            
            // 切换大区 Tab 按钮状态
            regionTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 切换大区内容面板
            regionPanels.forEach(panel => {
                if (panel.dataset.region === targetRegion) {
                    panel.classList.add('active');
                    // 激活该大区内的第一个小区 Tab
                    const areaBtns = panel.querySelectorAll('.area-tab-btn');
                    const areaPanels = panel.querySelectorAll('.area-panel');
                    if (areaBtns.length > 0) {
                        areaBtns.forEach(b => b.classList.remove('active'));
                        areaPanels.forEach(p => p.classList.remove('active'));
                        areaBtns[0].classList.add('active');
                        areaPanels[0].classList.add('active');
                    }
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });
    
    // 二级小区 Tab 切换
    const areaTabBtns = document.querySelectorAll('.area-tab-btn');
    areaTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetArea = btn.dataset.area;
            const parentRegion = btn.dataset.parent;
            
            // 找到对应的父级大区面板
            const parentPanel = document.querySelector(`.region-panel[data-region="${parentRegion}"]`);
            if (!parentPanel) return;
            
            // 切换小区 Tab 按钮状态
            const panelAreaBtns = parentPanel.querySelectorAll('.area-tab-btn');
            const panelAreaPanels = parentPanel.querySelectorAll('.area-panel');
            
            panelAreaBtns.forEach(b => b.classList.remove('active'));
            panelAreaPanels.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPanel = parentPanel.querySelector(`.area-panel[data-area="${targetArea}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

/**
 * 关闭大区渠道质量详情弹窗
 */
function closeRegionChannelModal() {
    const modal = document.getElementById('regionChannelModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ============================================
// 大项目线索质量下钻功能
// ============================================

/**
 * 显示大项目下钻抽屉
 * @param {string} projectCode - 项目代码
 */
function showProjectDrillModal(projectCode) {
    const modal = document.getElementById('projectDrillModal');
    const title = document.getElementById('projectDrillModalTitle');
    const content = document.getElementById('projectDrillModalContent');

    if (!modal || !title || !content) return;

    const project = projectDrillData[projectCode];
    if (!project) return;

    title.innerText = project.projectName;

    // 计算全局总计
    const allTotal = { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
    const regionNames = Object.keys(project.channels);
    regionNames.forEach(region => {
        Object.values(project.channels[region]).forEach(stores => {
            stores.forEach(store => {
                allTotal.h += store.h; allTotal.a += store.a; allTotal.b += store.b; allTotal.c += store.c;
                allTotal.f += store.f; allTotal.l += store.l; allTotal.e += store.e; allTotal.invalid += store.invalid; allTotal.total += store.total;
            });
        });
    });
    const allHab = allTotal.total > 0 ? ((allTotal.h + allTotal.a + allTotal.b) / allTotal.total * 100).toFixed(1) : '0.0';
    const allStoreCount = regionNames.reduce((sum, r) => {
        return sum + Object.values(project.channels[r]).reduce((s, stores) => s + stores.length, 0);
    }, 0);

    let html = `
        <div style="padding: 16px 20px;">
            <!-- 汇总信息栏 -->
            <div style="display: flex; align-items: center; gap: 20px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #6b7280;">专营店数量</div>
                    <div style="font-size: 18px; font-weight: 600; color: #111827;">${allStoreCount} 家</div>
                </div>
                <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                <div style="display: flex; gap: 16px;">
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">H级</div><div style="font-size: 14px; font-weight: 600; color: #00337c;">${allTotal.h}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">A级</div><div style="font-size: 14px; font-weight: 600; color: #0081ff;">${allTotal.a}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">B级</div><div style="font-size: 14px; font-weight: 600; color: #6fb8ff;">${allTotal.b}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">C级</div><div style="font-size: 14px; font-weight: 600; color: #22c55e;">${allTotal.c}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">F级</div><div style="font-size: 14px; font-weight: 600; color: #f97316;">${allTotal.f}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">L级</div><div style="font-size: 14px; font-weight: 600; color: #a855f7;">${allTotal.l}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">E级</div><div style="font-size: 14px; font-weight: 600; color: #64748b;">${allTotal.e}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">无效</div><div style="font-size: 14px; font-weight: 600; color: #ef4444;">${allTotal.invalid}</div></div>
                </div>
                <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                <div style="text-align: center;"><div style="font-size: 11px; color: #6b7280;">合计线索</div><div style="font-size: 18px; font-weight: 600; color: #111827;">${allTotal.total}</div></div>
                <div style="text-align: center;"><div style="font-size: 11px; color: #6b7280;">H/A/B占比</div><div style="font-size: 18px; font-weight: 600; color: #059669;">${allHab}%</div></div>
            </div>

            <!-- 一级大区 Tab -->
            <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <button class="region-tab-btn active" data-region="all">
                    <span>全部</span>
                    <span class="region-tab-count">${allHab}%</span>
                </button>
    `;

    regionNames.forEach(region => {
        const regionAreas = project.channels[region];
        const regionTotal = { h: 0, a: 0, b: 0, total: 0 };
        Object.values(regionAreas).forEach(stores => {
            stores.forEach(s => { regionTotal.h += s.h; regionTotal.a += s.a; regionTotal.b += s.b; regionTotal.total += s.total; });
        });
        const regionHab = regionTotal.total > 0 ? ((regionTotal.h + regionTotal.a + regionTotal.b) / regionTotal.total * 100).toFixed(1) : '0.0';
        html += `
                <button class="region-tab-btn" data-region="${region}">
                    <span>${region}</span>
                    <span class="region-tab-count">${regionHab}%</span>
                </button>
        `;
    });

    html += `
            </div>

            <div class="region-tab-content">
                <!-- 全部面板 -->
                <div class="region-panel active" data-region="all">
                    <div style="display: flex; align-items: center; gap: 16px; padding: 10px 14px; background: #fef3c7; border-radius: 6px; margin-bottom: 12px;">
                        <span style="font-size: 12px; font-weight: 600; color: #92400e;">全部大区</span>
                        <span style="font-size: 11px; color: #64748b;">${regionNames.length} 个大区</span>
                        <span style="margin-left: auto; font-size: 11px; color: #64748b;">${allStoreCount} 家专营店</span>
                        <span style="font-size: 13px; font-weight: 600; color: #059669;">H/A/B ${allHab}%</span>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                        <button class="area-tab-btn active" data-area="all" data-parent="all">
                            <span>全部</span>
                            <span class="area-tab-count">${allStoreCount}家</span>
                        </button>
                    </div>
                    <div class="area-tab-content">
                        <div class="area-panel active" data-area="all">
                            <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    // 全部门店
    regionNames.forEach(region => {
        Object.entries(project.channels[region]).forEach(([areaName, stores]) => {
            stores.forEach(store => {
                html += generateStoreCard(store, areaName);
            });
        });
    });

    html += `
                            </div>
                        </div>
                    </div>
                </div>
    `;

    // 每个大区面板
    regionNames.forEach((region, idx) => {
        const regionAreas = project.channels[region];
        const areaNames = Object.keys(regionAreas);
        const regionTotal = { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
        Object.values(regionAreas).forEach(stores => {
            stores.forEach(s => {
                regionTotal.h += s.h; regionTotal.a += s.a; regionTotal.b += s.b; regionTotal.c += s.c;
                regionTotal.f += s.f; regionTotal.l += s.l; regionTotal.e += s.e; regionTotal.invalid += s.invalid; regionTotal.total += s.total;
            });
        });
        const regionHab = regionTotal.total > 0 ? ((regionTotal.h + regionTotal.a + regionTotal.b) / regionTotal.total * 100).toFixed(1) : '0.0';
        const regionStoreCount = Object.values(regionAreas).reduce((s, st) => s + st.length, 0);

        html += `
                <div class="region-panel" data-region="${region}">
                    <div style="display: flex; align-items: center; gap: 16px; padding: 10px 14px; background: #dbeafe; border-radius: 6px; margin-bottom: 12px;">
                        <span style="font-size: 12px; font-weight: 600; color: #0369a1;">${region}</span>
                        <span style="font-size: 11px; color: #64748b;">${areaNames.length} 个小区</span>
                        <span style="margin-left: auto; font-size: 11px; color: #64748b;">${regionStoreCount} 家专营店</span>
                        <span style="font-size: 13px; font-weight: 600; color: #059669;">H/A/B ${regionHab}%</span>
                    </div>

                    <!-- 二级小区 Tab -->
                    <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                        <button class="area-tab-btn active" data-area="all" data-parent="${region}">
                            <span>全部</span>
                            <span class="area-tab-count">${regionStoreCount}家</span>
                        </button>
        `;

        areaNames.forEach(areaName => {
            const areaStores = regionAreas[areaName];
            const areaTotal = areaStores.reduce((s, st) => { s.h += st.h; s.a += st.a; s.b += st.b; s.total += st.total; return s; }, { h: 0, a: 0, b: 0, total: 0 });
            const areaHab = areaTotal.total > 0 ? ((areaTotal.h + areaTotal.a + areaTotal.b) / areaTotal.total * 100).toFixed(1) : '0.0';
            html += `
                        <button class="area-tab-btn" data-area="${areaName}" data-parent="${region}">
                            <span>${areaName}</span>
                            <span class="area-tab-count">${areaStores.length}家</span>
                        </button>
            `;
        });

        html += `
                    </div>
                    <div class="area-tab-content">
        `;

        // "全部"面板 - 该大区所有门店
        html += `
                        <div class="area-panel active" data-area="all">
                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #fef3c7; border-radius: 4px; margin-bottom: 10px;">
                                <span style="font-size: 12px; font-weight: 600; color: #92400e;">全部小区</span>
                                <span style="font-size: 11px; color: #64748b;">${areaNames.length} 个小区</span>
                                <span style="font-size: 11px; color: #64748b;">${regionStoreCount} 家专营店</span>
                                <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #059669;">H/A/B ${regionHab}%</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
        `;
        areaNames.forEach(areaName => {
            regionAreas[areaName].forEach(store => {
                html += generateStoreCard(store, areaName);
            });
        });
        html += `
                            </div>
                        </div>
        `;

        // 每个小区面板
        areaNames.forEach(areaName => {
            const areaStores = regionAreas[areaName];
            const areaTotal = areaStores.reduce((s, st) => {
                s.h += st.h; s.a += st.a; s.b += st.b; s.c += st.c; s.f += st.f; s.l += st.l; s.e += st.e; s.invalid += st.invalid; s.total += st.total; return s;
            }, { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 });
            const areaHab = areaTotal.total > 0 ? ((areaTotal.h + areaTotal.a + areaTotal.b) / areaTotal.total * 100).toFixed(1) : '0.0';

            html += `
                        <div class="area-panel" data-area="${areaName}">
                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f1f5f9; border-radius: 4px; margin-bottom: 10px;">
                                <span style="font-size: 12px; font-weight: 600; color: #475569;">${areaName}</span>
                                <span style="font-size: 11px; color: #64748b;">${areaStores.length} 家专营店</span>
                                <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #059669;">H/A/B ${areaHab}%</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 6px;">
            `;
            areaStores.forEach(store => {
                html += generateStoreCard(store);
            });
            html += `
                            </div>
                        </div>
            `;
        });

        html += `
                    </div>
                </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    content.innerHTML = html;
    initProjectTabSwitch();
    modal.classList.add('active');
}

/**
 * 生成门店卡片 HTML
 */
function generateStoreCard(store, areaLabel) {
    const hab = store.h + store.a + store.b;
    const habPct = store.total > 0 ? ((hab / store.total) * 100).toFixed(1) : '0.0';
    const hP = store.total > 0 ? (store.h / store.total * 100).toFixed(1) : 0;
    const aP = store.total > 0 ? (store.a / store.total * 100).toFixed(1) : 0;
    const bP = store.total > 0 ? (store.b / store.total * 100).toFixed(1) : 0;
    const cP = store.total > 0 ? (store.c / store.total * 100).toFixed(1) : 0;
    const fP = store.total > 0 ? (store.f / store.total * 100).toFixed(1) : 0;
    const subLabel = areaLabel ? `<div style="font-size: 10px; color: #9ca3af;">${areaLabel}</div>` : '';

    return `
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <div>
                    <div style="font-weight: 500; color: #111827; font-size: 12px;">${store.name}</div>
                    ${subLabel}
                </div>
                <div style="font-weight: 600; color: #059669; font-size: 13px;">${habPct}%</div>
            </div>
            <div style="height: 5px; background: #f3f4f6; border-radius: 3px; overflow: hidden; display: flex; margin-bottom: 6px;">
                <div style="height: 100%; background: #00337c; width: ${hP}%;"></div>
                <div style="height: 100%; background: #0081ff; width: ${aP}%;"></div>
                <div style="height: 100%; background: #6fb8ff; width: ${bP}%;"></div>
                <div style="height: 100%; background: #22c55e; width: ${cP}%;"></div>
                <div style="height: 100%; background: #f97316; width: ${fP}%;"></div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; font-size: 10px;">
                <span style="color: #00337c;">H:<span style="font-weight: 600;">${store.h}</span></span>
                <span style="color: #0081ff;">A:<span style="font-weight: 600;">${store.a}</span></span>
                <span style="color: #6fb8ff;">B:<span style="font-weight: 600;">${store.b}</span></span>
                <span style="color: #22c55e;">C:<span style="font-weight: 600;">${store.c}</span></span>
                <span style="color: #f97316;">F:<span style="font-weight: 600;">${store.f}</span></span>
                <span style="color: #a855f7;">L:<span style="font-weight: 600;">${store.l}</span></span>
                <span style="color: #64748b;">E:<span style="font-weight: 600;">${store.e}</span></span>
                <span style="color: #ef4444;">无效:<span style="font-weight: 600;">${store.invalid}</span></span>
                <span style="color: #6b7280; margin-left: auto;">合计:<span style="font-weight: 600;">${store.total}</span></span>
            </div>
        </div>
    `;
}

/**
 * 初始化大项目 Tab 切换（支持二级小区 Tab）
 */
function initProjectTabSwitch() {
    // 一级大区 Tab
    const regionTabBtns = document.querySelectorAll('#projectDrillModalContent .region-tab-btn');
    const regionPanels = document.querySelectorAll('#projectDrillModalContent .region-panel');

    regionTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetRegion = btn.dataset.region;
            regionTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            regionPanels.forEach(panel => {
                if (panel.dataset.region === targetRegion) {
                    panel.classList.add('active');
                    const areaBtns = panel.querySelectorAll('.area-tab-btn');
                    const areaPanels = panel.querySelectorAll('.area-panel');
                    if (areaBtns.length > 0) {
                        areaBtns.forEach(b => b.classList.remove('active'));
                        areaPanels.forEach(p => p.classList.remove('active'));
                        areaBtns[0].classList.add('active');
                        areaPanels[0].classList.add('active');
                    }
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // 二级小区 Tab
    const areaTabBtns = document.querySelectorAll('#projectDrillModalContent .area-tab-btn');
    areaTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetArea = btn.dataset.area;
            const parentRegion = btn.dataset.parent;
            const parentPanel = document.querySelector(`#projectDrillModalContent .region-panel[data-region="${parentRegion}"]`);
            if (!parentPanel) return;

            const panelAreaBtns = parentPanel.querySelectorAll('.area-tab-btn');
            const panelAreaPanels = parentPanel.querySelectorAll('.area-panel');
            panelAreaBtns.forEach(b => b.classList.remove('active'));
            panelAreaPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetPanel = parentPanel.querySelector(`.area-panel[data-area="${targetArea}"]`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}

/**
 * 关闭大项目下钻抽屉
 */
function closeProjectDrillModal() {
    const modal = document.getElementById('projectDrillModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ============================================
// 排期线索质量下钻功能
// ============================================

/**
 * 显示排期下钻抽屉
 * @param {string} scheduleCode - 排期代码
 */
function showScheduleDrillModal(scheduleCode) {
    const modal = document.getElementById('scheduleDrillModal');
    const title = document.getElementById('scheduleDrillModalTitle');
    const content = document.getElementById('scheduleDrillModalContent');

    if (!modal || !title || !content) return;

    const schedule = scheduleDrillData[scheduleCode];
    if (!schedule) return;

    title.innerText = schedule.scheduleName;

    // 复用大项目下钻的渲染逻辑（结构一致：大区→小区→门店）
    let html = renderDrillContent(schedule.channels);
    content.innerHTML = html;
    initDrillTabSwitch('#scheduleDrillModalContent');
    modal.classList.add('active');
}

/**
 * 通用下钻内容渲染（大区→小区→门店）
 */
function renderDrillContent(channels) {
    const regionNames = Object.keys(channels);
    const allTotal = { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
    const allStoreCount = regionNames.reduce((sum, r) => {
        return sum + Object.values(channels[r]).reduce((s, stores) => s + stores.length, 0);
    }, 0);
    regionNames.forEach(region => {
        Object.values(channels[region]).forEach(stores => {
            stores.forEach(store => {
                allTotal.h += store.h; allTotal.a += store.a; allTotal.b += store.b; allTotal.c += store.c;
                allTotal.f += store.f; allTotal.l += store.l; allTotal.e += store.e; allTotal.invalid += store.invalid; allTotal.total += store.total;
            });
        });
    });
    const allHab = allTotal.total > 0 ? ((allTotal.h + allTotal.a + allTotal.b) / allTotal.total * 100).toFixed(1) : '0.0';

    let html = `
        <div style="padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 20px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <div style="text-align: center;"><div style="font-size: 11px; color: #6b7280;">专营店数量</div><div style="font-size: 18px; font-weight: 600; color: #111827;">${allStoreCount} 家</div></div>
                <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                <div style="display: flex; gap: 16px;">
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">H级</div><div style="font-size: 14px; font-weight: 600; color: #00337c;">${allTotal.h}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">A级</div><div style="font-size: 14px; font-weight: 600; color: #0081ff;">${allTotal.a}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">B级</div><div style="font-size: 14px; font-weight: 600; color: #6fb8ff;">${allTotal.b}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">C级</div><div style="font-size: 14px; font-weight: 600; color: #22c55e;">${allTotal.c}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">F级</div><div style="font-size: 14px; font-weight: 600; color: #f97316;">${allTotal.f}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">L级</div><div style="font-size: 14px; font-weight: 600; color: #a855f7;">${allTotal.l}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">E级</div><div style="font-size: 14px; font-weight: 600; color: #64748b;">${allTotal.e}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">无效</div><div style="font-size: 14px; font-weight: 600; color: #ef4444;">${allTotal.invalid}</div></div>
                </div>
                <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                <div style="text-align: center;"><div style="font-size: 11px; color: #6b7280;">合计线索</div><div style="font-size: 18px; font-weight: 600; color: #111827;">${allTotal.total}</div></div>
                <div style="text-align: center;"><div style="font-size: 11px; color: #6b7280;">H/A/B占比</div><div style="font-size: 18px; font-weight: 600; color: #059669;">${allHab}%</div></div>
            </div>

            <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <button class="region-tab-btn active" data-region="all"><span>全部</span><span class="region-tab-count">${allHab}%</span></button>
    `;

    regionNames.forEach(region => {
        const regionAreas = channels[region];
        const regionTotal = { h: 0, a: 0, b: 0, total: 0 };
        Object.values(regionAreas).forEach(stores => { stores.forEach(s => { regionTotal.h += s.h; regionTotal.a += s.a; regionTotal.b += s.b; regionTotal.total += s.total; }); });
        const regionHab = regionTotal.total > 0 ? ((regionTotal.h + regionTotal.a + regionTotal.b) / regionTotal.total * 100).toFixed(1) : '0.0';
        html += `<button class="region-tab-btn" data-region="${region}"><span>${region}</span><span class="region-tab-count">${regionHab}%</span></button>`;
    });

    html += `</div><div class="region-tab-content">`;

    // 全部面板
    html += `
        <div class="region-panel active" data-region="all">
            <div style="display: flex; align-items: center; gap: 16px; padding: 10px 14px; background: #fef3c7; border-radius: 6px; margin-bottom: 12px;">
                <span style="font-size: 12px; font-weight: 600; color: #92400e;">全部大区</span>
                <span style="font-size: 11px; color: #64748b;">${regionNames.length} 个大区</span>
                <span style="margin-left: auto; font-size: 11px; color: #64748b;">${allStoreCount} 家专营店</span>
                <span style="font-size: 13px; font-weight: 600; color: #059669;">H/A/B ${allHab}%</span>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                <button class="area-tab-btn active" data-area="all" data-parent="all"><span>全部</span><span class="area-tab-count">${allStoreCount}家</span></button>
            </div>
            <div class="area-tab-content"><div class="area-panel active" data-area="all"><div style="display: flex; flex-direction: column; gap: 8px;">
    `;
    regionNames.forEach(region => {
        Object.entries(channels[region]).forEach(([areaName, stores]) => {
            stores.forEach(store => { html += generateStoreCard(store, areaName); });
        });
    });
    html += `</div></div></div></div>`;

    // 每个大区面板
    regionNames.forEach((region) => {
        const regionAreas = channels[region];
        const areaNames = Object.keys(regionAreas);
        const regionTotal = { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
        Object.values(regionAreas).forEach(stores => { stores.forEach(s => { regionTotal.h += s.h; regionTotal.a += s.a; regionTotal.b += s.b; regionTotal.c += s.c; regionTotal.f += s.f; regionTotal.l += s.l; regionTotal.e += s.e; regionTotal.invalid += s.invalid; regionTotal.total += s.total; }); });
        const regionHab = regionTotal.total > 0 ? ((regionTotal.h + regionTotal.a + regionTotal.b) / regionTotal.total * 100).toFixed(1) : '0.0';
        const regionStoreCount = Object.values(regionAreas).reduce((s, st) => s + st.length, 0);

        html += `
        <div class="region-panel" data-region="${region}">
            <div style="display: flex; align-items: center; gap: 16px; padding: 10px 14px; background: #dbeafe; border-radius: 6px; margin-bottom: 12px;">
                <span style="font-size: 12px; font-weight: 600; color: #0369a1;">${region}</span>
                <span style="font-size: 11px; color: #64748b;">${areaNames.length} 个小区</span>
                <span style="margin-left: auto; font-size: 11px; color: #64748b;">${regionStoreCount} 家专营店</span>
                <span style="font-size: 13px; font-weight: 600; color: #059669;">H/A/B ${regionHab}%</span>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                <button class="area-tab-btn active" data-area="all" data-parent="${region}"><span>全部</span><span class="area-tab-count">${regionStoreCount}家</span></button>
        `;
        areaNames.forEach(areaName => {
            const areaHab = (() => {
                const t = regionAreas[areaName].reduce((s, st) => { s.h += st.h; s.a += st.a; s.b += st.b; s.total += st.total; return s; }, { h: 0, a: 0, b: 0, total: 0 });
                return t.total > 0 ? ((t.h + t.a + t.b) / t.total * 100).toFixed(1) : '0.0';
            })();
            html += `<button class="area-tab-btn" data-area="${areaName}" data-parent="${region}"><span>${areaName}</span><span class="area-tab-count">${regionAreas[areaName].length}家</span></button>`;
        });
        html += `</div><div class="area-tab-content">`;

        // 全部面板
        html += `<div class="area-panel active" data-area="all">
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #fef3c7; border-radius: 4px; margin-bottom: 10px;">
                <span style="font-size: 12px; font-weight: 600; color: #92400e;">全部小区</span>
                <span style="font-size: 11px; color: #64748b;">${areaNames.length} 个小区</span>
                <span style="font-size: 11px; color: #64748b;">${regionStoreCount} 家专营店</span>
                <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #059669;">H/A/B ${regionHab}%</span>
            </div><div style="display: flex; flex-direction: column; gap: 6px;">`;
        areaNames.forEach(areaName => { regionAreas[areaName].forEach(store => { html += generateStoreCard(store, areaName); }); });
        html += `</div></div>`;

        // 每个小区面板
        areaNames.forEach(areaName => {
            const areaStores = regionAreas[areaName];
            const areaTotal = areaStores.reduce((s, st) => { s.h += st.h; s.a += st.a; s.b += st.b; s.c += st.c; s.f += st.f; s.l += st.l; s.e += st.e; s.invalid += st.invalid; s.total += st.total; return s; }, { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 });
            const areaHab = areaTotal.total > 0 ? ((areaTotal.h + areaTotal.a + areaTotal.b) / areaTotal.total * 100).toFixed(1) : '0.0';
            html += `
            <div class="area-panel" data-area="${areaName}">
                <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f1f5f9; border-radius: 4px; margin-bottom: 10px;">
                    <span style="font-size: 12px; font-weight: 600; color: #475569;">${areaName}</span>
                    <span style="font-size: 11px; color: #64748b;">${areaStores.length} 家专营店</span>
                    <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #059669;">H/A/B ${areaHab}%</span>
                </div><div style="display: flex; flex-direction: column; gap: 6px;">`;
            areaStores.forEach(store => { html += generateStoreCard(store); });
            html += `</div></div>`;
        });

        html += `</div></div>`;
    });

    html += `</div></div>`;
    return html;
}

/**
 * 通用 Tab 切换初始化
 */
function initDrillTabSwitch(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const regionTabBtns = container.querySelectorAll('.region-tab-btn');
    const regionPanels = container.querySelectorAll('.region-panel');

    regionTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetRegion = btn.dataset.region;
            regionTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            regionPanels.forEach(panel => {
                if (panel.dataset.region === targetRegion) {
                    panel.classList.add('active');
                    const areaBtns = panel.querySelectorAll('.area-tab-btn');
                    const areaPanels = panel.querySelectorAll('.area-panel');
                    if (areaBtns.length > 0) {
                        areaBtns.forEach(b => b.classList.remove('active'));
                        areaPanels.forEach(p => p.classList.remove('active'));
                        areaBtns[0].classList.add('active');
                        areaPanels[0].classList.add('active');
                    }
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    container.querySelectorAll('.area-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetArea = btn.dataset.area;
            const parentRegion = btn.dataset.parent;
            const parentPanel = container.querySelector(`.region-panel[data-region="${parentRegion}"]`);
            if (!parentPanel) return;
            const panelAreaBtns = parentPanel.querySelectorAll('.area-tab-btn');
            const panelAreaPanels = parentPanel.querySelectorAll('.area-panel');
            panelAreaBtns.forEach(b => b.classList.remove('active'));
            panelAreaPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetPanel = parentPanel.querySelector(`.area-panel[data-area="${targetArea}"]`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}

/**
 * 关闭排期下钻抽屉
 */
function closeScheduleDrillModal() {
    const modal = document.getElementById('scheduleDrillModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// 点击弹窗外部关闭大区弹窗
document.addEventListener('click', (e) => {
    const modal = document.getElementById('regionChannelModal');
    if (modal && e.target === modal) {
        closeRegionChannelModal();
    }
});

// ============================================
// 渠道质量柱状图点击事件（仅限渠道质量图表）
// ============================================
document.addEventListener('click', (e) => {
    // 只响应渠道质量图表内的点击
    const chartContainer = e.target.closest('#channelVChart');
    if (!chartContainer) return;
    
    // 查找被点击的柱状图元素
    const barItem = e.target.closest('.ce-v-bar-item');
    if (!barItem) return;
    
    // 获取 X 轴标签
    const labelEl = barItem.querySelector('.ce-v-x-label');
    if (!labelEl) return;
    
    const label = labelEl.innerText.trim();
    
    // 检查是否是大区标签 (R1-R11)
    if (/^R\d+$/.test(label)) {
        showRegionChannelModal(label);
    }
});
