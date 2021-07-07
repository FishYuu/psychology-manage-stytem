module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "no-multi-str": 0, //字符串不能用\换行
    'linebreak-style': [0, 'windows'],
    semi: [0, 'never'],
    // allow paren-less arrow functions
    indent: 0,
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'eol-last': 0,
    'space-before-function-paren': 0,
    quotes: [1, 'single'],
    "no-unused-vars": "off"
  }
};
