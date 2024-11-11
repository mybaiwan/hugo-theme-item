(function () {
    initDrawer(1024);
    initNavBlock();
    initBtmBar();
    initSearch();
})();

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(`.hitokoto`).forEach(el =>
        hitokoto(el.getAttribute('data-category'), el));

    initScrolltop();
    initSearchBarScroll();
    afterToHome();
});


/**
 * 以指定宽度为限，隐藏/显示抽屉
 */
function initDrawer(maxWidth) {
    let sidebar = document.getElementById('sidebar')
    let drawer = document.getElementById("drawer");
    let control = document.getElementById("side-control");
    control.addEventListener("change", () => {
        if (window.innerWidth > maxWidth) {
            sidebar.classList.toggle("sidebar-hide");
        } else {
            sidebar.classList.remove("sidebar-hide");
            drawer.checked = true;
        }
    })
}

/**
 * 导航块切换
 */
function initNavBlock() {
    document.querySelectorAll('.nav-block').forEach(node => {
        const inputs = node.querySelectorAll('input');
        const navItems = node.querySelectorAll('.nav-item');

        inputs.forEach(input => {
            input.onchange = () => {
                navItems.forEach(item => item.classList.toggle('hidden', item.dataset.id !== input.dataset.id));
            }
        });

        if (inputs.length > 0) {
            inputs[0].checked = true;
            inputs[0].dispatchEvent(new Event('change'));
        }
    });
}

/**
 * 底部操作栏
 */
function initBtmBar() {
    let btmBar = document.querySelector(".btm-bar");
    let indicator = document.querySelector(".btm-indicator");

    if (btmBar) {
        if (window.innerHeight >= document.body.offsetHeight) {
            btmBar.classList.add("btm-bar-normal");
        } else if (indicator) {
            new IntersectionObserver(entries => {
                const isIntersecting = entries[0].isIntersecting;
                btmBar.classList.toggle("btm-bar-normal", isIntersecting);
                btmBar.classList.toggle("btm-bar-sticky", !isIntersecting);
            }).observe(indicator);
        }
    }
}

/**
 * 调用一言API并设置到指定元素
 */
function hitokoto(cate, el) {

    let category = '';
    if (cate) {
        const array = cate.split(',');
        category = array.map(c => `c=${c}`).join('&');
    }

    fetch(`https://v1.hitokoto.cn/?encode=text&${category}`)
        .then(response => response.text())
        .then(data => {
            el.innerHTML = data;
        })
        .catch(error => {
            console.error('hitokoto request failed', error);
        });
}

/**
* 获取滚动条位置
*/
function getScrollTop() {
    var scrollPos;
    if (window.scrollY !== undefined) {
        scrollPos = window.scrollY;
    }
    else if (document.compatMode && document.compatMode != 'BackCompat') {
        scrollPos = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollPos = document.body.scrollTop;
    }
    return scrollPos;
}

/**
 * 初始化回顶按钮
 */
function initScrolltop() {
    const scrolltop = document.querySelector(".scrolltop");
    if (scrolltop) {
        window.onscroll = function () {
            let scrollPos = getScrollTop();
            if (scrollPos === 0) {
                scrolltop.classList.add("hidden");
            } else {
                scrolltop.classList.remove("hidden");
            }
        }
    }
}

/**
 * 点击事件，记录滚动目标并回首页
 */
function handleToHome(target) {
    sessionStorage.setItem("handleToHome_target", target);
    window.location.replace('/')
}

/**
 * 根据记录的滚动目标，滚动到指定位置
 */
function afterToHome() {
    const target = sessionStorage.getItem("handleToHome_target");
    if (target) {
        sessionStorage.removeItem("handleToHome_target");
        const element = document.getElementById(target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

/**
 * 初始化搜索框
 */
function initSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;
    input.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;
        const element = document.querySelector('input[name="search-item"]:checked');
        if (element) {
            const url = element.value.replace(/%s/g, input.value);
            window.open(url, "_blank");
        }
    });
}

/**
 * 搜索栏水平滚动
 */
function initSearchBarScroll() {
    const searchBar = document.getElementById("search-bar");
    if (!searchBar) return;
    searchBar.addEventListener('wheel', (event) => {
        event.preventDefault();
        searchBar.scrollLeft += event.deltaY;
    });
}