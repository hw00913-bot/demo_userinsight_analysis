// 左侧导航分组展开与收起
document.querySelectorAll('.nav-group-header').forEach(header => {
    header.addEventListener('click', () => {
        const navGroup = header.closest('.nav-group');
        navGroup.classList.toggle('open');
    });
});

// 用户洞察主分页切换
document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        document.querySelectorAll('.tab-btn[data-tab]').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(tabId);
        if (targetPane) targetPane.classList.add('active');

        if (window.AnnotationRuntime) {
            requestAnimationFrame(() => window.AnnotationRuntime.refresh());
        }
    });
});
