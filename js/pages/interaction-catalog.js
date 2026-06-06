(function renderAnnotationCatalog() {
            const catalog = document.getElementById('annotationCatalog');
            const filter = document.getElementById('annotationGroupFilter');
            const summary = document.getElementById('annotationSummary');
            if (!catalog || !filter || !summary) return;

            const userInsightData = (window.AnnotationData && window.AnnotationData.userinsight) || [];
            const workbenchData = (window.AnnotationData && window.AnnotationData.workbench) || [];
            const data = userInsightData.concat(workbenchData);
            const fieldLabels = [
                ['functionDesc', '功能说明'],
                ['permissionScope', '权限范围'],
                ['dataSource', '数据来源'],
                ['valueLogic', '取值逻辑'],
                ['fieldDesc', '字段说明'],
                ['interactionDesc', '交互说明'],
                ['judgeRule', '判断规则'],
                ['exceptionRule', '异常规则'],
                ['otherDesc', '其他说明']
            ];

            function getGroup(item) {
                if (item.page === 'workbench') return 'workbench';
                const target = item.target || '';
                const title = item.title || '';
                if (target.includes('cultivation-')) return 'cultivation';
                if (target.includes('insight-')) return 'insight';
                if (target.includes('channel-kpi') || target.includes('channel-touch') || target.includes('channel-project-ranking') ||
                    target.includes('channel-media-ranking') || target.includes('channel-city-delivery') || target.includes('channel-quality') ||
                    target.includes('channel-car-series-pie') || target.includes('channel-lead') || target.includes('channel-region') ||
                    target.includes('channel-district')) return 'channel';
                if (title.includes('筛选') || title.includes('查询') || title.includes('重置') || title.includes('下载')) return 'common';
                return 'channel';
            }

            function groupName(group) {
                return {
                    channel: '渠道效果',
                    cultivation: '培育运营',
                    insight: '用户群体洞察',
                    common: '通用筛选/操作',
                    workbench: '培育工作台'
                }[group] || '其他';
            }

            function escapeHtml(value) {
                return String(value || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                    .replace(/\n/g, '<br>');
            }

            function render() {
                const selected = filter.value;
                const rows = data.filter(item => selected === 'all' || getGroup(item) === selected);
                summary.textContent = `共 ${rows.length} 条标注${selected === 'all' ? '' : ' · ' + groupName(selected)}`;

                if (!rows.length) {
                    catalog.innerHTML = '<div class="annotation-empty">暂无标注内容</div>';
                    return;
                }

                catalog.innerHTML = `
                    <table class="flow-table annotation-table">
                        <thead>
                            <tr>
                                <th style="width:72px;">编号</th>
                                <th style="width:190px;">标注项</th>
                                <th style="width:130px;">分组</th>
                                <th>说明内容</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map(item => `
                                <tr>
                                    <td><code>${escapeHtml(item.id)}</code></td>
                                    <td class="annotation-title-cell">
                                        ${escapeHtml(item.title || item.sections?.functionName)}
                                        <span class="annotation-target">${escapeHtml(item.target)}</span>
                                    </td>
                                    <td>${groupName(getGroup(item))}</td>
                                    <td>
                                        <div class="annotation-desc-list">
                                            ${fieldLabels.map(([key, label]) => {
                                                const value = item.sections && item.sections[key];
                                                if (!value) return '';
                                                return `
                                                    <div class="annotation-desc-row">
                                                        <span class="annotation-desc-label">${label}</span>
                                                        <span class="annotation-desc-text">${escapeHtml(value)}</span>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }

            filter.addEventListener('change', render);
            render();
        })();
