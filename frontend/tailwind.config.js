module.exports = {
  theme: {
    extend: {
      spacing: {
        navigation: "6vh",
        main: "94vh",
        nodes: "50px"
      }
    },
    colors: {
      black: "#000000",
      white: "#ffffff",
      russet: "#80421F",
      brown_sugar: "#BB6949",
      regalia: "#522A83",
      sunray: "#E4BD5B",
      white_chocolate: "#E8EBD5",
      alabama_crimson: "#A2052C",
      transparent: "transparent",

      gray: {
        100: "#f7fafc",
        200: "#edf2f7",
        300: "#e2e8f0",
        400: "#cbd5e0",
        500: "#a0aec0",
        600: "#718096",
        700: "#4a5568",
        800: "#2d3748",
        900: "#1a202c"
      },

      blue: {
        100: "#f2f5f8",
        200: "#e5ecf1",
        300: "#ccd9e3",
        400: "#b2c6d5",
        500: "#7fa0b9",
        600: "#668dab",
        700: "#4c7a9d",
        800: "#33678f",
        900: "#195481",
        default: "#004173"
      },
      "light-blue": {
        lighter: "#e5f4fa",
        default: "#0096cd",
        darker: "#007fae"
      },
      green: { lighter: "#f5f9e8", default: "#9CC919", darker: "#84aa15" },
      orange: { lighter: "#fdf4e9", default: "#EF9524", darker: "#cb7e1e" },
      purple: { lighter: "#f5eff7", default: "#A063B8", darker: "#88549c" },
      pink: { lighter: "#fae5f2", default: "#D60085", darker: "#b50071" }
    }
  },
  fontFamily: {
    sans: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      '"Noto Sans"',
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"'
    ],
    mono: "monospace"
  }
};
