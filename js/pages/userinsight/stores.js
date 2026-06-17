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
    dealStores: {},
    targetRange: '20',
    targetPage: 1
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
var firstTouchStoreSourceRows = null;
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

function getFirstTouchStoreSourceRows() {
    if (firstTouchStoreSourceRows) return firstTouchStoreSourceRows;
    var stores = getAllStoreNames();
    firstTouchStoreSourceRows = stores.map(function(store) {
        var total = stores.reduce(function(sum, target) {
            return target === store ? sum : sum + storeJourneyCount(store, target);
        }, 0);
        return { store: store, total: total };
    }).sort(function(a, b) { return b.total - a.total; });
    return firstTouchStoreSourceRows;
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
    if (document.getElementById('firstTouchDealStoreModal')?.classList.contains('active')) {
        renderFirstTouchDealStoreResult();
    }
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

    list.style.cssText = 'display:flex; min-height:118px; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:18px 0;text-align:center;font-size:12px;color:#64748b;';
    list.innerHTML = '<div style="font-size:13px; font-weight:600; color:#64748b;">分析首触专营店到成交专营店的流向</div>'
        + '<button onclick="openFirstTouchDealStoreSankey()" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; min-width:150px; height:36px; padding:0 18px; border:1px solid #1d4ed8; border-radius:6px; background:#2563eb; color:#fff; font-size:13px; font-weight:700; cursor:pointer; box-shadow:0 8px 18px rgba(37,99,235,0.22);">'
        + '查看桑基图 <i class="fa-solid fa-arrow-up-right-from-square"></i>'
        + '</button>';
}

function getFirstTouchDealStoreRows(firstStore, range) {
    var stores = getAllStoreNames().filter(function(store) { return store !== firstStore; });
    var allRows = stores.map(function(dealStore) {
        var leads = storeJourneyCount(firstStore, dealStore);
        var dealRate = touchHabitDeliveryRate(firstStore + dealStore);
        return {
            source: firstStore,
            target: dealStore,
            leads: leads,
            deliveries: Math.round(leads * dealRate / 100),
            dealRate: dealRate
        };
    }).filter(function(row) {
        return row.leads > 0;
    }).sort(function(a, b) { return b.leads - a.leads; });

    if (range === 'all') return allRows;

    var limit = range === '50' ? 50 : 20;
    var visibleRows = allRows.slice(0, limit);
    var otherRows = allRows.slice(limit);
    var otherLeads = otherRows.reduce(function(sum, row) { return sum + row.leads; }, 0);
    if (otherLeads > 0) {
        var otherDeliveries = otherRows.reduce(function(sum, row) { return sum + row.deliveries; }, 0);
        visibleRows.push({
            source: firstStore,
            target: '其他专营店',
            leads: otherLeads,
            deliveries: otherDeliveries,
            dealRate: otherLeads > 0 ? +(otherDeliveries / otherLeads * 100).toFixed(1) : 0
        });
    }
    return visibleRows;
}

function openFirstTouchDealStoreSankey() {
    var modal = document.getElementById('firstTouchDealStoreModal');
    if (!modal) return;
    renderFirstTouchDealStoreResult();
    modal.classList.add('active');
}

function queryFirstTouchDealStoreAnalysis() {
    openFirstTouchDealStoreSankey();
}

function renderFirstTouchDealStoreResult() {
    var content = document.getElementById('firstTouchDealStoreModalContent');
    if (!content) return;

    var firstStore = firstTouchDealStoreState.firstTouchStore;
    var allStores = getAllStoreNames();
    var range = firstTouchDealStoreState.targetRange || '20';
    var pageSize = 50;
    var sourceRows = getFirstTouchStoreSourceRows().slice(0, 20);
    var activeStore = firstStore;
    var allTargetRows = firstStore ? getFirstTouchDealStoreRows(firstStore, 'all') : [];
    var totalPages = range === 'all' ? Math.max(1, Math.ceil(allTargetRows.length / pageSize)) : 1;
    if (firstTouchDealStoreState.targetPage > totalPages) firstTouchDealStoreState.targetPage = totalPages;
    var currentPage = Math.max(1, firstTouchDealStoreState.targetPage || 1);
    var rows = firstStore
        ? (range === 'all'
            ? allTargetRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
            : getFirstTouchDealStoreRows(firstStore, range))
        : [];
    var total = rows.reduce(function(sum, row) { return sum + row.leads; }, 0);

    content.innerHTML = '<div class="store-sankey-layout">'
        + '<aside class="store-sankey-sidebar">'
        + '<div class="store-sankey-sidebar-title"><strong>首触专营店 Top20</strong><span>点击门店切换流向</span></div>'
        + '<div class="store-sankey-source-list">'
        + sourceRows.map(function(row) {
            return '<button class="media-sankey-source store-sankey-source' + (row.store === activeStore ? ' active' : '') + '" data-store="' + sankeyEscape(row.store) + '" type="button">'
                + '<span>' + sankeyEscape(row.store) + '</span>'
                + '<strong>' + row.total.toLocaleString() + '条</strong>'
                + '</button>';
        }).join('')
        + '</div>'
        + '</aside>'
        + '<section class="store-sankey-main">'
        + '<div class="store-sankey-toolbar">'
        + '<div class="store-sankey-selector">'
        + '<span>首触专营店</span>'
        + '<button class="store-filter-trigger store-analysis-trigger" onclick="openStoreFilterModal(this)" data-store-filter-mode="firstTouch" data-store-text="请选择门店">'
        + '<i class="fa-solid fa-store"></i> <span>' + (firstStore || '请选择门店') + '</span> <i class="fa-solid fa-chevron-down"></i>'
        + '</button>'
        + '</div>'
        + '<div class="store-sankey-toolbar-meta">'
        + '<strong>' + (firstStore ? firstStore : '请选择首触专营店') + '</strong>'
        + '<span>' + (firstStore ? '从全部 ' + Math.max(allStores.length - 1, 0).toLocaleString() + ' 家成交专营店中按线索量展示流向' + (range === 'all' ? '，当前第 ' + currentPage + '/' + totalPages + ' 页' : '') : '使用顶部同款门店筛选弹窗选择首触门店，或点击左侧 Top20 门店') + '</span>'
        + '</div>'
        + '<div class="media-sankey-range store-sankey-range" role="group" aria-label="成交专营店展示范围">'
        + '<button type="button" data-range="20" class="' + (range === '20' ? 'active' : '') + '">Top 20</button>'
        + '<button type="button" data-range="50" class="' + (range === '50' ? 'active' : '') + '">Top 50</button>'
        + '<button type="button" data-range="all" class="' + (range === 'all' ? 'active' : '') + '">全部</button>'
        + '</div>'
        + '</div>'
        + (range === 'all' && firstStore ? '<div class="store-sankey-pager">'
            + '<span>全部成交专营店：' + allTargetRows.length.toLocaleString() + ' 家，当前展示 ' + (((currentPage - 1) * pageSize) + 1).toLocaleString() + '-' + Math.min(currentPage * pageSize, allTargetRows.length).toLocaleString() + '</span>'
            + '<div>'
            + '<button type="button" data-page="prev" ' + (currentPage <= 1 ? 'disabled' : '') + '>上一页</button>'
            + '<strong>' + currentPage + ' / ' + totalPages + '</strong>'
            + '<button type="button" data-page="next" ' + (currentPage >= totalPages ? 'disabled' : '') + '>下一页</button>'
            + '</div>'
            + '</div>' : '')
        + '<div id="firstTouchDealStoreSankeyContent"></div>'
        + '</section>'
        + '</div>';

    if (window.renderSankeyView) {
        window.renderSankeyView(document.getElementById('firstTouchDealStoreSankeyContent'), {
            rows: rows,
            sourceLabel: '首触专营店',
            targetLabel: '成交专营店',
        chartTitle: '首触-成交专营店',
            emptyMessage: firstStore ? '暂无首触-成交专营店路径数据' : '请选择首触专营店'
        });
    }

    var selectorTrigger = content.querySelector('.store-analysis-trigger[data-store-filter-mode="firstTouch"]');
    if (selectorTrigger && firstStore) selectorTrigger.classList.add('has-selection');
    content.querySelectorAll('.store-sankey-range button').forEach(function(button) {
        button.addEventListener('click', function() {
            firstTouchDealStoreState.targetRange = button.dataset.range;
            firstTouchDealStoreState.targetPage = 1;
            renderFirstTouchDealStoreResult();
        });
    });
    content.querySelectorAll('.store-sankey-pager button').forEach(function(button) {
        button.addEventListener('click', function() {
            firstTouchDealStoreState.targetPage += button.dataset.page === 'next' ? 1 : -1;
            renderFirstTouchDealStoreResult();
        });
    });
    content.querySelectorAll('.store-sankey-source').forEach(function(button) {
        button.addEventListener('click', function() {
            var store = button.dataset.store;
            storeFilterState.selectionsByContext.firstTouch = {};
            storeFilterState.selectionsByContext.firstTouch[store] = true;
            firstTouchDealStoreState.firstTouchStore = store;
            renderFirstTouchDealStoreResult();
        });
    });
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
