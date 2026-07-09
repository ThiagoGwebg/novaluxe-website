/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js}", // Procura por classes em todos os arquivos HTML e JS dentro de src
    ],
    theme: {
        extend: {
            colors: {
                primary: "#3B5B43",
                primaryDark: "#2d4533",
                bgCream: "#F5F0E8",
                bgBeige: "#f0f0eb",
                textDark: "#2D3748",
                textMuted: "#4A5568",
                navDark: "#0d1f14",
                borderBase: "#E2E8F0"
            },
            fontFamily: {
                serif: ["Playfair Display", "serif"],
                body: ["Inter", "sans-serif"]
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}