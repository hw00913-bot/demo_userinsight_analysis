        const PAGES = [
            { name: '用户洞察', file: 'pages/userinsight.html?v=20260605-03' },
            { name: '交互说明', file: 'docs/interaction.html' },
        ];

        let currentTab = 0;

        function renderTabs() {
            const container = document.getElementById('tabsContainer');
            container.innerHTML = '';
            PAGES.forEach((page, index) => {
                const btn = document.createElement('button');
                btn.className = 'tab-btn' + (index === currentTab ? ' active' : '');
                btn.textContent = page.name;
                btn.onclick = () => setActiveTab(index);
                container.appendChild(btn);
            });
        }

        function setActiveTab(index) {
            currentTab = index;
            renderTabs();
            document.getElementById('prototypeFrame').src = PAGES[index].file;
        }

        setActiveTab(0);
