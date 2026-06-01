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
            const start = new Date(startInput.value);
            const end = new Date(endInput.value);

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

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
    initReasonTypeFilter();
    initDateRange();
    initFilterMultiSelects();
    initGlobalFilters();    // 分页内筛选器逻辑
    reorderCultivationDeliveryCharts();
    alignChannelQualityLeadLevels();
    convertCultivationChartsToHorizontal();
    initChannelJourneyFilter();
    initMediaJourneyFilter();
    initCultivationScaledCharts();
    initRankInteraction({ tabsId: 'rankMetricTabs', listId: 'projectRankList', dataProp: 'projectCode', dataAttr: 'project', data: projectRankData });
    initRankInteraction({ tabsId: 'scheduleMetricTabs', listId: 'scheduleRankList', dataProp: 'scheduleCode', dataAttr: 'schedule', data: scheduleRankData });
});

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

function alignChannelQualityLeadLevels() {
    const chart = document.getElementById('channelVChart');
    const card = chart?.closest('.content-card');
    const legend = card?.querySelector('.ce-v-legend');
    if (!chart || !legend || !MOCK.leadLevels) return;

    const levelClasses = [
        'h-schedule', 'h-lead', 'h-nontest', 'a', 'b',
        'c-unclear', 'c-unreachable', 'f', 'l', 'e', 'invalid'
    ];
    const distributions = [
        [7, 6, 5, 10, 15, 10, 10, 10, 5, 7, 15],
        [6, 6, 4, 10, 15, 10, 10, 10, 5, 8, 16],
        [6, 5, 4, 10, 15, 10, 10, 10, 5, 8, 17],
        [5, 5, 4, 8, 12, 9, 9, 15, 6, 8, 19],
        [5, 4, 4, 9, 13, 8, 9, 15, 6, 8, 19],
        [4, 4, 4, 8, 12, 8, 7, 20, 6, 8, 19],
        [4, 4, 3, 7, 11, 7, 6, 25, 6, 8, 19],
        [4, 3, 3, 7, 10, 6, 6, 28, 6, 8, 19],
        [3, 3, 2, 6, 8, 6, 6, 30, 6, 10, 20],
        [3, 2, 2, 5, 8, 5, 5, 32, 6, 10, 22],
        [2, 2, 2, 5, 7, 5, 4, 34, 6, 10, 23]
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

function parseUserCount(text) {
    const match = String(text || '').match(/([\d,]+)\s*人/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
}

// --- 工具函数 ---
function pctNum(part, total) { return total > 0 ? +(part / total * 100).toFixed(1) : 0; }
function pctStr(part, total) { return total > 0 ? (part / total * 100).toFixed(1) : '0.0'; }

// --- 等级颜色常量（与 MOCK.leadLevels 11 级对齐）---
var LEVEL_COLORS = {
    hSchedule: '#b91c1c', hLead: '#ef4444', hNonTest: '#fb7185',
    a: '#f59e0b', b: '#3b82f6',
    cUnclear: '#14b8a6', cUnreachable: '#67e8f9',
    f: '#8b5cf6', l: '#ec4899', e: '#84cc16', invalid: '#94a3b8',
    h: '#00337c', c: '#22c55e', hab: '#059669', other: '#9ca3af'
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
    { key: 'e', label: MOCK.leadLevels[9] },
    { key: 'invalid', label: MOCK.leadLevels[10] }
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
    { key: 'e', label: 'E-意向含糊' },
    { key: 'invalid', label: '无效号码' }
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

// 向后兼容别名
function updateFilterLevelText(multiSelect) { updateMultiSelectText(multiSelect); }
function updateFilterPlatformText(multiSelect) { updateMultiSelectText(multiSelect); }

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

function switchTouchMediaTab(tab) {
    document.querySelectorAll('.touch-media-tab').forEach(el => {
        el.classList.toggle('active', el.dataset.touchTab === tab);
    });
    document.getElementById('touchMediaPanel_channel').style.display = tab === 'channel' ? '' : 'none';
    document.getElementById('touchMediaPanel_media').style.display = tab === 'media' ? '' : 'none';
}

function initChannelJourneyFilter() {
    const firstSelect = document.getElementById('firstJourneyChannel');
    const lastMultiSelect = document.getElementById('lastJourneyChannel');
    if (!firstSelect || !lastMultiSelect || !MOCK.touchMedia?.channelJourney) return;

    const channels = MOCK.channels || [];
    firstSelect.innerHTML = channels.map(channel => `<option value="${channel}">${channel}</option>`).join('');
    firstSelect.value = channels.includes('R4') ? 'R4' : channels[0];
    lastMultiSelect.querySelector('.select-dropdown').innerHTML = `
        <label class="dropdown-item"><input type="checkbox" class="select-all-journey-channels" value="all" checked> 全选</label>
        ${channels.map(channel => `<label class="dropdown-item"><input type="checkbox" class="journey-channel-cb" value="${channel}" checked> ${channel}</label>`).join('')}
    `;

    firstSelect.addEventListener('change', renderChannelJourneyList);
    lastMultiSelect.querySelector('.select-header').addEventListener('click', () => {
        const dropdown = lastMultiSelect.querySelector('.select-dropdown');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    lastMultiSelect.querySelector('.select-all-journey-channels').addEventListener('change', event => {
        lastMultiSelect.querySelectorAll('.journey-channel-cb').forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
        updateChannelJourneyFilterText();
        renderChannelJourneyList();
    });
    lastMultiSelect.querySelectorAll('.journey-channel-cb').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateChannelJourneyFilterText();
            renderChannelJourneyList();
        });
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('.journey-multi-select')) {
            lastMultiSelect.querySelector('.select-dropdown').style.display = 'none';
        }
    });
    renderChannelJourneyList();
}

function updateChannelJourneyFilterText() {
    const multiSelect = document.getElementById('lastJourneyChannel');
    if (!multiSelect) return;

    const checkboxes = [...multiSelect.querySelectorAll('.journey-channel-cb')];
    const selected = checkboxes.filter(checkbox => checkbox.checked);
    const selectAll = multiSelect.querySelector('.select-all-journey-channels');
    const text = multiSelect.querySelector('.journey-channel-text');
    selectAll.checked = selected.length === checkboxes.length;
    text.textContent = selected.length === checkboxes.length
        ? `全选 (${checkboxes.length}项)`
        : `已选 (${selected.length}项)`;
}

function renderChannelJourneyList() {
    const firstSelect = document.getElementById('firstJourneyChannel');
    const lastMultiSelect = document.getElementById('lastJourneyChannel');
    const list = document.getElementById('channelJourneyList');
    const config = MOCK.touchMedia?.channelJourney;
    if (!firstSelect || !lastMultiSelect || !list || !config) return;

    const channels = [...lastMultiSelect.querySelectorAll('.journey-channel-cb:checked')]
        .map(checkbox => checkbox.value);
    if (!channels.length) {
        list.innerHTML = '<div style="padding:16px 0;text-align:center;font-size:12px;color:#94a3b8;">请选择末次留资渠道</div>';
        return;
    }
    const weight = config.firstChannelWeights[firstSelect.value] || 1;
    const rows = channels.map(channel => {
        const count = Math.round((config.lastChannelCounts[channel] || 0) * weight);
        return { channel, count, percent: pctStr(count, config.totalUsers) };
    });
    const maxCount = Math.max(...rows.map(row => row.count), 1);

    list.innerHTML = rows.map(row => {
        const width = Math.max(4, Math.round(row.count / maxCount * 100));
        return `
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="width:90px; font-size:12px;">${firstSelect.value}-${row.channel}</span>
                <div style="flex:1;height:16px;background:#f1f5f9;border-radius:4px;overflow:hidden;">
                    <div style="width:${width}%;height:100%;background:#2563eb;"></div>
                </div>
                <span style="width:76px;text-align:right;font-size:11px;color:#64748b;">${row.count.toLocaleString()}人 · ${row.percent}%</span>
            </div>
        `;
    }).join('');
}

function initMediaJourneyFilter() {
    const firstSelect = document.getElementById('firstJourneyMedia');
    const lastMultiSelect = document.getElementById('lastJourneyMedia');
    const config = MOCK.touchMedia?.mediaJourney;
    if (!firstSelect || !lastMultiSelect || !config) return;

    const media = config.media || [];
    const firstInput = firstSelect.querySelector('.journey-search-input');
    const firstDropdown = firstSelect.querySelector('.journey-search-dropdown');
    const lastDropdown = lastMultiSelect.querySelector('.select-dropdown');
    const lastSearchInput = lastMultiSelect.querySelector('.journey-dropdown-search input');
    const lastOptions = lastMultiSelect.querySelector('.journey-dropdown-options');
    firstSelect.dataset.value = media.includes('天网') ? '天网' : media[0];
    firstInput.value = firstSelect.dataset.value;
    lastOptions.innerHTML = `
        <label class="dropdown-item"><input type="checkbox" class="select-all-journey-media" value="all" checked> 全选</label>
        ${media.map(item => `<label class="dropdown-item"><input type="checkbox" class="journey-media-cb" value="${item}" checked> ${item}</label>`).join('')}
    `;

    function renderFirstMediaOptions(keyword) {
        const filteredMedia = media.filter(item => item.includes(keyword.trim()));
        firstDropdown.innerHTML = filteredMedia.length
            ? filteredMedia.map(item => `<button type="button" class="journey-search-option" data-value="${item}">${item}</button>`).join('')
            : '<div class="journey-search-empty">暂无匹配媒体</div>';
        firstDropdown.style.display = 'block';
    }

    firstInput.addEventListener('focus', () => renderFirstMediaOptions(firstInput.value === firstSelect.dataset.value ? '' : firstInput.value));
    firstInput.addEventListener('input', () => renderFirstMediaOptions(firstInput.value));
    firstDropdown.addEventListener('click', event => {
        const option = event.target.closest('.journey-search-option');
        if (!option) return;
        firstSelect.dataset.value = option.dataset.value;
        firstInput.value = option.dataset.value;
        firstDropdown.style.display = 'none';
        renderMediaJourneyList();
    });
    lastMultiSelect.querySelector('.select-header').addEventListener('click', () => {
        lastDropdown.style.display = lastDropdown.style.display === 'none' ? 'block' : 'none';
        if (lastDropdown.style.display === 'block') {
            lastSearchInput.focus();
        }
    });
    lastMultiSelect.querySelector('.select-all-journey-media').addEventListener('change', event => {
        lastMultiSelect.querySelectorAll('.journey-media-cb').forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
        updateMediaJourneyFilterText();
        renderMediaJourneyList();
    });
    lastMultiSelect.querySelectorAll('.journey-media-cb').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateMediaJourneyFilterText();
            renderMediaJourneyList();
        });
    });
    updateMediaJourneyFilterText();
    lastSearchInput.addEventListener('input', () => {
        const keyword = lastSearchInput.value.trim();
        lastOptions.querySelectorAll('.dropdown-item').forEach(item => {
            const checkbox = item.querySelector('input');
            item.style.display = checkbox.value === 'all' || checkbox.value.includes(keyword) ? 'flex' : 'none';
        });
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('#firstJourneyMedia')) {
            firstDropdown.style.display = 'none';
            firstInput.value = firstSelect.dataset.value;
        }
        if (!event.target.closest('#lastJourneyMedia')) {
            lastDropdown.style.display = 'none';
        }
    });
    renderMediaJourneyList();
}

function updateMediaJourneyFilterText() {
    const multiSelect = document.getElementById('lastJourneyMedia');
    if (!multiSelect) return;

    const checkboxes = [...multiSelect.querySelectorAll('.journey-media-cb')];
    const selected = checkboxes.filter(checkbox => checkbox.checked);
    multiSelect.querySelector('.select-all-journey-media').checked = selected.length === checkboxes.length;
    multiSelect.querySelector('.journey-media-text').textContent = selected.length === checkboxes.length
        ? `全选 (${checkboxes.length}项)`
        : `已选 (${selected.length}项)`;
}

function renderMediaJourneyList() {
    const firstSelect = document.getElementById('firstJourneyMedia');
    const lastMultiSelect = document.getElementById('lastJourneyMedia');
    const list = document.getElementById('mediaJourneyList');
    const config = MOCK.touchMedia?.mediaJourney;
    if (!firstSelect || !lastMultiSelect || !list || !config) return;

    const media = [...lastMultiSelect.querySelectorAll('.journey-media-cb:checked')]
        .map(checkbox => checkbox.value);
    if (!media.length) {
        list.innerHTML = '<div style="padding:16px 0;text-align:center;font-size:12px;color:#94a3b8;">请选择末次留资媒体</div>';
        return;
    }
    const firstMedia = firstSelect.dataset.value;
    const weight = config.firstMediaWeights[firstMedia] || 1;
    const rows = media.map(item => {
        const count = Math.round((config.lastMediaCounts[item] || 0) * weight);
        return { media: item, count, percent: pctStr(count, config.totalUsers) };
    });
    const maxCount = Math.max(...rows.map(row => row.count), 1);

    list.innerHTML = rows.map(row => {
        const width = Math.max(4, Math.round(row.count / maxCount * 100));
        return `
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="width:90px; font-size:12px;">${firstMedia}-${row.media}</span>
                <div style="flex:1;height:16px;background:#f1f5f9;border-radius:4px;overflow:hidden;">
                    <div style="width:${width}%;height:100%;background:#2563eb;"></div>
                </div>
                <span style="width:76px;text-align:right;font-size:11px;color:#64748b;">${row.count.toLocaleString()}人 · ${row.percent}%</span>
            </div>
        `;
    }).join('');
}

// 城市投放效果 Top 10/20 切换逻辑
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
        extras.forEach(el => el.style.display = '');
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
function initRankInteraction(config) {
    const tabs = document.getElementById(config.tabsId);
    const listContainer = document.getElementById(config.listId);
    if (!tabs || !listContainer) return;

    const metricLabels = {
        hab: "HAB 占比",
        arrival: "到店率",
        testdrive: "试驾率",
        order: "锁单率"
    };

    function renderRankList(data, labelText, metric) {
        listContainer.style.opacity = '0';
        setTimeout(() => {
            const baseMap = { hab: 12345, arrival: 12345, testdrive: 5185, order: 2345 };
            const base = baseMap[metric] || 12345;

            // 计算每项的绝对数量，并按最大值归一化，让柱长反映总量差异
            const itemsWithCount = data.map(function(item) {
                var pct = parseFloat(item.val);
                var count = Math.round(pct * base / 100);
                return { item: item, count: count };
            });
            var maxCount = itemsWithCount.reduce(function(max, ic) { return Math.max(max, ic.count); }, 0) || 1;

            var html = '';
            itemsWithCount.forEach(function(ic, index) {
                var item = ic.item;
                var count = ic.count;
                var barPct = Math.round(count / maxCount * 100);
                var rankClass = index < 3 ? 'top3' : '';

                var barHtml = '';
                if (metric === 'hab') {
                    var hCount = Math.round(item.h * base / 100);
                    var aCount = Math.round(item.a * base / 100);
                    var bCount = Math.round(item.b * base / 100);
                    var totalSeg = item.h + item.a + item.b + item.other;
                    var hW = totalSeg > 0 ? Math.round(item.h / totalSeg * barPct) : 0;
                    var aW = totalSeg > 0 ? Math.round(item.a / totalSeg * barPct) : 0;
                    var bW = totalSeg > 0 ? Math.round(item.b / totalSeg * barPct) : 0;
                    var otherW = barPct - hW - aW - bW;
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg h" style="width: ${hW}%;" title="H: ${hCount}人"></div>
                            <div class="ce-h-seg a" style="width: ${aW}%;" title="A: ${aCount}人"></div>
                            <div class="ce-h-seg b" style="width: ${bW}%;" title="B: ${bCount}人"></div>
                            <div class="ce-h-seg other" style="width: ${otherW}%;"></div>
                        </div>
                    `;
                    barHtml += '<span class="ce-h-total">' + labelText + ': ' + item.val + ' (' + count.toLocaleString() + '人)</span>';
                } else {
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg a" style="width: ${barPct}%;"></div>
                        </div>
                    `;
                    barHtml += '<span class="ce-h-total">' + labelText + ': ' + item.val + ' (' + count.toLocaleString() + '人)</span>';
                }

                const code = item[config.dataProp];
                html += `
                    <div class="ce-h-bar-item ${code ? 'project-bar-item' : ''}" ${code ? `data-${config.dataAttr}="${code}"` : ''}>
                        <div class="ce-h-info">
                            <span class="ce-h-rank ${rankClass}">${index + 1}</span>
                            <span class="ce-h-name">${item.name}</span>
                        </div>
                        <div class="ce-h-chart-wrapper">
                            ${barHtml}
                        </div>
                    </div>
                `;
            });
            listContainer.innerHTML = html;
            listContainer.style.opacity = '1';
        }, 300);
    }

    renderRankList(config.data.hab, metricLabels.hab, 'hab');

    tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.ce-dim-btn');
        if (!btn) return;
        tabs.querySelectorAll('.ce-dim-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const metric = btn.dataset.metric;
        renderRankList(config.data[metric], metricLabels[metric], metric);
    });
}

// 排名列表点击事件委托（项目/媒体下钻）
document.addEventListener('click', (e) => {
    const barItem = e.target.closest('.project-bar-item');
    if (!barItem) return;
    const projectCode = barItem.dataset.project;
    const scheduleCode = barItem.dataset.schedule;
    if (projectCode) showProjectDrillModal(projectCode);
    else if (scheduleCode) showScheduleDrillModal(scheduleCode);
});


// === 培育运营：关注点下钻逻辑 ===


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

// 通用弹窗关闭
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('active'); }


/**
 * 全量排行榜相关逻辑
 */





function openFullRanking(type) {
    const modal = document.getElementById('rankingModal');
    const title = document.getElementById('rankingModalTitle');
    const thead = document.getElementById('rankingModalThead');
    const tbody = document.getElementById('rankingModalTableBody');

    if (!modal || !tbody) return;

    tbody.innerHTML = '';
    modal.querySelector('.drawer-body').style.padding = '';

    if (type === 'quality') {
        title.innerText = '通话质量标签全量排行榜';
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
            const ti = getTrendInfo(item.trend);
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td><span class="status-tag" style="${getQualityTypeStyle(item.type)}">${item.type}</span></td>
                <td style="font-weight: 500;">${item.reason}</td>
                <td style="text-align: right; font-weight: 600;">${item.count.toLocaleString()}</td>
                <td style="text-align: right;">${item.percent}</td>
                <td style="text-align: right; color: ${ti.color}">${ti.icon} ${item.trendVal}</td>
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
            const ti = getTrendInfo(item.trend);
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td><span class="status-tag" style="background: #f1f5f9; color: #475569; border: none;">${item.result}</span></td>
                <td style="font-weight: 500;">${item.reason}</td>
                <td style="text-align: right; font-weight: 600;">${item.count.toLocaleString()}</td>
                <td style="text-align: right;">${item.percent}</td>
                <td style="text-align: right; color: ${ti.color}">${ti.icon} ${item.trendVal}</td>
            `;
            tbody.appendChild(row);
        });
    } else if (type === 'areaDelivery') {
        title.innerText = '小区投放效果全量';
        modal.querySelector('.drawer-body').style.padding = '0 60px';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
                <th>大区</th>
                <th>小区</th>
                <th style="width: 140px; text-align: right;">新增线索用户</th>
                <th style="width: 120px; text-align: right;">H占比</th>
                <th style="width: 120px; text-align: right;">A占比</th>
                <th style="width: 120px; text-align: right;">B占比</th>
                <th style="width: 120px; text-align: right;">C/其他</th>
                <th style="width: 150px; text-align: right;">H/A/B占比</th>
            </tr>
        `;
        areaDeliveryFullData.forEach(item => {
            const hab = item.h + item.a + item.b;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td style="font-weight: 500;">${item.region}</td>
                <td style="font-weight: 500;">${item.area}</td>
                <td style="text-align: right; font-weight: 600;">${item.count.toLocaleString()}人</td>
                <td style="text-align: right;">${item.h}%</td>
                <td style="text-align: right;">${item.a}%</td>
                <td style="text-align: right;">${item.b}%</td>
                <td style="text-align: right;">${item.other}%</td>
                <td style="text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <div style="width: 64px; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; width: ${hab}%; background: #00337c;"></div>
                        </div>
                        <strong>${hab}%</strong>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else if (type.startsWith('channelOverlap') && channelOverlapFullData[type.replace('channelOverlap', '')]) {
        const overlap = channelOverlapFullData[type.replace('channelOverlap', '')];
        title.innerText = overlap.title;
        modal.querySelector('.drawer-body').style.padding = '0 60px';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
                <th>重合渠道名称列表</th>
                <th style="width: 140px; text-align: right;">并集用户数</th>
                <th style="width: 140px; text-align: right;">重合用户数</th>
                <th style="width: 120px; text-align: right;">重合率</th>
            </tr>
        `;
        overlap.rows.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td style="font-weight: 500;">${item.media}</td>
                <td style="text-align: right; font-weight: 600;">${item.unionCount.toLocaleString()}人</td>
                <td style="text-align: right; font-weight: 600;">${item.overlapCount.toLocaleString()}人</td>
                <td style="text-align: right;">${item.overlapRate}</td>
            `;
            tbody.appendChild(row);
        });
    } else if (type.startsWith('mediaOverlap') && mediaOverlapFullData[type.replace('mediaOverlap', '')]) {
        const overlap = mediaOverlapFullData[type.replace('mediaOverlap', '')];
        title.innerText = overlap.title;
        modal.querySelector('.drawer-body').style.padding = '0 60px';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
                <th>重合媒体名称列表</th>
                <th style="width: 140px; text-align: right;">并集用户数</th>
                <th style="width: 140px; text-align: right;">重合用户数</th>
                <th style="width: 120px; text-align: right;">重合率</th>
            </tr>
        `;
        overlap.rows.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td style="font-weight: 500;">${item.media}</td>
                <td style="text-align: right; font-weight: 600;">${item.unionCount.toLocaleString()}人</td>
                <td style="text-align: right; font-weight: 600;">${item.overlapCount.toLocaleString()}人</td>
                <td style="text-align: right;">${item.overlapRate}</td>
            `;
            tbody.appendChild(row);
        });
    } else if (type === 'assignedStore' || type === 'dealStore' || type === 'firstTouchDealStore' || type === 'reachStore') {
        const titles = { assignedStore: '下发专营店全量排名', dealStore: '成交专营店全量排名', firstTouchDealStore: '首触-成交专营店全量排名', reachStore: '触达专营店全量排名' };
        title.innerText = titles[type];
        modal.querySelector('.drawer-body').style.padding = '0 60px';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
                <th>专营店名称</th>
                <th style="width: 140px; text-align: right;">用户数</th>
                <th style="width: 120px; text-align: right;">占比</th>
            </tr>
        `;
        storeFullData[type].forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td style="font-weight: 500;">${item.name}</td>
                <td style="text-align: right; font-weight: 600;">${item.count.toLocaleString()}人</td>
                <td style="text-align: right;">${item.percent}</td>
            `;
            tbody.appendChild(row);
        });
    } else     if (type === 'project' || type === 'schedule') {
        title.innerText = type === 'project' ? '全量大项目线索质量排名' : '全量媒体质量排名';
        modal.querySelector('.drawer-body').style.padding = '0 60px';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
                <th>${type === 'project' ? '项目名称' : '媒体名称'}</th>
                <th style="width: 200px; text-align: right;">H/A/B 占比</th>
                <th style="width: 145px; text-align: right;">到店率</th>
                <th style="width: 145px; text-align: right;">试驾率</th>
                <th style="width: 145px; text-align: right;">锁单率</th>
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

        // 媒体名称 → scheduleCode 映射（用于下钻弹窗）
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
            const habVal = (45 - i * 0.5);
            const arrivalVal = (28 - i * 0.4);
            const testdriveVal = (18 - i * 0.3);
            const orderVal = (8 - i * 0.1);
            const hab = habVal.toFixed(1) + '%';
            const arrival = arrivalVal.toFixed(1) + '%';
            const testdrive = testdriveVal.toFixed(1) + '%';
            const order = orderVal.toFixed(1) + '%';
            const habCount = Math.round(habVal * 12345 / 100);
            const arrivalCount = Math.round(arrivalVal * 12345 / 100);
            const testdriveCount = Math.round(testdriveVal * 5185 / 100);
            const orderCount = Math.round(orderVal * 2345 / 100);
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
                        <span style="font-size: 11px; color: #6b7280;">(${habCount.toLocaleString()}人)</span>
                    </div>
                </td>
                <td style="text-align: right;">${arrival} <span style="font-size: 11px; color: #6b7280;">(${arrivalCount.toLocaleString()}人)</span></td>
                <td style="text-align: right;">${testdrive} <span style="font-size: 11px; color: #6b7280;">(${testdriveCount.toLocaleString()}人)</span></td>
                <td style="text-align: right;">${order} <span style="font-size: 11px; color: #6b7280;">(${orderCount.toLocaleString()}人)</span></td>
            `;
            tbody.appendChild(row);
        }
    }

    modal.classList.add('active');
}


function getQualityTypeStyle(type) {
    const styles = {
        '无效号码': 'background: #f3f4f6; color: #374151; border: none;',
        '无法建联': 'background: #eff6ff; color: #1e40af; border: none;',
        '有效号码': 'background: #f0fdf4; color: #166534; border: none;'
    };
    return styles[type] || 'background: #f1f5f9; color: #475569; border: none;';
}

function getTrendInfo(trend) {
    return {
        icon: `<i class="fa-solid ${TREND_ICONS[trend] || TREND_ICONS.equal}"></i>`,
        color: TREND_COLORS[trend] || TREND_COLORS.equal
    };
}

// ============================================
// 城市专营店意向等级详情弹窗功能
// ============================================

// 城市专营店 Mock 数据（包含大区、小区）

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
        initDrillTabSwitch('#cityStoreModalContent');
    }
    
    // 显示弹窗
    modal.classList.add('active');
}



// 城市投放效果柱状图点击事件（仅限城市投放效果图表）
document.addEventListener('click', (e) => {
    // 只响应城市投放效果图表内的点击
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

// 关闭弹窗按钮委托（通过data-modal-id属性）
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-modal-id]');
    if (btn) closeModal(btn.dataset.modalId);
});

// 点击弹窗/抽屉外部关闭
document.addEventListener('click', (e) => {
    ['cityStoreModal','regionChannelModal','projectDrillModal','scheduleDrillModal','rankingModal','focusDrillDownModal','firstTouchDealStoreModal'].forEach(id => {
        if (e.target === document.getElementById(id)) closeModal(id);
    });
});

// ============================================
// 大区渠道质量详情弹窗功能
// ============================================

// 大区渠道质量 Mock 数据（按大区-小区-门店结构）

// ============================================
// 大项目线索质量下钻数据
// ============================================

// ============================================
// 媒体质量下钻数据
// ============================================

// 计算大区总计
function calculateRegionTotal(regionData) {
    var total = { hSchedule: 0, hLead: 0, hNonTest: 0, a: 0, b: 0, cUnclear: 0, cUnreachable: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
    Object.values(regionData.areas).forEach(function(areaStores) {
        areaStores.forEach(function(store) {
            total.hSchedule += storeLevel(store, 'hSchedule');
            total.hLead += storeLevel(store, 'hLead');
            total.hNonTest += storeLevel(store, 'hNonTest');
            total.a += (store.a || 0);
            total.b += (store.b || 0);
            total.cUnclear += storeLevel(store, 'cUnclear');
            total.cUnreachable += storeLevel(store, 'cUnreachable');
            total.f += (store.f || 0);
            total.l += (store.l || 0);
            total.e += (store.e || 0);
            total.invalid += (store.invalid || 0);
            total.total += storeTotal(store);
        });
    });
    // 兼容旧字段
    total.h = total.hSchedule + total.hLead + total.hNonTest;
    total.c = total.cUnclear + total.cUnreachable;
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
    
    // 计算全局总计（11级）
    var regionCodes = Object.keys(regionChannelData);
    var allRegionsTotal = { hSchedule: 0, hLead: 0, hNonTest: 0, a: 0, b: 0, cUnclear: 0, cUnreachable: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
    regionCodes.forEach(function(code) {
        var t = calculateRegionTotal(regionChannelData[code]);
        allRegionsTotal.hSchedule += t.hSchedule;
        allRegionsTotal.hLead += t.hLead;
        allRegionsTotal.hNonTest += t.hNonTest;
        allRegionsTotal.a += t.a;
        allRegionsTotal.b += t.b;
        allRegionsTotal.cUnclear += t.cUnclear;
        allRegionsTotal.cUnreachable += t.cUnreachable;
        allRegionsTotal.f += t.f;
        allRegionsTotal.l += t.l;
        allRegionsTotal.e += t.e;
        allRegionsTotal.invalid += t.invalid;
        allRegionsTotal.total += t.total;
    });
    var allHTotal = allRegionsTotal.hSchedule + allRegionsTotal.hLead + allRegionsTotal.hNonTest;
    var allCTotal = allRegionsTotal.cUnclear + allRegionsTotal.cUnreachable;
    var allHabTotal = allHTotal + allRegionsTotal.a + allRegionsTotal.b;
    var allHabPercent = allRegionsTotal.total > 0 ? (allHabTotal / allRegionsTotal.total * 100).toFixed(1) : '0.0';
    var allStoreCount = regionCodes.reduce(function(sum, code) {
        return sum + Object.values(regionChannelData[code].areas).reduce(function(s, stores) { return s + stores.length; }, 0);
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
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">H-试驾排程单</div><div style="font-size: 14px; font-weight: 600; color: #b91c1c;">${allRegionsTotal.hSchedule}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">H-试驾线索单</div><div style="font-size: 14px; font-weight: 600; color: #ef4444;">${allRegionsTotal.hLead}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">H-非试驾线索单</div><div style="font-size: 14px; font-weight: 600; color: #fb7185;">${allRegionsTotal.hNonTest}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">A</div><div style="font-size: 14px; font-weight: 600; color: #f59e0b;">${allRegionsTotal.a}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">B</div><div style="font-size: 14px; font-weight: 600; color: #3b82f6;">${allRegionsTotal.b}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">C-意向不明</div><div style="font-size: 14px; font-weight: 600; color: #14b8a6;">${allRegionsTotal.cUnclear}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">C-无法接通</div><div style="font-size: 14px; font-weight: 600; color: #67e8f9;">${allRegionsTotal.cUnreachable}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">F-战败</div><div style="font-size: 14px; font-weight: 600; color: #8b5cf6;">${allRegionsTotal.f}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">L-休眠</div><div style="font-size: 14px; font-weight: 600; color: #ec4899;">${allRegionsTotal.l}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">E-意向含糊</div><div style="font-size: 14px; font-weight: 600; color: #84cc16;">${allRegionsTotal.e}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">无效号码</div><div style="font-size: 14px; font-weight: 600; color: #94a3b8;">${allRegionsTotal.invalid}</div></div>
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
                html += generateStoreCard(store, region.regionName);
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
                sum.h += storeHTotal(s); sum.a += s.a; sum.b += s.b; sum.total += s.total;
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
                html += generateStoreCard(store, areaName);
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
                sum.h += storeHTotal(s); sum.a += s.a; sum.b += s.b; sum.c += storeCTotal(s);
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
    
    // 绑定小区 Tab 切换事件
    initDrillTabSwitch('#regionChannelModalContent');
    
    // 显示弹窗
    modal.classList.add('active');
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

    let html = renderDrillContent(project.channels);
    content.innerHTML = html;
    initDrillTabSwitch('#projectDrillModalContent');
    modal.classList.add('active');
}

/**
 * 生成门店卡片 HTML
 */
// 兼容旧数据：计算合并的 H 和 C 总量
function storeLevel(s, key) { return s[key] || 0; }
function storeHTotal(s) { return storeLevel(s, 'hSchedule') + storeLevel(s, 'hLead') + storeLevel(s, 'hNonTest') || s.h || 0; }
function storeCTotal(s) { return storeLevel(s, 'cUnclear') + storeLevel(s, 'cUnreachable') || s.c || 0; }
function storeTotal(s) { return s.total || 0; }
function storeHabTotal(s) { return storeHTotal(s) + (s.a || 0) + (s.b || 0); }

function generateStoreCard(store, areaLabel) {
    var t = storeTotal(store);
    var habTotal = storeHabTotal(store);
    var habPct = t > 0 ? (habTotal / t * 100).toFixed(1) : '0.0';
    var subLabel = areaLabel ? '<div style="font-size: 10px; color: #9ca3af;">' + areaLabel + '</div>' : '';

    // 迷你条形图：11级分段
    var barSegments = '';
    LEVEL_LABELS.forEach(function(lv) {
        var val = store[lv.key] || 0;
        var pct = t > 0 ? (val / t * 100).toFixed(1) : 0;
        barSegments += '<div style="height:100%;background:' + LEVEL_COLORS[lv.key] + ';width:' + pct + '%;" title="' + lv.label + ': ' + val + '"></div>';
    });

    // 底部标签行
    var labelRow = '';
    LEVEL_LABELS.forEach(function(lv) {
        var val = store[lv.key] || 0;
        labelRow += '<span style="color:' + LEVEL_COLORS[lv.key] + ';">' + lv.label + ':<span style="font-weight:600;">' + val + '</span></span>';
    });

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
                ${barSegments}
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 9px; flex-wrap: wrap;">
                ${labelRow}
                <span style="color: #6b7280; margin-left: auto;">合计:<span style="font-weight: 600;">${t}</span></span>
            </div>
        </div>
    `;
}



// ============================================
// 媒体质量下钻功能
// ============================================

/**
 * 显示媒体质量下钻抽屉
 * @param {string} scheduleCode - 媒体代码
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
    const allTotal = { hSchedule: 0, hLead: 0, hNonTest: 0, a: 0, b: 0, cUnclear: 0, cUnreachable: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 };
    const allStoreCount = regionNames.reduce((sum, r) => {
        return sum + Object.values(channels[r]).reduce((s, stores) => s + stores.length, 0);
    }, 0);
    regionNames.forEach(region => {
        Object.values(channels[region]).forEach(stores => {
            stores.forEach(function(store) {
                allTotal.hSchedule += storeLevel(store, 'hSchedule');
                allTotal.hLead += storeLevel(store, 'hLead');
                allTotal.hNonTest += storeLevel(store, 'hNonTest');
                allTotal.a += (store.a || 0); allTotal.b += (store.b || 0);
                allTotal.cUnclear += storeLevel(store, 'cUnclear');
                allTotal.cUnreachable += storeLevel(store, 'cUnreachable');
                allTotal.f += (store.f || 0); allTotal.l += (store.l || 0); allTotal.e += (store.e || 0); allTotal.invalid += (store.invalid || 0);
                allTotal.total += storeTotal(store);
            });
        });
    });
    const allH = allTotal.hSchedule + allTotal.hLead + allTotal.hNonTest;
    const allC = allTotal.cUnclear + allTotal.cUnreachable;
    const allHab = allTotal.total > 0 ? ((allH + allTotal.a + allTotal.b) / allTotal.total * 100).toFixed(1) : '0.0';

    let html = `
        <div style="padding: 16px 20px;">
            <div style="display: flex; align-items: center; gap: 20px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <div style="text-align: center;"><div style="font-size: 11px; color: #6b7280;">专营店数量</div><div style="font-size: 18px; font-weight: 600; color: #111827;">${allStoreCount} 家</div></div>
                <div style="width: 1px; height: 36px; background: #e5e7eb;"></div>
                <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">H-试驾排程单</div><div style="font-size: 14px; font-weight: 600; color: #b91c1c;">${allTotal.hSchedule}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">H-试驾线索单</div><div style="font-size: 14px; font-weight: 600; color: #ef4444;">${allTotal.hLead}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">H-非试驾线索单</div><div style="font-size: 14px; font-weight: 600; color: #fb7185;">${allTotal.hNonTest}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">A</div><div style="font-size: 14px; font-weight: 600; color: #f59e0b;">${allTotal.a}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">B</div><div style="font-size: 14px; font-weight: 600; color: #3b82f6;">${allTotal.b}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">C-意向不明</div><div style="font-size: 14px; font-weight: 600; color: #14b8a6;">${allTotal.cUnclear}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">C-无法接通</div><div style="font-size: 14px; font-weight: 600; color: #67e8f9;">${allTotal.cUnreachable}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">F-战败</div><div style="font-size: 14px; font-weight: 600; color: #8b5cf6;">${allTotal.f}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">L-休眠</div><div style="font-size: 14px; font-weight: 600; color: #ec4899;">${allTotal.l}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">E-意向含糊</div><div style="font-size: 14px; font-weight: 600; color: #84cc16;">${allTotal.e}</div></div>
                    <div style="text-align: center;"><div style="font-size: 10px; color: #6b7280;">无效号码</div><div style="font-size: 14px; font-weight: 600; color: #94a3b8;">${allTotal.invalid}</div></div>
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
        Object.values(regionAreas).forEach(stores => { stores.forEach(function(s) { regionTotal.h += storeHTotal(s); regionTotal.a += (s.a || 0); regionTotal.b += (s.b || 0); regionTotal.total += storeTotal(s); }); });
        const regionHab = regionTotal.total > 0 ? ((regionTotal.h + regionTotal.a + regionTotal.b) / regionTotal.total * 100).toFixed(1) : '0.0';
        html += '<button class="region-tab-btn" data-region="' + region + '"><span>' + region + '</span><span class="region-tab-count">' + regionHab + '%</span></button>';
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
        const regionTotal = { h: 0, a: 0, b: 0, total: 0 };
        Object.values(regionAreas).forEach(stores => { stores.forEach(function(s) { regionTotal.h += storeHTotal(s); regionTotal.a += (s.a || 0); regionTotal.b += (s.b || 0); regionTotal.total += storeTotal(s); }); });
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
                const t = regionAreas[areaName].reduce(function(s, st) { s.h += storeHTotal(st); s.a += (st.a || 0); s.b += (st.b || 0); s.total += storeTotal(st); return s; }, { h: 0, a: 0, b: 0, total: 0 });
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
            const areaTotal = areaStores.reduce(function(s, st) { s.h += storeHTotal(st); s.a += (st.a || 0); s.b += (st.b || 0); s.c += storeCTotal(st); s.f += (st.f || 0); s.l += (st.l || 0); s.e += (st.e || 0); s.invalid += (st.invalid || 0); s.total += storeTotal(st); return s; }, { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, invalid: 0, total: 0 });
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
 * 切换培育运营跟进过程页签
 */
function switchCultivationFollowProcess(tabKey) {
    const tabButtons = document.querySelectorAll('.follow-process-tab');
    const panels = document.querySelectorAll('.follow-process-panel');

    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.followTab === tabKey);
    });

    panels.forEach(panel => {
        const isTargetPanel =
            (tabKey === 'headquarters' && panel.id === 'headquartersFollowPanel') ||
            (tabKey === 'store' && panel.id === 'storeFollowPanel');
        panel.classList.toggle('active', isTargetPanel);
    });
}

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

// ============================================
// Plan B 动态渲染 — 不修改HTML，仅替换数据内容
// ============================================

// 辅助：渲染趋势图标HTML
function trendHtml(trend, tv) {
    return `<i class="fa-solid ${TREND_ICONS[trend] || TREND_ICONS.equal}"></i> ${tv}`;
}

// --- KPI卡片动态渲染 ---
function renderKpiCards() {
    // 只更新渠道效果页的KPI（其他两页类似结构但标签略有不同，保留原样）
    const pane = document.getElementById('channel-effect');
    if (!pane) return;
    const row = pane.querySelector('.kpi-group-row');
    if (!row) return;
    
    const config = kpiPageData['channel-effect'];
    if (!config) return;
    
    let html = '';
    config.forEach(g => {
        html += `<div class="kpi-group-compact ${g.border}" style="flex: ${g.flex};">
            <div class="kpi-group-title-mini"><i class="fa-solid ${g.icon}"></i> ${g.title}</div>
            <div class="kpi-metrics-row">`;
        g.metrics.forEach(m => {
            html += `<div class="kpi-metric-item">
                <div class="kpi-metric-label">${m.label}</div>
                <div class="kpi-metric-val">${m.val}<span class="kpi-unit">${m.unit}</span></div>
                <div class="kpi-metric-trend ${m.trend}">${trendHtml(m.trend, m.tv)}</div>
            </div>`;
        });
        html += `</div></div>`;
    });
    row.innerHTML = html;
}

// --- 线索级别占比饼图渲染 ---
function renderLeadLevelPie() {
    const body = findCard('线索级别占比', { returnBody: true });
    if (!body) return;
    const data = pieOverrideData['线索级别占比'];
    if (!data) return;
    
    const gradient = data.segments.map(s => `${s.color} ${s.start}% ${s.end}%`).join(', ');
    let legendHtml = data.segments.map(seg =>
        `<div style="display:flex;align-items:center;gap:6px;">
            <span style="width:10px;height:10px;border-radius:2px;background:${seg.color};flex-shrink:0;"></span>
            <span style="color:#6b7280;flex:1;">${seg.label}</span>
            <span style="font-weight:600;color:#1e293b;">${seg.count}人</span>
            <span style="color:${seg.color};font-weight:600;">${seg.pct}</span>
        </div>`
    ).join('');
    
    body.style.padding = '24px';
    body.innerHTML = `<div style="display:flex;align-items:center;gap:40px;">
        <div style="width:200px;height:200px;flex-shrink:0;border-radius:50%;background:conic-gradient(${gradient});position:relative;">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:90px;height:90px;background:#fff;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <div style="font-size:20px;font-weight:700;color:#1e293b;">${data.centerTotal}</div>
                <div style="font-size:10px;color:#6b7280;">${data.centerLabel}</div>
            </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:11px;text-align:left;flex:1;min-width:0;">${legendHtml}</div>
    </div>`;
}

// ============================================
// ============================================
// 筛选门店弹窗 - 菜单树 + 门店多选列表
// ============================================
var storeFilterState = {
    trigger: null,
    selectedStores: {},    // 当前弹窗临时选择
    selectionsByContext: {
        top: {},
        firstTouch: {},
        deal: {}
    },
    context: 'top',
    activeTab: 'byRegion'
};

var firstTouchDealStoreState = {
    firstTouchStore: '',
    dealStores: {}
};

// ====== 弹窗开关 ======
function openStoreFilterModal(btn) {
    storeFilterState.context = btn.dataset.storeFilterMode || 'top';
    storeFilterState.trigger = btn;
    storeFilterState.selectedStores = Object.assign({}, storeFilterState.selectionsByContext[storeFilterState.context]);
    var title = document.querySelector('.store-filter-modal-title');
    if (title) {
        title.innerHTML = '<i class="fa-solid fa-store"></i> '
            + (storeFilterState.context === 'firstTouch' ? '选择首触专营店'
                : storeFilterState.context === 'deal' ? '选择成交专营店' : '筛选门店');
    }
    document.getElementById('storeFilterOverlay').classList.add('open');
    buildMenuTree('byRegion');
    buildMenuTree('byLocation');
    switchStoreTab('byRegion');
    clearSearch();
}

function isSingleStoreSelection() {
    return storeFilterState.context === 'firstTouch';
}

function closeStoreFilterModal(e) {
    if (e && e.target !== document.getElementById('storeFilterOverlay')) return;
    document.getElementById('storeFilterOverlay').classList.remove('open');
}

function switchStoreTab(tab) {
    storeFilterState.activeTab = tab;
    var searchInput = document.querySelector('.store-filter-search input');
    var hasSearch = searchInput && searchInput.value.trim() !== '';
    document.querySelectorAll('.store-filter-tab').forEach(function(t) {
        t.classList.toggle('active', t.getAttribute('data-tab') === tab);
    });
    document.querySelectorAll('.store-filter-panel').forEach(function(p) {
        p.classList.toggle('active', p.id === 'storePanel_' + tab);
        if (p.id === 'storePanel_search') {
            p.style.display = hasSearch ? 'block' : 'none';
        } else {
            p.style.display = !hasSearch && p.id === 'storePanel_' + tab ? 'block' : 'none';
        }
    });
    refreshStoreList(tab);
    updateStoreCount();
}

// ====== 菜单树构建 ======
function buildMenuTree(tab) {
    var h = MOCK.hierarchy;
    if (!h) return;
    var container = document.getElementById('menuTree_' + tab);
    if (!container) return;
    container.innerHTML = '';

    if (tab === 'byRegion') {
        Object.keys(h).sort().forEach(function(regionName) {
            var parentId = 'region_' + regionName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
            var selectRegionButton = isSingleStoreSelection() ? '' : '<button class="tree-select-all-btn" data-scope="region" data-name="' + encodeURIComponent(regionName) + '" onclick="toggleTreeNodeStores(event, this)">全选</button>';
            var parentDiv = document.createElement('div');
            parentDiv.className = 'menu-tree-item';
            parentDiv.innerHTML = '<div class="menu-tree-parent" data-id="' + parentId + '" onclick="toggleMenuTree(this, \'byRegion\')">'
                + '<span class="arrow">▶</span><span class="label">' + regionName + '</span>' + selectRegionButton + '</div>';

            var childDiv = document.createElement('div');
            childDiv.className = 'menu-tree-children';
            childDiv.setAttribute('data-parent', parentId);
            var subregions = h[regionName];
            subregions.forEach(function(sr) {
                var storeCount = countSubregionStores(sr);
                var childId = 'sub_' + sr.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
                childDiv.innerHTML += '<div class="menu-tree-child" data-id="' + childId + '" data-region="' + regionName + '" data-subregion="' + sr.name + '" onclick="selectMenuLeaf(this, \'byRegion\')">'
                    + sr.name + '<span class="count">' + storeCount + '</span></div>';
            });
            parentDiv.appendChild(childDiv);
            container.appendChild(parentDiv);
        });
    } else {
        // byLocation: 省份 → 城市 → 县区
        var provMap = {};
        Object.keys(h).forEach(function(r) {
            h[r].forEach(function(sr) {
                sr.provinces.forEach(function(p) {
                    if (!provMap[p.name]) provMap[p.name] = [];
                    p.cities.forEach(function(c) {
                        var existing = provMap[p.name].find(function(x) { return x.name === c.name; });
                        if (!existing) {
                            existing = { name: c.name, districts: [] };
                            provMap[p.name].push(existing);
                        }
                        c.districts.forEach(function(d) {
                            var dex = existing.districts.find(function(x) { return x.name === d.name; });
                            if (!dex) {
                                dex = { name: d.name, stores: [] };
                                existing.districts.push(dex);
                            }
                            d.stores.forEach(function(s) { if (dex.stores.indexOf(s) === -1) dex.stores.push(s); });
                        });
                    });
                });
            });
        });

        Object.keys(provMap).sort().forEach(function(provName) {
            var provId = 'prov_' + provName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
            var selectProvinceButton = isSingleStoreSelection() ? '' : '<button class="tree-select-all-btn" data-scope="province" data-name="' + encodeURIComponent(provName) + '" onclick="toggleTreeNodeStores(event, this)">全选</button>';
            var parentDiv = document.createElement('div');
            parentDiv.className = 'menu-tree-item';
            parentDiv.innerHTML = '<div class="menu-tree-parent" data-id="' + provId + '" onclick="toggleMenuTree(this, \'byLocation\')">'
                + '<span class="arrow">▶</span><span class="label">' + provName + '</span>' + selectProvinceButton + '</div>';

            var childDiv = document.createElement('div');
            childDiv.className = 'menu-tree-children';
            childDiv.setAttribute('data-parent', provId);

            provMap[provName].sort(function(a,b) { return a.name.localeCompare(b.name); }).forEach(function(city) {
                var cityId = 'city_' + city.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
                var selectCityButton = isSingleStoreSelection() ? '' : '<button class="tree-select-all-btn" data-scope="city" data-name="' + encodeURIComponent(provName) + '" data-city="' + encodeURIComponent(city.name) + '" onclick="toggleTreeNodeStores(event, this)">全选</button>';
                var itemHtml = '<div class="menu-tree-item">'
                    + '<div class="menu-tree-child" data-id="' + cityId + '" data-province="' + provName + '" data-city="' + city.name + '" onclick="toggleCityMenu(this)">'
                    + '<span class="arrow">▶</span><span class="label">' + city.name + '</span><span class="count">' + city.districts.length + '</span>' + selectCityButton + '</div>';

                var grandHtml = '<div class="menu-tree-grandchildren" data-parent="' + cityId + '">';
                city.districts.sort(function(a,b) { return a.name.localeCompare(b.name); }).forEach(function(dist) {
                    var distId = 'dist_' + dist.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
                    grandHtml += '<div class="menu-tree-grandchild" data-id="' + distId + '" data-province="' + provName + '" data-city="' + city.name + '" data-district="' + dist.name + '" onclick="selectMenuLeaf(this, \'byLocation\')">'
                        + dist.name + '<span class="count">' + dist.stores.length + '</span></div>';
                });
                grandHtml += '</div>';
                itemHtml += grandHtml + '</div>';
                childDiv.innerHTML += itemHtml;
            });
            parentDiv.appendChild(childDiv);
            container.appendChild(parentDiv);
        });
    }
}

function countSubregionStores(sr) {
    var count = 0;
    sr.provinces.forEach(function(p) { p.cities.forEach(function(c) { c.districts.forEach(function(d) { count += d.stores.length; }); }); });
    return count;
}

function getStoresForTreeNode(scope, encodedName, encodedCity) {
    var h = MOCK.hierarchy;
    if (!h) return [];

    var name = decodeURIComponent(encodedName);
    var cityName = encodedCity ? decodeURIComponent(encodedCity) : '';
    var stores = [];

    Object.keys(h).forEach(function(regionName) {
        if (scope === 'region' && regionName !== name) return;
        h[regionName].forEach(function(sr) {
            sr.provinces.forEach(function(province) {
                if ((scope === 'province' || scope === 'city') && province.name !== name) return;
                province.cities.forEach(function(city) {
                    if (scope === 'city' && city.name !== cityName) return;
                    city.districts.forEach(function(district) {
                        stores = stores.concat(district.stores);
                    });
                });
            });
        });
    });

    return Array.from(new Set(stores)).sort();
}

function toggleTreeNodeStores(event, button) {
    event.stopPropagation();
    if (isSingleStoreSelection()) return;

    var stores = getStoresForTreeNode(button.dataset.scope, button.dataset.name, button.dataset.city);
    var shouldSelect = stores.some(function(store) { return !storeFilterState.selectedStores[store]; });
    stores.forEach(function(store) {
        if (shouldSelect) storeFilterState.selectedStores[store] = true;
        else delete storeFilterState.selectedStores[store];
    });
    refreshStoreList(storeFilterState.activeTab);
    updateStoreCount();
}

function updateTreeSelectAllButtons() {
    document.querySelectorAll('.tree-select-all-btn').forEach(function(button) {
        var stores = getStoresForTreeNode(button.dataset.scope, button.dataset.name, button.dataset.city);
        var allSelected = stores.length > 0 && stores.every(function(store) {
            return storeFilterState.selectedStores[store];
        });
        button.textContent = allSelected ? '取消' : '全选';
        button.classList.toggle('selected', allSelected);
    });
}

// ====== 菜单交互 ======
function toggleMenuTree(el, tab) {
    var parentId = el.getAttribute('data-id');
    var item = el.parentElement;
    var children = item.querySelector('.menu-tree-children');
    if (children) {
        children.classList.toggle('open');
        el.querySelector('.arrow').classList.toggle('open');
    }
}

function toggleCityMenu(el) {
    var item = el.parentElement;
    var grandChildren = item.querySelector('.menu-tree-grandchildren');
    if (grandChildren) {
        grandChildren.classList.toggle('open');
        el.querySelector('.arrow').classList.toggle('open');
    }
}

function selectMenuLeaf(el, tab) {
    storeFilterState.activeTab = tab;

    var container = document.getElementById('menuTree_' + tab);
    container.querySelectorAll('.menu-tree-child.selected, .menu-tree-grandchild.selected').forEach(function(e) { e.classList.remove('selected'); });
    el.classList.add('selected');

    refreshStoreList(tab);
}

// ====== 门店列表 ======
function getStoresForActiveLeaf(tab) {
    var h = MOCK.hierarchy;
    if (!h) return [];
    var stores = [];

    if (tab === 'byRegion') {
        var selected = document.querySelector('#menuTree_byRegion .menu-tree-child.selected');
        if (!selected) return [];
        var regionName = selected.getAttribute('data-region');
        var subregionName = selected.getAttribute('data-subregion');
        if (!regionName || !subregionName) return [];
        var region = h[regionName];
        if (!region) return [];
        var sr = region.find(function(s) { return s.name === subregionName; });
        if (!sr) return [];
        sr.provinces.forEach(function(p) { p.cities.forEach(function(c) { c.districts.forEach(function(d) { stores = stores.concat(d.stores); }); }); });
    } else {
        var selected = document.querySelector('#menuTree_byLocation .menu-tree-grandchild.selected');
        if (!selected) return [];
        var prov = selected.getAttribute('data-province');
        var city = selected.getAttribute('data-city');
        var dist = selected.getAttribute('data-district');
        if (!prov || !city || !dist) return [];
        Object.keys(h).forEach(function(r) {
            h[r].forEach(function(sr) {
                sr.provinces.forEach(function(p) {
                    if (p.name !== prov) return;
                    p.cities.forEach(function(c) {
                        if (c.name !== city) return;
                        c.districts.forEach(function(d) {
                            if (d.name === dist) stores = stores.concat(d.stores);
                        });
                    });
                });
            });
        });
    }
    return stores.sort();
}

function refreshStoreList(tab) {
    var container = document.getElementById('storeList_' + tab);
    if (!container) return;

    var stores = getStoresForActiveLeaf(tab);
    if (stores.length === 0) {
        container.innerHTML = '<div class="store-list-hint">点击左侧' + (tab === 'byRegion' ? '小区' : '县区') + '查看门店</div>';
        return;
    }

    var html = '';
    if (!isSingleStoreSelection()) {
        html += '<div class="store-check-actions">';
        html += '<button onclick="checkAllStores(\'' + tab + '\', true)">全选</button>';
        html += '<button onclick="checkAllStores(\'' + tab + '\', false)">取消全选</button>';
        html += '</div>';
    }

    stores.forEach(function(s) {
        var checked = storeFilterState.selectedStores[s] ? ' checked' : '';
        html += '<label class="store-check-item"><input type="checkbox" value="' + s.replace(/"/g, '&quot;') + '" onchange="toggleStoreCheck(this)"' + checked + '>' + s + '</label>';
    });

    container.innerHTML = html;
}

function checkAllStores(tab, check) {
    var stores = getStoresForActiveLeaf(tab);
    if (isSingleStoreSelection()) return;
    stores.forEach(function(s) {
        if (check) storeFilterState.selectedStores[s] = true;
        else delete storeFilterState.selectedStores[s];
    });
    refreshStoreList(tab);
    updateStoreCount();
}

// ====== 模糊搜索门店 ======
var allStoreNames = null;
function getAllStoreNames() {
    if (allStoreNames) return allStoreNames;
    allStoreNames = [];
    var h = MOCK.hierarchy;
    if (!h) return allStoreNames;
    Object.keys(h).forEach(function(r) {
        h[r].forEach(function(sr) {
            sr.provinces.forEach(function(p) {
                p.cities.forEach(function(c) {
                    c.districts.forEach(function(d) {
                        d.stores.forEach(function(s) { allStoreNames.push(s); });
                    });
                });
            });
        });
    });
    allStoreNames.sort();
    return allStoreNames;
}

function searchStores(query) {
    var clearBtn = document.querySelector('.store-search-clear');
    var tabPanel = document.getElementById('storePanel_' + storeFilterState.activeTab);
    var searchPanel = document.getElementById('storePanel_search');

    if (!query || query.trim() === '') {
        if (clearBtn) clearBtn.style.display = 'none';
        if (searchPanel) searchPanel.style.display = 'none';
        // Restore tab panels
        ['byRegion', 'byLocation'].forEach(function(t) {
            var p = document.getElementById('storePanel_' + t);
            if (p && t === storeFilterState.activeTab) p.style.display = 'block';
            else if (p) p.style.display = 'none';
        });
        refreshStoreList(storeFilterState.activeTab);
        return;
    }

    if (clearBtn) clearBtn.style.display = 'flex';
    // Hide both tab panels, show search panel
    ['byRegion', 'byLocation'].forEach(function(t) {
        var p = document.getElementById('storePanel_' + t);
        if (p) p.style.display = 'none';
    });
    if (searchPanel) searchPanel.style.display = 'block';

    var q = query.trim().toLowerCase();
    var matches = getAllStoreNames().filter(function(s) { return s.toLowerCase().indexOf(q) !== -1; });

    var container = document.getElementById('storeList_search');
    if (!container) return;

    if (matches.length === 0) {
        container.innerHTML = '<div class="store-list-hint">未找到匹配的门店</div>';
        return;
    }

    var html = '<div class="store-check-actions">';
    if (!isSingleStoreSelection()) {
        html += '<button onclick="searchCheckAll(true)">全选结果</button>';
        html += '<button onclick="searchCheckAll(false)">取消全选</button>';
    }
    html += '<span style="font-size:12px;color:#94a3b8;margin-left:8px;">匹配 ' + matches.length + ' 家</span>';
    html += '</div>';

    matches.forEach(function(s) {
        var checked = storeFilterState.selectedStores[s] ? ' checked' : '';
        html += '<label class="store-check-item"><input type="checkbox" value="' + s.replace(/"/g, '&quot;') + '" onchange="toggleStoreCheck(this)"' + checked + '>' + s + '</label>';
    });

    container.innerHTML = html;
}

function searchCheckAll(check) {
    if (isSingleStoreSelection()) return;
    var container = document.getElementById('storeList_search');
    if (!container) return;
    container.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
        cb.checked = check;
        if (check) storeFilterState.selectedStores[cb.value] = true;
        else delete storeFilterState.selectedStores[cb.value];
    });
    updateStoreCount();
}

function clearSearch() {
    var input = document.querySelector('.store-filter-search input');
    if (input) input.value = '';
    searchStores('');
}

function toggleStoreCheck(cb) {
    if (cb.checked && isSingleStoreSelection()) {
        storeFilterState.selectedStores = {};
        storeFilterState.selectedStores[cb.value] = true;
        document.querySelectorAll('.store-check-list input[type="checkbox"]').forEach(function(input) {
            input.checked = input.value === cb.value;
        });
    } else if (cb.checked) storeFilterState.selectedStores[cb.value] = true;
    else delete storeFilterState.selectedStores[cb.value];
    updateStoreCount();
}

// ====== 选中计数 ======
function updateStoreCount() {
    var count = Object.keys(storeFilterState.selectedStores).length;
    var el = document.querySelector('.store-filter-count strong');
    if (el) el.textContent = count;
    updateTreeSelectAllButtons();
}

// ====== 重置 & 确认 ======
function resetStoreFilter() {
    storeFilterState.selectedStores = {};
    storeFilterState.selectionsByContext[storeFilterState.context] = {};
    document.querySelectorAll('.menu-tree-child.selected, .menu-tree-grandchild.selected').forEach(function(e) { e.classList.remove('selected'); });
    document.querySelectorAll('.store-check-list').forEach(function(c) {
        c.innerHTML = '<div class="store-list-hint">点击左侧查看门店</div>';
    });
    updateStoreCount();
    if (storeFilterState.trigger) {
        storeFilterState.trigger.querySelector('span').textContent = storeFilterState.context === 'top' ? '全部门店' : '请选择门店';
        storeFilterState.trigger.classList.remove('has-selection');
    }
    updateFirstTouchDealStoreState();
    document.getElementById('storeFilterOverlay').classList.remove('open');
}

function confirmStoreFilter() {
    var trigger = storeFilterState.trigger;
    var count = Object.keys(storeFilterState.selectedStores).length;
    storeFilterState.selectionsByContext[storeFilterState.context] = Object.assign({}, storeFilterState.selectedStores);
    if (trigger) {
        var span = trigger.querySelector('span');
        if (count > 0) {
            var names = Object.keys(storeFilterState.selectedStores);
            span.textContent = count > 1 ? ('已选 ' + count + ' 家门店') : names[0];
            trigger.classList.add('has-selection');
        } else {
            span.textContent = storeFilterState.context === 'top' ? '全部门店' : '请选择门店';
            trigger.classList.remove('has-selection');
        }
    }
    updateFirstTouchDealStoreState();
    document.getElementById('storeFilterOverlay').classList.remove('open');
}

function updateFirstTouchDealStoreState() {
    firstTouchDealStoreState.firstTouchStore = Object.keys(storeFilterState.selectionsByContext.firstTouch)[0] || '';
    firstTouchDealStoreState.dealStores = Object.assign({}, storeFilterState.selectionsByContext.deal);
    renderFirstTouchDealStorePlaceholder();
}

function resetFirstTouchDealStoreAnalysis() {
    storeFilterState.selectionsByContext.firstTouch = {};
    storeFilterState.selectionsByContext.deal = {};

    var firstTouchTrigger = document.querySelector('.store-analysis-trigger[data-store-filter-mode="firstTouch"]');
    var dealTrigger = document.querySelector('.store-analysis-trigger[data-store-filter-mode="deal"]');
    if (firstTouchTrigger) {
        firstTouchTrigger.querySelector('span').textContent = '请选择门店';
        firstTouchTrigger.classList.remove('has-selection');
    }
    if (dealTrigger) {
        dealTrigger.querySelector('span').textContent = '请选择门店';
        dealTrigger.classList.remove('has-selection');
    }
    updateFirstTouchDealStoreState();
    closeModal('firstTouchDealStoreModal');
}

function storeJourneyCount(firstStore, dealStore) {
    var source = firstStore + '|' + dealStore;
    var hash = 0;
    for (var i = 0; i < source.length; i += 1) hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
    return 80 + (hash % 421);
}

function renderFirstTouchDealStorePlaceholder() {
    var list = document.getElementById('firstTouchDealStoreList');
    if (!list) return;

    var firstStore = firstTouchDealStoreState.firstTouchStore;
    var dealStores = Object.keys(firstTouchDealStoreState.dealStores);
    var text = !firstStore || dealStores.length === 0 ? '请选择门店进行分析' : '筛选条件已更新，请点击查询';
    list.innerHTML = '<div style="padding:16px 0;text-align:center;font-size:12px;color:#94a3b8;">' + text + '</div>';
}

function queryFirstTouchDealStoreAnalysis() {
    var firstStore = firstTouchDealStoreState.firstTouchStore;
    var dealStores = Object.keys(firstTouchDealStoreState.dealStores);
    if (!firstStore || dealStores.length === 0) {
        showNotification('请选择首触专营店和成交专营店后再查询', 'info');
        return;
    }

    renderFirstTouchDealStoreResult();
    document.getElementById('firstTouchDealStoreModal').classList.add('active');
}

function renderFirstTouchDealStoreResult() {
    var content = document.getElementById('firstTouchDealStoreModalContent');
    if (!content) return;

    var firstStore = firstTouchDealStoreState.firstTouchStore;
    var dealStores = Object.keys(firstTouchDealStoreState.dealStores);
    var rows = dealStores.map(function(dealStore) {
        return { dealStore: dealStore, count: storeJourneyCount(firstStore, dealStore) };
    }).sort(function(a, b) { return b.count - a.count; });
    var maxCount = Math.max.apply(null, rows.map(function(row) { return row.count; }));
    var total = rows.reduce(function(sum, row) { return sum + row.count; }, 0);

    var rowsHtml = rows.map(function(row) {
        var width = Math.max(4, Math.round(row.count / maxCount * 100));
        var percent = pctStr(row.count, total);
        return '<div class="store-result-row">'
            + '<span class="store-result-path" title="' + firstStore + ' → ' + row.dealStore + '">' + firstStore + ' → ' + row.dealStore + '</span>'
            + '<div class="store-result-bar"><div class="store-result-bar-fill" style="width:' + width + '%;"></div></div>'
            + '<span class="store-result-value">' + row.count.toLocaleString() + ' 人 · ' + percent + '%</span>'
            + '</div>';
    }).join('');

    content.innerHTML = '<div class="store-result-summary">'
        + '<div class="store-result-summary-card store-result-summary-card-wide"><span class="store-result-summary-label">首触专营店</span><strong class="store-result-summary-value">' + firstStore + '</strong></div>'
        + '<div class="store-result-summary-card"><span class="store-result-summary-label">成交专营店</span><strong class="store-result-summary-value">' + dealStores.length + ' 家</strong></div>'
        + '<div class="store-result-summary-card"><span class="store-result-summary-label">统计用户数</span><strong class="store-result-summary-value">' + total.toLocaleString() + ' 人</strong></div>'
        + '</div>'
        + '<div class="store-result-list-card">'
        + '<div class="store-result-list-title"><strong>成交专营店统计</strong><span>共 ' + dealStores.length + ' 家</span></div>'
        + '<div class="store-result-list-header"><span>首触 → 成交专营店</span><span>用户数分布</span><span>用户数 / 占比</span></div>'
        + '<div class="store-result-list">' + rowsHtml + '</div>'
        + '</div>';
}

function initStoreFilters() {
    if (MOCK.hierarchy) {
        buildMenuTree('byRegion');
        buildMenuTree('byLocation');
        resetFirstTouchDealStoreAnalysis();
    }
}



function initDynamicRender() {
    renderKpiCards();
    renderLeadLevelPie();
}

// ============================================
// 渠道效果 - 异步下载明细数据
// ============================================
function downloadChannelEffectDetail() {
    var btn = document.getElementById('channelEffectDownloadBtn');
    if (!btn) return;

    // 设置加载状态
    btn.classList.add('loading');
    var iconEl = btn.querySelector('i');
    var spanEl = btn.querySelector('span');
    var originalIcon = iconEl.className;
    var originalText = spanEl.textContent;
    iconEl.className = 'fa-solid fa-spinner fa-spin';
    spanEl.textContent = '下载中...';

    // 恢复按钮状态的通用函数
    function restoreBtn() {
        btn.classList.remove('loading');
        iconEl.className = originalIcon;
        spanEl.textContent = originalText;
    }

    // 模拟异步接口请求（实际对接后端API时替换为 fetch 调用）
    simulateAsyncDownload(channelEffectDetailData)
        .then(function(csvContent) {
            var now = new Date();
            var timestamp = formatTimestamp(now);
            downloadFile(csvContent, '渠道效果明细_' + timestamp + '.csv', 'text/csv;charset=utf-8;');
        })
        .catch(function(err) {
            console.error('下载失败:', err);
            alert('下载失败，请稍后重试');
        })
        .finally(restoreBtn);
}

// 生成时间戳字符串 YYYYMMDD_HHmmss
function formatTimestamp(date) {
    var d = formatDate(date).replace(/-/g, '');
    return d + '_'
        + String(date.getHours()).padStart(2, '0')
        + String(date.getMinutes()).padStart(2, '0')
        + String(date.getSeconds()).padStart(2, '0');
}

// 通过 Blob 触发浏览器文件下载
function downloadFile(content, filename, mimeType) {
    var BOM = '﻿'; // BOM 确保 Excel 正确识别中文
    var blob = new Blob([BOM + content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 生成 CSV 内容
function generateCsv(data) {
    var parts = [];
    parts.push(data.headers.join(','));
    data.rows.forEach(function(row) {
        parts.push(row.map(function(cell) {
            return '"' + String(cell).replace(/"/g, '""') + '"';
        }).join(','));
    });
    return parts.join('\n');
}

// 模拟异步下载（实际对接后端时替换为 fetch 调用）
function simulateAsyncDownload(data) {
    return new Promise(function(resolve) {
        var delay = 800 + Math.random() * 1200;
        setTimeout(function() {
            resolve(generateCsv(data));
        }, delay);
    });
}

// 页面加载时调用（在原有初始化之后）
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        try { initStoreFilters(); } catch(e) { console.warn('Store filters init:', e.message); }
        try { initDynamicRender(); } catch(e) { console.warn('Plan B render:', e.message); }
    }, 50);
});
