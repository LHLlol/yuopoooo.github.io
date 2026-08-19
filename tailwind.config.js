export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}", "./PortfolioHero.jsx"],
  theme: {
    extend: {
      colors: {
        // UI REVIEW FIX [WCAG 1.4.3]: readable semantic blue for text on light surfaces.
        portfolioBlue: "#006d9f",
        inkBlue: "#075eac",
        slate: {
          // UI REVIEW FIX [WCAG 1.4.3]: metadata must remain readable on white.
          400: "#64748b",
        },
      },
      boxShadow: {
        glass: "inset 0 1px 0 rgba(255,255,255,.55), 0 18px 48px rgba(0,92,170,.10)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
