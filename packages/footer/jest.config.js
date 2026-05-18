module.exports = {
  displayName: 'footer',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '\\.stories\\.'],
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg|webp)$': '<rootDir>/../../jest.fileMock.js'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }]
  }
};
