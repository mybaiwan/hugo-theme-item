let themes = document.querySelectorAll('input[name="theme-item"]');

function saveState(event) {
    const checkbox = event.target;
    if (checkbox.checked) {
        localStorage.setItem("data-theme", checkbox.value);
        if (checkbox.value === "default") {
            applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
        } else {
            applyTheme(checkbox.value === "dark");
        }
    }
}

themes.forEach(checkbox => checkbox.addEventListener('change', saveState));
window.addEventListener('load', () => {
    const state = localStorage.getItem("data-theme") || "default";
    themes.forEach(checkbox => {
        checkbox.checked = (checkbox.value === state);
    });
});

