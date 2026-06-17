document.addEventListener("DOMContentLoaded", () => {
    const tasks = document.querySelectorAll(".task-entry");
    const existingModel = document.querySelector('[data-field="existing-model"]');
    const vehiclePrediction = document.querySelector('[data-field="vehicle-prediction"]');
    const brandDetail = document.querySelector(".brand-detail");
    const brandTendency = document.querySelector('[data-field="brand-tendency"]');
    const fields = {
        phone: document.querySelector('[data-field="phone"]'),
        code: document.querySelector('[data-field="code"]'),
        taskCode: document.querySelector('[data-field="task-code"]')
    };

    const updateVehiclePrediction = () => {
        const model = existingModel?.textContent.trim();
        vehiclePrediction.textContent = model && model !== "-" ? "有车" : "无车";
    };

    updateVehiclePrediction();

    const brands = (brandDetail?.dataset.brands || "")
        .split(",")
        .map((brand) => brand.trim())
        .filter(Boolean);
    brandTendency.textContent = brands.length > 2 ? "多品牌摇摆" : "双品牌摇摆";

    tasks.forEach((task) => {
        task.addEventListener("click", (event) => {
            if (event.target.closest(".call-button")) {
                return;
            }

            tasks.forEach((item) => item.classList.remove("active"));
            task.classList.add("active");
            fields.phone.textContent = task.dataset.phone;
            fields.code.textContent = task.dataset.code;
            fields.taskCode.textContent = task.dataset.taskCode;
        });
    });

    document.querySelectorAll(".group-heading").forEach((heading) => {
        heading.addEventListener("click", () => {
            const group = heading.closest(".task-group");
            const content = group.querySelector(".task-group-content");
            if (!content) {
                return;
            }

            const expanded = heading.getAttribute("aria-expanded") === "true";
            heading.setAttribute("aria-expanded", String(!expanded));
            group.classList.toggle("expanded", !expanded);
            content.hidden = expanded;
            heading.querySelector(".group-arrow").textContent = expanded ? "›" : "⌄";
        });
    });

    document.querySelectorAll(".assistant-tabs button").forEach((tab) => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".assistant-tabs button").forEach((item) => {
                item.classList.remove("active");
            });
            document.querySelectorAll(".tab-panel").forEach((panel) => {
                panel.classList.remove("active");
            });
            tab.classList.add("active");
            document.querySelector(`[data-tab-panel="${tab.dataset.panel}"]`)?.classList.add("active");
        });
    });

    document.querySelectorAll(".prediction-title").forEach((title) => {
        title.addEventListener("click", () => {
            const section = title.closest(".prediction-section");
            const body = section.querySelector(".prediction-body");
            const expanded = title.getAttribute("aria-expanded") === "true";

            title.setAttribute("aria-expanded", String(!expanded));
            body.hidden = expanded;
            title.querySelector(":scope > b").textContent = expanded ? "⌄" : "⌃";
        });
    });

    const assistantPanel = document.querySelector(".assistant-panel");
    const expandButton = document.querySelector(".prediction-expand");
    const backdrop = document.querySelector(".prediction-backdrop");

    const setPredictionExpanded = (expanded) => {
        assistantPanel.classList.toggle("expanded", expanded);
        expandButton.setAttribute("aria-expanded", String(expanded));
        expandButton.textContent = expanded ? "收起 ↙" : "展开 ↗";
        backdrop.hidden = !expanded;
    };

    expandButton.addEventListener("click", () => {
        setPredictionExpanded(!assistantPanel.classList.contains("expanded"));
    });

    backdrop.addEventListener("click", () => {
        setPredictionExpanded(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && assistantPanel.classList.contains("expanded")) {
            setPredictionExpanded(false);
            expandButton.focus();
        }
    });

    document.querySelectorAll(".copy-button").forEach((button) => {
        button.addEventListener("click", async () => {
            const fieldName = button.dataset.copyField;
            const value = document.querySelector(`[data-field="${fieldName}"]`)?.textContent || "";

            try {
                await navigator.clipboard.writeText(value);
                button.textContent = "✓";
                window.setTimeout(() => {
                    button.textContent = "▣";
                }, 900);
            } catch (error) {
                console.warn("复制失败", error);
            }
        });
    });
});
