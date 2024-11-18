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
    themes: [
        "light", "dark"
      ],
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/typography'),
        require('daisyui')
    ],
    daisyui: {
        themes: true,
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
