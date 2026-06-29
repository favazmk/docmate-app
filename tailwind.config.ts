import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
