/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "src",
  testRegex: ".spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!(lowdb|steno)/)"
  ]
};

module.exports = config;