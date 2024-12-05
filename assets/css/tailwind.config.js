const { black } = require("daisyui/src/theming/themes");

module.exports = {
    darkMode: ['selector', '[data-theme="dark"]'],
    content: [
        "./themes/**/layouts/**/*.html",
        "./content/**/layouts/**/*.html",
        "./layouts/**/*.html",
        "./content/**/*.html"
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/typography'),
        require('daisyui')
    ],
    daisyui: {
        themes: [
            {
                dark: {
                ...require("daisyui/src/theming/themes")["dark"],
                "base-100": "#000000",
                "base-200": "#141414",
                "base-300": "#262626",
              },
            },
            {
                light: {
                    ...require("daisyui/src/theming/themes")["light"],
                }
            }
          ],
        darkTheme: "dark",
        logs: false
    },
    safelist: [
        'badge-neutral',
        'badge-primary',
        'badge-secondary',
        'badge-accent',
        'badge-ghost'
    ]
}
