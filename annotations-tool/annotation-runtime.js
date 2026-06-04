/**
 * 标注运行时 — 页面标注展示、查看、编辑、导出
 * 依赖：window.AnnotationConfig, 标注数据（window.AnnotationData 或旧格式全局变量）
 * 样式：annotations-tool/annotation.css
 */
(function () {
  'use strict';

  // ===== 配置读取 =====
  var config = window.AnnotationConfig;
  if (!config || !config.page) return;

  var PAGE_KEY = config.page;
  var DATA_KEY = config.dataKey || null;
  var CACHE_KEY = 'anno_cache_' + PAGE_KEY;
  var OVERLAY_ID = 'anno-overlay';
  var TOGGLE_ID = 'anno-toggle-btn';
  var POPUP_ID = 'anno-popup';

  // ===== 数据加载 =====
  function loadAnnotations() {
    // 优先读取浏览器缓存
    var cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    // 读取页面初始数据
    var data = null;
    if (window.AnnotationData && Array.isArray(window.AnnotationData[PAGE_KEY])) {
      data = window.AnnotationData[PAGE_KEY];
    } else if (DATA_KEY && Array.isArray(window[DATA_KEY])) {
      data = window[DATA_KEY];
    }
    return data || [];
  }

  function saveAnnotations(annotations) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(annotations));
  }

  function getSourceAnnotations() {
    if (window.AnnotationData && Array.isArray(window.AnnotationData[PAGE_KEY])) {
      return window.AnnotationData[PAGE_KEY];
    }
    if (DATA_KEY && Array.isArray(window[DATA_KEY])) {
      return window[DATA_KEY];
    }
    return [];
  }

  var annotations = loadAnnotations();

  // ===== DOM 创建 =====
  var toggleBtn = null;
  var overlay = null;
  var popup = null;
  var visible = false;
  var markers = [];
  var renderingMarkers = false;
  var renderTimer = null;

  function createToggleBtn() {
    if (document.getElementById(TOGGLE_ID)) return;
    toggleBtn = document.createElement('button');
    toggleBtn.id = TOGGLE_ID;
    toggleBtn.textContent = 'A';
    toggleBtn.title = '显示/隐藏标注';
    toggleBtn.className = 'anno-hidden';
    toggleBtn.addEventListener('click', toggleAnnotations);
    document.body.appendChild(toggleBtn);
  }

  function createOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    document.body.appendChild(overlay);
  }

  // ===== 标注点渲染 =====
  function findTarget(selector) {
    if (!selector) return null;
    try {
      var el = document.querySelector(selector);
      return el;
    } catch (e) {
      return null;
    }
  }

  function calcMarkerPosition(targetEl, position) {
    var rect = targetEl.getBoundingClientRect();
    var placement = (position && position.placement) || 'top-right';
    var offsetX = (position && position.offsetX) || 0;
    var offsetY = (position && position.offsetY) || 0;

    var x, y;
    switch (placement) {
      case 'top-left':
        x = rect.left - 6;
        y = rect.top - 6;
        break;
      case 'top-right':
        x = rect.right - 18;
        y = rect.top - 6;
        break;
      case 'bottom-left':
        x = rect.left - 6;
        y = rect.bottom - 18;
        break;
      case 'bottom-right':
        x = rect.right - 18;
        y = rect.bottom - 18;
        break;
      case 'center-right':
        x = rect.right + 4;
        y = rect.top + rect.height / 2 - 12;
        break;
      default:
        x = rect.right - 18;
        y = rect.top - 6;
    }

    return {
      left: Math.max(0, x + offsetX),
      top: Math.max(0, y + offsetY)
    };
  }

  function renderMarkers() {
    if (!overlay) return;
    if (renderingMarkers) return;
    renderingMarkers = true;

    // 清除旧标注点
    var oldMarkers = overlay.querySelectorAll('.anno-marker');
    for (var i = 0; i < oldMarkers.length; i++) {
      oldMarkers[i].remove();
    }
    markers = [];

    if (!visible || !annotations.length) {
      renderingMarkers = false;
      return;
    }

    for (var j = 0; j < annotations.length; j++) {
      var anno = annotations[j];
      var targetEl = findTarget(anno.target);
      if (!targetEl) continue;

      var pos = calcMarkerPosition(targetEl, anno.position);

      var marker = document.createElement('div');
      marker.className = 'anno-marker';
      marker.textContent = anno.id;
      marker.style.left = pos.left + 'px';
      marker.style.top = pos.top + 'px';
      marker.setAttribute('data-anno-id', anno.id);
      marker.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = this.getAttribute('data-anno-id');
        openPopup(id);
      });
      overlay.appendChild(marker);
      markers.push({ el: marker, anno: anno, targetEl: targetEl });
    }
    renderingMarkers = false;
  }

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight &&
           rect.right > 0 && rect.left < window.innerWidth;
  }

  function repositionMarkers() {
    for (var i = 0; i < markers.length; i++) {
      var m = markers[i];
      if (!isInViewport(m.targetEl)) {
        m.el.style.display = 'none';
        continue;
      }
      m.el.style.display = '';
      var pos = calcMarkerPosition(m.targetEl, m.anno.position);
      m.el.style.left = pos.left + 'px';
      m.el.style.top = pos.top + 'px';
    }
  }

  // ===== 显示/隐藏切换 =====
  function toggleAnnotations() {
    visible = !visible;
    if (visible) {
      toggleBtn.classList.remove('anno-hidden');
      startPositionLoop();
    } else {
      toggleBtn.classList.add('anno-hidden');
      stopPositionLoop();
      closePopup();
    }
    renderMarkers();
  }

  // ===== 弹窗 =====
  function buildDesc(sections) {
    var labels = [
      '功能名称', '功能说明', '权限范围', '数据来源', '取值逻辑',
      '字段说明', '交互说明', '判断规则', '异常规则', '其他说明'
    ];
    var keys = [
      'functionName', 'functionDesc', 'permissionScope', 'dataSource', 'valueLogic',
      'fieldDesc', 'interactionDesc', 'judgeRule', 'exceptionRule', 'otherDesc'
    ];
    var lines = [];
    for (var i = 0; i < keys.length; i++) {
      var val = (sections && sections[keys[i]]) || '';
      lines.push((i + 1) + '. ' + labels[i] + '：' + val);
    }
    return lines.join('<br>');
  }

  function openPopup(annoId) {
    var anno = null;
    for (var i = 0; i < annotations.length; i++) {
      if (annotations[i].id === annoId) { anno = annotations[i]; break; }
    }
    if (!anno) return;

    closePopup();

    popup = document.createElement('div');
    popup.id = POPUP_ID;
    popup.className = 'anno-popup';
    popup.style.left = '120px';
    popup.style.top = '100px';
    popup.setAttribute('data-anno-id', annoId);

    renderPopupView(popup, anno);
    document.body.appendChild(popup);
    enableDrag(popup);
  }

  function closePopup() {
    if (popup) {
      popup.remove();
      popup = null;
    }
  }

  function renderPopupView(popupEl, anno) {
    var sections = anno.sections || {};
    var sectionLabels = [
      { key: 'functionName', label: '1. 功能名称' },
      { key: 'functionDesc', label: '2. 功能说明' },
      { key: 'permissionScope', label: '3. 权限范围' },
      { key: 'dataSource', label: '4. 数据来源' },
      { key: 'valueLogic', label: '5. 取值逻辑' },
      { key: 'fieldDesc', label: '6. 字段说明' },
      { key: 'interactionDesc', label: '7. 交互说明' },
      { key: 'judgeRule', label: '8. 判断规则' },
      { key: 'exceptionRule', label: '9. 异常规则' },
      { key: 'otherDesc', label: '10. 其他说明' }
    ];

    var html = '';
    html += '<div class="anno-popup-header" id="anno-popup-drag-handle">';
    html += '<h3>' + escapeHtml(anno.title || '标注详情') + '</h3>';
    html += '<button class="anno-popup-close" id="anno-popup-close-btn">&times;</button>';
    html += '</div>';
    html += '<div class="anno-popup-body">';
    for (var i = 0; i < sectionLabels.length; i++) {
      var sl = sectionLabels[i];
      var val = sections[sl.key] || '';
      html += '<div class="anno-section">';
      html += '<div class="anno-section-label">' + sl.label + '</div>';
      html += '<div class="anno-section-value">' + escapeHtml(val || '（暂无）') + '</div>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="anno-popup-footer">';
    html += '<button class="anno-btn" id="anno-edit-btn">编辑</button>';
    html += '<button class="anno-btn" id="anno-copy-btn">复制数据</button>';
    html += '</div>';

    popupEl.innerHTML = html;

    // 事件绑定
    popupEl.querySelector('#anno-popup-close-btn').addEventListener('click', closePopup);
    popupEl.querySelector('#anno-edit-btn').addEventListener('click', function () {
      renderPopupEdit(popupEl, anno);
    });
    popupEl.querySelector('#anno-copy-btn').addEventListener('click', function () {
      copyAnnotationData(anno);
    });
  }

  function renderPopupEdit(popupEl, anno) {
    var sections = anno.sections || {};
    var sectionLabels = [
      { key: 'functionName', label: '1. 功能名称' },
      { key: 'functionDesc', label: '2. 功能说明' },
      { key: 'permissionScope', label: '3. 权限范围' },
      { key: 'dataSource', label: '4. 数据来源' },
      { key: 'valueLogic', label: '5. 取值逻辑' },
      { key: 'fieldDesc', label: '6. 字段说明' },
      { key: 'interactionDesc', label: '7. 交互说明' },
      { key: 'judgeRule', label: '8. 判断规则' },
      { key: 'exceptionRule', label: '9. 异常规则' },
      { key: 'otherDesc', label: '10. 其他说明' }
    ];

    // 保存弹窗位置不变
    var currentLeft = popupEl.style.left;
    var currentTop = popupEl.style.top;

    var html = '';
    html += '<div class="anno-popup-header" id="anno-popup-drag-handle">';
    html += '<h3>编辑标注</h3>';
    html += '<button class="anno-popup-close" id="anno-popup-close-btn">&times;</button>';
    html += '</div>';
    html += '<div class="anno-popup-body">';
    // 标题
    html += '<div class="anno-edit-field">';
    html += '<label>标注标题</label>';
    html += '<input type="text" id="anno-edit-title" value="' + escapeAttr(anno.title || '') + '">';
    html += '</div>';
    // 10 个 sections
    for (var i = 0; i < sectionLabels.length; i++) {
      var sl = sectionLabels[i];
      html += '<div class="anno-edit-field">';
      html += '<label>' + sl.label + '</label>';
      html += '<textarea id="anno-edit-' + sl.key + '">' + escapeHtml(sections[sl.key] || '') + '</textarea>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="anno-popup-footer">';
    html += '<button class="anno-btn anno-btn-primary" id="anno-save-btn">保存</button>';
    html += '<button class="anno-btn" id="anno-cancel-btn">取消</button>';
    html += '</div>';

    popupEl.innerHTML = html;
    popupEl.style.left = currentLeft;
    popupEl.style.top = currentTop;

    // 事件绑定
    popupEl.querySelector('#anno-popup-close-btn').addEventListener('click', closePopup);
    popupEl.querySelector('#anno-cancel-btn').addEventListener('click', function () {
      // 重新渲染查看态
      var updatedAnno = null;
      for (var j = 0; j < annotations.length; j++) {
        if (annotations[j].id === anno.id) { updatedAnno = annotations[j]; break; }
      }
      renderPopupView(popupEl, updatedAnno || anno);
    });
    popupEl.querySelector('#anno-save-btn').addEventListener('click', function () {
      saveEdit(popupEl, anno);
    });
  }

  function saveEdit(popupEl, anno) {
    var newTitle = popupEl.querySelector('#anno-edit-title').value.trim();
    var sectionKeys = [
      'functionName', 'functionDesc', 'permissionScope', 'dataSource', 'valueLogic',
      'fieldDesc', 'interactionDesc', 'judgeRule', 'exceptionRule', 'otherDesc'
    ];

    var newSections = {};
    for (var i = 0; i < sectionKeys.length; i++) {
      var textarea = popupEl.querySelector('#anno-edit-' + sectionKeys[i]);
      newSections[sectionKeys[i]] = textarea ? textarea.value.trim() : '';
    }

    // 更新标注
    anno.title = newTitle || anno.title;
    anno.sections = newSections;
    anno.desc = buildDesc(newSections);

    // 保存到缓存
    saveAnnotations(annotations);

    // 回到查看态
    renderPopupView(popupEl, anno);
    showToast('已保存到浏览器缓存');
  }

  function copyAnnotationData(anno) {
    var data = JSON.stringify(anno, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(data).then(function () {
        showToast('标注数据已复制到剪贴板');
      }).catch(function () {
        fallbackCopy(data);
      });
    } else {
      fallbackCopy(data);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('标注数据已复制到剪贴板');
    } catch (e) {
      showToast('复制失败，请手动复制');
    }
    textarea.remove();
  }

  // ===== 弹窗拖拽 =====
  function enableDrag(popupEl) {
    var header = popupEl.querySelector('#anno-popup-drag-handle');
    if (!header) return;

    var startX, startY, startLeft, startTop;
    var dragging = false;

    header.addEventListener('mousedown', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(popupEl.style.left, 10) || 0;
      startTop = parseInt(popupEl.style.top, 10) || 0;
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      popupEl.style.left = Math.max(0, startLeft + dx) + 'px';
      popupEl.style.top = Math.max(0, startTop + dy) + 'px';
    });

    document.addEventListener('mouseup', function () {
      if (dragging) {
        dragging = false;
        document.body.style.userSelect = '';
      }
    });
  }

  // ===== Toast =====
  function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'anno-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2200);
  }

  // ===== 工具函数 =====
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ===== 事件监听 =====
  var rafId = null;

  function startPositionLoop() {
    if (rafId) return;
    function loop() {
      repositionMarkers();
      // 弹窗约束在视口内
      if (popup) {
        var rect = popup.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          popup.style.left = Math.max(0, window.innerWidth - rect.width - 16) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
          popup.style.top = Math.max(0, window.innerHeight - rect.height - 16) + 'px';
        }
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
  }

  function stopPositionLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // ===== 初始化 =====
  function init() {
    createToggleBtn();
    createOverlay();
    // MutationObserver 监听 DOM 变化（SPA 页面切换等），重新渲染
    // 跳过标注系统自身的 DOM 变更，避免无限循环
    if (window.MutationObserver) {
      var observer = new MutationObserver(function (mutations) {
        if (!visible) return;
        // 检查是否都是标注系统自身的变更
        var allOurs = true;
        for (var i = 0; i < mutations.length; i++) {
          var el = mutations[i].target;
          if (!el || !el.id) { allOurs = false; break; }
          if (el.id !== OVERLAY_ID && el.id !== TOGGLE_ID && el.id !== POPUP_ID &&
              el.className && el.className.indexOf && el.className.indexOf('anno-') === -1) {
            allOurs = false; break;
          }
        }
        if (allOurs) return;
        // 防抖：延迟 200ms 重新渲染
        if (renderTimer) clearTimeout(renderTimer);
        renderTimer = setTimeout(function () { renderMarkers(); }, 200);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // ===== 导出全局 API =====
  window.AnnotationRuntime = {
    show: function () { if (!visible) toggleAnnotations(); },
    hide: function () { if (visible) toggleAnnotations(); },
    refresh: renderMarkers,
    getAnnotations: function () { return annotations; },
    exportData: function () { return JSON.stringify(annotations, null, 2); }
  };

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
