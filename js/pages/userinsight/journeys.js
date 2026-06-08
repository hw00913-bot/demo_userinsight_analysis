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
                <span style="width:76px;text-align:right;font-size:11px;color:#64748b;">${row.count.toLocaleString()}条 · ${row.percent}%</span>
            </div>
        `;
    }).join('');
    enhanceTouchHabitDeliveryMetrics();
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
                <span style="width:76px;text-align:right;font-size:11px;color:#64748b;">${row.count.toLocaleString()}条 · ${row.percent}%</span>
            </div>
        `;
    }).join('');
    enhanceTouchHabitDeliveryMetrics();
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
                            <div class="ce-h-seg h" style="width: ${hW}%;" title="H: ${hCount}条"></div>
                            <div class="ce-h-seg a" style="width: ${aW}%;" title="A: ${aCount}条"></div>
                            <div class="ce-h-seg b" style="width: ${bW}%;" title="B: ${bCount}条"></div>
                            <div class="ce-h-seg other" style="width: ${otherW}%;"></div>
                        </div>
                    `;
                    barHtml += '<span class="ce-h-total">' + labelText + ': ' + item.val + ' (' + count.toLocaleString() + '条)</span>';
                } else {
                    barHtml = `
                        <div class="ce-h-stack">
                            <div class="ce-h-seg a" style="width: ${barPct}%;"></div>
                        </div>
                    `;
                    barHtml += '<span class="ce-h-total">' + labelText + ': ' + item.val + ' (' + count.toLocaleString() + '条)</span>';
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
