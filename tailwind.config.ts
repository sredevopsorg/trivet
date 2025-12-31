import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const fontVariationSettingsPlugin = plugin(function ({ addUtilities }) {
  const weights = [
    { name: "thin", value: 100 },
    { name: "extralight", value: 200 },
    { name: "light", value: 300 },
    { name: "normal", value: 400 },
    { name: "medium", value: 500 },
    { name: "semibold", value: 600 },
    { name: "bold", value: 700 },
    { name: "extrabold", value: 800 },
    { name: "black", value: 900 }
  ];

  const opszSettings = [
    { name: "text", value: 12 },
    { name: "display", value: 30 },
    { name: "micro", value: 4 }
  ];

  const utilities: Record<string, Record<string, string | number>> = {};

  for (const { name, value } of weights) {
    for (const { name: opszName, value: opszValue } of opszSettings) {
      utilities[`.font-${name}.${opszName}`] = {
        fontWeight: value,
        fontVariationSettings: `"wght" ${value}, "opsz" ${opszValue}, "wdth" 100`
      };
      utilities[`.font-${name}.${opszName}.italic`] = {
        fontVariationSettings: `"slnt" 1, "wght" ${value}, "opsz" ${opszValue}, "wdth" 100`
      };
      utilities[`.font-${name}.${opszName}.comp`] = {
        fontVariationSettings: `"wght" ${value}, "opsz" ${opszValue}, "wdth" 75`
      };
      utilities[`.font-${name}.${opszName}.cond`] = {
        fontVariationSettings: `"wght" ${value}, "opsz" ${opszValue}, "wdth" 50`
      };
    }

    utilities[`.font-${name}`] = {
      fontWeight: value,
      fontVariationSettings: `"wght" ${value}, "opsz" 12, "wdth" 100`
    };
    utilities[`.font-${name}.italic`] = {
      fontVariationSettings: `"slnt" 1, "wght" ${value}, "opsz" 12, "wdth" 100`
    };
    utilities[`.font-${name}.comp`] = {
      fontVariationSettings: `"wght" ${value}, "opsz" 12, "wdth" 75`
    };
    utilities[`.font-${name}.cond`] = {
      fontVariationSettings: `"wght" ${value}, "opsz" 12, "wdth" 50`
    };
  }

  utilities[".italic"] = {
    fontStyle: "italic",
    fontVariationSettings: '"slnt" 1, "opsz" 12, "wdth" 100'
  };
  utilities[".comp"] = {
    fontVariationSettings: '"wdth" 75'
  };
  utilities[".cond"] = {
    fontVariationSettings: '"wdth" 50'
  };

  addUtilities(utilities as any);
});

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      black: "#000000",
      yellow: "#fee53f",
      blue: "#54759e",
      vividBlue: "#0056ac",
      red: "#ff0c5b",
      green: "#2c6153",
      brown: "#6a525a",
      gray: {
        "050": "#F7F7F7",
        "075": "#ECECEC",
        100: "#E1E1E1",
        200: "#CFCFCF",
        300: "#B1B1B1",
        400: "#9E9E9E",
        500: "#7E7E7E",
        600: "#626262",
        700: "#515151",
        800: "#3B3B3B",
        850: "#2F2F2F",
        900: "#222222",
        925: "#1A1A1A",
        950: "#111111",
        975: "#090909"
      }
    },
    extend: {
      fontFamily: {
        sans: [
          '"Helvetica Now Variable"',
          '"Helvetica Neue"',
          "Helvetica",
          ...defaultTheme.fontFamily.sans
        ],
        mono: ["\"TX-02-Data\"", "\"Roboto Mono\"", ...defaultTheme.fontFamily.mono]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-flip"),
    require("@tailwindcss/line-clamp"),
    fontVariationSettingsPlugin
  ]
};

export default config;
