function openStatsModal() {
        document.getElementById('stats-drawer-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
        const activeMainTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        const statsTab = activeMainTab === 'cultivation-op'
            ? 'cultivation'
            : activeMainTab === 'user-group-insight'
                ? 'insight'
                : 'channel';
        switchStatsTab(statsTab);
    }

    function switchStatsTab(tabKey) {
        document.querySelectorAll('.stats-tab').forEach((tab) => {
            tab.classList.toggle('active', tab.dataset.statsTab === tabKey);
        });
        document.querySelectorAll('.stats-panel').forEach((panel) => {
            panel.classList.toggle('active', panel.dataset.statsPanel === tabKey);
        });
        const body = document.querySelector('.stats-drawer-body');
        if (body) body.scrollTop = 0;
    }

    function closeStatsDrawer() {
        document.getElementById('stats-drawer-overlay').classList.remove('active');
        document.body.style.overflow = '';
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.getElementById('stats-drawer-overlay').classList.remove('active');
            document.body.style.overflow = '';
        }
    });
