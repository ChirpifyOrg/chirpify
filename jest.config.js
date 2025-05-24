module.exports = {
   rootDir: '.',
   preset: 'ts-jest',
   testEnvironment: 'node',
   moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
   },
   transform: {
      '^.+\\.tsx?$': 'ts-jest',
   },
   testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
