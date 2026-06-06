// 初始化各分页内的时间范围快捷选择 + 自定义日期
function initDateRange() {
    document.querySelectorAll('.filter-section .date-range-group').forEach(group => {
        const startInput = group.querySelector('.date-custom-start');
        const endInput = group.querySelector('.date-custom-end');
        const shortcuts = group.querySelector('.date-shortcuts');
        const customInputs = group.querySelector('.date-custom-inputs');
        if (!startInput || !endInput || !shortcuts || !customInputs) return;

        const today = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(today.getFullYear() - 2);

        const todayStr = formatDate(today);
        const twoYearsAgoStr = formatDate(twoYearsAgo);

        startInput.min = twoYearsAgoStr;
        startInput.max = todayStr;
        endInput.min = twoYearsAgoStr;
        endInput.max = todayStr;

        const defaultRange = group.dataset.defaultRange || group.querySelector('.shortcut-btn.active')?.dataset.range || '7';
        let currentDays = parseInt(defaultRange, 10) || 7;

        function setDateValues(days) {
            const start = new Date();
            start.setDate(today.getDate() - days);
            startInput.value = formatDate(start);
            endInput.value = todayStr;
        }

        setDateValues(currentDays);

        shortcuts.addEventListener('click', (e) => {
            const btn = e.target.closest('.shortcut-btn');
            if (!btn) return;

            shortcuts.querySelectorAll('.shortcut-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const range = btn.dataset.range;
            if (range === 'custom') {
                customInputs.style.display = 'flex';
                setDateValues(currentDays);
            } else {
                customInputs.style.display = 'none';
                currentDays = parseInt(range, 10);
                setDateValues(currentDays);
            }
        });

        const validateCustomRange = (changedInput) => {
            // 空值保护：任一输入为空时不校验
            if (!startInput.value || !endInput.value) return;

            const start = new Date(startInput.value);
            const end = new Date(endInput.value);

            // Invalid Date 保护
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

            if (start > end) {
                if (changedInput === 'start') endInput.value = startInput.value;
                else startInput.value = endInput.value;
                return;
            }

            const maxRange = 90 * 24 * 60 * 60 * 1000;
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
    });
}

// 原因类型大类联动
function initReasonTypeFilter() {
    document.querySelectorAll('.reason-category-select').forEach(catSelect => {
        const filterItem = catSelect.closest('.filter-item');
        const reasonSelect = filterItem.parentElement.querySelector('.reason-type-select');
        if (!reasonSelect) return;

        catSelect.addEventListener('change', () => {
            const category = catSelect.value;
            const options = reasonSelect.querySelectorAll('option');
            let firstVisible = null;

            options.forEach(opt => {
                if (category === 'all' || opt.value === 'all' || opt.dataset.category === category) {
                    opt.style.display = '';
                    if (!firstVisible && opt.value !== 'all') firstVisible = opt;
                } else {
                    opt.style.display = 'none';
                }
            });

            reasonSelect.value = 'all';
        });
    });
}

function reorderCultivationDeliveryCharts() {
    const hierarchyRow = document.querySelector('.ce-hierarchy-row');
    const analysisRow = document.querySelector('.ce-mid-row');
    const rankRow = document.querySelector('.ce-rank-row');
    if (!hierarchyRow || !analysisRow || hierarchyRow.parentNode !== analysisRow.parentNode) return;

    analysisRow.parentNode.insertBefore(hierarchyRow, analysisRow);
    if (rankRow && rankRow.parentNode === analysisRow.parentNode) {
        analysisRow.parentNode.insertBefore(rankRow, analysisRow.nextSibling);
    }
}

function enhanceHierarchyHabLabels() {
    document.querySelectorAll('.ce-hierarchy-row .card-body > div:last-child > div').forEach(row => {
        const stack = row.children[1];
        const label = row.children[row.children.length - 1];
        if (!stack || !label || label.dataset.habEnhanced === 'true') return;

        const match = label.textContent.match(/([\d,]+)人\s*·\s*HAB\s*(\d+)%/);
        if (!match) return;

        const total = parseInt(match[1].replace(/,/g, ''), 10);
        const habPercent = match[2];
        const habCount = Array.from(stack.children).slice(0, 3).reduce((sum, segment) => {
            return sum + Math.round(total * (parseFloat(segment.style.width) || 0) / 100);
        }, 0);

        row.style.gridTemplateColumns = '92px minmax(0, 1fr) 126px';
        label.dataset.habEnhanced = 'true';
        label.style.whiteSpace = 'nowrap';
        label.innerHTML = `${total.toLocaleString()}人<br>HAB ${habCount.toLocaleString()}人 · ${habPercent}%`;
    });
}

function alignChannelQualityLeadLevels() {
    const chart = document.getElementById('channelVChart');
    const card = chart?.closest('.content-card');
    const legend = card?.querySelector('.ce-v-legend');
    if (!chart || !legend || !MOCK.leadLevels) return;

    const levelClasses = [
        'h-schedule', 'h-lead', 'h-nontest', 'a', 'b',
        'c-unclear', 'c-unreachable', 'f', 'l', 'e'
    ];
    const distributions = [
        [8, 7, 6, 12, 18, 12, 12, 12, 6, 7],
        [7, 7, 5, 12, 18, 12, 12, 12, 6, 9],
        [7, 6, 5, 12, 18, 12, 12, 12, 6, 10],
        [6, 6, 5, 10, 15, 11, 11, 18, 7, 11],
        [6, 5, 5, 11, 16, 10, 11, 18, 7, 11],
        [5, 5, 5, 10, 15, 10, 9, 25, 7, 9],
        [5, 5, 4, 9, 14, 9, 7, 31, 7, 9],
        [5, 4, 4, 9, 12, 7, 7, 35, 7, 10],
        [4, 4, 3, 8, 10, 8, 8, 37, 7, 11],
        [4, 3, 3, 6, 10, 6, 6, 41, 8, 13],
        [3, 3, 3, 6, 9, 6, 5, 44, 8, 13]
    ];

    legend.innerHTML = MOCK.leadLevels.map((label, index) => `
        <div class="ce-v-legend-item"><span class="ce-v-legend-dot ${levelClasses[index]}"></span><span>${label}</span></div>
    `).join('');

    chart.querySelectorAll('.ce-v-bar-item').forEach((item, index) => {
        const stack = item.querySelector('.ce-v-stack');
        if (!stack) return;
        const distribution = distributions[index] || distributions[distributions.length - 1];
        stack.innerHTML = distribution.map((percent, levelIndex) => `
            <div class="ce-v-seg ${levelClasses[levelIndex]}" style="height: ${percent}%;"></div>
        `).join('');
    });
}

function convertCultivationChartsToHorizontal() {
    ['regionVChart', 'channelVChart'].forEach(chartId => {
        const chart = document.getElementById(chartId);
        if (!chart || chart.classList.contains('ce-v-horizontal')) return;

        chart.classList.add('ce-v-horizontal');
        chart.querySelectorAll('.ce-v-bar-item').forEach(item => {
            const stack = item.querySelector('.ce-v-stack');
            if (!stack) return;

            stack.style.width = stack.style.height;
            stack.style.height = '18px';
            stack.querySelectorAll('.ce-v-seg').forEach(segment => {
                segment.style.width = segment.style.height;
                segment.style.height = '100%';
            });
        });
    });
}

function enhanceOverviewHabLabels() {
    const channelTotals = [2080, 1835, 1591, 1419, 1272, 1125, 1028, 930, 832, 734, 636];

    document.querySelectorAll('#regionVChart .ce-v-bar-item').forEach(item => {
        const stack = item.querySelector('.ce-v-stack');
        if (!stack || item.querySelector('.ce-v-stat-label')) return;

        const counts = Array.from(item.querySelectorAll('.ce-v-tooltip-row')).map(row => {
            const match = row.textContent.match(/([\d,]+)\s*\(/);
            return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
        });
        const total = counts.reduce((sum, count) => sum + count, 0);
        const habCount = counts.slice(0, 3).reduce((sum, count) => sum + count, 0);
        appendOverviewHabLabel(item, total, habCount);
    });

    document.querySelectorAll('#channelVChart .ce-v-bar-item').forEach((item, index) => {
        const stack = item.querySelector('.ce-v-stack');
        const total = channelTotals[index];
        if (!stack || !total || item.querySelector('.ce-v-stat-label')) return;

        const habPercent = Array.from(stack.children).slice(0, 5).reduce((sum, segment) => {
            return sum + (parseFloat(segment.style.width) || 0);
        }, 0);
        const habCount = Math.round(total * habPercent / 100);
        appendOverviewHabLabel(item, total, habCount);
    });
}

function appendOverviewHabLabel(item, total, habCount) {
    if (!total) return;

    const label = document.createElement('span');
    label.className = 'ce-v-stat-label';
    label.innerHTML = `${total.toLocaleString()}人<br>HAB ${habCount.toLocaleString()}人 · ${pctStr(habCount, total)}%`;
    item.appendChild(label);
}

function parseUserCount(text) {
    const match = String(text || '').match(/([\d,]+)\s*人/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
}

// --- 工具函数 ---
function pctNum(part, total) { return total > 0 ? +(part / total * 100).toFixed(1) : 0; }
function pctStr(part, total) { return total > 0 ? (part / total * 100).toFixed(1) : '0.0'; }

function touchHabitDeliveryRate(label) {
    const hash = [...String(label || '')].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return +(2.8 + (hash % 43) / 10).toFixed(1);
}

function enhanceTouchHabitDeliveryMetrics() {
    const section = document.getElementById('touchHabitAnalysis');
    if (!section) return;

    const dealStoreButton = section.querySelector('button[onclick="openFullRanking(\'dealStore\')"]');
    const dealStoreCard = dealStoreButton?.closest('div[style*="border"]');

    section.querySelectorAll('span').forEach(metric => {
        if (metric.dataset.deliveryEnhanced === 'true') return;
        const match = metric.textContent.trim().match(/^([\d,]+)人\s*·\s*([\d.]+)%$/);
        if (!match) return;

        const row = metric.parentElement;
        const label = row?.querySelector('span')?.textContent.trim();
        if (!label || label === metric.textContent.trim()) return;

        const count = parseInt(match[1].replace(/,/g, ''), 10);
        const rate = touchHabitDeliveryRate(label);
        const deliveries = Math.round(count * rate / 100);
        metric.dataset.deliveryEnhanced = 'true';
        metric.classList.add('touch-habit-metric');
        if (dealStoreCard?.contains(metric)) {
            metric.innerHTML = `<span class="touch-habit-delivery">交车量 ${deliveries.toLocaleString()}人 · 交车占比 ${rate}%</span>`;
        } else {
            metric.innerHTML = `用户量 ${match[1]}人 · <span class="touch-habit-delivery">交车量 ${deliveries.toLocaleString()}人 · 交车占比 ${rate}%</span>`;
        }
    });
}

// --- 等级颜色常量（与 MOCK.leadLevels 10 级对齐）---
var LEVEL_COLORS = {
    hSchedule: '#b91c1c', hLead: '#ef4444', hNonTest: '#fb7185',
    a: '#f59e0b', b: '#3b82f6',
    cUnclear: '#14b8a6', cUnreachable: '#67e8f9',
    f: '#8b5cf6', l: '#ec4899', e: '#84cc16'
};

// 与 MOCK.leadLevels 完全对齐
var LEVEL_LABELS = MOCK && MOCK.leadLevels ? [
    { key: 'hSchedule', label: MOCK.leadLevels[0] },
    { key: 'hLead', label: MOCK.leadLevels[1] },
    { key: 'hNonTest', label: MOCK.leadLevels[2] },
    { key: 'a', label: MOCK.leadLevels[3] },
    { key: 'b', label: MOCK.leadLevels[4] },
    { key: 'cUnclear', label: MOCK.leadLevels[5] },
    { key: 'cUnreachable', label: MOCK.leadLevels[6] },
    { key: 'f', label: MOCK.leadLevels[7] },
    { key: 'l', label: MOCK.leadLevels[8] },
    { key: 'e', label: MOCK.leadLevels[9] }
] : [
    { key: 'hSchedule', label: 'H-试驾排程单' },
    { key: 'hLead', label: 'H-试驾线索单' },
    { key: 'hNonTest', label: 'H-非试驾线索单' },
    { key: 'a', label: 'A' },
    { key: 'b', label: 'B' },
    { key: 'cUnclear', label: 'C-意向不明' },
    { key: 'cUnreachable', label: 'C-无法接通' },
    { key: 'f', label: 'F-战败' },
    { key: 'l', label: 'L-休眠' },
    { key: 'e', label: 'E-意向含糊' }
];

const TREND_ICONS = { up: 'fa-caret-up', down: 'fa-caret-down', equal: 'fa-minus' };
const TREND_COLORS = { up: '#ef4444', down: '#10b981', equal: '#6b7280' };

function findCard(title, options = {}) {
    const scope = options.scope ? document.getElementById(options.scope) : document;
    const cards = Array.from(scope.querySelectorAll('.content-card'));
    const card = cards.find(c => c.querySelector('.card-title')?.textContent.trim() === title);
    if (!card) return null;
    return options.returnBody ? card.querySelector('.card-body') : card;
}

function scaleCultivationHorizontalBars(title) {
    const card = findCard(title, { scope: 'cultivation-op' });
    if (!card) return;

    const rows = Array.from(card.querySelectorAll('.card-body div'))
        .filter(row => parseUserCount(row.textContent) > 0);
    const rowData = rows.map(row => {
        const count = parseUserCount(row.textContent);
        const bars = Array.from(row.children || []).filter(child => {
            const style = child.getAttribute('style') || '';
            return style.includes('background: #f3f4f6') && style.includes('display: flex');
        });
        return { row, count, bar: bars[0] };
    }).filter(item => item.bar);

    const max = Math.max(...rowData.map(item => item.count), 0);
    if (!max) return;

    rowData.forEach(({ row, count, bar }) => {
        if (bar.parentElement?.classList.contains('scaled-total-track')) return;
        const ratio = Math.max(0.08, count / max);
        const track = document.createElement('div');
        track.className = 'scaled-total-track';
        track.style.cssText = 'flex: 1; height: ' + (bar.style.height || '14px') + '; background: #f3f4f6; border-radius: 3px; overflow: hidden;';

        const scaledWidth = (ratio * 100).toFixed(1) + '%';
        bar.style.flex = '0 0 auto';
        bar.style.width = scaledWidth;
        bar.style.maxWidth = scaledWidth;
        bar.style.minWidth = '18px';
        bar.style.height = '100%';

        row.insertBefore(track, bar);
        track.appendChild(bar);
    });
}

function scaleCultivationVerticalChannelChart() {
    const card = findCard('渠道线索质量', { scope: 'cultivation-op' });
    if (!card) return;

    const totalsByLabel = {
        '百度': 2876,
        '抖音': 2654,
        '懂车帝': 2432,
        '汽车之家': 2134,
        '易车': 1876,
        '微信': 1654
    };
    const max = Math.max(...Object.values(totalsByLabel));

    Array.from(card.querySelectorAll('.card-body > div:first-child > div')).forEach(item => {
        const label = item.querySelector('span')?.textContent.trim();
        const total = totalsByLabel[label];
        const bar = item.querySelector('div[style*="height: 200px"]');
        if (!total || !bar || bar.dataset.scaledTotal === 'true') return;

        const ratio = Math.max(0.18, total / max);
        bar.dataset.scaledTotal = 'true';
        bar.style.height = Math.round(200 * ratio) + 'px';
        bar.title = `${label}：${total.toLocaleString()}人`;
    });
}

function initCultivationScaledCharts() {
    [
        '城市投放效果（TOP10城市）',
        '大区投放效果',
        '小区投放效果',
        '大项目线索质量排名（TOP10）',
        '媒体线索质量排名（TOP10）'
    ].forEach(scaleCultivationHorizontalBars);

    scaleCultivationVerticalChannelChart();
}

// 通用：更新多选筛选器的显示文本
function updateMultiSelectText(multiSelect) {
    var allCb = multiSelect.querySelectorAll('input[type="checkbox"]:not([value="all"])');
    var checkedCb = multiSelect.querySelectorAll('input[type="checkbox"]:not([value="all"]):checked');
    var selectAll = multiSelect.querySelector('input[type="checkbox"][value="all"]');
    var textSpan = multiSelect.querySelector('.select-header span');
    if (selectAll) selectAll.checked = checkedCb.length === allCb.length;
    if (textSpan) {
        textSpan.innerText = checkedCb.length === allCb.length
            ? '全选 (' + allCb.length + '项)'
            : '已选 ' + checkedCb.length + ' 项';
    }
}

function initFilterMultiSelects() {
    document.querySelectorAll('.custom-multi-select').forEach(function(multiSelect) {
        var header = multiSelect.querySelector('.select-header');
        var dropdown = multiSelect.querySelector('.select-dropdown');
        var selectAll = multiSelect.querySelector('input[type="checkbox"][value="all"]');
        var itemCbs = multiSelect.querySelectorAll('input[type="checkbox"]:not([value="all"])');

        header && header.addEventListener('click', function() {
            document.querySelectorAll('.custom-multi-select .select-dropdown').forEach(function(panel) {
                if (panel !== dropdown) panel.style.display = 'none';
            });
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        selectAll && selectAll.addEventListener('change', function() {
            itemCbs.forEach(function(cb) { cb.checked = selectAll.checked; });
            updateMultiSelectText(multiSelect);
        });

        itemCbs.forEach(function(cb) {
            cb.addEventListener('change', function() { updateMultiSelectText(multiSelect); });
        });
    });

    document.addEventListener('click', function(e) {
        if (e.target.closest('.custom-multi-select')) return;
        document.querySelectorAll('.custom-multi-select .select-dropdown').forEach(function(dropdown) {
            dropdown.style.display = 'none';
        });
    });
}

// 分页内筛选器交互逻辑
function initGlobalFilters() {
    document.querySelectorAll('.filter-section').forEach(filterSection => {
        const queryBtn = filterSection.querySelector('.query-btn');
        const resetBtn = filterSection.querySelector('.reset-btn');

        queryBtn?.addEventListener('click', () => {
            showNotification('正在基于线索创建日期为您聚合统计数据...', 'info');
            setTimeout(() => {
                showNotification('数据更新成功（已基于所选条件重新取值）', 'success');
            }, 800);
        });

        resetBtn?.addEventListener('click', () => {
            showNotification('正在重置筛选条件...', 'info');
            resetGlobalFilters(filterSection);
            setTimeout(() => {
                showNotification('筛选条件已重置', 'success');
            }, 300);
        });
    });
}

function resetDateRange(dateRangeGroup) {
    if (!dateRangeGroup) return;
    const shortcuts = dateRangeGroup.querySelector('.date-shortcuts');
    const customInputs = dateRangeGroup.querySelector('.date-custom-inputs');
    const defaultRange = dateRangeGroup.dataset.defaultRange || '7';
    if (shortcuts) {
        shortcuts.querySelectorAll('.shortcut-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.range === defaultRange);
        });
    }
    if (customInputs) customInputs.style.display = 'none';
    const startInput = dateRangeGroup.querySelector('.date-custom-start');
    const endInput = dateRangeGroup.querySelector('.date-custom-end');
    if (startInput && endInput) {
        const today = new Date();
        const start = new Date();
        start.setDate(today.getDate() - (parseInt(defaultRange, 10) || 7));
        startInput.value = formatDate(start);
        endInput.value = formatDate(today);
    }
}

function resetGlobalFilters(filterSection = document.querySelector('.filter-section')) {
    if (!filterSection) return;

    filterSection.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });

    filterSection.querySelectorAll('input[type="text"], input[type="search"]').forEach(input => {
        input.value = '';
    });

    const selectAllLevels = filterSection.querySelector('.select-all-levels');
    const levelCheckboxes = filterSection.querySelectorAll('.level-cb');
    if (selectAllLevels) selectAllLevels.checked = true;
    levelCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
    });

    const leadLevelText = filterSection.querySelector('.lead-level-text');
    if (leadLevelText) {
        leadLevelText.innerText = `全选 (${levelCheckboxes.length}项)`;
    }

    resetDateRange(filterSection.querySelector('.date-range-group'));
}

function showNotification(message, type = 'info') {
    const oldToast = document.querySelector('.prototype-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `prototype-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 72px;
        right: 24px;
        z-index: 3000;
        padding: 10px 14px;
        border-radius: 8px;
        background: ${type === 'success' ? '#f0fdf4' : '#eff6ff'};
        color: ${type === 'success' ? '#166534' : '#1d4ed8'};
        border: 1px solid ${type === 'success' ? '#bbf7d0' : '#bfdbfe'};
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        font-size: 13px;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}
