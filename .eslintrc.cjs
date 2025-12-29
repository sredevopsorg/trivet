module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended-type-checked"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  },
  rules: {
    "@typescript-eslint/no-floating-promises": "error"
  }
};
