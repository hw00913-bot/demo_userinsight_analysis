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
                <span style="width: 120px; font-size: 11px; font-weight: 600; color: #111827;">${item.rate}% (${userCount.toLocaleString()}条)</span>
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
                <th style="width: 120px; text-align: right;">线索量</th>
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
                <th style="width: 120px; text-align: right;">线索量</th>
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
                <th style="width: 140px; text-align: right;">新增线索量</th>
                <th style="width: 140px; text-align: right;">H线索量 / 占比</th>
                <th style="width: 140px; text-align: right;">A线索量 / 占比</th>
                <th style="width: 140px; text-align: right;">B线索量 / 占比</th>
                <th style="width: 150px; text-align: right;">C/其他线索量 / 占比</th>
                <th style="width: 190px; text-align: right;">H/A/B线索量 / 占比</th>
            </tr>
        `;
        areaDeliveryFullData.forEach(item => {
            const hab = item.h + item.a + item.b;
            const hCount = Math.round(item.count * item.h / 100);
            const aCount = Math.round(item.count * item.a / 100);
            const bCount = Math.round(item.count * item.b / 100);
            const otherCount = item.count - hCount - aCount - bCount;
            const habCount = hCount + aCount + bCount;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td style="font-weight: 500;">${item.region}</td>
                <td style="font-weight: 500;">${item.area}</td>
                <td style="text-align: right; font-weight: 600;">${item.count.toLocaleString()}条</td>
                <td style="text-align: right;">${hCount.toLocaleString()}条 · ${item.h}%</td>
                <td style="text-align: right;">${aCount.toLocaleString()}条 · ${item.a}%</td>
                <td style="text-align: right;">${bCount.toLocaleString()}条 · ${item.b}%</td>
                <td style="text-align: right;">${otherCount.toLocaleString()}条 · ${item.other}%</td>
                <td style="text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                        <div style="width: 64px; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden;">
                            <div style="height: 100%; width: ${hab}%; background: #00337c;"></div>
                        </div>
                        <strong>${habCount.toLocaleString()}条 · ${hab}%</strong>
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
                <th style="width: 140px; text-align: right;">并集线索量</th>
                <th style="width: 140px; text-align: right;">重合线索量</th>
                <th style="width: 120px; text-align: right;">重合率</th>
            </tr>
        `;
        overlap.rows.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td style="font-weight: 500;">${item.media}</td>
                <td style="text-align: right; font-weight: 600;">${item.unionCount.toLocaleString()}条</td>
                <td style="text-align: right; font-weight: 600;">${item.overlapCount.toLocaleString()}条</td>
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
                <th style="width: 140px; text-align: right;">并集线索量</th>
                <th style="width: 140px; text-align: right;">重合线索量</th>
                <th style="width: 120px; text-align: right;">重合率</th>
            </tr>
        `;
        overlap.rows.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td style="font-weight: 500;">${item.media}</td>
                <td style="text-align: right; font-weight: 600;">${item.unionCount.toLocaleString()}条</td>
                <td style="text-align: right; font-weight: 600;">${item.overlapCount.toLocaleString()}条</td>
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
                <th style="width: 140px; text-align: right;">线索量</th>
                <th style="width: 120px; text-align: right;">占比</th>
            </tr>
        `;
        storeFullData[type].forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align: center;"><span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">${item.rank}</span></td>
                <td style="font-weight: 500;">${item.name}</td>
                <td style="text-align: right; font-weight: 600;">${item.count.toLocaleString()}条</td>
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
                        <span style="font-size: 11px; color: #6b7280;">(${habCount.toLocaleString()}条)</span>
                    </div>
                </td>
                <td style="text-align: right;">${arrival} <span style="font-size: 11px; color: #6b7280;">(${arrivalCount.toLocaleString()}条)</span></td>
                <td style="text-align: right;">${testdrive} <span style="font-size: 11px; color: #6b7280;">(${testdriveCount.toLocaleString()}条)</span></td>
                <td style="text-align: right;">${order} <span style="font-size: 11px; color: #6b7280;">(${orderCount.toLocaleString()}条)</span></td>
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
    ['cityStoreModal','regionChannelModal','projectDrillModal','scheduleDrillModal','rankingModal','focusDrillDownModal','journeySankeyModal','firstTouchDealStoreModal'].forEach(id => {
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
    var total = { hSchedule: 0, hLead: 0, hNonTest: 0, a: 0, b: 0, cUnclear: 0, cUnreachable: 0, f: 0, l: 0, e: 0, total: 0 };
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

    // 计算全局总计（10级）
    var regionCodes = Object.keys(regionChannelData);
    var allRegionsTotal = { hSchedule: 0, hLead: 0, hNonTest: 0, a: 0, b: 0, cUnclear: 0, cUnreachable: 0, f: 0, l: 0, e: 0, total: 0 };
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

    // 预计算全局最大总量（用于柱长归一化）
    var allFlatStores = [];
    regionCodes.forEach(function(code) {
        var region = regionChannelData[code];
        Object.values(region.areas).forEach(function(stores) { allFlatStores = allFlatStores.concat(stores); });
    });
    var globalMaxTotal = maxStoreTotal(allFlatStores);

    // 生成全部门店列表
    regionCodes.forEach(function(code) {
        var region = regionChannelData[code];
        Object.values(region.areas).forEach(function(stores) {
            stores.forEach(function(store) {
                html += generateStoreCard(store, region.regionName, globalMaxTotal);
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

        // 预计算该大区的最大总量
        var regionAllStores = [];
        areaNames.forEach(function(a) { regionAllStores = regionAllStores.concat(region.areas[a]); });
        var regionMaxTotal = maxStoreTotal(regionAllStores);

        // 遍历所有小区的门店
        areaNames.forEach(function(areaName) {
            region.areas[areaName].forEach(function(store) {
                html += generateStoreCard(store, areaName, regionMaxTotal);
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
                sum.f += s.f; sum.l += s.l; sum.e += s.e; sum.total += s.total;
                return sum;
            }, { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, total: 0 });
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

            var areaMaxTotal = maxStoreTotal(areaStores);
            areaStores.forEach(function(store) {
                html += generateStoreCard(store, '', areaMaxTotal);
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
function storeHTotal(s) { return storeLevel(s, 'hSchedule') + storeLevel(s, 'hLead') + storeLevel(s, 'hNonTest'); }
function storeCTotal(s) { return storeLevel(s, 'cUnclear') + storeLevel(s, 'cUnreachable'); }
function storeTotal(s) { return s.total || 0; }
function storeHabTotal(s) { return storeHTotal(s) + (s.a || 0) + (s.b || 0); }
function maxStoreTotal(stores) { return stores.reduce(function(m, s) { return Math.max(m, storeTotal(s)); }, 0); }

function generateStoreCard(store, areaLabel, maxTotal) {
    var t = storeTotal(store);
    var habTotal = storeHabTotal(store);
    var habPct = t > 0 ? (habTotal / t * 100).toFixed(1) : '0.0';
    var subLabel = areaLabel ? '<div style="font-size: 10px; color: #9ca3af;">' + areaLabel + '</div>' : '';

    // 按最大总量归一化，让柱长反映门店间的总量差异
    var scale = maxTotal && maxTotal > 0 ? (t / maxTotal * 100) : 100;

    // 迷你条形图 + 底部标签行（一次遍历）
    var barSegments = '';
    var labelRow = '';
    LEVEL_LABELS.forEach(function(lv) {
        var val = store[lv.key] || 0;
        var segPct = t > 0 ? (val / t * scale).toFixed(1) : 0;
        barSegments += '<div style="height:100%;background:' + LEVEL_COLORS[lv.key] + ';width:' + segPct + '%;" title="' + lv.label + ': ' + val + '"></div>';
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
    const allTotal = { hSchedule: 0, hLead: 0, hNonTest: 0, a: 0, b: 0, cUnclear: 0, cUnreachable: 0, f: 0, l: 0, e: 0, total: 0 };
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
                allTotal.f += (store.f || 0); allTotal.l += (store.l || 0); allTotal.e += (store.e || 0);
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
    // 预计算全部面板的最大总量
    var drillAllStores = [];
    regionNames.forEach(function(r) {
        Object.values(channels[r]).forEach(function(stores) { drillAllStores = drillAllStores.concat(stores); });
    });
    var drillGlobalMax = maxStoreTotal(drillAllStores);

    regionNames.forEach(function(region) {
        Object.entries(channels[region]).forEach(function(_a) {
            var areaName = _a[0], stores = _a[1];
            stores.forEach(function(store) { html += generateStoreCard(store, areaName, drillGlobalMax); });
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
        var drRegionStores = []; areaNames.forEach(function(a) { drRegionStores = drRegionStores.concat(regionAreas[a]); });
        var drRegionMax = maxStoreTotal(drRegionStores);
        areaNames.forEach(function(areaName) { regionAreas[areaName].forEach(function(store) { html += generateStoreCard(store, areaName, drRegionMax); }); });
        html += `</div></div>`;

        // 每个小区面板
        areaNames.forEach(areaName => {
            const areaStores = regionAreas[areaName];
            const areaTotal = areaStores.reduce(function(s, st) { s.h += storeHTotal(st); s.a += (st.a || 0); s.b += (st.b || 0); s.c += storeCTotal(st); s.f += (st.f || 0); s.l += (st.l || 0); s.e += (st.e || 0); s.total += storeTotal(st); return s; }, { h: 0, a: 0, b: 0, c: 0, f: 0, l: 0, e: 0, total: 0 });
            const areaHab = areaTotal.total > 0 ? ((areaTotal.h + areaTotal.a + areaTotal.b) / areaTotal.total * 100).toFixed(1) : '0.0';
            html += `
            <div class="area-panel" data-area="${areaName}">
                <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f1f5f9; border-radius: 4px; margin-bottom: 10px;">
                    <span style="font-size: 12px; font-weight: 600; color: #475569;">${areaName}</span>
                    <span style="font-size: 11px; color: #64748b;">${areaStores.length} 家专营店</span>
                    <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #059669;">H/A/B ${areaHab}%</span>
                </div><div style="display: flex; flex-direction: column; gap: 6px;">`;
            var drAreaMax = maxStoreTotal(areaStores);
            areaStores.forEach(function(store) { html += generateStoreCard(store, '', drAreaMax); });
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
