module.exports = {
  displayName: "shared",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: ".",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["<rootDir>/src/**/*.test.ts?(x)"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/**/*.test.{ts,tsx}",
    "!<rootDir>/src/**/*.stories.{ts,tsx}",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/**/*.d.ts",
  ],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
};
