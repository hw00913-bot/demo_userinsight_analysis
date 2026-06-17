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

function sankeyEscape(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function buildSankeyRows(source, targets, countGetter) {
    return targets.map(target => {
        const leads = Math.max(0, Math.round(countGetter(target)));
        const dealRate = touchHabitDeliveryRate(source + target);
        const deliveries = Math.round(leads * dealRate / 100);
        return {
            source,
            target,
            leads,
            deliveries,
            dealRate
        };
    }).filter(row => row.leads > 0).sort((a, b) => b.leads - a.leads);
}

function summarizeSankeyRows(rows) {
    const totalLeads = rows.reduce((sum, row) => sum + row.leads, 0);
    const totalDeliveries = rows.reduce((sum, row) => sum + row.deliveries, 0);
    return {
        totalLeads,
        totalDeliveries,
        avgDealRate: totalLeads > 0 ? +(totalDeliveries / totalLeads * 100).toFixed(1) : 0
    };
}

function renderSankeyView(container, config) {
    if (!container) return;

    const rows = config.rows || [];
    if (!rows.length) {
        container.innerHTML = `<div class="sankey-empty">${sankeyEscape(config.emptyMessage || '暂无路径数据')}</div>`;
        return;
    }

    const summary = summarizeSankeyRows(rows);
    const sourceTotals = {};
    const targetTotals = {};
    rows.forEach(row => {
        sourceTotals[row.source] = (sourceTotals[row.source] || 0) + row.leads;
        targetTotals[row.target] = (targetTotals[row.target] || 0) + row.leads;
    });

    const sources = Object.keys(sourceTotals);
    const targets = Object.keys(targetTotals).sort((a, b) => targetTotals[b] - targetTotals[a]);
    const width = 820;
    const height = Math.max(360, 126 + targets.length * 32);
    const leftX = 188;
    const rightX = width - 326;
    const nodeWidth = 16;
    const top = 72;
    const bottom = 52;
    const drawableHeight = height - top - bottom;
    const maxTarget = Math.max(...targets.map(target => targetTotals[target]), 1);
    const linkMax = Math.max(...rows.map(row => row.leads), 1);
    const sourceY = top + drawableHeight / 2;
    const targetGap = targets.length > 1 ? drawableHeight / (targets.length - 1) : 0;
    const targetPositions = {};
    targets.forEach((target, index) => {
        targetPositions[target] = targets.length === 1 ? sourceY : top + index * targetGap;
    });

    const linkSvg = rows.map(row => {
        const y1 = sourceY;
        const y2 = targetPositions[row.target];
        const strokeWidth = Math.max(6, Math.min(42, row.leads / linkMax * 42));
        const title = `${row.source} → ${row.target}：${row.leads.toLocaleString()}条，交车${row.deliveries.toLocaleString()}条，成交率${row.dealRate}%`;
        return `
            <path class="sankey-link" d="M ${leftX + nodeWidth} ${y1} C ${leftX + 130} ${y1}, ${rightX - 130} ${y2}, ${rightX} ${y2}" stroke-width="${strokeWidth}">
                <title>${sankeyEscape(title)}</title>
            </path>
        `;
    }).join('');

    const sourceNodeSvg = sources.map(source => {
        const nodeHeight = Math.max(54, Math.min(230, sourceTotals[source] / Math.max(summary.totalLeads, 1) * 230));
        return `
            <rect x="${leftX}" y="${sourceY - nodeHeight / 2}" width="${nodeWidth}" height="${nodeHeight}" rx="4" fill="#1d4ed8"></rect>
            <text class="sankey-node-label" x="${leftX - 12}" y="${sourceY - 5}" text-anchor="end">${sankeyEscape(source)}</text>
            <text class="sankey-node-meta" x="${leftX - 12}" y="${sourceY + 14}" text-anchor="end">${sourceTotals[source].toLocaleString()}条</text>
        `;
    }).join('');

    const targetNodeSvg = targets.map(target => {
        const y = targetPositions[target];
        const row = rows.find(item => item.target === target);
        const nodeHeight = Math.max(18, Math.min(84, targetTotals[target] / maxTarget * 84));
        const meta = row
            ? `${row.leads.toLocaleString()}条 · 交车${row.deliveries.toLocaleString()}条 · ${row.dealRate}%`
            : `${targetTotals[target].toLocaleString()}条`;
        return `
            <rect x="${rightX}" y="${y - nodeHeight / 2}" width="${nodeWidth}" height="${nodeHeight}" rx="4" fill="#38bdf8"></rect>
            <text class="sankey-node-label" x="${rightX + nodeWidth + 12}" y="${y - 5}">${sankeyEscape(target)}</text>
            <text class="sankey-node-meta" x="${rightX + nodeWidth + 12}" y="${y + 14}">${sankeyEscape(meta)}</text>
        `;
    }).join('');

    container.innerHTML = `
        <div class="sankey-view">
            <div class="sankey-summary">
                <div class="sankey-summary-card"><span>${sankeyEscape(config.sourceLabel || '起点')}</span><strong>${sources.length === 1 ? sankeyEscape(sources[0]) : sources.length + ' 项'}</strong></div>
                <div class="sankey-summary-card"><span>${sankeyEscape(config.targetLabel || '终点')}</span><strong>${targets.length.toLocaleString()} 项</strong></div>
                <div class="sankey-summary-card"><span>新增线索量</span><strong>${summary.totalLeads.toLocaleString()} 条</strong></div>
                <div class="sankey-summary-card"><span>交车 / 成交率</span><strong>${summary.totalDeliveries.toLocaleString()} 条 · ${summary.avgDealRate}%</strong></div>
            </div>
            <div class="sankey-chart-card">
                <div class="sankey-card-title"><strong>${sankeyEscape(config.chartTitle || '路径桑基图')}</strong><span>线宽按新增线索量</span></div>
                <div class="sankey-scroll">
                    <svg class="sankey-svg" style="height:${height}px" viewBox="0 0 ${width} ${height}" role="img" aria-label="${sankeyEscape(config.chartTitle || '路径桑基图')}">
                        <text x="${leftX}" y="34" fill="#64748b" font-size="12" font-weight="700">${sankeyEscape(config.sourceLabel || '起点')}</text>
                        <text x="${rightX}" y="34" fill="#64748b" font-size="12" font-weight="700">${sankeyEscape(config.targetLabel || '终点')}</text>
                        ${linkSvg}
                        ${sourceNodeSvg}
                        ${targetNodeSvg}
                    </svg>
                </div>
            </div>
        </div>
    `;
}

function getChannelJourneySankeyRows() {
    const firstSelect = document.getElementById('firstJourneyChannel');
    const lastMultiSelect = document.getElementById('lastJourneyChannel');
    const config = MOCK.touchMedia?.channelJourney;
    if (!firstSelect || !lastMultiSelect || !config) return [];

    const source = firstSelect.value;
    const targets = [...lastMultiSelect.querySelectorAll('.journey-channel-cb:checked')]
        .map(checkbox => checkbox.value);
    const weight = config.firstChannelWeights[source] || 1;
    return buildSankeyRows(source, targets, target => (config.lastChannelCounts[target] || 0) * weight);
}

function getAllChannelJourneyRows(source) {
    const config = MOCK.touchMedia?.channelJourney;
    const channels = MOCK.channels || [];
    if (!config || !channels.length || !source) return [];

    const weight = config.firstChannelWeights[source] || 1;
    return buildSankeyRows(source, channels, target => (config.lastChannelCounts[target] || 0) * weight);
}

function renderInteractiveChannelSankey(container, selectedSource) {
    const config = MOCK.touchMedia?.channelJourney;
    const channels = MOCK.channels || [];
    if (!container) return;
    if (!config || !channels.length) {
        container.innerHTML = '<div class="sankey-empty">暂无渠道路径数据</div>';
        return;
    }

    const source = selectedSource && channels.includes(selectedSource) ? selectedSource : channels[0];
    const rows = getAllChannelJourneyRows(source);
    const targetTotals = {};
    rows.forEach(row => {
        targetTotals[row.target] = row.leads;
    });
    const totalLeads = rows.reduce((sum, row) => sum + row.leads, 0);
    const totalDeliveries = rows.reduce((sum, row) => sum + row.deliveries, 0);
    const totalDealRate = totalLeads > 0 ? +(totalDeliveries / totalLeads * 100).toFixed(1) : 0;
    const rowByTarget = {};
    rows.forEach(row => {
        rowByTarget[row.target] = row;
    });

    const width = 980;
    const height = Math.max(500, 130 + channels.length * 44);
    const leftX = 128;
    const rightX = width - 380;
    const nodeWidth = 16;
    const top = 70;
    const bottom = 54;
    const drawableHeight = height - top - bottom;
    const gap = channels.length > 1 ? drawableHeight / (channels.length - 1) : 0;
    const positions = {};
    channels.forEach((channel, index) => {
        positions[channel] = channels.length === 1 ? top + drawableHeight / 2 : top + index * gap;
    });

    const linkMax = Math.max(...rows.map(row => row.leads), 1);
    const linkSvg = rows.map(row => {
        const y1 = positions[source];
        const y2 = positions[row.target];
        const strokeWidth = Math.max(5, Math.min(34, row.leads / linkMax * 34));
        const share = totalLeads > 0 ? +(row.leads / totalLeads * 100).toFixed(1) : 0;
        const title = `${row.source} → ${row.target}：新增线索量${row.leads.toLocaleString()}条，占比${share}%，交车量${row.deliveries.toLocaleString()}条，线索成交率${row.dealRate}%`;
        return `
            <path class="sankey-link" d="M ${leftX + nodeWidth} ${y1} C ${leftX + 180} ${y1}, ${rightX - 180} ${y2}, ${rightX} ${y2}" stroke-width="${strokeWidth}">
                <title>${sankeyEscape(title)}</title>
            </path>
        `;
    }).join('');

    const leftNodes = channels.map(channel => {
        const y = positions[channel];
        const isActive = channel === source;
        return `
            <g class="sankey-source-node${isActive ? ' active' : ''}" data-channel="${sankeyEscape(channel)}" tabindex="0" role="button" aria-label="查看${sankeyEscape(channel)}到末次渠道流向">
                <rect x="${leftX}" y="${y - 11}" width="${nodeWidth}" height="22" rx="4" fill="${isActive ? '#1d4ed8' : '#94a3b8'}"></rect>
                <text class="sankey-node-label" x="${leftX - 12}" y="${y + 4}" text-anchor="end">${sankeyEscape(channel)}</text>
            </g>
        `;
    }).join('');

    const rightNodes = channels.map(channel => {
        const y = positions[channel];
        const row = rowByTarget[channel];
        const leads = row?.leads || targetTotals[channel] || 0;
        const share = totalLeads > 0 ? +(leads / totalLeads * 100).toFixed(1) : 0;
        const deliveries = row?.deliveries || 0;
        const dealRate = row?.dealRate || 0;
        const nodeHeight = Math.max(18, Math.min(58, leads / linkMax * 58));
        return `
            <rect x="${rightX}" y="${y - nodeHeight / 2}" width="${nodeWidth}" height="${nodeHeight}" rx="4" fill="#38bdf8"></rect>
            <text class="sankey-node-label" x="${rightX + nodeWidth + 12}" y="${y - 18}">${sankeyEscape(channel)}</text>
            <text class="sankey-node-meta" x="${rightX + nodeWidth + 12}" y="${y}">新增${leads.toLocaleString()}条 · 占比${share}%</text>
            <text class="sankey-node-meta" x="${rightX + nodeWidth + 12}" y="${y + 18}">交车${deliveries.toLocaleString()}条 · 线索成交率${dealRate}%</text>
        `;
    }).join('');

    container.innerHTML = `
        <div class="sankey-view sankey-view-chart-only">
            <div class="sankey-summary">
                <div class="sankey-summary-card"><span>首次留资渠道</span><strong>${sankeyEscape(source)}</strong></div>
                <div class="sankey-summary-card"><span>末次留资渠道</span><strong>${channels.length.toLocaleString()} 项</strong></div>
                <div class="sankey-summary-card"><span>新增线索量</span><strong>${totalLeads.toLocaleString()} 条</strong></div>
                <div class="sankey-summary-card"><span>交车 / 线索成交率</span><strong>${totalDeliveries.toLocaleString()} 条 · ${totalDealRate}%</strong></div>
            </div>
            <div class="sankey-chart-card">
                <div class="sankey-scroll">
                    <svg class="sankey-svg sankey-channel-svg" style="height:${height}px" viewBox="0 0 ${width} ${height}" role="img" aria-label="首次到末次留资渠道桑基图">
                        <text x="${leftX}" y="34" fill="#64748b" font-size="12" font-weight="700">首次留资渠道</text>
                        <text x="${rightX}" y="34" fill="#64748b" font-size="12" font-weight="700">末次留资渠道</text>
                        <text x="${width / 2}" y="36" fill="#334155" font-size="12" font-weight="700" text-anchor="middle">当前：${sankeyEscape(source)}，点击左侧渠道切换流向</text>
                        ${linkSvg}
                        ${leftNodes}
                        ${rightNodes}
                    </svg>
                </div>
            </div>
        </div>
    `;

    container.querySelectorAll('.sankey-source-node').forEach(node => {
        const activate = () => renderInteractiveChannelSankey(container, node.dataset.channel);
        node.addEventListener('click', activate);
        node.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activate();
            }
        });
    });
}

function getMediaJourneySankeyRows() {
    const firstSelect = document.getElementById('firstJourneyMedia');
    const lastMultiSelect = document.getElementById('lastJourneyMedia');
    const config = MOCK.touchMedia?.mediaJourney;
    if (!firstSelect || !lastMultiSelect || !config) return [];

    const source = firstSelect.dataset.value;
    const targets = [...lastMultiSelect.querySelectorAll('.journey-media-cb:checked')]
        .map(checkbox => checkbox.value);
    const weight = config.firstMediaWeights[source] || 1;
    return buildSankeyRows(source, targets, target => (config.lastMediaCounts[target] || 0) * weight);
}

function getAllMediaJourneyRows(source, range) {
    const config = MOCK.touchMedia?.mediaJourney;
    const media = config?.media || [];
    if (!config || !media.length || !source) return [];

    const weight = config.firstMediaWeights[source] || 1;
    const allRows = buildSankeyRows(source, media, target => (config.lastMediaCounts[target] || 0) * weight);
    const limit = range === 'all' ? allRows.length : Number(range || 20);
    if (allRows.length <= limit) return allRows;

    const visibleRows = allRows.slice(0, limit);
    const otherRows = allRows.slice(limit);
    const otherLeads = otherRows.reduce((sum, row) => sum + row.leads, 0);
    if (otherLeads > 0) {
        const otherDeliveries = otherRows.reduce((sum, row) => sum + row.deliveries, 0);
        visibleRows.push({
            source,
            target: '其他媒体',
            leads: otherLeads,
            deliveries: otherDeliveries,
            dealRate: otherLeads > 0 ? +(otherDeliveries / otherLeads * 100).toFixed(1) : 0
        });
    }
    return visibleRows;
}

function renderInteractiveMediaSankey(container, selectedSource, keyword, range, page) {
    const config = MOCK.touchMedia?.mediaJourney;
    const media = config?.media || [];
    if (!container) return;
    if (!config || !media.length) {
        container.innerHTML = '<div class="sankey-empty">暂无媒体路径数据</div>';
        return;
    }

    const activeRange = range || '20';
    const pageSize = 50;
    const sourceRows = media.map(item => {
        const weight = config.firstMediaWeights[item] || 1;
        const total = media.reduce((sum, target) => sum + Math.round((config.lastMediaCounts[target] || 0) * weight), 0);
        return { media: item, total };
    }).sort((a, b) => b.total - a.total);
    const displayedSources = sourceRows.slice(0, 20);
    const fallbackSource = sourceRows[0]?.media;
    const source = selectedSource && media.includes(selectedSource) ? selectedSource : fallbackSource;
    const allTargetRows = getAllMediaJourneyRows(source, 'all');
    const totalPages = activeRange === 'all' ? Math.max(1, Math.ceil(allTargetRows.length / pageSize)) : 1;
    const activePage = Math.min(Math.max(1, Number(page || 1)), totalPages);
    const rows = activeRange === 'all'
        ? allTargetRows.slice((activePage - 1) * pageSize, activePage * pageSize)
        : getAllMediaJourneyRows(source, activeRange);

    container.innerHTML = `
        <div class="store-sankey-layout media-sankey-store-layout">
            <aside class="store-sankey-sidebar">
                <div class="store-sankey-sidebar-title"><strong>首次留资媒体 Top20</strong><span>点击媒体切换流向</span></div>
                <div class="store-sankey-source-list">
                    ${displayedSources.map(row => `
                        <button class="media-sankey-source${row.media === source ? ' active' : ''}" data-media="${sankeyEscape(row.media)}" type="button">
                            <span>${sankeyEscape(row.media)}</span>
                            <strong>${row.total.toLocaleString()}条</strong>
                        </button>
                    `).join('')}
                </div>
            </aside>
            <section class="store-sankey-main">
                <div class="media-sankey-toolbar">
                    <div><strong>当前首次媒体：${sankeyEscape(source)}</strong><span>右侧按末次媒体流向展示${activeRange === 'all' ? `，当前第 ${activePage}/${totalPages} 页` : ''}</span></div>
                    <div class="media-sankey-range" role="group" aria-label="末次媒体展示范围">
                        <button type="button" data-range="20" class="${activeRange === '20' ? 'active' : ''}">Top 20</button>
                        <button type="button" data-range="50" class="${activeRange === '50' ? 'active' : ''}">Top 50</button>
                        <button type="button" data-range="all" class="${activeRange === 'all' ? 'active' : ''}">全部</button>
                    </div>
                </div>
                ${activeRange === 'all' ? `
                    <div class="store-sankey-pager">
                        <span>全部末次媒体：${allTargetRows.length.toLocaleString()} 个，当前展示 ${(((activePage - 1) * pageSize) + 1).toLocaleString()}-${Math.min(activePage * pageSize, allTargetRows.length).toLocaleString()}</span>
                        <div>
                            <button type="button" data-page="prev" ${activePage <= 1 ? 'disabled' : ''}>上一页</button>
                            <strong>${activePage} / ${totalPages}</strong>
                            <button type="button" data-page="next" ${activePage >= totalPages ? 'disabled' : ''}>下一页</button>
                        </div>
                    </div>
                ` : ''}
                <div id="mediaSankeyChart"></div>
            </section>
        </div>
    `;

    renderSankeyView(container.querySelector('#mediaSankeyChart'), {
        rows,
        sourceLabel: '首次留资媒体',
        targetLabel: '末次留资媒体',
        chartTitle: '首次到末次留资媒体',
        emptyMessage: '暂无媒体路径数据'
    });

    container.querySelectorAll('.media-sankey-source').forEach(button => {
        button.addEventListener('click', () => {
            renderInteractiveMediaSankey(container, button.dataset.media, '', activeRange, 1);
        });
    });
    container.querySelectorAll('.media-sankey-range button').forEach(button => {
        button.addEventListener('click', () => {
            renderInteractiveMediaSankey(container, source, '', button.dataset.range, 1);
        });
    });
    container.querySelectorAll('.store-sankey-pager button').forEach(button => {
        button.addEventListener('click', () => {
            const nextPage = activePage + (button.dataset.page === 'next' ? 1 : -1);
            renderInteractiveMediaSankey(container, source, '', activeRange, nextPage);
        });
    });
}

function openJourneySankey(type) {
    const modal = document.getElementById('journeySankeyModal');
    const title = document.getElementById('journeySankeyModalTitle');
    const content = document.getElementById('journeySankeyModalContent');
    if (!modal || !title || !content) return;

    if (type === 'channel') {
        title.textContent = '首次到末次留资渠道桑基图';
        renderInteractiveChannelSankey(content);
    } else if (type === 'media') {
        title.textContent = '首次到末次留资媒体桑基图';
        renderInteractiveMediaSankey(content);
    }

    modal.classList.add('active');
}

window.renderSankeyView = renderSankeyView;
window.openJourneySankey = openJourneySankey;

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
