export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}", "./PortfolioHero.jsx"],
  theme: {
    extend: {
      colors: {
        portfolioBlue: "#08a9f4",
        inkBlue: "#075eac",
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
