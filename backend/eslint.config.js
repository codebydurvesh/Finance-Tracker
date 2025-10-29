const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "__tests__/**",
      "*.test.js",
      "jest.config.js",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        Buffer: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      "no-useless-escape": "off",
    },
  },
];
