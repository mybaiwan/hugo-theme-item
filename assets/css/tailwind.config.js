module.exports = {
    darkMode: 'class',
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
        themes: true,
        darkTheme: "halloween",
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
