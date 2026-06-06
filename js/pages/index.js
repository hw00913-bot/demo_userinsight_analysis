        // 验证逻辑
        const CORRECT_PASSWORD = "dndc2026";

        function unlock() {
            const inputPwd = document.getElementById('passwordInput').value;
            const errorDiv = document.getElementById('errorMsg');
            const card = document.querySelector('.lock-card');

            if (inputPwd === CORRECT_PASSWORD) {
                // 验证成功，跳转到原型主预览页
                window.location.href = "main.html";
            } else {
                // 验证失败特效
                errorDiv.textContent = '❌ 密码错误，请重新输入';

                // 给卡片加一个左右晃动的震动效果
                card.style.transform = "translateX(10px)";
                setTimeout(() => card.style.transform = "translateX(-10px)", 50);
                setTimeout(() => card.style.transform = "translateX(0)", 100);

                // 清空输入框并聚焦
                const input = document.getElementById('passwordInput');
                input.value = '';
                input.focus();

                setTimeout(() => { errorDiv.textContent = ''; }, 3000);
            }
        }

        // 绑定点击事件
        document.getElementById('unlockBtn').addEventListener('click', unlock);

        // 绑定回车键事件
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') unlock();
        });

        // 页面加载自动聚焦
        window.onload = () => {
            document.getElementById('passwordInput').focus();
        };
