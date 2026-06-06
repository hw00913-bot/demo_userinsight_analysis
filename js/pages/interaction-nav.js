// 侧边栏高亮当前锚点
        const links = document.querySelectorAll('.nav-link, .nav-sub-link');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0.15, rootMargin: '-80px 0px -60% 0px' });

        document.querySelectorAll('section[id]').forEach(section => observer.observe(section));

        // 平滑滚动
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
