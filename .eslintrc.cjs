module.exports = {
  root: true,
  extends: ["@nuxtjs/eslint-config-typescript"],
  ignorePatterns: [
    "node_modules/",
    ".nuxt/",
    ".output/",
    "coverage/",
    "public/",
    "lighthouse-reports/",
    "test/**",
  ],
  rules: {},
};
