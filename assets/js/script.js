(function () {
    "use strict";
    let fn = {
        initialize: function () {
            const startTime = performance.now();
            try {
                this.nav();
                this.drawer(1024);
                this.indicator();
                this.scroll2top();
                this.search();
                this.carousel();
                this.theme();
                this.hitokoto();
                this.after2home();

                const endTime = performance.now();
                console.debug(`Initialization completed in ${(endTime - startTime).toFixed(2)}ms`);
            } catch (error) {
                console.error('Initialization failed:', error);
            }
        },

        nav: function () {

            const navBlocks = document.querySelectorAll('.nav-block');
            navBlocks.forEach(node => {
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

        },

        drawer: function (maxWidth) {

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

        },
        indicator: function () {

            let btmBar = document.querySelector(".btm-bar");
            if (!btmBar) return;
            let indicator = document.querySelector(".btm-indicator");
            if (window.innerHeight >= document.body.offsetHeight) {
                btmBar.classList.add("btm-bar-normal");
            } else if (indicator) {
                new IntersectionObserver(entries => {
                    const isIntersecting = entries[0].isIntersecting;
                    btmBar.classList.toggle("btm-bar-normal", isIntersecting);
                    btmBar.classList.toggle("btm-bar-sticky", !isIntersecting);
                }).observe(indicator);
            }

        },
        scroll2top: function () {

            const scrolltop = document.querySelector(".scrolltop");
            if (!scrolltop) return;

            scrolltop.classList.toggle("invisible", window.scrollY === 0);
            window.addEventListener('scroll', function () {
                scrolltop.classList.toggle("invisible", window.scrollY === 0);
            }, { passive: true });

            scrolltop.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

        },
        search: function () {

            const searchBar = document.getElementById("search-bar");
            if (!searchBar) return;
            searchBar.addEventListener('wheel', (event) => {
                event.preventDefault();
                searchBar.scrollLeft += event.deltaY;
            });

        },
        carousel: function () {

            const carousel = document.getElementById("carousel");
            if (!carousel) return;

            const items = carousel.querySelectorAll('.carousel-item');
            if (items.length <= 1) return;

            let currentIndex = 0;
            let timer;

            const showItem = (index) => {
                window.location.hash = `#carousel-${index}`;
            };

            const nextItem = () => {
                currentIndex = (currentIndex + 1) % items.length;
                showItem(currentIndex);
            };

            const startCarousel = () => {
                timer = setInterval(nextItem, 3000);
            };

            const stopCarousel = () => {
                clearInterval(timer);
            };

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopCarousel();
                } else {
                    startCarousel();
                }
            });

            startCarousel();

            carousel.addEventListener('click', (e) => {
                if (e.target.closest('.btn-circle')) {
                    stopCarousel();
                    const hash = window.location.hash;
                    if (hash.startsWith('#carousel-')) {
                        currentIndex = parseInt(hash.replace('#carousel-', ''));
                    }
                    startCarousel();
                }
            });

        },
        theme: function () {

            let themes = document.querySelectorAll('input[name="theme-item"]');

            const state = localStorage.getItem("data-theme");
            themes.forEach(item => {
                item.checked = (item.value === state);
                item.addEventListener('change', event => {
                    const checkbox = event.target;
                    if (checkbox.checked) {
                        localStorage.setItem("data-theme", checkbox.value);
                        if (checkbox.value === "default") {
                            document.documentElement.setAttribute("data-theme", window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
                        } else {
                            document.documentElement.setAttribute("data-theme", checkbox.value);
                        }
                    }
                })
            })

            window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', event => {
                if (localStorage.getItem("data-theme") === "default") {
                    document.documentElement.setAttribute("data-theme", event.matches ? "dark" : "light");
                }
            });

        },
        after2home: function () {

            const target = sessionStorage.getItem("handleToHome_target");
            if (!target) return;
            sessionStorage.removeItem("handleToHome_target");
            const element = document.getElementById(target);
            if (!element) return;

            if ('scrollIntoView' in element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                window.scrollTo(0, element.offsetTop);
            }

        },
        hitokoto: async function () {

            for (const el of document.querySelectorAll(".hitokoto")) {
                try {
                    let category = '';
                    let cate = el.getAttribute('data-category');
                    if (cate) {
                        const array = cate.split(',');
                        category = array.map(c => `c=${c}`).join('&');
                    }

                    const response = await fetch(`https://v1.hitokoto.cn/?encode=text&${category}`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data = await response.text();
                    el.innerHTML = data;
                } catch (error) {
                    console.error('hitokoto request failed', error);
                } finally {
                    el.classList.remove("skeleton");
                }
            }
        }
    };


    window.handleToHome = function (target) {
        sessionStorage.setItem("handleToHome_target", target);
        window.location.replace('/');
    };

    document.addEventListener("DOMContentLoaded", () => fn.initialize());
})();

