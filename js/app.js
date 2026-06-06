window.addEventListener('DOMContentLoaded', () => {
    initReasonTypeFilter();
    initDateRange();
    initFilterMultiSelects();
    initGlobalFilters();
    reorderCultivationDeliveryCharts();
    enhanceHierarchyHabLabels();
    alignChannelQualityLeadLevels();
    convertCultivationChartsToHorizontal();
    enhanceOverviewHabLabels();
    initChannelJourneyFilter();
    initMediaJourneyFilter();
    enhanceTouchHabitDeliveryMetrics();
    initCultivationScaledCharts();
    initRankInteraction({
        tabsId: 'rankMetricTabs',
        listId: 'projectRankList',
        dataProp: 'projectCode',
        dataAttr: 'project',
        data: projectRankData
    });
    initRankInteraction({
        tabsId: 'scheduleMetricTabs',
        listId: 'scheduleRankList',
        dataProp: 'scheduleCode',
        dataAttr: 'schedule',
        data: scheduleRankData
    });

    // 延迟到下一帧执行，确保样式和其他脚本完全就绪
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            try { initStoreFilters(); } catch (error) { console.warn('Store filters init:', error.message); }
            try { initDynamicRender(); } catch (error) { console.warn('Dynamic render:', error.message); }
        });
    });
});
