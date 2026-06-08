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
    const annoKeys = [
        'channel-kpi-leads',
        'channel-kpi-call',
        'channel-kpi-category',
        'channel-kpi-grade',
        'channel-kpi-conversion'
    ];

    let html = '';
    config.forEach((g, index) => {
        const annoAttr = annoKeys[index] ? ` data-anno="${annoKeys[index]}"` : '';
        html += `<div class="kpi-group-compact ${g.border}"${annoAttr} style="flex: ${g.flex};">
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
            <span style="font-weight:600;color:#1e293b;">${seg.count}条</span>
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
