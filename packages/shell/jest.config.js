module.exports = {
  displayName: "shell",
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
    "^header/Header$": "<rootDir>/src/__tests__/mocks/RemoteHeader.tsx",
    "^footer/Footer$": "<rootDir>/src/__tests__/mocks/RemoteFooter.tsx",
    "^cards/Cards$": "<rootDir>/src/__tests__/mocks/RemoteCards.tsx",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/**/*.test.{ts,tsx}",
    "!<rootDir>/src/bootstrap.tsx",
    "!<rootDir>/src/index.ts",
    "!<rootDir>/src/__tests__/mocks/**",
  ],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
};
