/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F7F3EB",
          deep: "#EEE7DB",
          subtle: "#FBF9F5",
        },
        ink: {
          DEFAULT: "#292821",
          muted: "#777267",
          faint: "#A6A095",
        },
        line: {
          DEFAULT: "#DDD5C8",
          dark: "#C8BEAE",
        },
        olive: {
          DEFAULT: "#777B5B",
          dark: "#5C6044",
          light: "#EFF2E8",
          surface: "#E3E7DA",
        },
        terracotta: {
          DEFAULT: "#B86F54",
          dark: "#96553E",
          light: "#F7EAE5",
        },
        butter: {
          DEFAULT: "#E5D49A",
          dark: "#CBB66E",
          light: "#FBF6E5",
        },
        sage: {
          DEFAULT: "#DDE2D2",
          deep: "#C5CDBC",
          light: "#F1F4EC",
        },
        "white-warm": "#FFFCF6",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Lora", "Georgia", "Cambria", "'Times New Roman'", "serif"],
        sans: ["DM Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        hand: ["Caveat", "Brush Script MT", "cursive"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(41, 40, 33, 0.05)",
        card: "0 2px 8px rgba(41, 40, 33, 0.06)",
        float: "0 12px 32px -4px rgba(41, 40, 33, 0.12)",
        photo: "0 4px 14px rgba(41, 40, 33, 0.08), 0 1px 3px rgba(41, 40, 33, 0.04)",
      },
      borderRadius: {
        editorial: "6px",
      },
    },
  },
  plugins: [],
};
