module.exports = {
  displayName: "header",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: ".",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["<rootDir>/src/**/*.test.ts?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "\\.stories\\."],
  setupFilesAfterEnv: ["<rootDir>/../../jest.setup.ts"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
    "\\.(png|jpe?g|gif|svg|webp)$": "<rootDir>/../../jest.fileMock.js",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/**/*.test.{ts,tsx}",
    "!<rootDir>/src/**/*.stories.{ts,tsx}",
    "!<rootDir>/src/bootstrap.tsx",
    "!<rootDir>/src/index.ts",
    "!<rootDir>/src/dev/**",
    "!<rootDir>/src/__tests__/mocks/**",
  ],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
};
