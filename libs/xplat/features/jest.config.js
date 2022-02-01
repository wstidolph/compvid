module.exports = {
  displayName: 'xplat-features',
  preset: '../../../jest.preset.js',
  testEnvironment: 'jsdom', // don't need this it's in the @nrwl jest-preset
  testRunner: 'jest-jasmine2',
  setupFilesAfterEnv: ['./test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$'
    },
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],

  coverageDirectory: '../../../coverage/libs/xplat/features',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
