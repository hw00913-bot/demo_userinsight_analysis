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
    });
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
    initDateRange();
    initFilterMultiSelects();
    initGlobalFilters();    // 分页内筛选器逻辑
    initCultivationScaledCharts();
    initProjectRankInteraction(); // 初始化大项目排名交互
    initScheduleRankInteraction(); // 初始化媒体质量排名交互
});

function parseUserCount(text) {
    const match = String(text || '').match(/([\d,]+)\s*人/);
    return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
}

function findCultivationCard(title) {
    const pane = document.getElementById('cultivation-op');
    if (!pane) return null;
    const cards = Array.from(pane.querySelectorAll('.content-card'));
    return cards.find(card => card.querySelector('.card-title')?.textContent.trim() === title) || null;
}

function scaleCultivationHorizontalBars(title) {
    const card = findCultivationCard(title);
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
    const card = findCultivationCard('渠道线索质量');
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
        '区域投放效果（TOP10城市）',
        '大区投放效果',
        '小区投放效果',
        '大项目线索质量排名（TOP10）',
        '媒体线索质量排名（TOP10）'
    ].forEach(scaleCultivationHorizontalBars);

    scaleCultivationVerticalChannelChart();
}

function updateFilterLevelText(multiSelect) {
    const checkedBoxes = multiSelect.querySelectorAll('.level-cb:checked');
    const allBoxes = multiSelect.querySelectorAll('.level-cb');
    const selectAll = multiSelect.querySelector('.select-all-levels');
    const text = multiSelect.querySelector('.lead-level-text');
    if (selectAll) selectAll.checked = checkedBoxes.length === allBoxes.length;
    if (text) {
        text.innerText = checkedBoxes.length === allBoxes.length
            ? `全选 (${allBoxes.length}项)`
            : `已选 ${checkedBoxes.length} 项`;
    }
}

function initFilterMultiSelects() {
    document.querySelectorAll('.custom-multi-select').forEach(multiSelect => {
        const header = multiSelect.querySelector('.select-header');
        const dropdown = multiSelect.querySelector('.select-dropdown');
        const selectAll = multiSelect.querySelector('.select-all-levels');

        header?.addEventListener('click', () => {
            document.querySelectorAll('.custom-multi-select .select-dropdown').forEach(panel => {
                if (panel !== dropdown) panel.style.display = 'none';
            });
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        selectAll?.addEventListener('change', () => {
            multiSelect.querySelectorAll('.level-cb').forEach(checkbox => {
                checkbox.checked = selectAll.checked;
            });
            updateFilterLevelText(multiSelect);
        });

        multiSelect.querySelectorAll('.level-cb').forEach(checkbox => {
            checkbox.addEventListener('change', () => updateFilterLevelText(multiSelect));
        });
    });

    document.addEventListener('click', e => {
        if (e.target.closest('.custom-multi-select')) return;
        document.querySelectorAll('.custom-multi-select .select-dropdown').forEach(dropdown => {
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

    const shortcuts = filterSection.querySelector('.date-shortcuts');
    const customInputs = filterSection.querySelector('.date-custom-inputs');
    const dateRangeGroup = filterSection.querySelector('.date-range-group');
    const defaultRange = dateRangeGroup?.dataset.defaultRange || '7';
    if (shortcuts) {
        shortcuts.querySelectorAll('.shortcut-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.range === defaultRange);
        });
    }
    if (customInputs) customInputs.style.display = 'none';

    const startInput = filterSection.querySelector('.date-custom-start');
    const endInput = filterSection.querySelector('.date-custom-end');
    if (startInput && endInput) {
        const today = new Date();
        const start = new Date();
        start.setDate(today.getDate() - (parseInt(defaultRange, 10) || 7));
        startInput.value = formatDate(start);
        endInput.value = formatDate(today);
    }
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
    const channelPanel = document.getElementById('touchMediaPanel_channel');
    const mediaPanel = document.getElementById('touchMediaPanel_media');
    const channelTab = document.getElementById('touchMediaTab_channel');
    const mediaTab = document.getElementById('touchMediaTab_media');
    if (tab === 'channel') {
        channelPanel.style.display = '';
        mediaPanel.style.display = 'none';
        channelTab.style.color = '#2563eb';
        channelTab.style.borderBottom = '2px solid #2563eb';
        mediaTab.style.color = '#94a3b8';
        mediaTab.style.borderBottom = '2px solid transparent';
    } else {
        channelPanel.style.display = 'none';
        mediaPanel.style.display = '';
        mediaTab.style.color = '#2563eb';
        mediaTab.style.borderBottom = '2px solid #2563eb';
        channelTab.style.color = '#94a3b8';
        channelTab.style.borderBottom = '2px solid transparent';
    }
}

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
            const baseMap = { hab: 12345, arrival: 12345, testdrive: 5185, order: 2345 };
            const base = baseMap[metric] || 12345;
            let html = '';
            data.forEach((item, index) => {
                const rankClass = index < 3 ? 'top3' : '';
                const pct = parseFloat(item.val);
                const count = Math.round(pct * base / 100);

                let barHtml = '';
                if (metric === 'hab') {
                    const hCount = Math.round(item.h * base / 100);
                    const aCount = Math.round(item.a * base / 100);
                    const bCount = Math.round(item.b * base / 100);
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg h" style="width: ${item.h}%;" title="H: ${hCount}人"></div>
                            <div class="ce-h-seg a" style="width: ${item.a}%;" title="A: ${aCount}人"></div>
                            <div class="ce-h-seg b" style="width: ${item.b}%;" title="B: ${bCount}人"></div>
                            <div class="ce-h-seg other" style="width: ${item.other}%;"></div>
                        </div>
                    `;
                    barHtml += `<span class="ce-h-total">${labelText}: ${item.val} (${count.toLocaleString()}人)</span>`;
                } else {
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg a" style="width: ${item.val};"></div>
                        </div>
                    `;
                    barHtml += `<span class="ce-h-total">${labelText}: ${item.val} (${count.toLocaleString()}人)</span>`;
                }

                html += `
                    <div class="ce-h-bar-item ${item.projectCode ? 'project-bar-item' : ''}" ${item.projectCode ? `data-project="${item.projectCode}"` : ''}>
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

// 媒体质量排名切换交互逻辑
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
            const baseMap = { hab: 12345, arrival: 12345, testdrive: 5185, order: 2345 };
            const base = baseMap[metric] || 12345;
            let html = '';
            data.forEach((item, index) => {
                const rankClass = index < 3 ? 'top3' : '';
                const pct = parseFloat(item.val);
                const count = Math.round(pct * base / 100);

                let barHtml = '';
                if (metric === 'hab') {
                    const hCount = Math.round(item.h * base / 100);
                    const aCount = Math.round(item.a * base / 100);
                    const bCount = Math.round(item.b * base / 100);
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg h" style="width: ${item.h}%;" title="H: ${hCount}人"></div>
                            <div class="ce-h-seg a" style="width: ${item.a}%;" title="A: ${aCount}人"></div>
                            <div class="ce-h-seg b" style="width: ${item.b}%;" title="B: ${bCount}人"></div>
                            <div class="ce-h-seg other" style="width: ${item.other}%;"></div>
                        </div>
                    `;
                    barHtml += `<span class="ce-h-total">${labelText}: ${item.val} (${count.toLocaleString()}人)</span>`;
                } else {
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg a" style="width: ${item.val};"></div>
                        </div>
                    `;
                    barHtml += `<span class="ce-h-total">${labelText}: ${item.val} (${count.toLocaleString()}人)</span>`;
                }

                html += `
                    <div class="ce-h-bar-item ${item.scheduleCode ? 'project-bar-item' : ''}" ${item.scheduleCode ? `data-schedule="${item.scheduleCode}"` : ''}>
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
    { rank: 1, type: '无法建联', reason: '无人接听', count: 1245, percent: '10.1%', trend: 'up', trendVal: '1.2%' },
    { rank: 2, type: '无法建联', reason: '无法接通', count: 952, percent: '7.7%', trend: 'down', trendVal: '0.5%' },
    { rank: 3, type: '无法建联', reason: '接通后挂断', count: 880, percent: '7.1%', trend: 'up', trendVal: '2.4%' },
    { rank: 4, type: '有效号码', reason: '确认有购车意向', count: 720, percent: '5.8%', trend: 'none', trendVal: '0%' },
    { rank: 5, type: '无效号码', reason: '空号', count: 680, percent: '5.5%', trend: 'down', trendVal: '1.8%' },
    { rank: 6, type: '无法建联', reason: '忙线（占线）', count: 550, percent: '4.5%', trend: 'up', trendVal: '0.3%' },
    { rank: 7, type: '无法建联', reason: '休眠失联', count: 520, percent: '4.2%', trend: 'down', trendVal: '0.9%' },
    { rank: 8, type: '无法建联', reason: '处于考虑/纠结期', count: 480, percent: '3.9%', trend: 'up', trendVal: '0.1%' },
    { rank: 9, type: '有效号码', reason: '已购车', count: 420, percent: '3.4%', trend: 'none', trendVal: '0%' },
    { rank: 10, type: '无效号码', reason: '黑名单过滤', count: 320, percent: '2.6%', trend: 'up', trendVal: '0.4%' },
    { rank: 11, type: '无效号码', reason: '停机', count: 280, percent: '2.3%', trend: 'down', trendVal: '0.2%' },
    { rank: 12, type: '无效号码', reason: '线路拦截', count: 260, percent: '2.1%', trend: 'none', trendVal: '0%' },
    { rank: 13, type: '无效号码', reason: '秘书台号码', count: 240, percent: '1.9%', trend: 'up', trendVal: '0.1%' },
    { rank: 14, type: '无效号码', reason: '语音信箱号', count: 220, percent: '1.8%', trend: 'down', trendVal: '0.4%' },
    { rank: 15, type: '无效号码', reason: '手机助理号码', count: 210, percent: '1.7%', trend: 'none', trendVal: '0%' },
    { rank: 16, type: '无法建联', reason: '休眠未购', count: 198, percent: '1.6%', trend: 'up', trendVal: '0.2%' },
    { rank: 17, type: '无法建联', reason: '信号差/无有效交互', count: 186, percent: '1.5%', trend: 'down', trendVal: '0.3%' },
    { rank: 18, type: '无法建联', reason: '正在开车/忙碌', count: 174, percent: '1.4%', trend: 'none', trendVal: '0%' },
    { rank: 19, type: '无法建联', reason: '其他琐碎沟通/未触达核心', count: 162, percent: '1.3%', trend: 'up', trendVal: '0.1%' },
    { rank: 20, type: '无法建联', reason: '转秘书台', count: 150, percent: '1.2%', trend: 'down', trendVal: '0.2%' },
    { rank: 21, type: '无法建联', reason: '语音信箱', count: 138, percent: '1.1%', trend: 'none', trendVal: '0%' },
    { rank: 22, type: '无法建联', reason: '手机助理', count: 126, percent: '1.0%', trend: 'up', trendVal: '0.1%' },
    { rank: 23, type: '有效号码', reason: '强烈抗议', count: 114, percent: '0.9%', trend: 'down', trendVal: '0.1%' },
    { rank: 24, type: '有效号码', reason: '购车意愿明确', count: 102, percent: '0.8%', trend: 'none', trendVal: '0%' },
    { rank: 25, type: '有效号码', reason: '购车意愿不明确', count: 96, percent: '0.8%', trend: 'up', trendVal: '0.1%' },
    { rank: 26, type: '有效号码', reason: '意向不明', count: 88, percent: '0.7%', trend: 'down', trendVal: '0.1%' },
    { rank: 27, type: '无法建联', reason: '关机', count: 76, percent: '0.6%', trend: 'none', trendVal: '0%' },
    { rank: 28, type: '无法建联', reason: '不在服务区', count: 64, percent: '0.5%', trend: 'up', trendVal: '0.1%' },
    { rank: 29, type: '无法建联', reason: '拒接', count: 52, percent: '0.4%', trend: 'down', trendVal: '0.1%' },
    { rank: 30, type: '无法建联', reason: '欠费', count: 40, percent: '0.3%', trend: 'none', trendVal: '0%' }
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

const areaDeliveryFullData = [
    { rank: 1, area: '上海一区', count: 2180, h: 20, a: 23, b: 24, other: 33 },
    { rank: 2, area: '广州一区', count: 1870, h: 16, a: 21, b: 23, other: 40 },
    { rank: 3, area: '北京一区', count: 1610, h: 14, a: 18, b: 21, other: 47 },
    { rank: 4, area: '成都一区', count: 1260, h: 10, a: 15, b: 20, other: 55 },
    { rank: 5, area: '上海二区', count: 1180, h: 9, a: 14, b: 19, other: 58 },
    { rank: 6, area: '深圳一区', count: 1060, h: 8, a: 13, b: 18, other: 61 },
    { rank: 7, area: '广州二区', count: 960, h: 8, a: 12, b: 17, other: 63 },
    { rank: 8, area: '武汉一区', count: 850, h: 7, a: 11, b: 16, other: 66 },
    { rank: 9, area: '西安一区', count: 740, h: 6, a: 10, b: 15, other: 69 },
    { rank: 10, area: '深圳二区', count: 680, h: 6, a: 9, b: 14, other: 71 },
    { rank: 11, area: '重庆一区', count: 620, h: 5, a: 9, b: 13, other: 73 },
    { rank: 12, area: '南京一区', count: 580, h: 5, a: 8, b: 12, other: 75 },
    { rank: 13, area: '杭州一区', count: 540, h: 4, a: 8, b: 12, other: 76 },
    { rank: 14, area: '苏州一区', count: 500, h: 4, a: 7, b: 11, other: 78 },
    { rank: 15, area: '郑州一区', count: 460, h: 4, a: 7, b: 10, other: 79 }
];

const channelOverlapFullData = {
    channelOverlap5plus: {
        title: '渠道留资重合度分析：5 个以上',
        rows: [
            { rank: 1, media: 'R1 + R2 + R4 + R6 + R8 + R10', unionCount: 2860, overlapCount: 42, overlapRate: '1.5%' },
            { rank: 2, media: 'R1 + R3 + R4 + R7 + R9 + R11', unionCount: 2540, overlapCount: 34, overlapRate: '1.3%' },
            { rank: 3, media: 'R2 + R3 + R5 + R6 + R8', unionCount: 2380, overlapCount: 31, overlapRate: '1.3%' },
            { rank: 4, media: 'R1 + R4 + R5 + R8 + R10', unionCount: 2200, overlapCount: 25, overlapRate: '1.1%' },
            { rank: 5, media: 'R3 + R4 + R6 + R9 + R11', unionCount: 2050, overlapCount: 19, overlapRate: '0.9%' },
            { rank: 6, media: 'R2 + R5 + R7 + R8 + R10 + R11', unionCount: 1960, overlapCount: 16, overlapRate: '0.8%' },
            { rank: 7, media: 'R1 + R3 + R6 + R7 + R10', unionCount: 1820, overlapCount: 14, overlapRate: '0.8%' },
            { rank: 8, media: 'R4 + R5 + R8 + R9 + R10 + R11', unionCount: 1680, overlapCount: 12, overlapRate: '0.7%' },
            { rank: 9, media: 'R1 + R2 + R6 + R7 + R9', unionCount: 1520, overlapCount: 10, overlapRate: '0.7%' },
            { rank: 10, media: 'R3 + R5 + R7 + R8 + R11', unionCount: 1360, overlapCount: 8, overlapRate: '0.6%' }
        ]
    },
    channelOverlap5: {
        title: '渠道留资重合度分析：5个',
        rows: [
            { rank: 1, media: 'R1 + R2 + R4 + R6 + R8', unionCount: 2420, overlapCount: 68, overlapRate: '2.8%' },
            { rank: 2, media: 'R2 + R3 + R5 + R7 + R9', unionCount: 2260, overlapCount: 56, overlapRate: '2.5%' },
            { rank: 3, media: 'R1 + R4 + R6 + R8 + R10', unionCount: 2100, overlapCount: 48, overlapRate: '2.3%' },
            { rank: 4, media: 'R3 + R5 + R6 + R9 + R11', unionCount: 1980, overlapCount: 39, overlapRate: '2.0%' },
            { rank: 5, media: 'R1 + R2 + R7 + R8 + R11', unionCount: 1840, overlapCount: 32, overlapRate: '1.7%' },
            { rank: 6, media: 'R2 + R4 + R5 + R9 + R10', unionCount: 1720, overlapCount: 26, overlapRate: '1.5%' },
            { rank: 7, media: 'R1 + R3 + R6 + R7 + R10', unionCount: 1580, overlapCount: 22, overlapRate: '1.4%' },
            { rank: 8, media: 'R4 + R6 + R8 + R9 + R11', unionCount: 1460, overlapCount: 18, overlapRate: '1.2%' },
            { rank: 9, media: 'R1 + R5 + R7 + R10 + R11', unionCount: 1320, overlapCount: 14, overlapRate: '1.1%' },
            { rank: 10, media: 'R2 + R3 + R8 + R9 + R10', unionCount: 1200, overlapCount: 10, overlapRate: '0.8%' }
        ]
    },
    channelOverlap4: {
        title: '渠道留资重合度分析：4 个',
        rows: [
            { rank: 1, media: 'R1 + R2 + R4 + R6', unionCount: 2180, overlapCount: 126, overlapRate: '5.8%' },
            { rank: 2, media: 'R2 + R3 + R5 + R8', unionCount: 2020, overlapCount: 104, overlapRate: '5.1%' },
            { rank: 3, media: 'R1 + R4 + R7 + R9', unionCount: 1860, overlapCount: 82, overlapRate: '4.4%' },
            { rank: 4, media: 'R3 + R6 + R8 + R10', unionCount: 1720, overlapCount: 66, overlapRate: '3.8%' },
            { rank: 5, media: 'R5 + R7 + R9 + R11', unionCount: 1600, overlapCount: 54, overlapRate: '3.4%' },
            { rank: 6, media: 'R1 + R2 + R3 + R5', unionCount: 1480, overlapCount: 44, overlapRate: '3.0%' },
            { rank: 7, media: 'R4 + R6 + R9 + R10', unionCount: 1360, overlapCount: 36, overlapRate: '2.6%' },
            { rank: 8, media: 'R2 + R7 + R8 + R11', unionCount: 1240, overlapCount: 28, overlapRate: '2.3%' },
            { rank: 9, media: 'R1 + R5 + R6 + R10', unionCount: 1120, overlapCount: 20, overlapRate: '1.8%' },
            { rank: 10, media: 'R3 + R4 + R8 + R9', unionCount: 980, overlapCount: 14, overlapRate: '1.4%' }
        ]
    },
    channelOverlap3: {
        title: '渠道留资重合度分析：3 个',
        rows: [
            { rank: 1, media: 'R1 + R2 + R4', unionCount: 1960, overlapCount: 196, overlapRate: '10.0%' },
            { rank: 2, media: 'R2 + R3 + R6', unionCount: 1780, overlapCount: 154, overlapRate: '8.7%' },
            { rank: 3, media: 'R1 + R5 + R8', unionCount: 1620, overlapCount: 128, overlapRate: '7.9%' },
            { rank: 4, media: 'R4 + R7 + R9', unionCount: 1460, overlapCount: 92, overlapRate: '6.3%' },
            { rank: 5, media: 'R6 + R10 + R11', unionCount: 1320, overlapCount: 70, overlapRate: '5.3%' },
            { rank: 6, media: 'R1 + R3 + R8', unionCount: 1200, overlapCount: 56, overlapRate: '4.7%' },
            { rank: 7, media: 'R2 + R5 + R9', unionCount: 1080, overlapCount: 44, overlapRate: '4.1%' },
            { rank: 8, media: 'R3 + R7 + R10', unionCount: 960, overlapCount: 34, overlapRate: '3.5%' },
            { rank: 9, media: 'R4 + R6 + R11', unionCount: 840, overlapCount: 24, overlapRate: '2.9%' },
            { rank: 10, media: 'R5 + R8 + R9', unionCount: 720, overlapCount: 16, overlapRate: '2.2%' }
        ]
    },
    channelOverlap2: {
        title: '渠道留资重合度分析：2 个',
        rows: [
            { rank: 1, media: 'R4 + R1', unionCount: 1680, overlapCount: 180, overlapRate: '10.7%' },
            { rank: 2, media: 'R2 + R1', unionCount: 1500, overlapCount: 128, overlapRate: '8.5%' },
            { rank: 3, media: 'R1 + R3', unionCount: 1320, overlapCount: 92, overlapRate: '7.0%' },
            { rank: 4, media: 'R6 + R2', unionCount: 1160, overlapCount: 68, overlapRate: '5.9%' },
            { rank: 5, media: 'R3 + R4', unionCount: 1020, overlapCount: 56, overlapRate: '5.5%' },
            { rank: 6, media: 'R1 + R5', unionCount: 920, overlapCount: 42, overlapRate: '4.6%' },
            { rank: 7, media: 'R2 + R3', unionCount: 860, overlapCount: 38, overlapRate: '4.4%' },
            { rank: 8, media: 'R7 + R1', unionCount: 780, overlapCount: 28, overlapRate: '3.6%' },
            { rank: 9, media: 'R8 + R2', unionCount: 640, overlapCount: 18, overlapRate: '2.8%' },
            { rank: 10, media: 'R4 + R9', unionCount: 520, overlapCount: 12, overlapRate: '2.3%' }
        ]
    },
    channelOverlap1: {
        title: '渠道留资重合度分析：仅 1 个',
        rows: [
            { rank: 1, media: 'R1', unionCount: 2460, overlapCount: 2460, overlapRate: '100%' },
            { rank: 2, media: 'R2', unionCount: 2180, overlapCount: 2180, overlapRate: '100%' },
            { rank: 3, media: 'R4', unionCount: 1920, overlapCount: 1920, overlapRate: '100%' },
            { rank: 4, media: 'R3', unionCount: 1680, overlapCount: 1680, overlapRate: '100%' },
            { rank: 5, media: 'R5', unionCount: 1420, overlapCount: 1420, overlapRate: '100%' },
            { rank: 6, media: 'R6', unionCount: 1180, overlapCount: 1180, overlapRate: '100%' },
            { rank: 7, media: 'R7', unionCount: 920, overlapCount: 920, overlapRate: '100%' },
            { rank: 8, media: 'R8', unionCount: 680, overlapCount: 680, overlapRate: '100%' },
            { rank: 9, media: 'R9', unionCount: 460, overlapCount: 460, overlapRate: '100%' },
            { rank: 10, media: 'R10', unionCount: 320, overlapCount: 320, overlapRate: '100%' }
        ]
    }
};

const mediaOverlapFullData = {
    mediaOverlap5plus: {
        title: '媒体留资重合度分析：5 个以上',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝 + 百度 + 快手 + 小红书 + 头条', unionCount: 3200, overlapCount: 38, overlapRate: '1.2%' },
            { rank: 2, media: '抖音 + 懂车帝 + 快手 + 朋友圈 + B站', unionCount: 2860, overlapCount: 28, overlapRate: '1.0%' },
            { rank: 3, media: '百度 + 快手 + 小红书 + 头条 + 优酷', unionCount: 2540, overlapCount: 22, overlapRate: '0.9%' },
            { rank: 4, media: '抖音 + 小红书 + 朋友圈 + 头条 + 知乎', unionCount: 2380, overlapCount: 16, overlapRate: '0.7%' },
            { rank: 5, media: '懂车帝 + 百度 + 快手 + 优酷 + B站', unionCount: 2200, overlapCount: 12, overlapRate: '0.5%' },
            { rank: 6, media: '抖音 + 懂车帝 + 百度 + 朋友圈 + 头条 + B站', unionCount: 2080, overlapCount: 10, overlapRate: '0.5%' },
            { rank: 7, media: '快手 + 小红书 + 朋友圈 + 优酷 + 知乎', unionCount: 1920, overlapCount: 8, overlapRate: '0.4%' },
            { rank: 8, media: '抖音 + 百度 + 头条 + 优酷 + B站 + 知乎', unionCount: 1780, overlapCount: 6, overlapRate: '0.3%' },
            { rank: 9, media: '懂车帝 + 快手 + 小红书 + 头条 + 朋友圈', unionCount: 1640, overlapCount: 5, overlapRate: '0.3%' },
            { rank: 10, media: '百度 + 朋友圈 + 头条 + 优酷 + 知乎 + B站', unionCount: 1500, overlapCount: 4, overlapRate: '0.3%' }
        ]
    },
    mediaOverlap5: {
        title: '媒体留资重合度分析：5个',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝 + 百度 + 快手 + 小红书', unionCount: 2860, overlapCount: 56, overlapRate: '2.0%' },
            { rank: 2, media: '懂车帝 + 百度 + 快手 + 朋友圈 + 头条', unionCount: 2600, overlapCount: 46, overlapRate: '1.8%' },
            { rank: 3, media: '抖音 + 百度 + 小红书 + 头条 + 优酷', unionCount: 2400, overlapCount: 38, overlapRate: '1.6%' },
            { rank: 4, media: '懂车帝 + 快手 + 小红书 + 朋友圈 + B站', unionCount: 2200, overlapCount: 30, overlapRate: '1.4%' },
            { rank: 5, media: '抖音 + 百度 + 快手 + 优酷 + 知乎', unionCount: 2000, overlapCount: 22, overlapRate: '1.1%' },
            { rank: 6, media: '小红书 + 朋友圈 + 头条 + 优酷 + B站', unionCount: 1860, overlapCount: 18, overlapRate: '1.0%' },
            { rank: 7, media: '抖音 + 懂车帝 + 朋友圈 + 优酷 + 知乎', unionCount: 1720, overlapCount: 14, overlapRate: '0.8%' },
            { rank: 8, media: '百度 + 快手 + 头条 + 优酷 + B站', unionCount: 1580, overlapCount: 10, overlapRate: '0.6%' },
            { rank: 9, media: '懂车帝 + 小红书 + 朋友圈 + 头条 + 知乎', unionCount: 1440, overlapCount: 8, overlapRate: '0.6%' },
            { rank: 10, media: '抖音 + 快手 + 朋友圈 + B站 + 知乎', unionCount: 1300, overlapCount: 6, overlapRate: '0.5%' }
        ]
    },
    mediaOverlap4: {
        title: '媒体留资重合度分析：4 个',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝 + 百度 + 快手', unionCount: 2460, overlapCount: 108, overlapRate: '4.4%' },
            { rank: 2, media: '懂车帝 + 百度 + 快手 + 小红书', unionCount: 2280, overlapCount: 88, overlapRate: '3.9%' },
            { rank: 3, media: '抖音 + 百度 + 小红书 + 头条', unionCount: 2100, overlapCount: 72, overlapRate: '3.4%' },
            { rank: 4, media: '懂车帝 + 快手 + 朋友圈 + 头条', unionCount: 1920, overlapCount: 58, overlapRate: '3.0%' },
            { rank: 5, media: '抖音 + 快手 + 小红书 + 优酷', unionCount: 1780, overlapCount: 44, overlapRate: '2.5%' },
            { rank: 6, media: '百度 + 朋友圈 + 头条 + 优酷', unionCount: 1620, overlapCount: 34, overlapRate: '2.1%' },
            { rank: 7, media: '懂车帝 + 小红书 + B站 + 知乎', unionCount: 1480, overlapCount: 26, overlapRate: '1.8%' },
            { rank: 8, media: '抖音 + 朋友圈 + 优酷 + 知乎', unionCount: 1340, overlapCount: 18, overlapRate: '1.3%' },
            { rank: 9, media: '快手 + 小红书 + 头条 + B站', unionCount: 1200, overlapCount: 12, overlapRate: '1.0%' },
            { rank: 10, media: '百度 + 快手 + 朋友圈 + 知乎', unionCount: 1060, overlapCount: 8, overlapRate: '0.8%' }
        ]
    },
    mediaOverlap3: {
        title: '媒体留资重合度分析：3 个',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝 + 百度', unionCount: 2200, overlapCount: 176, overlapRate: '8.0%' },
            { rank: 2, media: '懂车帝 + 百度 + 快手', unionCount: 1960, overlapCount: 142, overlapRate: '7.2%' },
            { rank: 3, media: '抖音 + 小红书 + 头条', unionCount: 1780, overlapCount: 116, overlapRate: '6.5%' },
            { rank: 4, media: '百度 + 快手 + 朋友圈', unionCount: 1600, overlapCount: 86, overlapRate: '5.4%' },
            { rank: 5, media: '懂车帝 + 优酷 + B站', unionCount: 1420, overlapCount: 64, overlapRate: '4.5%' },
            { rank: 6, media: '抖音 + 快手 + 小红书', unionCount: 1280, overlapCount: 48, overlapRate: '3.8%' },
            { rank: 7, media: '百度 + 朋友圈 + 头条', unionCount: 1140, overlapCount: 38, overlapRate: '3.3%' },
            { rank: 8, media: '小红书 + 优酷 + 知乎', unionCount: 1000, overlapCount: 28, overlapRate: '2.8%' },
            { rank: 9, media: '抖音 + 朋友圈 + B站', unionCount: 880, overlapCount: 18, overlapRate: '2.0%' },
            { rank: 10, media: '快手 + 头条 + 知乎', unionCount: 760, overlapCount: 12, overlapRate: '1.6%' }
        ]
    },
    mediaOverlap2: {
        title: '媒体留资重合度分析：2 个',
        rows: [
            { rank: 1, media: '抖音 + 懂车帝', unionCount: 1880, overlapCount: 168, overlapRate: '8.9%' },
            { rank: 2, media: '懂车帝 + 百度', unionCount: 1640, overlapCount: 120, overlapRate: '7.3%' },
            { rank: 3, media: '抖音 + 百度', unionCount: 1500, overlapCount: 90, overlapRate: '6.0%' },
            { rank: 4, media: '快手 + 抖音', unionCount: 1280, overlapCount: 62, overlapRate: '4.8%' },
            { rank: 5, media: '小红书 + 懂车帝', unionCount: 1100, overlapCount: 46, overlapRate: '4.2%' },
            { rank: 6, media: '百度 + 快手', unionCount: 960, overlapCount: 34, overlapRate: '3.5%' },
            { rank: 7, media: '抖音 + 小红书', unionCount: 840, overlapCount: 26, overlapRate: '3.1%' },
            { rank: 8, media: '朋友圈 + 懂车帝', unionCount: 720, overlapCount: 18, overlapRate: '2.5%' },
            { rank: 9, media: '头条 + 百度', unionCount: 600, overlapCount: 12, overlapRate: '2.0%' },
            { rank: 10, media: '优酷 + 抖音', unionCount: 480, overlapCount: 8, overlapRate: '1.7%' }
        ]
    },
    mediaOverlap1: {
        title: '媒体留资重合度分析：仅 1 个',
        rows: [
            { rank: 1, media: '抖音', unionCount: 3120, overlapCount: 3120, overlapRate: '100%' },
            { rank: 2, media: '懂车帝', unionCount: 2540, overlapCount: 2540, overlapRate: '100%' },
            { rank: 3, media: '百度', unionCount: 1960, overlapCount: 1960, overlapRate: '100%' },
            { rank: 4, media: '快手', unionCount: 1480, overlapCount: 1480, overlapRate: '100%' },
            { rank: 5, media: '小红书', unionCount: 1120, overlapCount: 1120, overlapRate: '100%' },
            { rank: 6, media: '朋友圈', unionCount: 820, overlapCount: 820, overlapRate: '100%' },
            { rank: 7, media: '头条', unionCount: 580, overlapCount: 580, overlapRate: '100%' },
            { rank: 8, media: '优酷', unionCount: 380, overlapCount: 380, overlapRate: '100%' },
            { rank: 9, media: '知乎', unionCount: 240, overlapCount: 240, overlapRate: '100%' },
            { rank: 10, media: 'B站', unionCount: 160, overlapCount: 160, overlapRate: '100%' }
        ]
    }
};

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
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td><span class="status-tag" style="${getQualityTypeStyle(item.type)}">${item.type}</span></td>
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
    } else if (type === 'areaDelivery') {
        title.innerText = '小区投放效果全量';
        modal.querySelector('.drawer-body').style.padding = '0 60px';
        thead.innerHTML = `
            <tr>
                <th style="width: 60px; text-align: center;">排名</th>
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
    } else if (channelOverlapFullData[type]) {
        const overlap = channelOverlapFullData[type];
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
    } else if (mediaOverlapFullData[type]) {
        const overlap = mediaOverlapFullData[type];
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
        const storeFullData = {
            assignedStore: [
                { rank:1, name:'上海东风南方', count:1980, percent:'16.0%' },
                { rank:2, name:'广州天河', count:1520, percent:'12.3%' },
                { rank:3, name:'深圳南山', count:1080, percent:'8.7%' },
                { rank:4, name:'北京朝阳', count:940, percent:'7.6%' },
                { rank:5, name:'武汉光谷', count:820, percent:'6.6%' },
                { rank:6, name:'成都锦江', count:700, percent:'5.7%' },
                { rank:7, name:'杭州西湖', count:610, percent:'4.9%' },
                { rank:8, name:'南京鼓楼', count:520, percent:'4.2%' },
                { rank:9, name:'重庆渝北', count:430, percent:'3.5%' },
                { rank:10, name:'苏州工业园', count:360, percent:'2.9%' },
                { rank:11, name:'长沙岳麓', count:310, percent:'2.5%' },
                { rank:12, name:'天津河西', count:270, percent:'2.2%' },
                { rank:13, name:'西安雁塔', count:240, percent:'1.9%' },
                { rank:14, name:'郑州金水', count:210, percent:'1.7%' },
                { rank:15, name:'合肥蜀山', count:185, percent:'1.5%' }
            ],
            dealStore: [
                { rank:1, name:'上海东风南方', count:520, percent:'22.0%' },
                { rank:2, name:'北京朝阳', count:430, percent:'18.0%' },
                { rank:3, name:'广州天河', count:360, percent:'15.0%' },
                { rank:4, name:'深圳南山', count:280, percent:'12.0%' },
                { rank:5, name:'成都锦江', count:220, percent:'9.0%' },
                { rank:6, name:'武汉光谷', count:180, percent:'7.5%' },
                { rank:7, name:'杭州西湖', count:140, percent:'6.0%' },
                { rank:8, name:'重庆渝北', count:105, percent:'4.4%' },
                { rank:9, name:'南京鼓楼', count:72, percent:'3.0%' },
                { rank:10, name:'苏州工业园', count:50, percent:'2.1%' }
            ],
            firstTouchDealStore: [
                { rank:1, name:'上海东风南方', count:420, percent:'18.0%' },
                { rank:2, name:'广州天河', count:320, percent:'14.0%' },
                { rank:3, name:'北京朝阳', count:260, percent:'11.0%' },
                { rank:4, name:'深圳南山', count:220, percent:'9.5%' },
                { rank:5, name:'成都锦江', count:180, percent:'7.7%' },
                { rank:6, name:'武汉光谷', count:140, percent:'6.0%' },
                { rank:7, name:'杭州西湖', count:110, percent:'4.7%' },
                { rank:8, name:'重庆渝北', count:88, percent:'3.8%' },
                { rank:9, name:'南京鼓楼', count:65, percent:'2.8%' },
                { rank:10, name:'苏州工业园', count:48, percent:'2.1%' }
            ],
            reachStore: [
                { rank:1, name:'上海东风南方', count:2340, percent:'19.0%' },
                { rank:2, name:'广州天河', count:1860, percent:'15.0%' },
                { rank:3, name:'深圳南山', count:1480, percent:'12.0%' },
                { rank:4, name:'北京朝阳', count:1260, percent:'10.0%' },
                { rank:5, name:'成都锦江', count:1100, percent:'9.0%' },
                { rank:6, name:'武汉光谷', count:920, percent:'7.5%' },
                { rank:7, name:'杭州西湖', count:760, percent:'6.2%' },
                { rank:8, name:'重庆渝北', count:590, percent:'4.8%' },
                { rank:9, name:'南京鼓楼', count:460, percent:'3.7%' },
                { rank:10, name:'苏州工业园', count:350, percent:'2.8%' },
                { rank:11, name:'长沙岳麓', count:280, percent:'2.3%' },
                { rank:12, name:'天津河西', count:230, percent:'1.9%' },
                { rank:13, name:'西安雁塔', count:195, percent:'1.6%' },
                { rank:14, name:'郑州金水', count:160, percent:'1.3%' },
                { rank:15, name:'合肥蜀山', count:130, percent:'1.1%' }
            ]
        };
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

function closeRankingModal() {
    document.getElementById('rankingModal').classList.remove('active');
}

function getQualityTypeStyle(type) {
    const styles = {
        '无效号码': 'background: #f3f4f6; color: #374151; border: none;',
        '无法建联': 'background: #eff6ff; color: #1e40af; border: none;',
        '有效号码': 'background: #f0fdf4; color: #166534; border: none;'
    };
    return styles[type] || 'background: #f1f5f9; color: #475569; border: none;';
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
    // 关闭媒体质量下钻抽屉
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
// 媒体质量下钻数据
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
 * 关闭媒体质量下钻抽屉
 */
function closeScheduleDrillModal() {
    const modal = document.getElementById('scheduleDrillModal');
    if (modal) {
        modal.classList.remove('active');
    }
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
