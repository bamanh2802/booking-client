import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#FF9B17", // Vibrant orange from original palette
            foreground: "#000000", // Black for contrast
          },
          secondary: {
            DEFAULT: "#FFF085", // Bright yellow for accents
            foreground: "#000000",
          },
          accent: {
            DEFAULT: "#FCB454", // Warm orange for highlights
            foreground: "#000000",
          },
          focus: "#FF9B17", // Matching primary for focus states
          danger: {
            DEFAULT: "#F16767", // Red for error or warning states
            foreground: "#FFFFFF",
          },
          background: {
            DEFAULT: "#FFFFFF", // White background for light mode
            subtle: "#FFF8E1", // Slightly warm off-white for subtle backgrounds
          },
          text: {
            DEFAULT: "#333333", // Dark gray for readable text
            muted: "#666666", // Lighter gray for secondary text
          },
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#FF9B17", // Keeping vibrant orange as primary
            foreground: "#FFFFFF", // White for contrast in dark mode
          },
          secondary: {
            DEFAULT: "#FFF085", // Yellow for accents
            foreground: "#000000",
          },
          accent: {
            DEFAULT: "#FCB454", // Warm orange for highlights
            foreground: "#FFFFFF",
          },
          focus: "#FF9B17", // Matching primary for focus states
          danger: {
            DEFAULT: "#F16767", // Red for error or warning states
            foreground: "#FFFFFF",
          },
          background: {
            DEFAULT: "#1A1A1A", // Dark gray background for dark mode
            subtle: "#2A2A2A", // Slightly lighter gray for subtle backgrounds
          },
          text: {
            DEFAULT: "#E0E0E0", // Light gray for readable text
            muted: "#A0A0A0", // Darker gray for secondary text
          },
        },
      },
    },
  })],
}

module.exports = config;