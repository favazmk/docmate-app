import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1.4" }],
        secondary: ["0.875rem", { lineHeight: "1.5" }],
        subheading: ["1.25rem", { lineHeight: "1.3" }],
        heading: ["clamp(1.75rem, 1.4rem + 1.8vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        display: ["clamp(2.25rem, 1.6rem + 3.2vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        ring: "var(--ring)",
        input: "var(--input)",
        "blue-primary": "var(--blue-primary)",
        "blue-hover": "var(--blue-hover)",
        "blue-light": "var(--blue-light)",
        "blue-mid": "var(--blue-mid)",
        "white-custom": "var(--white)",
        "gray-bg": "var(--gray-bg)",
        "gray-border": "var(--gray-border)",
        "text-dark": "var(--text-dark)",
        "text-mid": "var(--text-mid)",
        "text-light": "var(--text-light)",
        "green-badge": "var(--green-badge)",
        "green-badge-bg": "var(--green-badge-bg)",
        "star-color": "var(--star-color)",
        "footer-bg": "var(--footer-bg)",
        primary: {
          DEFAULT: "var(--blue-primary)",
          foreground: "var(--white)",
        }
      },
    },
  },
  plugins: [],
};
export default config;
